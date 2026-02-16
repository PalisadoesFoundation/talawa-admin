/**
 * A secured route component for user access control in the application.
 *
 * This component ensures that only authenticated users with the appropriate
 * role can access certain routes. It uses a custom hook to interact with
 * local storage for retrieving authentication and role information.
 *
 * @returns A JSX element that conditionally renders:
 * - The child route components if the user is logged in and does not have an admin role.
 * - A `PageNotFound` component if the user has an admin role.
 * - A redirection to the home page (`"/"`) if the user is not logged in.
 *
 * @example
 * ```tsx
 * <Route path="/user" element={<SecuredRouteForUser />}>
 *   <Route path="dashboard" element={<UserDashboard />} />
 * </Route>
 * ```
 *
 * @remarks
 * - The `isLoggedIn` value is retrieved from local storage using the key `'IsLoggedIn'`.
 * - The `adminFor` value is retrieved from local storage using the key `'AdminFor'`.
 * - If `isLoggedIn` is `'TRUE'` and `adminFor` is `undefined`, the child routes are rendered.
 * - If `isLoggedIn` is not `'TRUE'`, the user is redirected to the home page.
 * - Requires `react-router` for navigation and route handling.
 * - Requires `useLocalStorage` custom hook for local storage interaction.
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import PageNotFound from 'screens/Public/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';

// Time constants for session timeout and inactivity interval
const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMinutes = 1;
const inactiveIntervalMilliseconds = inactiveIntervalMinutes * 60 * 1000;

const SecuredRouteForUser = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'securedRouteForUser',
  });
  // Custom hook to interact with local storage
  const { getItem, setItem, removeItem } = useLocalStorage();
  const lastActiveRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if the user is logged in and the role of the user
  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');

  const updateLastActive = useCallback(() => {
    lastActiveRef.current = Date.now();
  }, []);

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
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setItem('IsLoggedIn', 'FALSE');
          removeItem('email');
          removeItem('id');
          removeItem('name');
          removeItem('role');
          removeItem('token');
          removeItem('userId');
          removeItem('AdminFor');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      }, inactiveIntervalMilliseconds);
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
  }, [isLoggedIn, setItem, removeItem, t, updateLastActive]);

  // Conditional rendering based on authentication status and role
  return isLoggedIn === 'TRUE' ? (
    <>{adminFor == undefined ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default SecuredRouteForUser;
