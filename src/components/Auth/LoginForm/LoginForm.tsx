/**
 * @fileoverview LoginForm component for user authentication
 * @description Handles login functionality with email/password validation and reCAPTCHA
 */

import { useLazyQuery, useMutation } from '@apollo/client';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { toast } from 'react-toastify';

import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
import { RECAPTCHA_MUTATION } from 'GraphQl/Mutations/mutations';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import { errorHandler } from 'utils/errorHandler';
import i18n from 'utils/i18n';
import styles from '../../../style/app-fixed.module.css';
import type {
  InterfaceLoginFormProps,
  InterfaceLoginFormData,
  InterfaceUserData,
} from 'types/Auth/LoginForm/interface';

/**
 * LoginForm component for user authentication
 */
const LoginForm: React.FC<InterfaceLoginFormProps> = ({
  isAdmin = false,
  onSuccess,
  onError,
  testId = 'login-form',
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const location = useLocation();

  // Form state
  const [formState, setFormState] = useState<InterfaceLoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // Refs
  const loginRecaptchaRef = useRef<ReCAPTCHA>(null);

  // GraphQL hooks
  const [signin, { loading: loginLoading }] = useLazyQuery(SIGNIN_QUERY);
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

  // Handlers
  const togglePassword = (): void => setShowPassword(!showPassword);

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const verifyRecaptcha = async (
    recaptchaToken: string | null,
  ): Promise<boolean | void> => {
    try {
      if (REACT_APP_USE_RECAPTCHA !== 'yes') {
        return true;
      }
      const { data } = await recaptcha({
        variables: {
          recaptchaToken,
        },
      });

      return data.recaptcha;
    } catch {
      toast.error(t('captchaError') as string);
    }
  };

  const loginLink = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const isVerified = await verifyRecaptcha(recaptchaToken);

    if (!isVerified) {
      toast.error(t('Please_check_the_captcha') as string);
      return;
    }

    try {
      const { data: signInData } = await signin({
        variables: { email: formState.email, password: formState.password },
      });

      if (signInData) {
        if (signInData.signIn.user.countryCode !== null) {
          i18n.changeLanguage(signInData.signIn.user.countryCode);
        }

        const { signIn } = signInData;
        const { user, authenticationToken } = signIn;
        const isUserAdmin: boolean = user.role === 'administrator';

        if (isAdmin && !isUserAdmin) {
          toast.warn(tErrors('notAuthorised') as string);
          return;
        }

        // Prepare essential user data
        const userData: InterfaceUserData = {
          token: authenticationToken,
          user: {
            id: user.id,
            name: user.name,
            emailAddress: user.emailAddress,
            role: user.role,
            countryCode: user.countryCode,
            avatarURL: user.avatarURL,
          },
        };

        onSuccess(userData);
      } else {
        toast.warn(tErrors('notFound') as string);
      }
    } catch (error) {
      errorHandler(t, error);
      loginRecaptchaRef.current?.reset();
      onError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div data-testid={testId}>
      <form onSubmit={loginLink}>
        <h1 className="fs-2 fw-bold text-dark mb-3">
          {isAdmin ? t('adminLogin') : t('userLogin')}
        </h1>

        <Form.Label>{tCommon('email')}</Form.Label>
        <div className="position-relative">
          <Form.Control
            type="email"
            disabled={loginLoading}
            placeholder={tCommon('enterEmail')}
            required
            value={formState.email}
            onChange={(e): void => {
              setFormState({
                ...formState,
                email: e.target.value,
              });
            }}
            autoComplete="username"
            data-testid="loginEmail"
            data-cy="loginEmail"
          />
          <Button tabIndex={-1} className={styles.email_button}>
            <EmailOutlinedIcon />
          </Button>
        </div>

        <Form.Label className="mt-3">{tCommon('password')}</Form.Label>
        <div className="position-relative">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            className="input_box_second lh-1"
            placeholder={tCommon('enterPassword')}
            required
            value={formState.password}
            data-testid="password"
            onChange={(e): void => {
              setFormState({
                ...formState,
                password: e.target.value,
              });
            }}
            disabled={loginLoading}
            autoComplete="current-password"
            data-cy="loginPassword"
          />
          <Button
            onClick={togglePassword}
            data-testid="showLoginPassword"
            className={styles.email_button}
          >
            {showPassword ? (
              <i className="fas fa-eye"></i>
            ) : (
              <i className="fas fa-eye-slash"></i>
            )}
          </Button>
        </div>

        <div className="text-end mt-3">
          <Link to="/forgotPassword" className="text-secondary" tabIndex={-1}>
            {tCommon('forgotPassword')}
          </Link>
        </div>

        {REACT_APP_USE_RECAPTCHA === 'yes' ? (
          <div className="googleRecaptcha">
            <ReCAPTCHA
              ref={loginRecaptchaRef}
              className="mt-2"
              sitekey={RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'}
              onChange={handleCaptcha}
            />
          </div>
        ) : (
          <></>
        )}

        <Button
          disabled={loginLoading}
          type="submit"
          className={styles.login_btn}
          value="Login"
          data-testid="loginBtn"
          data-cy="loginBtn"
        >
          {tCommon('login')}
        </Button>

        {location.pathname === '/admin' || (
          <div>
            <div className="position-relative my-2">
              <hr />
              <span className={styles.orText}>{tCommon('OR')}</span>
            </div>
            <Button
              variant="outline-secondary"
              value="Register"
              className={styles.reg_btn}
              data-testid="goToRegisterPortion"
              onClick={(): void => {
                // This will be handled by parent orchestrator
                const event = new CustomEvent('switchToRegister');
                window.dispatchEvent(event);
              }}
            >
              <Link to={'/register'} className="text-decoration-none">
                {tCommon('register')}
              </Link>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
