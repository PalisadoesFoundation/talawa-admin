import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LoginForm from '../../components/Auth/LoginForm/LoginForm';
import RegistrationForm from '../../components/Auth/RegistrationForm/RegistrationForm';
import {
  NotificationToastContainer,
  NotificationToast,
} from 'components/NotificationToast/NotificationToast';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';
import { socialMediaLinks } from '../../constants';
import styles from './LoginPage.module.css';
import type { InterfaceSignInData } from '../../types/Auth/LoginForm/interface';
import type { InterfaceSignUpData } from '../../types/Auth/RegistrationForm/interface';

/**
 * LoginPage component - Orchestrator for login and registration flows.
 *
 * @remarks
 * Lightweight orchestrator that switches between LoginForm and RegistrationForm
 * components, handling session management and redirects.
 *
 * @returns React element containing the login/registration interface
 */
const LoginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { t: tGlobal } = useTranslation('translation');
  const navigate = useNavigate();
  const location = useLocation();
  const { setItem } = useLocalStorage();
  const { startSession } = useSession();

  document.title = t('title');

  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [organizations, setOrganizations] = useState<
    { _id: string; name: string }[]
  >([]);
  const isAdmin =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin');

  // Fetch organizations for registration
  const { data: orgData, error: orgError } = useQuery(
    ORGANIZATION_LIST_NO_MEMBERS,
    {
      skip: tab !== 'REGISTER',
    },
  );

  // Fetch community data
  const { data: communityData, error: communityError } = useQuery(
    GET_COMMUNITY_DATA_PG,
  );

  // Handle GraphQL errors
  useEffect(() => {
    if (orgError) {
      NotificationToast.error(tGlobal('errorOccurred'));
    }
  }, [orgError, tGlobal]);

  useEffect(() => {
    if (communityError) {
      NotificationToast.error(tGlobal('errorOccurred'));
    }
  }, [communityError, tGlobal]);

  useEffect(() => {
    if (orgData?.organizations) {
      // Map id to _id for OrgSelector compatibility
      const mappedOrgs = orgData.organizations.map(
        (org: { id: string; name: string }) => ({
          _id: org.id,
          name: org.name,
        }),
      );
      setOrganizations(mappedOrgs);
    }
  }, [orgData]);

  const handleLoginSuccess = (signInData: InterfaceSignInData): void => {
    const { user, authenticationToken } = signInData.signIn;

    // Store token and user data
    setItem('token', authenticationToken);
    setItem('userId', user.id);
    setItem('userRole', user.role);
    setItem('userName', user.name);
    setItem('userEmail', user.emailAddress);

    // Start session management
    startSession();

    // Handle redirects
    const from =
      location.state?.from?.pathname || (isAdmin ? '/admin' : '/user');
    navigate(from, { replace: true });
  };

  const handleRegistrationSuccess = (signUpData: InterfaceSignUpData): void => {
    const { user, authenticationToken } = signUpData.signUp;

    // Store token and redirect to login
    setItem('token', authenticationToken);
    setItem('userId', user.id);

    // Switch to login tab after successful registration
    setTab('LOGIN');
  };

  const getSocialMediaLabel = (tag: string): string => {
    const labels: Record<string, string> = {
      facebookURL: 'Facebook',
      xURL: 'X (Twitter)',
      linkedInURL: 'LinkedIn',
      githubURL: 'GitHub',
      youtubeURL: 'YouTube',
      slackURL: 'Slack',
      instagramURL: 'Instagram',
      redditURL: 'Reddit',
    };
    return labels[tag] || tag;
  };

  const handleAuthError = (error: Error): void => {
    console.error('Authentication error:', error);
    NotificationToast.error(t('Something_went_wrong'));
  };

  return (
    <>
      <section className={styles.loginPage}>
        <Row className={styles.row}>
          <Col sm={0} md={6} lg={7} className={styles.leftBox}>
            <div className={styles.innerLeft}>
              <PalisadoesLogo className={styles.palisadoesLogo} />
              <p className={styles.logintitle}>{t('fromPalisadoes')}</p>
              <div className={styles.socialIcons}>
                {socialMediaLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label={getSocialMediaLabel(link.tag)}
                  >
                    {link.logo}
                  </a>
                ))}
              </div>
            </div>
          </Col>
          <Col sm={12} md={6} lg={5}>
            <div className={styles.rightBox}>
              <TalawaLogo className={styles.talawaLogo} />
              <div className={styles.langChangeBtnBox}>
                <ChangeLanguageDropDown />
              </div>

              {/* Tab Navigation */}
              <div className={styles.tabContainer} role="tablist">
                <button
                  type="button"
                  role="tab"
                  id="login-tab"
                  aria-selected={tab === 'LOGIN'}
                  aria-controls="login-panel"
                  className={`${styles.tab} ${tab === 'LOGIN' ? styles.activeTab : ''}`}
                  onClick={() => setTab('LOGIN')}
                  data-testid="login-tab"
                >
                  {tCommon('login')}
                </button>
                <button
                  type="button"
                  role="tab"
                  id="register-tab"
                  aria-selected={tab === 'REGISTER'}
                  aria-controls="register-panel"
                  className={`${styles.tab} ${tab === 'REGISTER' ? styles.activeTab : ''}`}
                  onClick={() => setTab('REGISTER')}
                  data-testid="register-tab"
                >
                  {tCommon('register')}
                </button>
              </div>

              {/* Form Content */}
              <div
                className={styles.formContainer}
                role="tabpanel"
                id={tab === 'LOGIN' ? 'login-panel' : 'register-panel'}
                aria-labelledby={tab === 'LOGIN' ? 'login-tab' : 'register-tab'}
              >
                {tab === 'LOGIN' ? (
                  <LoginForm
                    isAdmin={isAdmin}
                    onSuccess={handleLoginSuccess}
                    onError={handleAuthError}
                    testId="login-form"
                  />
                ) : (
                  <RegistrationForm
                    organizations={organizations}
                    onSuccess={handleRegistrationSuccess}
                    onError={handleAuthError}
                  />
                )}
              </div>

              {/* Community Data Display */}
              {communityData?.community && (
                <div className={styles.communityContainer}>
                  <p>{communityData.community.name}</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </section>
      <NotificationToastContainer />
    </>
  );
};

export default LoginPage;
