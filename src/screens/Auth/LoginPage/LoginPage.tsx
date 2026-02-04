/**
 * LoginPage component.
 *
 * Lightweight orchestrator for login and registration: tab switching,
 * portal routing (admin vs user), redirects, and composition of LoginForm
 * and RegistrationForm. Supports community branding and social links.
 *
 * @example
 * ```tsx
 * <LoginPage />
 * ```
 */
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';

import Button from 'shared-components/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { REACT_APP_USE_RECAPTCHA, BACKEND_URL } from 'Constant/constant';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import { LoginForm } from 'components/Auth/LoginForm/LoginForm';
import { RegistrationForm } from 'components/Auth/RegistrationForm/RegistrationForm';
import {
  IRegistrationSuccessResult,
  RegistrationError,
} from 'hooks/auth/useRegistration';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { socialMediaLinks } from '../../../constants';
import styles from './LoginPage.module.css';
import type { InterfaceSignInResult } from 'types/Auth/LoginForm/interface';
import type { InterfaceOrgOption } from 'types/Auth/OrgSelector/interface';
import type { InterfaceQueryOrganizationListObject } from 'utils/interfaces';
import useSession from 'utils/useSession';
import i18n from 'utils/i18n';

const LoginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const navigate = useNavigate();
  const location = useLocation();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { startSession, extendSession } = useSession();

  document.title = t('title');

  const [showTab, setShowTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [organizations, setOrganizations] = useState<InterfaceOrgOption[]>([]);
  const [pendingInvitationToken] = useState<string | null>(() =>
    getItem('pendingInvitationToken'),
  );

  useEffect(() => {
    setShowTab(location.pathname === '/register' ? 'REGISTER' : 'LOGIN');
    setRole(location.pathname === '/admin' ? 'admin' : 'user');
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');
    if (isLoggedIn === 'TRUE') {
      const storedRole = getItem('role');
      const target =
        storedRole === 'administrator' || storedRole === 'superuser'
          ? '/admin/orglist'
          : '/user/organizations';
      navigate(target);
      extendSession();
    }
  }, [navigate, getItem, extendSession]);

  const { data } = useQuery(GET_COMMUNITY_DATA_PG, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: orgData } = useQuery(ORGANIZATION_LIST_NO_MEMBERS);
  useEffect(() => {
    if (orgData?.organizations) {
      const options: InterfaceOrgOption[] = orgData.organizations.map(
        (org: InterfaceQueryOrganizationListObject) => ({
          _id: org.id,
          name: org.name,
        }),
      );
      setOrganizations(options);
    }
  }, [orgData]);

  useEffect(() => {
    async function loadResource(): Promise<void> {
      try {
        await fetch(BACKEND_URL as string, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '{ __typename }' }),
        });
      } catch (error) {
        errorHandler(t, error);
      }
    }
    loadResource();
  }, [t]);

  const handleLoginSuccess = (signInResult: InterfaceSignInResult): void => {
    const { user } = signInResult;
    if (user.countryCode !== null) {
      i18n.changeLanguage(user.countryCode);
    }
    const isAdminUser =
      user.role === 'administrator' || user.role === 'superuser';
    if (role === 'admin' && !isAdminUser) {
      NotificationToast.warning(tErrors('notAuthorised') as string);
      return;
    }
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
    if (!user.isEmailAddressVerified) {
      setItem('emailNotVerified', 'true');
      setItem('unverifiedEmail', user.emailAddress);
    } else {
      removeItem('emailNotVerified');
      removeItem('unverifiedEmail');
    }
    if (pendingInvitationToken) {
      removeItem('pendingInvitationToken');
      startSession();
      window.location.href = `/event/invitation/${pendingInvitationToken}`;
      return;
    }
    startSession();
    navigate(role === 'admin' ? '/admin/orglist' : '/user/organizations');
  };

  const handleLoginError = (error: Error): void => {
    const apolloError = error as {
      graphQLErrors?: Array<{
        extensions?: { code?: string; retryAfter?: string };
      }>;
    };
    const graphQLError = apolloError.graphQLErrors?.[0];
    const extensions = graphQLError?.extensions;

    if (extensions?.code === 'account_locked' && extensions?.retryAfter) {
      const retryAfterDate = new Date(extensions.retryAfter);
      const diffMs = retryAfterDate.getTime() - Date.now();
      const diffMinutes = Math.max(1, Math.ceil(diffMs / 60000));
      NotificationToast.error(
        tErrors('accountLockedWithTimer', { minutes: diffMinutes }),
      );
    } else {
      errorHandler(t, error);
    }
  };

  const handleRegisterSuccess = (result: IRegistrationSuccessResult): void => {
    NotificationToast.success(t('signupSuccessVerifyEmail') as string);
    setShowTab('LOGIN');
    if (result.signUp) {
      setItem('IsLoggedIn', 'TRUE');
      setItem('name', result.name);
      setItem('email', result.email);
      setItem('emailNotVerified', 'true');
      setItem('unverifiedEmail', result.email);
      if (result.signUp.user?.id) {
        setItem('userId', result.signUp.user.id);
      }
      setItem('role', 'user');
      if (pendingInvitationToken) {
        removeItem('pendingInvitationToken');
        startSession();
        window.location.href = `/event/invitation/${pendingInvitationToken}`;
        return;
      }
      startSession();
      navigate('/user/organizations');
    }
  };

  const handleRegisterError = (error: Error): void => {
    if (error instanceof RegistrationError) {
      NotificationToast.error({ key: error.code, namespace: 'errors' });
      return;
    }
    errorHandler(t, error);
  };

  const socialIconsList = socialMediaLinks.map(({ href, logo, tag }, index) =>
    data?.community ? (
      data.community?.[tag] && (
        <a
          key={index}
          href={data.community?.[tag]}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="preLoginSocialMedia"
        >
          <img src={logo} />
        </a>
      )
    ) : (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="PalisadoesSocialMedia"
      >
        <img src={logo} />
      </a>
    ),
  );

  return (
    <>
      <section className={styles.login_background}>
        <Row className={styles.row}>
          <Col sm={0} md={6} lg={7} className={styles.left_portion}>
            <div className={styles.inner}>
              {data?.community ? (
                <a
                  href={data.community.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.communityLogo}`}
                >
                  <img
                    src={data.community.logoURL}
                    alt={t('communityLogo')}
                    data-testid="preLoginLogo"
                  />
                  <p className="text-center">{data.community.name}</p>
                </a>
              ) : (
                <a
                  href="https://www.palisadoes.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PalisadoesLogo
                    className={styles.palisadoes_logo}
                    data-testid="PalisadoesLogo"
                  />
                  <p className="text-center">{t('fromPalisadoes')}</p>
                </a>
              )}
            </div>
            <div className={styles.socialIcons}>{socialIconsList}</div>
          </Col>
          <Col sm={12} md={6} lg={5}>
            <div className={styles.right_portion}>
              <ChangeLanguageDropDown
                parentContainerStyle={styles.langChangeBtn}
                btnStyle={styles.langChangeBtnStyle}
              />
              <TalawaLogo
                className={`${styles.talawa_logo}  ${
                  showTab === 'REGISTER' && styles.marginTopForReg
                }`}
              />
              {/* LOGIN TAB */}
              <div
                className={`${
                  showTab === 'LOGIN' ? styles.active_tab : 'd-none'
                }`}
                role="tabpanel"
                aria-hidden={showTab !== 'LOGIN'}
              >
                <LoginForm
                  isAdmin={role === 'admin'}
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  testId="login-form"
                  enableRecaptcha={REACT_APP_USE_RECAPTCHA === 'YES'}
                />
                <div className="text-end mt-3">
                  <Link
                    to="/forgotPassword"
                    className="text-secondary"
                    tabIndex={-1}
                  >
                    {tCommon('forgotPassword')}
                  </Link>
                </div>
                {location.pathname !== '/admin' && (
                  <div className="position-relative my-2">
                    <hr />
                    <span className={styles.orText}>{tCommon('OR')}</span>
                    <Button
                      variant="outline-secondary"
                      className={styles.reg_btn}
                      data-testid="goToRegisterPortion"
                      onClick={(): void => setShowTab('REGISTER')}
                    >
                      <Link to="/register" className="text-decoration-none">
                        {tCommon('register')}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              {/* REGISTER TAB */}
              <div
                className={`${
                  showTab === 'REGISTER' ? styles.active_tab : 'd-none'
                }`}
                role="tabpanel"
                aria-hidden={showTab !== 'REGISTER'}
              >
                <h1
                  className="fs-2 fw-bold text-dark mb-3"
                  data-testid="register-text"
                >
                  {tCommon('register')}
                </h1>
                <RegistrationForm
                  organizations={organizations}
                  onSuccess={handleRegisterSuccess}
                  onError={handleRegisterError}
                  enableRecaptcha={REACT_APP_USE_RECAPTCHA === 'YES'}
                />
                <div className="position-relative my-2">
                  <hr />
                  <span className={styles.orText}>{tCommon('OR')}</span>
                </div>
                <Button
                  variant="outline-secondary"
                  className={styles.reg_btn}
                  data-testid="goToLoginPortion"
                  onClick={(): void => setShowTab('LOGIN')}
                >
                  <Link to="/" className="text-decoration-none">
                    {t('backToLogin')}
                  </Link>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default LoginPage;
