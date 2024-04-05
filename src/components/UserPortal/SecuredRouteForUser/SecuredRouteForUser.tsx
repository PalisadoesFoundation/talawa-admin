import React from 'react';
<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';

const SecuredRouteForUser = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');
  return isLoggedIn === 'TRUE' ? (
    <>{adminFor == undefined ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
=======
import { Redirect, Route } from 'react-router-dom';

const SecuredRouteForUser = (props: any): JSX.Element => {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/user" />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );
};

export default SecuredRouteForUser;
