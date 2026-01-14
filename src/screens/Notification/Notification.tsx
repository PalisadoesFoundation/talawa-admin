/**
 * Notification screen
 *
 * Presents a paginated list of the user's notifications with lightweight
 * actions (mark as read). The UI shows skeletons while loading and keeps
 * the layout stable by rendering empty placeholders when there are fewer
 * items than the page size.
 */
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
} from 'GraphQl/Queries/NotificationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { Link } from 'react-router';
import { ListGroup, Button } from 'react-bootstrap';
import styles from './Notification.module.css';
import { FaUserCircle } from 'react-icons/fa';

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const Notification: React.FC = () => {
  const { getItem } = useLocalStorage();
  const userId = getItem('id');

  const [page, setPage] = useState<number>(0);
  const pageSize = 6;

  const skip = page * pageSize;

  const { loading, data, refetch } = useQuery(GET_USER_NOTIFICATIONS, {
    variables: {
      userId: userId,
      input: {
        first: pageSize,
        skip: skip,
      },
    },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      await markAsRead({
        variables: {
          input: { notificationIds },
        },
      });
      await refetch({ userId, input: { first: pageSize, skip } });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const notifications: InterfaceNotification[] =
    data?.user?.notifications || [];

  const handleNext = async () => {
    if (notifications.length < pageSize) return;
    setPage((p) => p + 1);
  };

  const handlePrev = async () => {
    setPage((p) => Math.max(0, p - 1));
  };

  const isLoading = loading;

  return (
    <div className={styles.container}>
      <div className={styles.listWrapper}>
        <ListGroup variant="flush">
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <ListGroup.Item
                key={`skeleton-${idx}`}
                className={styles.notificationItem}
              >
                <div className={styles.profileSection} />
                <div className={styles.notificationContent}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonBody} />
                </div>
                <div style={{ width: 92 }} />
              </ListGroup.Item>
            ))
          ) : notifications.length === 0 ? (
            <div className={styles.noNotifications}>You're all caught up!</div>
          ) : (
            Array.from({ length: pageSize }).map((_, idx) => {
              const notification = notifications[idx];
              if (notification) {
                return (
                  <ListGroup.Item
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                  >
                    <div className={styles.profileSection}>
                      <FaUserCircle size={28} color="#8a99b3" />
                    </div>
                    <Link
                      to={notification.navigation || '#'}
                      className={styles.notificationLink}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <div className={styles.notificationContent}>
                        <div className={styles.notificationTitle}>
                          {notification.title}
                        </div>
                        <div className={styles.notificationBody}>
                          {notification.body}
                        </div>
                      </div>
                    </Link>
                    {!notification.isRead && (
                      <Button
                        variant="primary"
                        size="sm"
                        className={styles.markButton}
                        onClick={() => handleMarkAsRead([notification.id])}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </ListGroup.Item>
                );
              }

              return (
                <ListGroup.Item
                  key={`empty-${idx}`}
                  className={styles.notificationItem}
                >
                  <div className={styles.profileSection} />
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>&nbsp;</div>
                    <div className={styles.notificationBody}>&nbsp;</div>
                  </div>
                  <div style={{ width: 92 }} />
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>

        <div className={styles.paginationFooter}>
          <button
            className={styles.paginationButton}
            onClick={handlePrev}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            className={styles.paginationButton}
            onClick={handleNext}
            disabled={notifications.length < pageSize}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
