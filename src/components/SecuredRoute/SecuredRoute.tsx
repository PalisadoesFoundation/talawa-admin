import React from 'react';
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
  );
};

let lastActive: number = Date.now();

document.addEventListener('mousemove', () => {
  lastActive = Date.now();
});

setInterval(() => {
  const currentTime = Date.now();
  const timeSinceLastActive = currentTime - lastActive;
  const logoutUserTime = 20 * 60 * 1000;

  if (timeSinceLastActive > logoutUserTime) {
    toast.warn('User not found! kindly relogin as sessison has expired');

    window.location.href = '/';
    localStorage.setItem('IsLoggedIn', 'FALSE');
  }
}, 60000);

export default SecuredRoute;
