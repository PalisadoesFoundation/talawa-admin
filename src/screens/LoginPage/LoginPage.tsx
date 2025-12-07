import React, { useEffect, useState } from 'react';
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
 *
 * Handles user authentication for both admin and user roles
 *
 * @returns {JSX.Element} The rendered login page
 */
const LoginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tErrors } = useTranslation('errors');
  const navigate = useNavigate();
  const location = useLocation();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { startSession, extendSession } = useSession();

  useEffect(() => {
    document.title = t('title');
  }, [t]);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [pendingInvitationToken] = useState(() =>
    getItem('pendingInvitationToken'),
  );

  const { data: communityData } = useQuery(GET_COMMUNITY_DATA_PG);
  const [signin, { loading: loginLoading }] = useLazyQuery(SIGNIN_QUERY);
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

  useEffect(() => {
    const isAdmin = location.pathname === '/admin';
    setRole(isAdmin ? 'admin' : 'user');
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');
    if (isLoggedIn === 'TRUE') {
      navigate(getItem('userId') !== null ? '/user/organizations' : '/orglist');
      extendSession();
    }
  }, []);

  /**
   * Verifies reCAPTCHA token if enabled
   */
  const verifyRecaptcha = async (
    recaptchaToken: string | null,
  ): Promise<boolean> => {
    if (REACT_APP_USE_RECAPTCHA !== 'yes') {
      return true;
    }

    try {
      const { data } = await recaptcha({
        variables: { recaptchaToken },
      });
      return data.recaptcha;
    } catch {
      toast.error(t('captchaError') as string);
      return false;
    }
  };

  /**
   * Handles login form submission
   */
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
      const { data: signInData } = await signin({
        variables: { email, password },
      });

      if (signInData) {
        if (signInData.signIn.user.countryCode !== null) {
          i18n.changeLanguage(signInData.signIn.user.countryCode);
        }

        const { signIn } = signInData;
        const { user, authenticationToken } = signIn;
        const isAdmin: boolean = user.role === 'administrator';

        if (role === 'admin' && !isAdmin) {
          toast.warn(tErrors('notAuthorised') as string);
          return;
        }

        const loggedInUserId = user.id;

        setItem('token', authenticationToken);
        setItem('IsLoggedIn', 'TRUE');
        setItem('name', user.name);
        setItem('email', user.emailAddress);
        setItem('role', user.role);
        setItem('UserImage', user.avatarURL || '');

        if (role === 'admin') {
          setItem('id', loggedInUserId);
        } else {
          setItem('userId', loggedInUserId);
        }

        if (pendingInvitationToken) {
          removeItem('pendingInvitationToken');
          startSession();
          window.location.href = `/event/invitation/${pendingInvitationToken}`;
          return;
        }
      } else {
        toast.warn(tErrors('notFound') as string);
      }
    } catch (error) {
      errorHandler(t, error);
    }
  };

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
