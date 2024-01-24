import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SecuredRouteForUser = (): any => {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? <Outlet /> : <Navigate to="/user" replace />;
};

export default SecuredRouteForUser;
