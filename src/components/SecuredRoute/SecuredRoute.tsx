import { useQuery } from '@apollo/client';
import { UserRole, type VerifyRoleResponse } from 'components/CheckIn/types';
import { VERIFY_ROLE } from 'GraphQl/Queries/Queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';
const { getItem, setItem } = useLocalStorage();

/**
 * A route guard that checks if the user is logged in and has the necessary permissions.
 *
 * If the user is logged in and has an admin role set, it renders the child routes.
 * Otherwise, it redirects to the home page or shows a 404 page if admin role is not set.
 *
 * @returns The JSX element representing the secured route.
 */
const SecuredRoute = (): JSX.Element => {
  const location = useLocation();
  const { data, loading, error, refetch } = useQuery<VerifyRoleResponse>(
    VERIFY_ROLE,
    {
      skip: !getItem('token'),
      context: {
        headers: {
          Authorization: `Bearer ${getItem('token')}`,
        },
      },
    },
  );
  const [token, setToken] = React.useState(getItem('token'));

  useEffect(() => {
    const newToken = getItem('token');
    if (newToken !== token) {
      setToken(newToken);
    }
  }, []);

  useEffect(() => {
    refetch(); // Refetch when token updates
  }, [token]);

  if (loading) {
    return <div> Loading.....</div>;
  } else if (error) {
    return <div>Error During Routing ...</div>;
  } else {
    const { isAuthorized = false, role = '' } = (data as VerifyRoleResponse)
      .verifyRole;
    const restrictedRoutesForAdmin = ['/member', '/users', '/communityProfile'];
    if (isAuthorized) {
      if (role == UserRole.SUPER_ADMIN) {
        return <Outlet />;
      } else if (role == UserRole.ADMIN) {
        if (restrictedRoutesForAdmin.includes(location.pathname)) {
          return <PageNotFound />;
        }
        return <Outlet />;
      } else {
        return <PageNotFound />;
      }
    } else {
      return <Navigate to="/" replace />;
    }
  }
};

// Time constants for session timeout and inactivity interval
const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMin = 1;
const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;

let lastActive: number = Date.now();

// Update lastActive timestamp on mouse movement
document.addEventListener('mousemove', () => {
  lastActive = Date.now();
});

// Check for inactivity and handle session timeout
setInterval(() => {
  const currentTime = Date.now();
  const timeSinceLastActive = currentTime - lastActive;

  // If inactive for longer than the timeout period, show a warning and log out
  if (timeSinceLastActive > timeoutMilliseconds) {
    toast.warn('Kindly relogin as sessison has expired');

    window.location.href = '/';
    setItem('IsLoggedIn', 'FALSE');
  }
}, inactiveIntervalMilsec);

export default SecuredRoute;
