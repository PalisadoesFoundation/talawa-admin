/**
 * ChatMessageList Component
 *
 * Displays the list of chat messages with infinite scroll and message actions.
 */

import React from 'react';
import type { RefObject } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { MoreVert } from '@mui/icons-material';
import Avatar from 'components/Avatar/Avatar';
import { MessageImage } from './MessageImage';
import styles from './ChatRoom.module.css';
import type { INewChat } from './ChatRoomTypes';

interface IChatMessageListProps {
  chat: INewChat;
  userId: string;
  messagesContainerRef: RefObject<HTMLDivElement | null>;
  hasMoreMessages: boolean;
  loadingMoreMessages: boolean;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
  onScroll: () => void;
  onLoadMore: () => void;
  onReply: (message: INewChat['messages']['edges'][0]['node']) => void;
  onEdit: (message: INewChat['messages']['edges'][0]['node']) => void;
  onDelete: (messageId: string) => void;
  replyLabel: string;
  editLabel: string;
  deleteLabel: string;
  loadOlderMessagesLabel: string;
  loadingLabel: string;
}

export const ChatMessageList: React.FC<IChatMessageListProps> = ({
  chat,
  userId,
  messagesContainerRef,
  hasMoreMessages,
  loadingMoreMessages,
  getFileFromMinio,
  onScroll,
  onLoadMore,
  onReply,
  onEdit,
  onDelete,
  replyLabel,
  editLabel,
  deleteLabel,
  loadOlderMessagesLabel,
  loadingLabel,
}) => {
  return (
    <div className={`d-flex flex-grow-1 flex-column`} style={{ minHeight: 0 }}>
      <div
        className={styles.chatMessages}
        ref={messagesContainerRef}
        onScroll={onScroll}
      >
        {hasMoreMessages && (
          <div className={styles.loadMoreBar}>
            <Button
              variant="light"
              size="sm"
              onClick={onLoadMore}
              disabled={loadingMoreMessages}
            >
              {loadingMoreMessages ? loadingLabel : loadOlderMessagesLabel}
            </Button>
          </div>
        )}
        {loadingMoreMessages && (
          <div className={styles.loadingMore}>Loading more messages...</div>
        )}
        {!!chat?.messages?.edges?.length && (
          <div id="messages">
            {chat?.messages.edges.map(
              (edge: { node: INewChat['messages']['edges'][0]['node'] }) => {
                const message = edge.node;
                const isFile = message.body.startsWith('uploads/');

                return (
                  <div
                    className={
                      message.creator.id === userId
                        ? styles.messageSentContainer
                        : styles.messageReceivedContainer
                    }
                    key={message.id}
                  >
                    {chat.isGroup &&
                      message.creator.id !== userId &&
                      (message.creator?.avatarURL ? (
                        <img
                          src={message.creator.avatarURL}
                          alt={message.creator.avatarURL}
                          className={styles.contactImage}
                        />
                      ) : (
                        <Avatar
                          name={message.creator.name}
                          alt={message.creator.name}
                          avatarStyle={styles.contactImage}
                        />
                      ))}
                    <div
                      className={
                        message.creator.id === userId
                          ? styles.messageSent
                          : styles.messageReceived
                      }
                      data-testid="message"
                      key={message.id}
                      id={message.id}
                    >
                      <span className={styles.messageContent}>
                        {chat.isGroup && message.creator.id !== userId && (
                          <p className={styles.senderInfo}>
                            {message.creator.name}
                          </p>
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
                            organizationId={chat?.organization?.id}
                            getFileFromMinio={getFileFromMinio}
                          />
                        ) : (
                          message.body
                        )}
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
                                onReply(message);
                              }}
                              data-testid="replyBtn"
                            >
                              {replyLabel}
                            </Dropdown.Item>
                            {message.creator.id === userId && (
                              <>
                                {!message.body.startsWith('uploads/') && (
                                  <Dropdown.Item
                                    onClick={() => {
                                      onEdit(message);
                                    }}
                                    data-testid="replyToMessage"
                                  >
                                    {editLabel}
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Item
                                  onClick={() => onDelete(message.id)}
                                  data-testid="deleteMessage"
                                  style={{ color: 'red' }}
                                >
                                  {deleteLabel}
                                </Dropdown.Item>
                              </>
                            )}
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
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
};
