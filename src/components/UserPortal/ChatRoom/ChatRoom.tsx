import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from './ChatRoom.module.css';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useTranslation } from 'react-i18next';
import { DIRECT_CHAT_BY_ID, DIRECT_CHAT_MESSAGES_BY_CHAT_ID, GROUP_CHAT_BY_ID } from 'GraphQl/Queries/PlugInQueries';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  CREATE_MESSAGE_CHAT,
  MESSAGE_SENT_TO_DIRECT_CHAT,
  SEND_MESSAGE_TO_DIRECT_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import { hours } from 'components/EventCalendar/constants';

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

  const [newMessage, setNewMessage] = useState('');

  const [directChat, setDirectChat] = useState<Chat>();
  const [groupChat, setGroupChat] = useState<Chat>();

  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMessageValue = e.target.value;

    setNewMessage(newMessageValue);
  };


  const [sendMessageToDirectChat] = useMutation(SEND_MESSAGE_TO_DIRECT_CHAT);
  const [createMessageChat] = useMutation(CREATE_MESSAGE_CHAT);

  if(props.selectedChatType == 'direct') {
    const {
      data: chatData,
      loading: chatLoading,
      refetch: chatRefresh,
    } = useQuery(DIRECT_CHAT_BY_ID, { variables: {
       id: props.selectedContact
      }
    });

    useEffect(() => {
      if (chatData) {
        console.log(chatData, 'chat');
        setDirectChat(chatData.directChatById);
  
        if(chatData.directChatById.users[0]._id == userId) {
          setChatTitle(`${chatData.directChatById.users[1].firstName} ${chatData.directChatById.users[1].lastName}`);
        } else {
          setChatTitle(`${chatData.directChatById.users[0].firstName} ${chatData.directChatById.users[0].lastName}`);
        }
      }
    }, [chatData]);
  } else {
    const {
      data: groupChatData,
      loading: groupChatLoading,
      refetch: groupChatRefresh,
    } = useQuery(GROUP_CHAT_BY_ID, { variables: {
      id: props.selectedContact
      }
    });

    useEffect(() => {
      if (groupChatData) {
        console.log(groupChatData, 'chat');
        setGroupChat(groupChatData.groupChatById);
  
        setChatTitle(groupChatData.groupChatById.title);
      }
    }, [groupChatData]);
  }

  const { data: messageSubscriptionData } = useSubscription(
    MESSAGE_SENT_TO_DIRECT_CHAT,
    {
      variables: {
        userId: userId,
      },
    },
  );

  

  

  // useEffect(() => {
  //   if (messageSubscriptionData) {
  //     const updatedMessages = JSON.parse(JSON.stringify(messages));
  //     console.log('before', updatedMessages.length, updatedMessages);
  //     console.log(
  //       messageSubscriptionData.messageSentToDirectChat,
  //       'subscription',
  //     );
  //     updatedMessages.push(messageSubscriptionData.messageSentToDirectChat);
  //     setMessages(updatedMessages);
  //     console.log('after', updatedMessages.length, updatedMessages);
  //   }
  // }, [messageSubscriptionData]);

  const sendMessage = async (): Promise<void> => {
    console.log('selesctedContact', props.selectedContact);
    await sendMessageToDirectChat({
      variables: {
        chatId: props.selectedContact,
        messageContent: newMessage,
      },
    });

    // await createMessageChat({
    //   variables: {
    //     messageContent: newMessage,
    //     receiver: props.selectedContact.userId,
    //   },
    // });
    // await chatMessagesRefresh();
    // setMessages(chatMessages);
  };

  return (
    <div className={`d-flex flex-column ${styles.chatAreaContainer}`}>
      {!props.selectedContact ? (
        <div
          className={`d-flex flex-column justify-content-center align-items-center w-100 h-75 gap-2 ${styles.grey}`}
        >
          <PermContactCalendarIcon fontSize="medium" className={styles.grey} />
          <h6>{t('selectContact')}</h6>
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
              <h5>
                {chatTitle}
              </h5>
            </div>
          </div>
          <div className={`d-flex flex-grow-1 flex-column`}>
            <div className="chatMessages">
              {(directChat?.messages.length || groupChat?.messages.length) && (
                <div id="messages">
                  {props.selectedChatType == 'direct' ? directChat?.messages.map((message: DirectMessage, index: number) => {
                    return (
                      <>
                        <div
                          className={
                            message.sender._id === userId
                              ? styles.messageReceivedContainer
                              : styles.messageSentContainer
                          }
                        >
                          <div
                            className={
                              message.sender._id === userId
                                ? styles.messageSent
                                : styles.messageReceived
                            }
                            key={index}
                          >
                            <span className={styles.messageContent}>
                              {message.messageContent}
                            </span>
                            <span className={styles.messageTime}>
                              {new Date(message?.createdAt).toLocaleTimeString(
                                'it-IT',
                                { hour: '2-digit', minute: '2-digit' },
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  }) : groupChat?.messages.map((message: DirectMessage, index: number) => {
                    return (
                      <>
                        <div
                          className={
                            message.sender._id === userId
                              ? styles.messageReceivedContainer
                              : styles.messageSentContainer
                          }
                        >
                          <div
                            className={
                              message.sender._id === userId
                                ? styles.messageSent
                                : styles.messageReceived
                            }
                            key={index}
                          >
                            <span className={styles.messageContent}>
                              {message.messageContent}
                            </span>
                            <span className={styles.messageTime}>
                              {new Date(message?.createdAt).toLocaleTimeString(
                                'it-IT',
                                { hour: '2-digit', minute: '2-digit' },
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div>
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
                id="button-addon2"
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
