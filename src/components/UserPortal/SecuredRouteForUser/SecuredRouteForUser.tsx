import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const SecuredRouteForUser = (props: any): JSX.Element => {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/user" />
  );
};

export default SecuredRouteForUser;
