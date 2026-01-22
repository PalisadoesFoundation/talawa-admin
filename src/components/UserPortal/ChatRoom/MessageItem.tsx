// translation-check-keyPrefix: userChatRoom
/**
 * MessageItem Component
 *
 * This component renders a single chat message. It displays the message content, sender information
 * (for group chats), timestamp, and action buttons for reply, edit, and delete operations.
 *
 * @remarks
 * - Differentiates between sent and received messages with distinct styling.
 * - Shows sender avatar in group chats for non-own messages.
 * - Displays parent message reference when replying to a message.
 * - Supports both text and image attachments.
 *
 * @param props - The props for the MessageItem component.
 * @returns The rendered MessageItem component.
 *
 * @example
 * ```tsx
 * <MessageItem
 *   message={messageNode}
 *   isGroup={false}
 *   currentUserId="user123"
 *   chatOrganizationId="org123"
 *   getFileFromMinio={getFileFromMinio}
 *   onReply={setReplyToDirectMessage}
 *   onEdit={setEditMessage}
 *   onDelete={deleteMessage}
 *   t={t}
 * />
 * ```
 */

import { Dropdown } from 'react-bootstrap';
import { MoreVert } from '@mui/icons-material';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import styles from './ChatRoom.module.css';
import type { INewChat } from './types';
import MessageImage from './MessageImage';

interface IMessageItemProps {
  message: INewChat['messages']['edges'][0]['node'];
  isGroup: boolean;
  currentUserId: string;
  chatOrganizationId?: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
  onReply: (message: INewChat['messages']['edges'][0]['node']) => void;
  onEdit: (message: INewChat['messages']['edges'][0]['node']) => void;
  onDelete: (messageId: string) => void;
  t: (key: string) => string;
}

export default function MessageItem({
  message,
  isGroup,
  currentUserId,
  chatOrganizationId,
  getFileFromMinio,
  onReply,
  onEdit,
  onDelete,
  t,
}: IMessageItemProps): JSX.Element {
  const isOwnMessage = message.creator.id === currentUserId;
  const isFile = message.body.startsWith('uploads/');

  return (
    <div
      className={
        isOwnMessage
          ? styles.messageSentContainer
          : styles.messageReceivedContainer
      }
      key={message.id}
    >
      {isGroup && !isOwnMessage && (
        <ProfileAvatarDisplay
          imageUrl={message.creator.avatarURL}
          fallbackName={message.creator.name}
          className={styles.contactImage}
          enableEnlarge={true}
        />
      )}
      <div
        className={isOwnMessage ? styles.messageSent : styles.messageReceived}
        data-testid="message"
        key={message.id}
        id={message.id}
      >
        <span className={styles.messageContent}>
          {isGroup && !isOwnMessage && (
            <p className={styles.senderInfo}>{message.creator.name}</p>
          )}
          {message.parentMessage && (
            <a href={`#${message.parentMessage.id}`}>
              <div className={styles.replyToMessage}>
                <p className={styles.replyToMessageSender}>
                  {message.parentMessage.creator.name}
                </p>
                <span>{message.parentMessage.body}</span>
              </div>
            </a>
          )}
          {isFile ? (
            <MessageImage
              media={message.body}
              organizationId={chatOrganizationId}
              getFileFromMinio={getFileFromMinio}
            />
          ) : (
            message.body
          )}
        </span>
        <div className={styles.messageAttributes}>
          <Dropdown data-testid="moreOptions" className={styles.dropdownCursor}>
            <Dropdown.Toggle
              className={styles.customToggle}
              data-testid={'dropdown'}
            >
              <MoreVert />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  onReply(message);
                }}
                data-testid="replyBtn"
              >
                {t('reply')}
              </Dropdown.Item>
              {isOwnMessage && (
                <>
                  {!message.body.startsWith('uploads/') && (
                    <Dropdown.Item
                      onClick={() => {
                        onEdit(message);
                      }}
                      data-testid="replyToMessage"
                    >
                      {t('edit')}
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    onClick={() => onDelete(message.id)}
                    data-testid="deleteMessage"
                    className={styles.deleteMenuItem}
                  >
                    {t('delete')}
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <span className={styles.messageTime}>
            {new Date(message?.createdAt).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
