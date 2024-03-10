import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';

const SecuredRouteForUser = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const isLoggedIn = getItem('IsLoggedIn');
  const userType = getItem('UserType');
  return isLoggedIn === 'TRUE' ? (
    <>{userType === 'USER' ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default SecuredRouteForUser;
