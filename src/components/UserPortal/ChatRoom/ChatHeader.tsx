/**
 * ChatHeader Component
 *
 * Displays the chat header with contact/group information and action buttons.
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import Avatar from 'components/Avatar/Avatar';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import styles from './ChatRoom.module.css';

interface IChatHeaderProps {
  chatImage: string;
  chatTitle: string;
  chatSubtitle: string;
  isGroup: boolean;
  onOpenGroupDetails?: () => void;
}

export const ChatHeader: React.FC<IChatHeaderProps> = ({
  chatImage,
  chatTitle,
  chatSubtitle,
  isGroup,
  onOpenGroupDetails,
}) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.userDetails}>
        {chatImage ? (
          <img
            src={chatImage}
            alt={chatImage}
            className={styles.contactImage}
          />
        ) : (
          <Avatar
            name={chatTitle}
            alt={chatTitle}
            avatarStyle={styles.contactImage}
          />
        )}
        <div className={styles.userDetails}>
          <p className={styles.title}>{chatTitle}</p>
          <p className={styles.subtitle}>{chatSubtitle}</p>
        </div>
      </div>
      {isGroup && (
        <Button
          data-testid="groupInfoBtn"
          className={styles.infoIcon}
          onClick={onOpenGroupDetails}
        >
          <PermContactCalendarIcon />
        </Button>
      )}
    </div>
  );
};
