import React, { useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PasswordField from 'shared-components/PasswordField/PasswordField';
import { InterfaceLoginFormProps } from 'types/LoginForm/interface';
import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
import styles from 'style/app-fixed.module.css';

/**
 * LoginForm Component
 * Reusable login form for both admin and user portals
 * @param {InterfaceLoginFormProps} props - Component props
 * @returns {JSX.Element} The rendered login form
 */
const LoginForm: React.FC<InterfaceLoginFormProps> = ({
  role,
  isLoading,
  onSubmit,
  initialEmail = '',
  showRegisterLink = true,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const [formState, setFormState] = useState({
    email: initialEmail,
    password: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const loginRecaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await onSubmit(formState.email, formState.password, recaptchaToken);
  };

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  return (
    <div className={styles.active_tab}>
      <form onSubmit={handleSubmit}>
        <h1 className="fs-2 fw-bold text-dark mb-3">
          {role === 'admin' ? t('adminLogin') : t('userLogin')}
        </h1>

        <Form.Label>{tCommon('email')}</Form.Label>
        <div className="position-relative">
          <Form.Control
            type="email"
            disabled={isLoading}
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

        <div className="mt-3">
          <PasswordField
            label={tCommon('password')}
            value={formState.password}
            onChange={(value): void =>
              setFormState({ ...formState, password: value })
            }
            disabled={isLoading}
            placeholder={tCommon('enterPassword')}
            testId="password"
            autoComplete="current-password"
          />
        </div>

        <div className="text-end mt-3">
          <Link to="/forgotPassword" className="text-secondary" tabIndex={-1}>
            {tCommon('forgotPassword')}
          </Link>
        </div>

        {REACT_APP_USE_RECAPTCHA === 'yes' && (
          <div className="googleRecaptcha">
            <ReCAPTCHA
              ref={loginRecaptchaRef}
              className="mt-2"
              sitekey={RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'}
              onChange={handleCaptcha}
            />
          </div>
        )}

        <Button
          disabled={isLoading}
          type="submit"
          className={styles.login_btn}
          value="Login"
          data-testid="loginBtn"
          data-cy="loginBtn"
        >
          {tCommon('login')}
        </Button>

        {showRegisterLink && (
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
