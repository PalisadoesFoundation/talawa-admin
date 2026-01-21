import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import styles from './ChatRoom.module.css';

interface IChatHeaderProps {
  chatImage: string;
  chatTitle: string;
  chatSubtitle: string;
  isGroup?: boolean;
  onGroupClick?: () => void;
}

export default function ChatHeader({
  chatImage,
  chatTitle,
  chatSubtitle,
  isGroup = false,
  onGroupClick,
}: IChatHeaderProps): JSX.Element {
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
