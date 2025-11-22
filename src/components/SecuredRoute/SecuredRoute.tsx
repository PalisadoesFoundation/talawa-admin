/**
 * SecuredRoute Component
 *  A React component that secures routes based on user authentication and role.
 *  Redirects unauthorized users to the home page or displays a "Page Not Found" screen for non-administrator roles.
 *  Also includes session timeout and inactivity handling.
 */

import Loader from 'components/Loader/Loader';
import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';

// LAZY import to prevent Vite static/dynamic import conflict
const PageNotFound = lazy(() => import('screens/PageNotFound/PageNotFound'));

// Time constants for session timeout and inactivity interval
const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMin = 1;
const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;

const SecuredRoute = (): JSX.Element => {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const lastActiveRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isLoggedIn = getItem('IsLoggedIn');
  const role = getItem('role');

  const updateLastActive = () => {
    lastActiveRef.current = Date.now();
  };

  useEffect(() => {
    if (isLoggedIn === 'TRUE') {
      document.addEventListener('mousemove', updateLastActive);
      document.addEventListener('keydown', updateLastActive);
      document.addEventListener('click', updateLastActive);
      document.addEventListener('scroll', updateLastActive);

      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastActive = currentTime - lastActiveRef.current;

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
    }

    return () => {
      document.removeEventListener('mousemove', updateLastActive);
      document.removeEventListener('keydown', updateLastActive);
      document.removeEventListener('click', updateLastActive);
      document.removeEventListener('scroll', updateLastActive);

      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoggedIn, setItem, removeItem]);

  return isLoggedIn === 'TRUE' ? (
    <>
      {role === 'administrator' ? (
        <Outlet />
      ) : (
        <Suspense fallback={<Loader />}>
          <PageNotFound />
        </Suspense>
      )}
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default SecuredRoute;
