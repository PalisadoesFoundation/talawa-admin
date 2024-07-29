import React, { useEffect, useRef, useState } from 'react';
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
    data: chatDataGorup,
    loading: groupChatLoading,
    refetch: groupChatRefresh,
  } = useQuery(GROUP_CHAT_BY_ID, {
    variables: {
      id: props.selectedContact,
    },
  });

  useEffect(() => {
    if (props.selectedChatType == 'direct') {
      chatRefetch();
    } else if (props.selectedChatType == 'group') {
      groupChatRefresh();
    }
  }, [props.selectedContact]);

  useEffect(() => {
    if (
      props.selectedChatType === 'direct' &&
      chatData &&
      isMountedRef.current
    ) {
      const directChatData = chatData.directChatById;
      setDirectChat(directChatData);
      const otherUser = directChatData.users.find(
        (user: any) => user._id !== userId,
      );
      if (otherUser) {
        setChatTitle(`${otherUser.firstName} ${otherUser.lastName}`);
        setChatSubtitle(otherUser.email);
      }
    }
  }, [chatData]);

  useEffect(() => {
    if (
      props.selectedChatType === 'group' &&
      chatDataGorup &&
      isMountedRef.current
    ) {
      const groupChatData = chatDataGorup.groupChatById;
      setGroupChat(groupChatData);
      setChatTitle(groupChatData.title);
      setChatSubtitle(`${groupChatData.users.length} members`);
    }
  }, [chatDataGorup]);

  const sendMessage = async (): Promise<void> => {
    console.log(props.selectedChatType);
    if (props.selectedChatType === 'direct') {
      await sendMessageToDirectChat();
      await chatRefetch();
    } else if (props.selectedChatType === 'group') {
      const data = await sendMessageToGroupChat();
      await groupChatRefresh();
    }
    setNewMessage('');
  };

  useSubscription(MESSAGE_SENT_TO_DIRECT_CHAT, {
    variables: {
      userId: userId,
    },
    onData: (directMessageSubscriptionData) => {
      console.log(
        directMessageSubscriptionData?.data.data.messageSentToDirectChat
          .directChatMessageBelongsTo['_id'],
        props.selectedContact,
      );
      if (
        directMessageSubscriptionData?.data.data.messageSentToDirectChat &&
        directMessageSubscriptionData?.data.data.messageSentToDirectChat
          .directChatMessageBelongsTo['_id'] == props.selectedContact
      ) {
        const updatedChat = directChat
          ? JSON.parse(JSON.stringify(directChat))
          : { messages: [] };
        updatedChat?.messages.push(
          directMessageSubscriptionData?.data.data.messageSentToDirectChat,
        );
        setDirectChat(updatedChat);
        chatRefetch();
      }
    },
  });

  useSubscription(MESSAGE_SENT_TO_GROUP_CHAT, {
    variables: {
      userId: userId,
    },
    onData: (groupMessageSubscriptionData) => {
      if (
        groupMessageSubscriptionData?.data.data.messageSentToGroupChat &&
        groupMessageSubscriptionData?.data.data.messageSentToGroupChat
          .groupChatMessageBelongsTo['_id'] == props.selectedContact
      ) {
        const updatedChat = groupChat
          ? JSON.parse(JSON.stringify(groupChat))
          : { messages: [] };
        updatedChat?.messages.push(
          groupMessageSubscriptionData.data.data.messageSentToGroupChat,
        );
        setGroupChat(updatedChat);
        groupChatRefresh({
          id: props.selectedContact,
        });
      } else {
        groupChatRefresh({
          id: groupMessageSubscriptionData?.data.data.messageSentToGroupChat
            .groupChatMessageBelongsTo['_id'],
        });
        groupChatRefresh({
          id: props.selectedContact,
        });
      }
    },
  });

  useEffect(() => {
    document
      .getElementById('chat-area')
      ?.lastElementChild?.scrollIntoView({ block: 'end' });
  });

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
                              data-testid="groupChatMsg"
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
