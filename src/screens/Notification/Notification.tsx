import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { Link } from 'react-router-dom';

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
        first: 10,
        skip: 0,
      },
    },
    skip: !userId,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const notifications = data?.user?.notifications || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="flex flex-col gap-4">
        {notifications.length > 0 ? (
          notifications.map((notification: InterfaceNotification) => (
            <Link
              to={notification.navigation || '#'}
              key={notification.id}
              className="no-underline"
            >
              <div
                className={`bg-white shadow-md rounded-lg p-4 border-l-4 ${
                  !notification.isRead ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <h2
                  className={`text-lg ${!notification.isRead ? 'font-bold' : ''}`}
                >
                  {notification.title}
                </h2>
                <p className="text-gray-700">{notification.body}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <p>No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
