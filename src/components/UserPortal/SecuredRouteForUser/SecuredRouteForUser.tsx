import React from 'react';
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

  // Check if the user is logged in and the role of the user
  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');

  // Conditional rendering based on authentication status and role
  return isLoggedIn === 'TRUE' ? (
    <>{adminFor == undefined ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default SecuredRouteForUser;
