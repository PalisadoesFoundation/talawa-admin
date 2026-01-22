/**
 * ChatHeader Component
 *
 * This component displays the header information for a chat room, including the chat image,
 * title, and subtitle. For group chats, clicking on the header triggers the group details modal.
 *
 * @remarks
 * - Uses ProfileAvatarDisplay for rendering the chat avatar.
 * - Clickable header for group chats to view details.
 *
 * @param props - The props for the ChatHeader component.
 * @returns The rendered ChatHeader component.
 *
 * @example
 * ```tsx
 * <ChatHeader
 *   chatImage="https://example.com/avatar.jpg"
 *   chatTitle="Chat Name"
 *   chatSubtitle="2 members"
 *   isGroup={true}
 *   onGroupClick={() => setShowGroupDetails(true)}
 * />
 * ```
 */

import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import styles from './ChatHeader.module.css';
import { InterfaceChatHeaderProps } from './types';

export default function ChatHeader({
  chatImage,
  chatTitle,
  chatSubtitle,
  isGroup = false,
  onGroupClick,
}: InterfaceChatHeaderProps): JSX.Element {
  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <ProfileAvatarDisplay
          imageUrl={chatImage}
          fallbackName={chatTitle}
          className={styles.contactImage}
          enableEnlarge={true}
        />
        <div
          onClick={() => (isGroup && onGroupClick ? onGroupClick() : null)}
          className={styles.userDetails}
        >
          <p className={styles.title}>{chatTitle}</p>
          <p className={styles.subtitle}>{chatSubtitle}</p>
        </div>
      </div>
    </div>
  );
}
