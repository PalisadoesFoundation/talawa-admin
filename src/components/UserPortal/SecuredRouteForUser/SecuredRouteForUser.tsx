import { useQuery } from '@apollo/client';
import type { VerifyRoleResponse } from 'components/CheckIn/types';
import { UserRole } from 'components/CheckIn/types';
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

    if (isAuthorized) {
      if (
        role == UserRole.USER ||
        role == UserRole.ADMIN ||
        UserRole.SUPER_ADMIN
      ) {
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
