import React, { useEffect, useRef, useState } from 'react';
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
import convertToBase64 from 'utils/convertToBase64';

interface InterfaceChatRoomProps {
  selectedContact: string;
  chatListRefetch: (
    variables?:
      | Partial<{
          id: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<{ chatList: Chat[] }>>;
}

/**
 * A chat room component that displays messages and a message input field.
 *
 * This component shows a list of messages between the user and a selected contact.
 * If no contact is selected, it displays a placeholder with an icon and a message asking the user to select a contact.
 *
 * @param  props - The properties passed to the component.
 * @param selectedContact - The ID or name of the currently selected contact. If empty, a placeholder is shown.
 *
 * @returns The rendered chat room component.
 */

type DirectMessage = {
  _id: string;
  createdAt: Date;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  replyTo:
    | {
        _id: string;
        createdAt: Date;
        sender: {
          _id: string;
          firstName: string;
          lastName: string;
          image: string;
        };
        messageContent: string;
        receiver: {
          _id: string;
          firstName: string;
          lastName: string;
        };
      }
    | undefined;
  messageContent: string;
  media: string;
};

type Chat = {
  _id: string;
  isGroup: boolean;
  name?: string;
  image?: string;
  messages: DirectMessage[];
  admins: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  unseenMessagesByUsers: string;
  description: string;
};

export default function chatRoom(props: InterfaceChatRoomProps): JSX.Element {
  // Translation hook for text in different languages
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
  const [chat, setChat] = useState<Chat>();
  const [replyToDirectMessage, setReplyToDirectMessage] =
    useState<DirectMessage | null>(null);
  const [editMessage, setEditMessage] = useState<DirectMessage | null>(null);
  const [groupChatDetailsModalisOpen, setGroupChatDetailsModalisOpen] =
    useState(false);

  const [attachment, setAttachment] = useState('');

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
      media: attachment,
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
    await props.chatListRefetch({ id: userId });
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
      const base64 = await convertToBase64(file);
      setAttachment(base64);
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
                              <img
                                className={styles.messageAttachment}
                                src={message.media}
                                alt="attachment"
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
                <img src={attachment as string} alt="attachment" />

                <Button
                  onClick={() => setAttachment('')}
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
