import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';

const SecuredRouteForUser = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const isLoggedIn = getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? <Outlet /> : <Navigate to="/" replace />;
};

export default SecuredRouteForUser;
