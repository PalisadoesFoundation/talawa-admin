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
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import styles from './Notification.module.css';
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

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
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

  // Assign icon colors in a rotating pattern matching the prototype
  const iconColors = ['green', 'blue', 'orange', 'purple', 'red'];
  // Assign icon symbols in a rotating pattern matching the prototype
  const iconSymbols = [
    '\u2721',
    '\u2605',
    '\u2709',
    '\u2665',
    '\u{1F4B0}',
    '\u270D',
    '\u26D4',
    '\u2605',
  ];

  // Filter for the active tab
  const displayNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('notifications')}</h1>
          <p className="page-subtitle">{t('allCaughtUp')}</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'unread'}
          onClick={() => setActiveTab('unread')}
        >
          Unread
        </button>
      </div>

      <div className="card">
        {isLoading ? (
          Array.from({ length: pageSize }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className={styles.notificationItem}>
              <div className={styles.profileSection} />
              <div className={styles.notificationContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonBody} />
              </div>
              <div className={styles.buttonSpacer} />
            </div>
          ))
        ) : displayNotifications.length === 0 ? (
          <EmptyState
            icon={<NotificationsNone />}
            message={t('allCaughtUp')}
            dataTestId="notifications-empty-state"
          />
        ) : (
          <ul className="notif-list">
            {displayNotifications.map((notification, idx) => (
              <li
                key={notification.id}
                className={`notif-item${!notification.isRead ? ' unread' : ''}`}
              >
                <div
                  className={`notif-icon ${iconColors[idx % iconColors.length]}`}
                >
                  {iconSymbols[idx % iconSymbols.length]}
                </div>
                <Link
                  to={notification.navigation || '#'}
                  className="notif-content"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="notif-title">{notification.title}</div>
                  <div className="notif-desc">{notification.body}</div>
                </Link>
                {!notification.isRead ? (
                  <Button
                    variant="primary"
                    size="sm"
                    aria-label={t('markAsReadAriaLabel', {
                      title: notification.title,
                    })}
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleMarkAsRead([notification.id])}
                  >
                    {t('markAsRead')}
                  </Button>
                ) : (
                  <span className="notif-time" />
                )}
                <div
                  className={!notification.isRead ? 'unread-dot' : 'read-dot'}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {(page > 0 || notifications.length > 1) && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrev}
            disabled={page === 0}
            data-testid="prev-button"
          >
            &laquo;
          </button>
          <span className="pagination-info">
            {t('prev')} / {t('next')}
          </span>
          <button
            className="pagination-btn"
            onClick={handleNext}
            disabled={notifications.length < pageSize}
            data-testid="next-button"
          >
            &raquo;
          </button>
        </div>
      )}
    </>
  );
};

export default Notification;
