import { useQuery } from '@apollo/client';
import { VERIFY_ROLE } from 'GraphQl/Queries/Queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * A component that guards routes by checking if the user is logged in.
 * If the user is logged in and does not have 'AdminFor' set, the child routes are rendered.
 * If the user is not logged in, they are redirected to the homepage.
 * If the user is logged in but has 'AdminFor' set, a 404 page is shown.
 *
 * @returns JSX.Element - Rendered component based on user authentication and role.
 */
const SecuredRouteForUser = (): JSX.Element => {
  // Custom hook to interact with local storage
  const { getItem } = useLocalStorage();
  const { data, loading, error, refetch } = useQuery(VERIFY_ROLE, {
    context: {
      headers: {
        Authorization: `Bearer ${getItem('token')}`,
      },
    },
  });
  useEffect(() => {
    refetch(); // Refetch when token updates
  }, [getItem('token')]);

  if (loading) {
    return <div> Loading.....</div>;
  } else if (error) {
    return <div>Error During Routing ...</div>;
  } else {
    const isLoggedIn = data.verifyRole.isAuthorized;
    const role = data.verifyRole.role;
    if (isLoggedIn) {
      if (role == 'user' || role == 'admin' || role == 'superAdmin') {
        return <Outlet />;
      } else {
        return <PageNotFound />;
      }
    } else {
      return <Navigate to="/" replace />;
    }
  }
};

export default SecuredRouteForUser;
