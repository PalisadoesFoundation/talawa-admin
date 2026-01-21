/**
 * MessageInput Component
 *
 * This component provides the input interface for composing and sending messages. It supports
 * text input, file attachments, and reply functionality. Messages can be sent via button click
 * or Enter key.
 *
 * @remarks
 * - Supports image attachments with preview.
 * - Displays reply preview when replying to a message.
 * - Uses react-bootstrap InputGroup for layout.
 *
 * @param props - The props for the MessageInput component.
 * @returns The rendered MessageInput component.
 *
 * @example
 * ```tsx
 * <MessageInput
 *   newMessage={newMessage}
 *   replyToDirectMessage={replyToDirectMessage}
 *   attachment={attachment}
 *   onNewMessageChange={handleNewMessageChange}
 *   onSendMessage={sendMessage}
 *   onAddAttachment={handleAddAttachment}
 *   onFileChange={handleImageChange}
 *   onRemoveAttachment={() => setAttachment(null)}
 *   onCloseReply={() => setReplyToDirectMessage(null)}
 *   sendMessagePlaceholder="Type a message..."
 *   fileInputRef={fileInputRef}
 * />
 * ```
 */

import React from 'react';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { GrAttachment } from 'react-icons/gr';
import SendIcon from '@mui/icons-material/Send';
import { Close } from '@mui/icons-material';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import styles from './ChatRoom.module.css';
import type { ChangeEvent } from 'react';
import type { INewChat } from './types';

interface IMessageInputProps {
  newMessage: string;
  replyToDirectMessage: INewChat['messages']['edges'][0]['node'] | null;
  attachment: string | null;
  onNewMessageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onAddAttachment: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
  onCloseReply: () => void;
  sendMessagePlaceholder: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function MessageInput({
  newMessage,
  replyToDirectMessage,
  attachment,
  onNewMessageChange,
  onSendMessage,
  onAddAttachment,
  onFileChange,
  onRemoveAttachment,
  onCloseReply,
  sendMessagePlaceholder,
  fileInputRef,
}: IMessageInputProps): JSX.Element {
  return (
    <div id="messageInput">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
        data-testid="hidden-file-input"
      />
      {!!replyToDirectMessage?.id && (
        <div data-testid="replyMsg" className={styles.replyTo}>
          <div className={styles.replyToMessageContainer}>
            <div className={styles.userDetails}>
              <ProfileAvatarDisplay
                imageUrl={replyToDirectMessage.creator.avatarURL}
                fallbackName={replyToDirectMessage.creator.name}
                className={styles.userImage}
              />
              <span>{replyToDirectMessage.creator.name}</span>
            </div>
            <p>{replyToDirectMessage.body}</p>
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
        <button
          type="button"
          onClick={onAddAttachment}
          className={styles.addAttachmentBtn}
        >
          <GrAttachment />
        </button>
        <Form.Control
          placeholder={sendMessagePlaceholder}
          aria-label={sendMessagePlaceholder}
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
}
