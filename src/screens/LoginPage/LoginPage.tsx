import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LoginForm } from 'components/Auth/LoginForm/LoginForm';
import type { IAuthResponse } from 'types/Auth/LoginForm';
import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';

const LoginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const navigate = useNavigate();
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();
  const { startSession } = useSession();

  document.title = t('title');

  const isAdmin =
    location.pathname === '/admin' || location.pathname.startsWith('/admin');

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      navigate(getItem('userId') !== null ? '/user/organizations' : '/orglist');
    }
  }, []);

  const handleAuthSuccess = (authData: IAuthResponse): void => {
    const { user, authenticationToken } = authData;

    setItem('token', authenticationToken);
    setItem('IsLoggedIn', 'TRUE');
    setItem('name', user.name);
    setItem('email', user.emailAddress);

    startSession();
    navigate(isAdmin ? '/orglist' : '/user/organizations');
  };

  return (
    <div>
      <LoginForm isAdmin={isAdmin} onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default LoginPage;
