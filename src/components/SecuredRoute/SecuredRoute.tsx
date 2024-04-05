import React from 'react';
<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageNotFound from 'screens/PageNotFound/PageNotFound';
import useLocalStorage from 'utils/useLocalstorage';
const { getItem, setItem } = useLocalStorage();

const SecuredRoute = (): JSX.Element => {
  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');
  return isLoggedIn === 'TRUE' ? (
    <>{adminFor != null ? <Outlet /> : <PageNotFound />}</>
  ) : (
    <Navigate to="/" replace />
=======
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';

const SecuredRoute = (props: any): JSX.Element => {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/" />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );
};

const timeoutMinutes = 15;
const timeoutMilliseconds = timeoutMinutes * 60 * 1000;

const inactiveIntervalMin = 1;
const inactiveIntervalMilsec = inactiveIntervalMin * 60 * 1000;
let lastActive: number = Date.now();

document.addEventListener('mousemove', () => {
  lastActive = Date.now();
});

setInterval(() => {
  const currentTime = Date.now();
  const timeSinceLastActive = currentTime - lastActive;

  if (timeSinceLastActive > timeoutMilliseconds) {
    toast.warn('Kindly relogin as sessison has expired');

    window.location.href = '/';
<<<<<<< HEAD
    setItem('IsLoggedIn', 'FALSE');
=======
    localStorage.setItem('IsLoggedIn', 'FALSE');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  }
}, inactiveIntervalMilsec);

export default SecuredRoute;
