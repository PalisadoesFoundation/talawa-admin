import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { Link } from 'react-router-dom';
import { ListGroup, Button } from 'react-bootstrap';
import styles from './Notification.module.css';

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

  const { loading, error, data } = useQuery(GET_USER_NOTIFICATIONS, {
    variables: {
      userId: userId,
      input: {
        first: 100, // Fetching more notifications
        skip: 0,
      },
    },
    skip: !userId,
  });

  // const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  // const handleMarkAsRead = async (notificationId: string) => {
  //   try {
  //     await markAsRead({ variables: { notificationId } });
  //     refetch();
  //   } catch (error) {
  //     console.error('Error marking notification as read:', error);
  //   }
  // };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const notifications = data?.user?.notifications || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notifications</h1>
      <ListGroup variant="flush">
        {notifications.length > 0 ? (
          notifications.map((notification: InterfaceNotification) => (
            <ListGroup.Item
              key={notification.id}
              className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
            >
              <Link
                to={notification.navigation || '#'}
                className={styles.notificationLink}
              >
                <div>
                  <div className={styles.notificationTitle}>
                    {notification.title}
                  </div>
                  <div className={styles.notificationBody}>
                    {notification.body}
                  </div>
                </div>
              </Link>
              {!notification.isRead && (
                <Button variant="primary" size="sm">
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
