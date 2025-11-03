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

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const NotificationIcon = () => {
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
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <NotificationsIcon style={{ color: '#3b3b3b' }} />
          {unreadCount > 0 && (
            <span
              className={styles.unreadBadge}
              title={`${unreadCount} unread`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.glassMenu}>
        {loading && <Dropdown.Item>Loading...</Dropdown.Item>}
        {error && <Dropdown.Item>Error fetching notifications</Dropdown.Item>}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              className={styles.notificationItem}
              onClick={() => {
                if (notification.navigation) {
                  navigate(notification.navigation);
                  return;
                }
                const path = location.pathname || '';
                const isUserPortal =
                  path.startsWith('/user/') || path.startsWith('/user');
                navigate(isUserPortal ? '/user/notification' : '/notification');
              }}
              style={{
                cursor: notification.navigation ? 'pointer' : 'default',
              }}
            >
              {!notification.isRead && (
                <span className={styles.notificationDot} title="Unread" />
              )}
              <span className={styles.notificationText}>
                {notification.body.length > 48
                  ? notification.body.slice(0, 48) + '...'
                  : notification.body}
              </span>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item>No new notifications</Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() => {
            const path = location.pathname || '';
            const isUserPortal =
              path.startsWith('/user/') || path.startsWith('/user');
            navigate(isUserPortal ? '/user/notification' : '/notification');
          }}
        >
          View all notifications
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationIcon;
