/**
 * ChatRoom Component
 *
 * This component represents a chat room interface where users can send and receive messages,
 * view chat details, and manage attachments. It supports both group and direct messaging.
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries, mutations, and subscriptions.
 * - Supports message editing, replying, and attachments.
 * - Displays group chat details when applicable.
 *
 * @param props - The props for the ChatRoom component.
 * @returns The rendered ChatRoom comp                            {message.parentMessage && (
                              <a href={`#${message.parentMessage.id}`}>
                                <div className={styles.replyToMessage}>
                                  <p className={styles.replyToMessageSender}>
                                    {message.parentMessage.creator.name}
                                  </p>
                                  <span>{message.parentMessage.body}</span>
                                </div>
                              </a>
                            )} @example
 * ```tsx
 * <ChatRoom
 *   selectedContact="12345"
 *   chatListRefetch={refetchChatList}
 * />
 * ```
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import styles from './ChatRoom.module.css';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useTranslation } from 'react-i18next';
import { CHAT_BY_ID, UNREAD_CHAT_LIST } from 'GraphQl/Queries/PlugInQueries';
import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  EDIT_CHAT_MESSAGE,
  MESSAGE_SENT_TO_CHAT,
  SEND_MESSAGE_TO_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import { MoreVert, Close } from '@mui/icons-material';
import GroupChatDetails from 'components/GroupChatDetails/GroupChatDetails';
import { GrAttachment } from 'react-icons/gr';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import type { GroupChat } from 'types/Chat/type';
import { toast } from 'react-toastify';
import { validateFile } from 'utils/fileValidation';

interface IChatRoomProps {
  selectedContact: string;
  chatListRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chatList: GroupChat[] }>>;
}

interface INewChat {
  id: string;
  name: string;
  description?: string;
  avatarMimeType?: string;
  avatarURL?: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    countryCode?: string;
  };
  creator?: {
    id: string;
    name: string;
    avatarMimeType?: string;
    avatarURL?: string;
  };
  updater?: {
    id: string;
    name: string;
    avatarMimeType?: string;
    avatarURL?: string;
  };
  members: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        avatarMimeType?: string;
        avatarURL?: string;
      };
    }>;
  };
  messages: {
    edges: Array<{
      node: {
        id: string;
        body: string;
        createdAt: string;
        updatedAt: string;
        creator: {
          id: string;
          name: string;
          avatarMimeType?: string;
          avatarURL?: string;
        };
        parentMessage?: {
          id: string;
          body: string;
          createdAt: string;
          creator: {
            id: string;
            name: string;
          };
        };
      };
    }>;
  };
}

// Helper component to handle MinIO image loading
interface IMessageImageProps {
  media: string;
  organizationId?: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
}

export const MessageImage: React.FC<IMessageImageProps> = ({
  media,
  organizationId,
  getFileFromMinio,
}) => {
  const [imageState, setImageState] = useState<{
    url: string | null;
    loading: boolean;
    error: boolean;
  }>({
    url: null,
    loading: !!media && !media.startsWith('data:'),
    error: false,
  });

  useEffect(() => {
    // If it's a Base64 image, no need to fetch
    if (media.startsWith('data:')) return;

    // If no media provided, set error state
    if (!media) {
      setImageState((prev) => ({ ...prev, error: true, loading: false }));
      return;
    }

    // In direct messages, there is no organization ID, so use 'organization' as a fallback.
    const orgId = organizationId || 'organization';

    let stillMounted = true;
    const loadImage = async (): Promise<void> => {
      try {
        const url = await getFileFromMinio(media, orgId);
        if (stillMounted) setImageState({ url, loading: false, error: false });
      } catch (error) {
        console.error('Error fetching image from MinIO:', error);
        if (stillMounted)
          setImageState({ url: null, loading: false, error: true });
      }
    };

    loadImage();
    return () => {
      stillMounted = false;
    };
  }, [media, organizationId, getFileFromMinio]);

  // If it's a Base64 image, use it directly
  if (media.startsWith('data:')) {
    return (
      <img
        className={styles.messageAttachment}
        src={media}
        alt="attachment"
        onError={() => setImageState((prev) => ({ ...prev, error: true }))}
      />
    );
  }

  // If loading, show placeholder
  if (imageState.loading) {
    return <div className={styles.messageAttachment}>Loading image...</div>;
  }

  // If error or no URL, show fallback
  if (imageState.error || !imageState.url) {
    return <div className={styles.messageAttachment}>Image not available</div>;
  }

  // Show the MinIO image
  return (
    <img
      className={styles.messageAttachment}
      src={imageState.url}
      alt="attachment"
      onError={() => setImageState((prev) => ({ ...prev, error: true }))}
    />
  );
};

export default function chatRoom(props: IChatRoomProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const [chatTitle, setChatTitle] = useState('');
  const [chatSubtitle, setChatSubtitle] = useState('');
  const [chatImage, setChatImage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<INewChat>();
  const [replyToDirectMessage, setReplyToDirectMessage] = useState<
    INewChat['messages']['edges'][0]['node'] | null
  >(null);
  const [editMessage, setEditMessage] = useState<
    INewChat['messages']['edges'][0]['node'] | null
  >(null);
  const [groupChatDetailsModalisOpen, setGroupChatDetailsModalisOpen] =
    useState(false);

  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentObjectName, setAttachmentObjectName] = useState<
    string | null
  >(null);
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio: unstableGetFile } = useMinioDownload();
  const getFileFromMinio = useCallback(unstableGetFile, [unstableGetFile]);
  const openGroupChatDetails = (): void => {
    setGroupChatDetailsModalisOpen(true);
  };

  const toggleGroupChatDetailsModal = (): void =>
    setGroupChatDetailsModalisOpen(!groupChatDetailsModalisOpen);

  /**
   * Handles changes to the new message input field.
   *
   * Updates the state with the current value of the input field whenever it changes.
   *
   * @param e - The event triggered by the input field change.
   */
  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMessageValue = e.target.value;
    setNewMessage(newMessageValue);
  };

  const [sendMessageToChat] = useMutation(SEND_MESSAGE_TO_CHAT, {
    variables: {
      input: {
        chatId: props.selectedContact,
        replyTo: replyToDirectMessage?.id,
        media: attachmentObjectName || null,
        messageContent: newMessage,
      },
    },
  });

  const [editChatMessage] = useMutation(EDIT_CHAT_MESSAGE, {
    variables: {
      input: {
        messageId: editMessage?.id,
        messageContent: newMessage,
        chatId: props.selectedContact,
      },
    },
  });

  // TODO: Update markChatMessagesAsRead to match new schema
  // const [markChatMessagesAsRead] = useMutation(MARK_CHAT_MESSAGES_AS_READ, {
  //   variables: {
  //     chatId: props.selectedContact,
  //     userId: userId,
  //   },
  // });

  const { data: chatData, refetch: chatRefetch } = useQuery(CHAT_BY_ID, {
    variables: {
      input: { id: props.selectedContact },
      first: 10,
      after: null,
      firstMessages: 10,
      afterMessages: null,
    },
  });
  console.log('chatData', chatData);
  console.log('props.selectedContact', props.selectedContact);
  // const { refetch: chatListRefetch } = useQuery(CHATS_LIST, {
  //   variables: {
  //     id: userId,
  //   },
  // });

  const { refetch: unreadChatListRefetch } = useQuery(UNREAD_CHAT_LIST, {
    variables: {
      id: userId,
    },
  });

  useEffect(() => {
    // TODO: Update markChatMessagesAsRead to match new schema
    // markChatMessagesAsRead().then(() => {
    //   props.chatListRefetch();
    //   unreadChatListRefetch();
    // });
  }, [props.selectedContact]);

  useEffect(() => {
    if (chatData) {
      const chat = chatData.chat;
      setChat(chat);

      if (chat.members?.edges?.length === 2) {
        const otherUser = chat.members.edges.find(
          (edge: { node: { id: string } }) => edge.node.id !== userId,
        )?.node;
        if (otherUser) {
          setChatTitle(`${otherUser.name}`);
          setChatSubtitle('');
          setChatImage(otherUser.avatarURL);
        }
      } else if (chat.members?.edges?.length > 2) {
        setChatTitle(chat.name);
        setChatSubtitle(`${chat.members?.edges?.length || 0} members`);
        setChatImage(chat.avatarURL);
      }
    }
  }, [chatData]);

  const sendMessage = async (): Promise<void> => {
    if (editMessage) {
      await editChatMessage();
    } else {
      await sendMessageToChat();
    }
    await chatRefetch();
    setReplyToDirectMessage(null);
    setNewMessage('');
    setAttachment(null);
    setAttachmentObjectName(null);
    await props.chatListRefetch({ id: userId as string });
  };

  useSubscription(MESSAGE_SENT_TO_CHAT, {
    variables: {
      input: {
        id: props.selectedContact,
      },
    },
    onData: async (messageSubscriptionData) => {
      if (
        messageSubscriptionData?.data.data.chatMessageCreate &&
        messageSubscriptionData?.data.data.chatMessageCreate
          .chatMessageBelongsTo?.id == props.selectedContact
      ) {
        // TODO: Update markChatMessagesAsRead to match new schema
        // await markChatMessagesAsRead();
        chatRefetch();
      }
      props.chatListRefetch();
      unreadChatListRefetch();
    },
  });

  useEffect(() => {
    document
      .getElementById('chat-area')
      ?.lastElementChild?.scrollIntoView({ block: 'end' });
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAttachment = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use the fileValidation utility for validation
    const validation = validateFile(file);

    if (!validation.isValid) {
      toast.error(validation.errorMessage);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      // Get current organization ID from the chat data
      const organizationId = chat?.organization?.id || 'organization';

      // Use MinIO for file uploads regardless of organization context
      // If there's no organization specific ID, use 'organization' as default
      const { objectName } = await uploadFileToMinio(file, organizationId);

      // Store the object name for sending with the message
      setAttachmentObjectName(objectName);

      // Get a presigned URL to display the image preview
      const presignedUrl = await getFileFromMinio(objectName, organizationId);
      setAttachment(presignedUrl);

      // Allow re-selecting the same file
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading image. Please try again.');

      // Clear any partial data
      setAttachment(null);
      setAttachmentObjectName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`d-flex flex-column ${styles.chatAreaContainer}`}
      id="chat-area"
    >
      {!props.selectedContact ? (
        <div
          className={`d-flex flex-column justify-content-center align-items-center w-100 h-75 gap-2 ${styles.grey}`}
        >
          <PermContactCalendarIcon fontSize="medium" className={styles.grey} />
          <h6 data-testid="noChatSelected">{t('selectContact')}</h6>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              {chatImage ? (
                <img
                  src={chatImage}
                  alt={chatTitle}
                  className={styles.contactImage}
                />
              ) : (
                <Avatar
                  name={chatTitle}
                  alt={chatTitle}
                  avatarStyle={styles.contactImage}
                />
              )}
              <div
                onClick={() => (chat?.isGroup ? openGroupChatDetails() : null)}
                className={styles.userDetails}
              >
                <p className={styles.title}>{chatTitle}</p>
                <p className={styles.subtitle}>{chatSubtitle}</p>
              </div>
            </div>
          </div>
          <div className={`d-flex flex-grow-1 flex-column`}>
            <div className={styles.chatMessages}>
              {!!chat?.messages?.edges?.length && (
                <div id="messages">
                  {chat?.messages.edges.map(
                    (edge: {
                      node: INewChat['messages']['edges'][0]['node'];
                    }) => {
                      const message = edge.node;
                      return (
                        <div
                          className={
                            message.creator.id === userId
                              ? styles.messageSentContainer
                              : styles.messageReceivedContainer
                          }
                          key={message.id}
                        >
                          {chat.isGroup &&
                            message.creator.id !== userId &&
                            (message.creator?.avatarURL ? (
                              <img
                                src={message.creator.avatarURL}
                                alt={message.creator.avatarURL}
                                className={styles.contactImage}
                              />
                            ) : (
                              <Avatar
                                name={message.creator.name}
                                alt={message.creator.name}
                                avatarStyle={styles.contactImage}
                              />
                            ))}
                          <div
                            className={
                              message.creator.id === userId
                                ? styles.messageSent
                                : styles.messageReceived
                            }
                            data-testid="message"
                            key={message.id}
                            id={message.id}
                          >
                            <span className={styles.messageContent}>
                              {chat.isGroup &&
                                message.creator.id !== userId && (
                                  <p className={styles.senderInfo}>
                                    {message.creator.name}
                                  </p>
                                )}
                              {message.parentMessage && (
                                <a href={`#${message.parentMessage.id}`}>
                                  <div className={styles.replyToMessage}>
                                    <p className={styles.replyToMessageSender}>
                                      {message.parentMessage.creator.name}
                                    </p>
                                    <span>{message.parentMessage.body}</span>
                                  </div>
                                </a>
                              )}
                              {message.body}
                            </span>
                            <div className={styles.messageAttributes}>
                              <Dropdown
                                data-testid="moreOptions"
                                style={{ cursor: 'pointer' }}
                              >
                                <Dropdown.Toggle
                                  className={styles.customToggle}
                                  data-testid={'dropdown'}
                                >
                                  <MoreVert />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setReplyToDirectMessage(message);
                                    }}
                                    data-testid="replyBtn"
                                  >
                                    {t('reply')}
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setEditMessage(message);
                                      setNewMessage(message.body);
                                    }}
                                    data-testid="replyToMessage"
                                  >
                                    Edit
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <span className={styles.messageTime}>
                                {new Date(
                                  message?.createdAt,
                                ).toLocaleTimeString('it-IT', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
          <div id="messageInput">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }} // Hide the input
              onChange={handleImageChange}
              data-testid="hidden-file-input" // <<< ADD THIS
            />
            {!!replyToDirectMessage?.id && (
              <div data-testid="replyMsg" className={styles.replyTo}>
                <div className={styles.replyToMessageContainer}>
                  <div className={styles.userDetails}>
                    <Avatar
                      name={replyToDirectMessage.creator.name}
                      alt={replyToDirectMessage.creator.name}
                      avatarStyle={styles.userImage}
                    />
                    <span>{replyToDirectMessage.creator.name}</span>
                  </div>
                  <p>{replyToDirectMessage.body}</p>
                </div>

                <Button
                  data-testid="closeReply"
                  onClick={() => setReplyToDirectMessage(null)}
                  className={styles.closeBtn}
                >
                  <Close />
                </Button>
              </div>
            )}
            {attachment && (
              <div className={styles.attachment}>
                <img src={attachment} alt="attachment" />

                <Button
                  data-testid="removeAttachment"
                  onClick={() => {
                    setAttachment(null);
                    setAttachmentObjectName(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className={styles.closeBtn}
                >
                  <Close />
                </Button>
              </div>
            )}

            <InputGroup>
              <button
                onClick={handleAddAttachment}
                className={styles.addAttachmentBtn}
              >
                <GrAttachment />
              </button>
              <Form.Control
                placeholder={t('sendMessage')}
                aria-label="Send Message"
                value={newMessage}
                data-testid="messageInput"
                onChange={handleNewMessageChange}
                className={styles.sendMessageInput}
              />
              <Button
                onClick={sendMessage}
                variant="primary"
                id="button-send"
                data-testid="sendMessage"
              >
                <SendIcon fontSize="small" />
              </Button>
            </InputGroup>
          </div>
        </>
      )}
      {groupChatDetailsModalisOpen && chat && (
        <GroupChatDetails
          toggleGroupChatDetailsModal={toggleGroupChatDetailsModal}
          groupChatDetailsModalisOpen={groupChatDetailsModalisOpen}
          chat={chat}
          chatRefetch={chatRefetch}
        ></GroupChatDetails>
      )}
    </div>
  );
}
