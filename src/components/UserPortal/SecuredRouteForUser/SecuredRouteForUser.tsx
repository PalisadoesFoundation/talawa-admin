/**
 * A secured route component for user access control in the application.
 */

import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';
import Loader from 'components/Loader/Loader';

// LAZY import to avoid mixing static + dynamic imports
const PageNotFound = lazy(() => import('screens/PageNotFound/PageNotFound'));

// Time constants
const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMinutes = 1;
const inactiveIntervalMilliseconds = inactiveIntervalMinutes * 60 * 1000;

const SecuredRouteForUser = (): JSX.Element => {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const lastActiveRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');

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
          toast.warn('Kindly relogin as session has expired');

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
      {adminFor === null ? (
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

export default SecuredRouteForUser;
