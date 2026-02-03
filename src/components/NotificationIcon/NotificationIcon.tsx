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
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './NotificationIcon.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';

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

  const dropdownOptions = loading
    ? [{ value: 'status-loading', label: t('loading'), disabled: true }]
    : error
      ? [{ value: 'status-error', label: t('errorFetching'), disabled: true }]
      : notifications.length === 0
        ? [
            {
              value: 'status-empty',
              label: t('noNewNotifications'),
              disabled: true,
            },
            { value: 'view-all', label: t('viewAllNotifications') },
          ]
        : [
            ...notifications.map((notification) => ({
              value: notification.id,
              label:
                notification.body.length > 48
                  ? `${notification.body.slice(0, 48)}...`
                  : notification.body,
            })),
            { value: 'view-all', label: t('viewAllNotifications') },
          ];

  const handleSelectNotification = (value: string) => {
    if (value === 'view-all') {
      navigate(notificationPath);
      return;
    }

    const notification = notifications.find((n) => n.id === value);
    if (!notification) return;

    if (notification.navigation) {
      navigate(notification.navigation);
      return;
    }

    navigate(notificationPath);
  };

  const bellIconWithBadge = (
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
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <DropDownButton
        id="notification-dropdown"
        options={dropdownOptions}
        selectedValue={undefined}
        onSelect={handleSelectNotification}
        ariaLabel={t('openNotificationsMenu')}
        dataTestIdPrefix="notification-dropdown"
        variant="light"
        buttonLabel=""
        parentContainerStyle={undefined}
        btnStyle={styles.iconButton}
        icon={bellIconWithBadge}
      />
    </ErrorBoundaryWrapper>
  );
};

export default NotificationIcon;
