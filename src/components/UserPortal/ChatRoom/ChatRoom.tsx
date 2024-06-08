import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from './ChatRoom.module.css';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useTranslation } from 'react-i18next';
import { DIRECT_CHAT_MESSAGES_BY_CHAT_ID } from 'GraphQl/Queries/PlugInQueries';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  CREATE_MESSAGE_CHAT,
  MESSAGE_SENT_TO_DIRECT_CHAT,
  SEND_MESSAGE_TO_DIRECT_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import useLocalStorage from 'utils/useLocalstorage';

type SelectedContact = {
  id: string;
  userId: string;
  messages: DirectMessage[];
};
interface InterfaceChatRoomProps {
  selectedContact: SelectedContact;
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

export default function chatRoom(props: InterfaceChatRoomProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const [newMessage, setNewMessage] = useState('');

  const [messages, setMessages] = useState<DirectMessage[]>([]);

  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newMessageValue = e.target.value;

    setNewMessage(newMessageValue);
  };

  // DIRECT_CHAT_MESSAGES_BY_CHAT_ID

  const [sendMessageToDirectChat] = useMutation(SEND_MESSAGE_TO_DIRECT_CHAT);
  const [createMessageChat] = useMutation(CREATE_MESSAGE_CHAT);

  const {
    data: chatMessages,
    loading: chatMessagesLoading,
    refetch: chatMessagesRefresh,
  } = useQuery(DIRECT_CHAT_MESSAGES_BY_CHAT_ID, {
    variables: {
      id: props.selectedContact.id,
    },
  });

  const { data: messageSubscriptionData } = useSubscription(
    MESSAGE_SENT_TO_DIRECT_CHAT,
    {
      variables: {
        userId: userId,
      },
    },
  );

  // CREATE_MESSAGE_CHAT

  useEffect(() => {
    if (chatMessages) {
      console.log(chatMessages, 'messages');
      setMessages(chatMessages.directChatsMessagesByChatID);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (messageSubscriptionData) {
      const updatedMessages = JSON.parse(JSON.stringify(messages));
      console.log('before', updatedMessages.length, updatedMessages);
      console.log(
        messageSubscriptionData.messageSentToDirectChat,
        'subscription',
      );
      updatedMessages.push(messageSubscriptionData.messageSentToDirectChat);
      setMessages(updatedMessages);
      console.log('after', updatedMessages.length, updatedMessages);
    }
  }, [messageSubscriptionData]);

  const sendMessage = async (): Promise<void> => {
    console.log('selesctedContact', props.selectedContact);
    await sendMessageToDirectChat({
      variables: {
        chatId: props.selectedContact.id,
        messageContent: newMessage,
      },
    });

    // await createMessageChat({
    //   variables: {
    //     messageContent: newMessage,
    //     receiver: props.selectedContact.userId,
    //   },
    // });
    await chatMessagesRefresh();
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
          <div className={`d-flex flex-grow-1 flex-column`}>
            <div className="chatMessages">
              {messages.length}
              {messages.length && (
                <div id="messages">
                  {messages.map((message: DirectMessage, index: number) => {
                    return <div key={index}>{message.messageContent}</div>;
                  })}
                </div>
              )}
            </div>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderRadius: '20px 20px 5px 20px',
                marginBottom: `10px`,
              }}
            >
              My message
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: '#31bb6b',
                borderRadius: '20px 20px 20px 5px',
                color: 'white',
                marginBottom: `10px`,
              }}
            >
              Other message
            </Paper>
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
