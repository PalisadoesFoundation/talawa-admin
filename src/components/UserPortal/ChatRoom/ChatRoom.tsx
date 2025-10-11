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

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  MARK_CHAT_MESSAGES_AS_READ,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import { MoreVert, Close } from '@mui/icons-material';
import GroupChatDetails from 'components/GroupChatDetails/GroupChatDetails';
import { GrAttachment } from 'react-icons/gr';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import type { GroupChat } from 'types/Chat/type';
// import { toast } from 'react-toastify';
// import { validateFile } from 'utils/fileValidation';

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

interface IMessageImageProps {
  media: string;
  organizationId?: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
}

const MessageImageBase: React.FC<IMessageImageProps> = ({
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
    loading: !!media,
    error: false,
  });

  useEffect(() => {
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

  if (imageState.loading) {
    return <div className={styles.messageAttachment}>Loading image...</div>;
  }

  if (imageState.error || !imageState.url) {
    return <div className={styles.messageAttachment}>Image not available</div>;
  }

  return (
    <img
      className={styles.messageAttachment}
      src={imageState.url}
      alt="attachment"
      onError={() => setImageState((prev) => ({ ...prev, error: true }))}
    />
  );
};

export const MessageImage = React.memo(MessageImageBase);

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
  const getFileFromMinioRef = useRef(unstableGetFile);
  useEffect(() => {
    getFileFromMinioRef.current = unstableGetFile;
  }, [unstableGetFile]);
  const getFileFromMinio = useCallback(
    (objectName: string, organizationId: string) =>
      getFileFromMinioRef.current(objectName, organizationId),
    [],
  );

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
        parentMessageId: replyToDirectMessage?.id,
        body: newMessage,
      },
    },
  });

  const [editChatMessage] = useMutation(EDIT_CHAT_MESSAGE, {
    variables: {
      input: {
        id: editMessage?.id,
        body: newMessage,
      },
    },
  });

  const [markChatMessagesAsRead] = useMutation(MARK_CHAT_MESSAGES_AS_READ);

  const { data: chatData, refetch: chatRefetch } = useQuery(CHAT_BY_ID, {
    variables: {
      input: { id: props.selectedContact },
      first: 10,
      after: null,
      firstMessages: 10,
      afterMessages: null,
    },
  });
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
    if (chatData?.chat?.messages?.edges?.length) {
      const lastMessage =
        chatData.chat.messages.edges[chatData.chat.messages.edges.length - 1];
      markChatMessagesAsRead({
        variables: {
          input: {
            chatId: props.selectedContact,
            messageId: lastMessage.node.id,
          },
        },
      }).then(() => {
        props.chatListRefetch();
        unreadChatListRefetch();
      });
    }
  }, [props.selectedContact, chatData]);

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
    let messageBody = newMessage;
    if (attachmentObjectName) {
      // If there's an attachment, send the object ID as the body
      messageBody = attachmentObjectName;
    }

    if (editMessage) {
      await editChatMessage({
        variables: {
          input: {
            id: editMessage.id,
            body: messageBody,
          },
        },
      });
    } else {
      await sendMessageToChat({
        variables: {
          input: {
            chatId: props.selectedContact,
            parentMessageId: replyToDirectMessage?.id,
            body: messageBody,
          },
        },
      });
    }

    await chatRefetch();
    setReplyToDirectMessage(null);
    setEditMessage(null);
    setNewMessage('');
    setAttachment(null);
    setAttachmentObjectName(null);
    await props.chatListRefetch({ id: userId as string });
  };

  const subscription = useSubscription(MESSAGE_SENT_TO_CHAT, {
    variables: {
      input: {
        id: props.selectedContact,
      },
    },
    onData: async (messageSubscriptionData) => {
      if (
        messageSubscriptionData?.data.data.chatMessageCreate &&
        messageSubscriptionData?.data.data.chatMessageCreate.chat?.id ===
          props.selectedContact
      ) {
        const newMessage = messageSubscriptionData.data.data.chatMessageCreate;
        await markChatMessagesAsRead({
          variables: {
            input: {
              chatId: props.selectedContact,
              messageId: newMessage.id,
            },
          },
        });
        chatRefetch();
      }
      props.chatListRefetch();
      unreadChatListRefetch();
    },
  });
  console.log('subscription', subscription);
  useEffect(() => {
    document
      .getElementById('chat-area')
      ?.lastElementChild?.scrollIntoView({ block: 'end' });
  }, [chat?.messages?.edges?.length]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAttachment = (): void => {
    fileInputRef?.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const organizationId = chat?.organization?.id || 'organization';
      console.log('orgid', organizationId);
      const { objectName } = await uploadFileToMinio(file, organizationId);
      setAttachmentObjectName(objectName);
      const presignedUrl = await getFileFromMinio(objectName, organizationId);
      setAttachment(presignedUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
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
                      const isFile = message.body.startsWith('uploads/'); // Check if it's a file reference

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
                              {isFile ? (
                                <MessageImage
                                  media={message.body}
                                  organizationId={chat?.organization?.id}
                                  getFileFromMinio={getFileFromMinio}
                                />
                              ) : (
                                message.body
                              )}
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
              data-testid="hidden-file-input"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
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
