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
import { Link } from 'react-router-dom';
import { Button } from 'shared-components/Button';
import { ListGroup } from 'react-bootstrap';
import { NotificationsNone } from '@mui/icons-material';
import styles from './Notification.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import EmptyState from 'shared-components/EmptyState/EmptyState';

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const Notification: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'notification' });
  const { t: tErrors } = useTranslation('errors');
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
    } catch {
      NotificationToast.error(tErrors('markAsReadError'));
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
                <div className={styles.buttonSpacer} />
              </ListGroup.Item>
            ))
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={<NotificationsNone />}
              message={t('allCaughtUp')}
              dataTestId="notifications-empty-state"
            />
          ) : (
            Array.from({ length: pageSize }).map((_, idx) => {
              const notification = notifications[idx];
              if (notification) {
                return (
                  <ListGroup.Item
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                  >
                    <div
                      className={`${styles.profileSection} ${styles.userIconWrapper}`}
                    >
                      <FaUserCircle size={28} />
                    </div>
                    <Link
                      to={notification.navigation || '#'}
                      className={`${styles.notificationLink} ${styles.notificationLinkContent}`}
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
                        aria-label={t('markAsReadAriaLabel', {
                          title: notification.title,
                        })}
                        className={styles.markButton}
                        onClick={() => handleMarkAsRead([notification.id])}
                      >
                        {t('markAsRead')}
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
                    <div className={styles.notificationTitle}>{'\u00A0'}</div>
                    <div className={styles.notificationBody}>{'\u00A0'}</div>
                  </div>
                  <div className={styles.buttonSpacer} />
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>
        {(page > 0 || notifications.length > 1) && (
          <div className={styles.paginationFooter}>
            <button
              className={styles.paginationButton}
              onClick={handlePrev}
              disabled={page === 0}
            >
              {t('prev')}
            </button>
            <button
              className={styles.paginationButton}
              onClick={handleNext}
              disabled={notifications.length < pageSize}
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
