/**
 * MessageInput Component
 *
 * Handles message composition, attachments, and sending functionality.
 */

import React from 'react';
import type { ChangeEvent, RefObject } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Close } from '@mui/icons-material';
import { GrAttachment } from 'react-icons/gr';
import Avatar from 'components/Avatar/Avatar';
import styles from './ChatRoom.module.css';
import type { INewChat } from './ChatRoomTypes';

interface IMessageInputProps {
  newMessage: string;
  attachment: string | null;
  replyToMessage: INewChat['messages']['edges'][0]['node'] | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onNewMessageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onAddAttachment: () => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
  onCloseReply: () => void;
  placeholder: string;
}

export const MessageInput: React.FC<IMessageInputProps> = ({
  newMessage,
  attachment,
  replyToMessage,
  fileInputRef,
  onNewMessageChange,
  onSendMessage,
  onAddAttachment,
  onImageChange,
  onRemoveAttachment,
  onCloseReply,
  placeholder,
}) => {
  return (
    <div id="messageInput">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onImageChange}
        data-testid="hidden-file-input"
      />
      {!!replyToMessage?.id && (
        <div data-testid="replyMsg" className={styles.replyTo}>
          <div className={styles.replyToMessageContainer}>
            <div className={styles.userDetails}>
              <Avatar
                name={replyToMessage.creator.name}
                alt={replyToMessage.creator.name}
                avatarStyle={styles.userImage}
              />
              <span>{replyToMessage.creator.name}</span>
            </div>
            <p>{replyToMessage.body}</p>
          </div>

          <Button
            data-testid="closeReply"
            onClick={onCloseReply}
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
            onClick={onRemoveAttachment}
            className={styles.closeBtn}
          >
            <Close />
          </Button>
        </div>
      )}

      <InputGroup>
        <button onClick={onAddAttachment} className={styles.addAttachmentBtn}>
          <GrAttachment />
        </button>
        <Form.Control
          placeholder={placeholder}
          aria-label="Send Message"
          value={newMessage}
          data-testid="messageInput"
          onChange={onNewMessageChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          className={styles.sendMessageInput}
        />
        <Button
          onClick={onSendMessage}
          variant="primary"
          id="button-send"
          data-testid="sendMessage"
        >
          <SendIcon fontSize="small" />
        </Button>
      </InputGroup>
    </div>
  );
};
