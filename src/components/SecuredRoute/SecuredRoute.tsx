/**
 * SecuredRoute Component
 *  A React component that secures routes based on user authentication and role.
 *  Redirects unauthorized users to the home page or displays a "Page Not Found" screen for non-administrator roles.
 *  Also includes session timeout and inactivity handling.
 * @component
 * @returns {JSX.Element} - Renders the child route if the user is authenticated and has the "administrator" role.
 * Redirects to the home page if the user is not logged in.
 * Displays a "Page Not Found" screen for unauthorized roles.
 *
 * @remarks
 * - Uses `useLocalStorage` utility to manage local storage items.
 * - Implements session timeout and inactivity detection to enhance security.
 * - Displays a toast notification when the session expires.
 *
 * @dependencies
 * - `react-router-dom` for navigation (`Navigate`, `Outlet`).
 * - `react-toastify` for toast notifications.
 * - `useLocalStorage` custom hook for local storage operations.
 *
 * @example
 * ```tsx
 * <SecuredRoute />
 * ```
 *
 * @event document#mousemove
 * Updates the `lastActive` timestamp on mouse movement to track user activity.
 *
 * @function setInterval
 * Periodically checks for user inactivity and logs out the user if the session has expired.
 * Displays a warning toast and redirects to the home page upon session expiration.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';
const { getItem, setItem, removeItem } = useLocalStorage();

const SecuredRoute = (): JSX.Element => {
  const isLoggedIn = getItem('IsLoggedIn');
  const role = getItem('role');

  return isLoggedIn === 'TRUE' ? (
    <>{role === 'administrator' ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
  );
};

// Time constants for session timeout and inactivity interval
const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMin = 1;
const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;

let lastActive: number = Date.now();

const updateLastActive = () => {
  lastActive = Date.now();
};

document.addEventListener('mousemove', updateLastActive);
document.addEventListener('keydown', updateLastActive);
document.addEventListener('click', updateLastActive);
document.addEventListener('scroll', updateLastActive);

// Check for inactivity and handle session timeout
setInterval(() => {
  const currentTime = Date.now();
  const timeSinceLastActive = currentTime - lastActive;

  // If inactive for longer than the timeout period, show a warning and log out
  if (timeSinceLastActive > timeoutMilliseconds) {
    toast.warn('Kindly relogin as sessison has expired');

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

export default SecuredRoute;
