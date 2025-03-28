/**
 * A secured route component for user access control in the application.
 *
 * This component ensures that only authenticated users with the appropriate
 * role can access certain routes. It uses a custom hook to interact with
 * local storage for retrieving authentication and role information.
 *
 * @component
 *
 * @returns {JSX.Element} - A JSX element that conditionally renders:
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
 *
 * @requires `react-router-dom` for navigation and route handling.
 * @requires `useLocalStorage` custom hook for local storage interaction.
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';

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
