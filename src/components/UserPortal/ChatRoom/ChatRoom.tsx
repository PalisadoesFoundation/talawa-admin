import React from 'react';
import type { ChangeEvent } from 'react';
import { Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styles from './ChatRoom.module.css';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useTranslation } from 'react-i18next';

interface InterfaceChatRoomProps {
  selectedContact: string;
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
export default function chatRoom(props: InterfaceChatRoomProps): JSX.Element {
  // Translation hook for text in different languages
  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });

  // State to manage the new message input
  const [newMessage, setNewMessage] = React.useState('');

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
              <Button variant="primary" id="button-addon2">
                <SendIcon fontSize="small" />
              </Button>
            </InputGroup>
          </div>
        </>
      )}
    </div>
  );
}
