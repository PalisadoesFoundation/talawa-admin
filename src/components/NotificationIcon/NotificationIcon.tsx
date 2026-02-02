/**
 * NotificationIcon component.
 *
 * @remarks
 * A small, friendly notification bell used in the app header. It shows the
 * unread count and a compact dropdown of the most recent notifications so
 * users can quickly preview or navigate to them.
 *
 * @returns JSX.Element
 */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import { Dropdown } from 'react-bootstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './NotificationIcon.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const getNotificationPath = (pathname: string): string => {
  const path = pathname || '';
  const isUserPortal = path.startsWith('/user');
  return isUserPortal ? '/user/notification' : '/admin/notification';
};

const NotificationIcon = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'notification' });
  const { t: tErrors } = useTranslation('errors');
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
  const notificationPath = getNotificationPath(location.pathname);

  const unreadCount: number = (
    (data?.user?.notifications as InterfaceNotification[]) || []
  ).filter((n: InterfaceNotification) => !n.isRead).length;

  useEffect(() => {
    setNotifications(data?.user?.notifications?.slice(0, 5) || []);
  }, [data]);

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Dropdown>
        <Dropdown.Toggle
          variant="white"
          id="dropdown-basic"
          aria-label={t('openNotificationsMenu')}
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
                  className={`${styles.notificationItem} ${
                    notification.navigation ? styles.clickable : ''
                  }`}
                  onClick={() => {
                    if (notification.navigation) {
                      navigate(notification.navigation);
                      return;
                    }
                    navigate(notificationPath);
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
          <Dropdown.Item onClick={() => navigate(notificationPath)}>
            {t('viewAllNotifications')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ErrorBoundaryWrapper>
  );
};

export default NotificationIcon;
