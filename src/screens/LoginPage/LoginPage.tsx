/**
 * @fileoverview LoginPage orchestrator component
 * @description Lightweight orchestrator that switches between LoginForm and RegistrationForm
 */

import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import {
  REACT_APP_USE_RECAPTCHA,
  RECAPTCHA_SITE_KEY,
  BACKEND_URL,
} from 'Constant/constant';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import LoginForm from 'components/Auth/LoginForm/LoginForm';
import RegistrationForm from 'components/Auth/RegistrationForm/RegistrationForm';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';
import { socialMediaLinks } from '../../constants';
import styles from '../../style/app-fixed.module.css';
import type { InterfaceQueryOrganizationListObject } from 'utils/interfaces';
import type { InterfaceUserData } from 'types/Auth/LoginForm/interface';

/**
 * LoginPage orchestrator component
 */
const LoginPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const navigate = useNavigate();
  const location = useLocation();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { startSession, extendSession } = useSession();

  document.title = t('title');

  // Orchestrator state (reduced from 12+ hooks to 3)
  const [showTab, setShowTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [organizations, setOrganizations] = useState<
    Array<{ label: string; id: string }>
  >([]);
  const [pendingInvitationToken] = useState<string | null>(
    () => getItem('pendingInvitationToken') as string | null,
  );

  // Determine portal type
  const isAdmin = location.pathname === '/admin';

  // GraphQL hooks for data fetching
  const { data, refetch } = useQuery(GET_COMMUNITY_DATA_PG);
  const { data: orgData } = useQuery(ORGANIZATION_LIST_NO_MEMBERS);

  // Effects
  useEffect(() => {
    refetch();
  }, [data]);

  useEffect(() => {
    const fetchServerUrl = async (): Promise<void> => {
      try {
        const response = await fetch(BACKEND_URL as string);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching server URL:', error);
      }
    };
    fetchServerUrl();
  }, []);

  useEffect(() => {
    const isRegister = location.pathname === '/register';
    if (isRegister) {
      setShowTab('REGISTER');
    }
  }, [location.pathname]);

  useEffect(() => {
    const isLoggedIn = getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      navigate(getItem('userId') !== null ? '/user/organizations' : '/orglist');
      extendSession();
    }
  }, []);

  useEffect(() => {
    if (orgData) {
      const options = orgData.organizations.map(
        (org: InterfaceQueryOrganizationListObject) => {
          return {
            label: `${org.name}(${org.addressLine1})`,
            id: org.id,
          };
        },
      );
      setOrganizations(options);
    }
  }, [orgData]);

  // Success handlers
  const handleLoginSuccess = (userData: InterfaceUserData): void => {
    const { token, user } = userData;

    setItem('token', token);
    setItem('IsLoggedIn', 'TRUE');
    setItem('name', user.name);
    setItem('email', user.emailAddress);
    setItem('role', user.role);
    setItem('UserImage', user.avatarURL || '');

    if (isAdmin) {
      setItem('id', user.id);
    } else {
      setItem('userId', user.id);
    }

    // Handle pending invitation token
    if (pendingInvitationToken) {
      removeItem('pendingInvitationToken');
      startSession();
      window.location.href = `/event/invitation/${pendingInvitationToken}`;
      return;
    }

    startSession();
    navigate(isAdmin ? '/orglist' : '/user/organizations');
  };

  const handleRegistrationSuccess = (userData: InterfaceUserData): void => {
    if (userData.token) {
      // Auto-login after registration
      handleLoginSuccess(userData);
    } else {
      // Registration successful, switch to login
      toast.success(t('successfullyRegistered') as string);
      setShowTab('LOGIN');
    }
  };

  const handleError = (error: string): void => {
    errorHandler(t, new Error(error));
  };

  // Social media links
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
                    alt="Community Logo"
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
                className={`${styles.talawa_logo} ${
                  showTab === 'REGISTER' && styles.marginTopForReg
                }`}
              />

              {/* Tab Navigation */}
              <div className={styles.tab_container} role="tablist">
                <button
                  role="tab"
                  aria-selected={showTab === 'LOGIN'}
                  className={`${styles.tab_button} ${
                    showTab === 'LOGIN' ? styles.active_tab_button : ''
                  }`}
                  onClick={() => setShowTab('LOGIN')}
                  data-testid="login-tab"
                >
                  {t('login')}
                </button>
                <button
                  role="tab"
                  aria-selected={showTab === 'REGISTER'}
                  className={`${styles.tab_button} ${
                    showTab === 'REGISTER' ? styles.active_tab_button : ''
                  }`}
                  onClick={() => setShowTab('REGISTER')}
                  data-testid="register-tab"
                >
                  {t('register')}
                </button>
              </div>

              {/* Component Orchestration */}
              <div
                className={`${
                  showTab === 'LOGIN' ? styles.active_tab : 'd-none'
                }`}
              >
                <LoginForm
                  isAdmin={isAdmin}
                  onSuccess={handleLoginSuccess}
                  onError={handleError}
                  recaptchaSiteKey={
                    REACT_APP_USE_RECAPTCHA === 'yes'
                      ? RECAPTCHA_SITE_KEY
                      : undefined
                  }
                />
              </div>

              <div
                className={`${
                  showTab === 'REGISTER' ? styles.active_tab : 'd-none'
                }`}
              >
                <RegistrationForm
                  organizations={organizations}
                  onSuccess={handleRegistrationSuccess}
                  onError={handleError}
                  recaptchaSiteKey={
                    REACT_APP_USE_RECAPTCHA === 'yes'
                      ? RECAPTCHA_SITE_KEY
                      : undefined
                  }
                  pendingInvitationToken={pendingInvitationToken}
                />
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default LoginPage;
