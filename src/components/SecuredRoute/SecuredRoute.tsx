import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastAutoCloseTimeout } from 'Constant/constant';

const SecuredRoute = (props: any): JSX.Element => {
  const isLoggedIn = localStorage.getItem('IsLoggedIn');
  return isLoggedIn === 'TRUE' ? (
    <>
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/" />
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
    toast.warn('Kindly relogin as sessison has expired', {
      autoClose: toastAutoCloseTimeout,
    });

    window.location.href = '/';
    localStorage.setItem('IsLoggedIn', 'FALSE');
  }
}, inactiveIntervalMilsec);

export default SecuredRoute;
