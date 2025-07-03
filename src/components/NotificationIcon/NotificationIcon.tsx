import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import { Dropdown } from 'react-bootstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationIcon.module.css';
interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const { data, loading, error } = useQuery(GET_USER_NOTIFICATIONS);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setNotifications(data.notifications.slice(0, 5));
    }
  }, [data]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="white"
        id="dropdown-basic"
        className={styles.colorWhite}
      >
        <NotificationsIcon />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {loading && <Dropdown.Item>Loading...</Dropdown.Item>}
        {error && <Dropdown.Item>Error fetching notifications</Dropdown.Item>}
        {notifications.length > 0 ? (
          notifications.map((notification: InterfaceNotification) => (
            <Dropdown.Item key={notification.id}>
              {notification.body}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item>No new notifications</Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => navigate('/notification')}>
          View all notifications
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationIcon;
