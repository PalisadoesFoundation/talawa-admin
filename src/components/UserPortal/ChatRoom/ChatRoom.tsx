/**
 * ChatRoom Component
 *
 * This component represents a chat room interface where users can send and receive messages,
 * view chat details, and manage attachments. It supports both group and direct messaging.
 *
 * @component
 * @param {InterfaceChatRoomProps} props - The props for the ChatRoom component.
 * @param {string} props.selectedContact - The ID of the selected contact or chat.
 * @param {Function} props.chatListRefetch - A function to refetch the chat list.
 *
 * @returns {JSX.Element} The rendered ChatRoom component.
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries, mutations, and subscriptions.
 * - Supports message editing, replying, and attachments.
 * - Displays group chat details when applicable.
 *
 * @dependencies
 * - React, React-Bootstrap, Material-UI, and Apollo Client.
 * - Custom hooks: `useLocalStorage`.
 * - Utility functions: `convertToBase64`.
 *
 * @example
 * ```tsx
 * <ChatRoom
 *   selectedContact="12345"
 *   chatListRefetch={refetchChatList}
 * />
 * ```
 *
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
  MARK_CHAT_MESSAGES_AS_READ,
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
import type { DirectMessage, GroupChat } from 'types/Chat/type';
import { toast } from 'react-toastify';
interface InterfaceChatRoomProps {
  selectedContact: string;
  chatListRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chatList: GroupChat[] }>>;
}

// Helper component to handle MinIO image loading
interface MessageImageProps {
  media: string;
  organizationId: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
}

const MessageImage: React.FC<MessageImageProps> = ({
  media,
  organizationId,
  getFileFromMinio,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(
    !!media && !media.startsWith('data:'),
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async (): Promise<void> => {
      if (media && !media.startsWith('data:')) {
        setLoading(true);
        try {
          const url = await getFileFromMinio(media, organizationId);
          setImageUrl(url);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching image from MinIO:', error);
          setError(true);
          setLoading(false);
        }
      }
    };

    if (media && !media.startsWith('data:')) {
      loadImage();
    }
  }, [media, organizationId, getFileFromMinio]);

  // If it's a Base64 image, use it directly
  if (media.startsWith('data:')) {
    return (
      <img
        className={styles.messageAttachment}
        src={media}
        alt="attachment"
        onError={() => setError(true)}
      />
    );
  }

  // If loading, show placeholder
  if (loading) {
    return (
      <div className={styles.messageAttachment}>
        <span>Loading image...</span>
      </div>
    );
  }

  // If error or no URL, show fallback
  if (error || !imageUrl) {
    return (
      <div className={styles.messageAttachment}>
        <span>Image not available</span>
      </div>
    );
  }

  // Show the MinIO image
  return (
    <img
      className={styles.messageAttachment}
      src={imageUrl}
      alt="attachment"
      onError={() => setError(true)}
    />
  );
};

export default function chatRoom(props: InterfaceChatRoomProps): JSX.Element {
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
  const [chat, setChat] = useState<GroupChat>();
  const [replyToDirectMessage, setReplyToDirectMessage] =
    useState<DirectMessage | null>(null);
  const [editMessage, setEditMessage] = useState<DirectMessage | null>(null);
  const [groupChatDetailsModalisOpen, setGroupChatDetailsModalisOpen] =
    useState(false);

  const [attachment, setAttachment] = useState('');
  const [attachmentObjectName, setAttachmentObjectName] = useState('');
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio: unstableGetFile } = useMinioDownload();
  const getFileFromMinio = useCallback(unstableGetFile, []); // stable ref
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
      chatId: props.selectedContact,
      replyTo: replyToDirectMessage?._id,
      media: attachmentObjectName,
      messageContent: newMessage,
    },
  });

  const [editChatMessage] = useMutation(EDIT_CHAT_MESSAGE, {
    variables: {
      messageId: editMessage?._id,
      messageContent: newMessage,
      chatId: props.selectedContact,
    },
  });

  const [markChatMessagesAsRead] = useMutation(MARK_CHAT_MESSAGES_AS_READ, {
    variables: {
      chatId: props.selectedContact,
      userId: userId,
    },
  });

  const { data: chatData, refetch: chatRefetch } = useQuery(CHAT_BY_ID, {
    variables: {
      id: props.selectedContact,
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
    markChatMessagesAsRead().then(() => {
      props.chatListRefetch();
      unreadChatListRefetch();
    });
  }, [props.selectedContact]);

  useEffect(() => {
    if (chatData) {
      const chat = chatData.chatById;
      setChat(chat);
      if (chat.isGroup) {
        setChatTitle(chat.name);
        setChatSubtitle(`${chat.users.length} members`);
        setChatImage(chat.image);
      } else {
        const otherUser = chat.users.find(
          (user: { _id: string }) => user._id !== userId,
        );
        if (otherUser) {
          setChatTitle(`${otherUser.firstName} ${otherUser.lastName}`);
          setChatSubtitle(otherUser.email);
          setChatImage(otherUser.image);
        }
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
    setAttachment('');
    setAttachmentObjectName('');
    await props.chatListRefetch({ id: userId as string });
  };

  useSubscription(MESSAGE_SENT_TO_CHAT, {
    variables: {
      userId: userId,
    },
    onData: async (messageSubscriptionData) => {
      if (
        messageSubscriptionData?.data.data.messageSentToChat &&
        messageSubscriptionData?.data.data.messageSentToChat
          .chatMessageBelongsTo['_id'] == props.selectedContact
      ) {
        await markChatMessagesAsRead();
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

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File is too large. Maximum file size is 5MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }

    try {
      // Get current organization ID from the chat data
      if (!chat?.organization?._id) {
        toast.info('Organization details are still loading. Please try again.');
        return;
      }
      const organizationId = chat.organization._id;
      // Upload file to MinIO
      const { objectName } = await uploadFileToMinio(file, organizationId);

      // Store the object name for sending with the message
      setAttachmentObjectName(objectName);

      // Get a presigned URL to display the image preview
      const presignedUrl = await getFileFromMinio(objectName, organizationId);
      setAttachment(presignedUrl);

      // allow re‑selecting the same file
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      alert('Error uploading image. Please try again.');
      // Clear any partial data
      setAttachment('');
      setAttachmentObjectName('');
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
              {!!chat?.messages.length && (
                <div id="messages">
                  {chat?.messages.map((message: DirectMessage) => {
                    const organizationId = chat?.organization?._id || 'default';

                    return (
                      <div
                        className={
                          message.sender._id === userId
                            ? styles.messageSentContainer
                            : styles.messageReceivedContainer
                        }
                        key={message._id}
                      >
                        {chat.isGroup &&
                          message.sender._id !== userId &&
                          (message.sender?.image ? (
                            <img
                              src={message.sender.image}
                              alt={message.sender.image}
                              className={styles.contactImage}
                            />
                          ) : (
                            <Avatar
                              name={
                                message.sender.firstName +
                                ' ' +
                                message.sender.lastName
                              }
                              alt={
                                message.sender.firstName +
                                ' ' +
                                message.sender.lastName
                              }
                              avatarStyle={styles.contactImage}
                            />
                          ))}
                        <div
                          className={
                            message.sender._id === userId
                              ? styles.messageSent
                              : styles.messageReceived
                          }
                          data-testid="message"
                          key={message._id}
                          id={message._id}
                        >
                          <span className={styles.messageContent}>
                            {chat.isGroup && message.sender._id !== userId && (
                              <p className={styles.senderInfo}>
                                {message.sender.firstName +
                                  ' ' +
                                  message.sender.lastName}
                              </p>
                            )}
                            {message.replyTo && (
                              <a href={`#${message.replyTo._id}`}>
                                <div className={styles.replyToMessage}>
                                  <p className={styles.senderInfo}>
                                    {message.replyTo.sender.firstName +
                                      ' ' +
                                      message.replyTo.sender.lastName}
                                  </p>
                                  <span>{message.replyTo.messageContent}</span>
                                </div>
                              </a>
                            )}
                            {message.media && (
                              <MessageImage
                                media={message.media}
                                organizationId={organizationId}
                                getFileFromMinio={getFileFromMinio}
                              />
                            )}
                            {message.messageContent}
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
                                    setNewMessage(message.messageContent);
                                  }}
                                  data-testid="replyToMessage"
                                >
                                  Edit
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                            <span className={styles.messageTime}>
                              {new Date(message?.createdAt).toLocaleTimeString(
                                'it-IT',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
            />
            {!!replyToDirectMessage?._id && (
              <div data-testid="replyMsg" className={styles.replyTo}>
                <div className={styles.replyToMessageContainer}>
                  <div className={styles.userDetails}>
                    <Avatar
                      name={
                        replyToDirectMessage.sender.firstName +
                        ' ' +
                        replyToDirectMessage.sender.lastName
                      }
                      alt={
                        replyToDirectMessage.sender.firstName +
                        ' ' +
                        replyToDirectMessage.sender.lastName
                      }
                      avatarStyle={styles.userImage}
                    />
                    <span>
                      {replyToDirectMessage.sender.firstName +
                        ' ' +
                        replyToDirectMessage.sender.lastName}
                    </span>
                  </div>
                  <p>{replyToDirectMessage.messageContent}</p>
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
                  onClick={() => {
                    setAttachment('');
                    setAttachmentObjectName('');
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
