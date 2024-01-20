import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalStorage';

const SecuredRouteForUser = (props: any): JSX.Element => {
  const { getItem } = useLocalStorage();
  const isLoggedIn = getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/user" />
  );
};

export default SecuredRouteForUser;
