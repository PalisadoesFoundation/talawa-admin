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
 * - Uses MinIO for file storage.
 *
 * @dependencies
 * - React, React-Bootstrap, Material-UI, and Apollo Client.
 * - Custom hooks: `useLocalStorage`, `useMinioUpload`.
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
import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import { useOrganization } from 'contexts/OrganizationContext';

// Cache to persist MinIO URLs across component renders/mounts
const globalMediaCache: Record<string, string> = {};

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

export default function chatRoom(props: InterfaceChatRoomProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });
  const { organizationId } = useOrganization();
  const isMountedRef = useRef<boolean>(true);
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();
  const mediaUrlCacheRef = useRef<Record<string, string>>(globalMediaCache);
  const [messageMediaUrls, setMessageMediaUrls] =
    useState<Record<string, string>>(globalMediaCache);

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
    if (file) {
      try {
        // Upload file to MinIO
        const { objectName } = await uploadFileToMinio(
          file,
          organizationId || '',
        );
        setAttachmentObjectName(objectName);

        // Create a temporary URL for preview
        const objectUrl = URL.createObjectURL(file);
        setAttachment(objectUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        // TODO: Show error toast to user
      }
    }
  };

  // Clean up object URL when component unmounts or attachment changes
  useEffect(() => {
    return () => {
      if (attachment && attachment.startsWith('blob:')) {
        URL.revokeObjectURL(attachment);
      }
    };
  }, [attachment]);

  useEffect(() => {
    if (chat?.messages) {
      // Collect media keys that haven't been cached yet
      const uncachedMedia = new Set<string>();

      for (const message of chat.messages) {
        if (
          message.media &&
          !messageMediaUrls[message.media] &&
          !mediaUrlCacheRef.current[message.media]
        ) {
          uncachedMedia.add(message.media);
        }
      }

      // If no uncached media, skip the fetch
      if (uncachedMedia.size === 0) return;

      // Load media URLs in parallel batches
      const loadMediaUrls = async () => {
        try {
          const mediaPromises = Array.from(uncachedMedia).map(
            async (mediaKey) => {
              try {
                const url = await getFileFromMinio(
                  mediaKey,
                  organizationId || '',
                );
                return { key: mediaKey, url };
              } catch (error) {
                console.error(
                  `Error loading media URL for ${mediaKey}:`,
                  error,
                );
                return null;
              }
            },
          );

          const results = await Promise.all(mediaPromises);

          // Update cache with new results
          const newMediaUrls: Record<string, string> = {};
          results.forEach((result) => {
            if (result) {
              newMediaUrls[result.key] = result.url;
              // Update global cache
              globalMediaCache[result.key] = result.url;
            }
          });

          if (Object.keys(newMediaUrls).length > 0 && isMountedRef.current) {
            mediaUrlCacheRef.current = {
              ...mediaUrlCacheRef.current,
              ...newMediaUrls,
            };
            setMessageMediaUrls((prev) => ({ ...prev, ...newMediaUrls }));
          }
        } catch (error) {
          console.error('Error batch loading media URLs:', error);
        }
      };

      loadMediaUrls();
    }
  }, [chat?.messages, organizationId]);

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
                            {message.media &&
                              messageMediaUrls[message.media] && (
                                <img
                                  className={styles.messageAttachment}
                                  src={messageMediaUrls[message.media]}
                                  alt={
                                    message?.media?.split('/').pop() ??
                                    t('attachment')
                                  }
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
                    if (attachment.startsWith('blob:'))
                      URL.revokeObjectURL(attachment);
                    setAttachment('');
                    setAttachmentObjectName('');
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
