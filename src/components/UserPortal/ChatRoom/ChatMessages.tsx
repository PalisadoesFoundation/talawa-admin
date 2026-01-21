/**
 * ChatMessages Component
 *
 * This component renders the list of messages in a chat room. It handles message pagination,
 * displays a loading indicator when fetching older messages, and manages scroll events.
 *
 * @remarks
 * - Uses a ref to track the messages container for scroll handling.
 * - Renders individual MessageItem components for each message.
 * - Shows loading state when more messages are being fetched.
 *
 * @param props - The props for the ChatMessages component.
 * @returns The rendered ChatMessages component.
 *
 * @example
 * ```tsx
 * <ChatMessages
 *   messages={chat.messages.edges}
 *   isGroup={false}
 *   currentUserId="user123"
 *   chatOrganizationId="org123"
 *   getFileFromMinio={getFileFromMinio}
 *   onScroll={handleScroll}
 *   loadingMoreMessages={false}
 *   onReply={setReplyToDirectMessage}
 *   onEdit={setEditMessage}
 *   onDelete={deleteMessage}
 *   t={t}
 *   setMessagesContainerRef={(ref) => (messagesContainerRef.current = ref)}
 * />
 * ```
 */

import { useRef, useEffect } from 'react';
import type { INewChat } from './types';
import MessageItem from './MessageItem';
import styles from './ChatRoom.module.css';

interface IChatMessagesProps {
  messages: INewChat['messages']['edges'];
  isGroup: boolean;
  currentUserId: string;
  chatOrganizationId?: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
  onScroll: () => void;
  loadingMoreMessages: boolean;
  onReply: (message: INewChat['messages']['edges'][0]['node']) => void;
  onEdit: (message: INewChat['messages']['edges'][0]['node']) => void;
  onDelete: (messageId: string) => void;
  t: (key: string) => string;
  setMessagesContainerRef: (ref: HTMLDivElement | null) => void;
}

export default function ChatMessages({
  messages,
  isGroup,
  currentUserId,
  chatOrganizationId,
  getFileFromMinio,
  onScroll,
  loadingMoreMessages,
  onReply,
  onEdit,
  onDelete,
  t,
  setMessagesContainerRef,
}: IChatMessagesProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessagesContainerRef(containerRef.current);
  }, [setMessagesContainerRef]);

  return (
    <div className={styles.chatMessages} ref={containerRef} onScroll={onScroll}>
      {loadingMoreMessages && (
        <div className={styles.loadingMore}>Loading more messages...</div>
      )}
      {!!messages?.length && (
        <div id="messages">
          {messages.map((edge) => (
            <MessageItem
              key={edge.node.id}
              message={edge.node}
              isGroup={isGroup}
              currentUserId={currentUserId}
              chatOrganizationId={chatOrganizationId}
              getFileFromMinio={getFileFromMinio}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
