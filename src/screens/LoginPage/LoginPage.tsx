import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import LoginForm from 'shared-components/LoginForm/LoginForm';
import AuthBranding from 'shared-components/AuthBranding/AuthBranding';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';

import { SIGNIN_QUERY, GET_COMMUNITY_DATA_PG } from 'GraphQl/Queries/Queries';
import { RECAPTCHA_MUTATION } from 'GraphQl/Mutations/mutations';

import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';
import { errorHandler } from 'utils/errorHandler';
import i18n from 'utils/i18n';

import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app-fixed.module.css';
import { REACT_APP_USE_RECAPTCHA } from 'Constant/constant';

/**
 * LoginPage Component
 * Handles authentication for admin and user roles
 */
const LoginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tErrors } = useTranslation('errors');

  const navigate = useNavigate();
  const location = useLocation();

  const { getItem, setItem, removeItem } = useLocalStorage();
  const { startSession, extendSession } = useSession();

  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [pendingInvitationToken] = useState<string | null>(() =>
    getItem('pendingInvitationToken'),
  );

  /** -------------------- GraphQL -------------------- */
  const { data: communityData } = useQuery(GET_COMMUNITY_DATA_PG);

  const [signin, { loading: loginLoading }] = useLazyQuery(SIGNIN_QUERY, {
    fetchPolicy: 'no-cache',
  });

  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

  /** -------------------- Effects -------------------- */
  useEffect(() => {
    document.title = t('title');
  }, [t]);

  useEffect(() => {
    const isAdminRoute = location.pathname === '/admin';
    setRole(isAdminRoute ? 'admin' : 'user');
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');

    if (isLoggedIn === 'TRUE') {
      const redirectPath =
        getItem('userId') !== null ? '/user/organizations' : '/orglist';

      navigate(redirectPath, { replace: true });
      extendSession();
    }
  }, [extendSession, getItem, navigate]);

  /** -------------------- Helpers -------------------- */
  const verifyRecaptcha = useCallback(
    async (recaptchaToken: string | null): Promise<boolean> => {
      if (REACT_APP_USE_RECAPTCHA !== 'yes') return true;

      if (!recaptchaToken) {
        toast.error(t('captchaError') as string);
        return false;
      }

      try {
        const { data } = await recaptcha({
          variables: { recaptchaToken },
        });

        return Boolean(data?.recaptcha);
      } catch {
        toast.error(t('captchaError') as string);
        return false;
      }
    },
    [recaptcha, t],
  );

  /** -------------------- Handlers -------------------- */
  const handleLogin = async (
    email: string,
    password: string,
    recaptchaToken: string | null,
  ): Promise<void> => {
    const isVerified = await verifyRecaptcha(recaptchaToken);

    if (!isVerified) {
      toast.error(t('Please_check_the_captcha') as string);
      return;
    }

    try {
      const { data } = await signin({
        variables: { email, password },
      });

      if (!data?.signIn) {
        toast.warn(tErrors('notFound') as string);
        return;
      }

      const { user, authenticationToken } = data.signIn;
      const isAdminUser = user.role === 'administrator';

      if (role === 'admin' && !isAdminUser) {
        toast.warn(tErrors('notAuthorised') as string);
        return;
      }

      if (user.countryCode) {
        i18n.changeLanguage(user.countryCode);
      }

      setItem('token', authenticationToken);
      setItem('IsLoggedIn', 'TRUE');
      setItem('name', user.name);
      setItem('email', user.emailAddress);
      setItem('role', user.role);
      setItem('UserImage', user.avatarURL || '');

      if (role === 'admin') {
        setItem('id', user.id);
      } else {
        setItem('userId', user.id);
      }

      startSession();

      if (pendingInvitationToken) {
        removeItem('pendingInvitationToken');
        window.location.href = `/event/invitation/${pendingInvitationToken}`;
        return;
      }

      const redirectPath =
        role === 'admin' ? '/orglist' : '/user/organizations';

      navigate(redirectPath, { replace: true });
    } catch (error) {
      errorHandler(t, error);
    }
  };

  /** -------------------- Render -------------------- */
  return (
    <section className={`${styles.login_background} auth-theme`}>
      <Row className={styles.row}>
        <Col sm={0} md={6} lg={7} className={styles.left_portion}>
          <AuthBranding communityData={communityData?.community} />
        </Col>

        <Col sm={12} md={6} lg={5}>
          <div className={styles.right_portion}>
            <ChangeLanguageDropDown
              parentContainerStyle={styles.langChangeBtn}
              btnStyle={styles.langChangeBtnStyle}
            />

            <TalawaLogo className={styles.talawa_logo} />

            <LoginForm
              role={role}
              isLoading={loginLoading}
              onSubmit={handleLogin}
              showRegisterLink={location.pathname !== '/admin'}
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default LoginPage;
