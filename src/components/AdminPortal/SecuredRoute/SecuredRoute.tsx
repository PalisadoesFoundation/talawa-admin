/**
 * SecuredRoute Component
 *  A React component that secures routes based on user authentication and role.
 *  Redirects unauthorized users to the home page or displays a "Page Not Found" screen for non-administrator roles.
 *  Also includes session timeout and inactivity handling.
 * @returns - Renders the child route if the user is authenticated and has the "administrator" role.
 * Redirects to the home page if the user is not logged in.
 * Displays a "Page Not Found" screen for unauthorized roles.
 *
 * @remarks
 * - Uses `useLocalStorage` utility to manage local storage items.
 * - Implements session timeout and inactivity detection to enhance security.
 * - Displays a toast notification when the session expires.
 *
 * dependencies
 * - `react-router-dom` for navigation (`Navigate`, `Outlet`).
 * - `NotificationToast` for toast notifications.
 * - `useLocalStorage` custom hook for local storage operations.
 *
 * @example
 * ```tsx
 * <SecuredRoute />
 * ```
 */

import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import PageNotFound from 'screens/Public/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';

// Time constants for session timeout and inactivity interval
const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMin = 1;
const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;

const SecuredRoute = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'securedRoute' });
  const { getItem, setItem, removeItem } = useLocalStorage();
  const lastActiveRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isLoggedIn = getItem('IsLoggedIn');
  const role = getItem('role');

  const updateLastActive = () => {
    lastActiveRef.current = Date.now();
  };

  useEffect(() => {
    // Only set up session timeout if user is logged in
    if (isLoggedIn === 'TRUE') {
      // Add event listeners for user activity
      document.addEventListener('mousemove', updateLastActive);
      document.addEventListener('keydown', updateLastActive);
      document.addEventListener('click', updateLastActive);
      document.addEventListener('scroll', updateLastActive);

      // Set up interval to check for inactivity
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastActive = currentTime - lastActiveRef.current;

        // If inactive for longer than the timeout period, show a warning and log out
        if (timeSinceLastActive > timeoutMilliseconds) {
          NotificationToast.warning(t('sessionExpired'));

          setItem('IsLoggedIn', 'FALSE');
          removeItem('email');
          removeItem('id');
          removeItem('name');
          removeItem('role');
          removeItem('token');
          removeItem('userId');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      }, inactiveIntervalMilsec);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', updateLastActive);
      document.removeEventListener('keydown', updateLastActive);
      document.removeEventListener('click', updateLastActive);
      document.removeEventListener('scroll', updateLastActive);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoggedIn, setItem, removeItem]);

  return isLoggedIn === 'TRUE' ? (
    <>{role === 'administrator' ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default SecuredRoute;
