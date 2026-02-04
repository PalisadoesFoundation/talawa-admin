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

import { MoreVert } from '@mui/icons-material';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import styles from './MessageItem.module.css';
import type { INewChat } from './types';
import MessageImage from './MessageImage';
import DropDownButton from 'shared-components/DropDownButton';
import { useMemo, useCallback } from 'react';

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

  const messageOptions = useMemo(() => {
    const opts = [
      {
        value: 'reply',
        label: t('reply'),
      },
    ];

    if (isOwnMessage) {
      if (!isFile) {
        opts.push({
          value: 'edit',
          label: t('edit'),
        });
      }
      opts.push({
        value: 'delete',
        label: t('delete'),
      });
    }

    return opts;
  }, [isOwnMessage, isFile, t]);

  const handleMessageAction = useCallback(
    (action: string): void => {
      switch (action) {
        case 'reply':
          onReply(message);
          break;
        case 'edit':
          onEdit(message);
          break;
        case 'delete':
          onDelete(message.id);
          break;
      }
    },
    [message, onReply, onEdit, onDelete],
  );

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
          <DropDownButton
            id={`message-${message.id}-dropdown`}
            options={messageOptions}
            onSelect={handleMessageAction}
            dataTestIdPrefix="more-options"
            variant="outline-secondary"
            btnStyle={styles.customToggle}
            icon={<MoreVert />}
            placeholder=""
            ariaLabel={t('messageActions')}
          />
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
