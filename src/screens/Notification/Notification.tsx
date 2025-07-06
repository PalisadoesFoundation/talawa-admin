import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
} from 'GraphQl/Queries/NotificationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { Link } from 'react-router-dom';
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

  const { loading, error, data, refetch } = useQuery(GET_USER_NOTIFICATIONS, {
    variables: {
      userId: userId,
      input: {
        first: 100,
        skip: 0,
      },
    },
    skip: !userId,
  });
  console.log('Notification data:', data);

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      await markAsRead({
        variables: {
          input: { notificationIds },
        },
      });
      refetch();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const notifications = data?.user?.notifications || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}></h1>
      <ListGroup variant="flush">
        {notifications.length > 0 ? (
          notifications.map((notification: InterfaceNotification) => (
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
                  onClick={() => handleMarkAsRead([notification.id])}
                >
                  Mark as Read
                </Button>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className={styles.noNotifications}>
            No notifications found.
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default Notification;
