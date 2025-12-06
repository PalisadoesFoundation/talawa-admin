import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RegistrationForm from 'shared-components/RegistrationForm/RegistrationForm';
import AuthBranding from 'shared-components/AuthBranding/AuthBranding';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import {
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';
import { errorHandler } from 'utils/errorHandler';
import type { IRegistrationData } from 'types/RegistrationForm/interface';
import type { InterfaceQueryOrganizationListObject } from 'utils/interfaces';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app-fixed.module.css';
import { REACT_APP_USE_RECAPTCHA } from 'Constant/constant';

/**
 * RegisterPage Component
 * Handles user registration for both admin and user roles
 * @returns {JSX.Element} The rendered registration page
 */
const RegisterPage = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const navigate = useNavigate();
  const location = useLocation();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const { startSession } = useSession();
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [organizations, setOrganizations] = useState<
    Array<{ label: string; id: string }>
  >([]);
  const [pendingInvitationToken] = useState(() =>
    getItem('pendingInvitationToken'),
  );

  // GraphQL
  const { data: communityData } = useQuery(GET_COMMUNITY_DATA_PG);
  const { data: orgData } = useQuery(ORGANIZATION_LIST_NO_MEMBERS);
  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);

  useEffect(() => {
    const isAdmin = location.pathname === '/admin/register';
    setRole(isAdmin ? 'admin' : 'user');
  }, [location.pathname]);

  useEffect(() => {
    if (orgData) {
      const options = orgData.organizations.map(
        (org: InterfaceQueryOrganizationListObject) => ({
          label: `${org.name}(${org.addressLine1})`,
          id: org.id,
        }),
      );
      setOrganizations(options);
    }
  }, [orgData]);

  // Handles registration form submission
  const handleRegistration = async (
    userData: IRegistrationData,
    recaptchaToken: string | null,
  ): Promise<boolean> => {
    try {
      // Verify reCAPTCHA if enabled
      if (REACT_APP_USE_RECAPTCHA === 'yes') {
        if (!recaptchaToken) {
          toast.error(t('Please_check_the_captcha') as string);
          return false;
        }

        try {
          const { data: recaptchaData } = await recaptcha({
            variables: { recaptchaToken },
          });

          if (!recaptchaData?.recaptcha) {
            toast.error(t('captchaError') as string);
            return false;
          }
        } catch {
          toast.error(t('captchaError') as string);
          return false;
        }
      }
      const { data: signUpData } = await signup({
        variables: {
          ID: userData.organizationId,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
        },
      });

      if (signUpData) {
        toast.success(
          t(
            role === 'admin' ? 'successfullyRegistered' : 'afterRegister',
          ) as string,
        );

        // Auto-login after registration if token returned
        if (signUpData.signUp && signUpData.signUp.authenticationToken) {
          const authToken = signUpData.signUp.authenticationToken;
          setItem('token', authToken);
          setItem('IsLoggedIn', 'TRUE');
          setItem('name', `${userData.firstName} ${userData.lastName}`);
          setItem('email', userData.email);

          if (pendingInvitationToken) {
            removeItem('pendingInvitationToken');
            startSession();
            window.location.href = `/event/invitation/${pendingInvitationToken}`;
            return true;
          }
        }

        // Navigate to login
        navigate(role === 'admin' ? '/admin' : '/');
        return true;
      }
      return false;
    } catch (error) {
      errorHandler(t, error);
      return false;
    }
  };

  return (
    <section className={styles.login_background}>
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
            <TalawaLogo
              className={`${styles.talawa_logo} ${styles.marginTopForReg}`}
            />

            <RegistrationForm
              role={role}
              isLoading={signinLoading}
              onSubmit={handleRegistration}
              showLoginLink={true}
              organizations={organizations}
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default RegisterPage;
