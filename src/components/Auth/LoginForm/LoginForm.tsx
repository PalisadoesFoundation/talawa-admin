import React, { useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation } from '@apollo/client';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { RECAPTCHA_MUTATION } from 'GraphQl/Mutations/mutations';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
import { errorHandler } from 'utils/errorHandler';
import type { ILoginFormProps } from 'types/Auth/LoginForm';
import styles from '../../../style/app-fixed.module.css';
import i18n from 'utils/i18n';

export const LoginForm: React.FC<ILoginFormProps> = ({
  isAdmin,
  onSuccess,
  loading = false,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const [formState, setFormState] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const loginRecaptchaRef = useRef<ReCAPTCHA>(null);

  const [signin, { loading: loginLoading }] = useLazyQuery(SIGNIN_QUERY);
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

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

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const togglePassword = (): void => setShowPassword(!showPassword);

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
        const { user } = signIn;
        const isUserAdmin: boolean = user.role === 'administrator';
        if (isAdmin && !isUserAdmin) {
          toast.warn(tErrors('notAuthorised') as string);
          return;
        }

        onSuccess(signIn);
      } else {
        toast.warn(tErrors('notFound') as string);
      }
    } catch (error) {
      errorHandler(t, error);
      loginRecaptchaRef.current?.reset();
    }
  };

  return (
    <form onSubmit={loginLink}>
      <h1 className="fs-2 fw-bold text-dark mb-3">
        {isAdmin ? t('adminLogin') : t('userLogin')}
      </h1>
      <Form.Label>{tCommon('email')}</Form.Label>
      <div className="position-relative">
        <Form.Control
          type="email"
          disabled={loading || loginLoading}
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
          disabled={loading || loginLoading}
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
        disabled={loading || loginLoading}
        type="submit"
        className={styles.login_btn}
        value="Login"
        data-testid="loginBtn"
        data-cy="loginBtn"
      >
        {tCommon('login')}
      </Button>
    </form>
  );
};
