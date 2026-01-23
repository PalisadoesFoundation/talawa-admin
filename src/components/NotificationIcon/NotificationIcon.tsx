/**
 * NotificationIcon component
 *
 * A small, friendly notification bell used in the app header. It shows the
 * unread count and a compact dropdown of the most recent notifications so
 * users can quickly preview or navigate to them.
 */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import { Dropdown } from 'react-bootstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation } from 'react-router';
import styles from './NotificationIcon.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { useTranslation } from 'react-i18next';

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const NotificationIcon = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'notification' });
  const [notifications, setNotifications] = useState<InterfaceNotification[]>(
    [],
  );
  const { getItem } = useLocalStorage();
  const userId = getItem('id');
  const { loading, error, data } = useQuery(GET_USER_NOTIFICATIONS, {
    variables: {
      userId: userId,
      input: {
        first: 5,
        skip: 0,
      },
    },
    skip: !userId,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount: number = (
    (data?.user?.notifications as InterfaceNotification[]) || []
  ).filter((n: InterfaceNotification) => !n.isRead).length;
  useEffect(() => {
    setNotifications(data?.user?.notifications?.slice(0, 5) || []);
  }, [data]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="white"
        id="dropdown-basic"
        className={styles.iconButton}
      >
        <div className={styles.iconContainer}>
          <NotificationsIcon className={styles.bellIcon} />
          {unreadCount > 0 && (
            <span
              className={styles.unreadBadge}
              title={t('unreadCount', { count: unreadCount })}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.glassMenu}>
        {loading && <Dropdown.Item>{t('loading')}</Dropdown.Item>}
        {error && <Dropdown.Item>{t('errorFetching')}</Dropdown.Item>}
        {!loading &&
          !error &&
          (notifications.length > 0 ? (
            notifications.map((notification) => (
              <Dropdown.Item
                key={notification.id}
                className={`${styles.notificationItem} ${styles.clickable}`}
                onClick={() => {
                  if (notification.navigation) {
                    navigate(notification.navigation);
                    return;
                  }
                  const path = location.pathname || '';
                  const isUserPortal =
                    path.startsWith('/user/') || path.startsWith('/user');
                  navigate(
                    isUserPortal ? '/user/notification' : '/notification',
                  );
                }}
              >
                {!notification.isRead && (
                  <span
                    className={styles.notificationDot}
                    title={t('unread')}
                  />
                )}
                <span className={styles.notificationText}>
                  {notification.body.length > 48
                    ? notification.body.slice(0, 48) + '...'
                    : notification.body}
                </span>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>{t('noNewNotifications')}</Dropdown.Item>
          ))}
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() => {
            const path = location.pathname || '';
            const isUserPortal =
              path.startsWith('/user/') || path.startsWith('/user');
            navigate(isUserPortal ? '/user/notification' : '/notification');
          }}
        >
          {t('viewAllNotifications')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationIcon;
