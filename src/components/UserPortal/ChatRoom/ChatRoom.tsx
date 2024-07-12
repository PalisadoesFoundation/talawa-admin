import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from './ChatRoom.module.css';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useTranslation } from 'react-i18next';
import {
  DIRECT_CHAT_BY_ID,
  GROUP_CHAT_BY_ID,
} from 'GraphQl/Queries/PlugInQueries';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  MESSAGE_SENT_TO_DIRECT_CHAT,
  MESSAGE_SENT_TO_GROUP_CHAT,
  SEND_MESSAGE_TO_DIRECT_CHAT,
  SEND_MESSAGE_TO_GROUP_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';

interface InterfaceChatRoomProps {
  selectedContact: string;
  selectedChatType: string;
}

type DirectMessage = {
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
};

type Chat = {
  _id: string;
  messages: {
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
  }[];
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
};

export default function chatRoom(props: InterfaceChatRoomProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const [chatTitle, setChatTitle] = useState('');
  const [chatSubtitle, setChatSubtitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [directChat, setDirectChat] = useState<Chat>();
  const [groupChat, setGroupChat] = useState<Chat>();

  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMessageValue = e.target.value;
    setNewMessage(newMessageValue);
  };

  const [sendMessageToDirectChat] = useMutation(SEND_MESSAGE_TO_DIRECT_CHAT, {
    variables: {
      chatId: props.selectedContact,
      messageContent: newMessage,
    },
  });

  const [sendMessageToGroupChat] = useMutation(SEND_MESSAGE_TO_GROUP_CHAT, {
    variables: {
      chatId: props.selectedContact,
      messageContent: newMessage,
    },
  });

  const {
    data: chatData,
    loading: chatLoading,
    refetch: chatRefetch,
  } = useQuery(DIRECT_CHAT_BY_ID, {
    variables: {
      id: props.selectedContact,
    },
  });

  const {
    data: groupChatData,
    loading: groupChatLoading,
    refetch: groupChatRefresh,
  } = useQuery(GROUP_CHAT_BY_ID, {
    variables: {
      id: props.selectedContact,
    },
  });
  if (props.selectedChatType == 'direct') {
    useEffect(() => {
      if (chatData) {
        setDirectChat(chatData.directChatById);
        if (chatData.directChatById.users[0]._id == userId) {
          setChatTitle(
            `${chatData.directChatById.users[1].firstName} ${chatData.directChatById.users[1].lastName}`,
          );
          setChatSubtitle(chatData.directChatById.users[1].email);
        } else {
          setChatTitle(
            `${chatData.directChatById.users[0].firstName} ${chatData.directChatById.users[0].lastName}`,
          );
          setChatSubtitle(chatData.directChatById.users[0].email);
        }
      }
    }, [chatData]);
  } else {
    useEffect(() => {
      if (groupChatData) {
        setGroupChat(groupChatData.groupChatById);
        setChatTitle(groupChatData.groupChatById.title);
        setChatSubtitle(groupChatData.groupChatById.users.length);
      }
    }, [groupChatData]);
  }

  const sendMessage = async (): Promise<void> => {
    if (props.selectedChatType == 'direct') {
      await sendMessageToDirectChat();
      await chatRefetch();
    } else if (props.selectedChatType == 'group') {
      await sendMessageToGroupChat();
      await groupChatRefresh();
    }
    setNewMessage('');
  };

  const { data: directMessageSubscriptionData } = useSubscription(
    MESSAGE_SENT_TO_DIRECT_CHAT,
    {
      variables: {
        userId: userId,
      },
    },
  );

  const { data: groupMessageSubscriptionData } = useSubscription(
    MESSAGE_SENT_TO_GROUP_CHAT,
    {
      variables: {
        userId: userId,
      },
    },
  );

  useEffect(() => {
    document
      .getElementById('chat-area')
      ?.lastElementChild?.scrollIntoView({ block: 'end' });
  });

  useEffect(() => {
    if (groupMessageSubscriptionData) {
      const updatedChat = groupChat
        ? JSON.parse(JSON.stringify(groupChat))
        : { messages: [] };
      updatedChat?.messages.push(
        groupMessageSubscriptionData.messageSentToGroupChat,
      );
      setGroupChat(updatedChat);
    }
  }, [groupMessageSubscriptionData]);

  useEffect(() => {
    if (directMessageSubscriptionData) {
      const updatedChat = directChat
        ? JSON.parse(JSON.stringify(directChat))
        : { messages: [] };
      updatedChat?.messages.push(
        directMessageSubscriptionData.messageSentToDirectChat,
      );
      setDirectChat(updatedChat);
    }
  }, [directMessageSubscriptionData]);

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
              <Avatar
                name={chatTitle}
                alt={chatTitle}
                avatarStyle={styles.contactImage}
              />
              <div className={styles.userDetails}>
                <p className={styles.title}>{chatTitle}</p>
                <p className={styles.subtitle}>
                  {chatSubtitle}{' '}
                  {props.selectedChatType == 'direct' ? '' : 'members'}
                </p>
              </div>
            </div>
          </div>
          <div className={`d-flex flex-grow-1 flex-column`}>
            <div className={styles.chatMessages}>
              {!!(
                directChat?.messages.length || groupChat?.messages.length
              ) && (
                <div id="messages">
                  {props.selectedChatType == 'direct'
                    ? directChat?.messages.map(
                        (message: DirectMessage, index: number) => {
                          return (
                            <div
                              className={
                                message.sender._id === userId
                                  ? styles.messageSentContainer
                                  : styles.messageReceivedContainer
                              }
                              key={message._id}
                            >
                              <div
                                className={
                                  message.sender._id === userId
                                    ? styles.messageSent
                                    : styles.messageReceived
                                }
                                key={message._id}
                              >
                                <span className={styles.messageContent}>
                                  {message.messageContent}
                                </span>
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
                          );
                        },
                      )
                    : groupChat?.messages.map(
                        (message: DirectMessage, index: number) => {
                          return (
                            <div
                              className={
                                message.sender._id === userId
                                  ? styles.messageSentContainer
                                  : styles.messageReceivedContainer
                              }
                              key={message._id}
                            >
                              {message.sender._id !== userId ? (
                                message.sender?.image ? (
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
                                )
                              ) : (
                                ''
                              )}
                              <div
                                className={
                                  message.sender._id === userId
                                    ? styles.messageSent
                                    : styles.messageReceived
                                }
                                key={message._id}
                              >
                                {message.sender._id !== userId && (
                                  <p className={styles.senderInfo}>
                                    {message.sender.firstName +
                                      ' ' +
                                      message.sender.lastName}
                                  </p>
                                )}
                                <span className={styles.messageContent}>
                                  {message.messageContent}
                                </span>
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
                          );
                        },
                      )}
                </div>
              )}
            </div>
          </div>
          <div id="messageInput">
            <InputGroup>
              <Form.Control
                placeholder={t('sendMessage')}
                aria-label="Send Message"
                value={newMessage}
                data-testid="messageInput"
                onChange={handleNewMessageChange}
                className={styles.backgroundWhite}
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
    </div>
  );
}
