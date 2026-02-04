import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { RECAPTCHA_SITE_KEY } from 'Constant/constant';
import { EmailField } from '../../../shared-components/Auth/EmailField/EmailField';
import { PasswordField } from '../PasswordField/PasswordField';
import { SIGNIN_QUERY } from '../../../GraphQl/Queries/Queries';
import type {
  InterfaceLoginFormData,
  InterfaceLoginFormProps,
} from '../../../types/Auth/LoginForm/interface';

/**
 * Reusable login form component that composes EmailField and PasswordField.
 *
 * @remarks
 * This component handles the login form UI and submission logic, delegating
 * authentication to the SIGNIN_QUERY GraphQL query. It supports both admin
 * and user login modes via the isAdmin prop.
 *
 * @param isAdmin - Whether the login form is rendered for an admin user
 * @param onSuccess - Callback invoked with the authentication token on successful login
 * @param onError - Callback invoked when the login request fails
 * @param testId - Optional test ID used for querying the component in tests
 *
 * @returns A JSX element rendering the login form
 *
 * @example
 * ```tsx
 * <LoginForm
 *   isAdmin={false}
 *   onSuccess={(token) => console.log('Logged in:', token)}
 *   onError={(error) => console.error('Login failed:', error)}
 * />
 * ```
 */
export const LoginForm: React.FC<InterfaceLoginFormProps> = ({
  isAdmin = false,
  onSuccess,
  onError,
  testId = 'login-form',
  enableRecaptcha = false,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');

  // Stable refs for callbacks to prevent multiple invocations on parent re-renders
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Keep refs in sync with latest callbacks
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const [formData, setFormData] = useState<InterfaceLoginFormData>({
    email: '',
    password: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [signin, { loading, data, error }] = useLazyQuery(SIGNIN_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Handle successful login - pass full signIn so parent can do session/redirect
  useEffect(() => {
    if (data?.signIn?.authenticationToken) {
      onSuccessRef.current?.(data.signIn);
    }
  }, [data]);

  // Handle login error - reset ReCAPTCHA when login fails
  useEffect(() => {
    if (error) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      onErrorRef.current?.(error);
    }
  }, [error]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await signin({
      variables: {
        email: formData.email,
        password: formData.password,
        ...(recaptchaToken && { recaptchaToken: recaptchaToken }),
      },
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} data-testid={testId} aria-busy={loading}>
      <h3 data-testid={`${testId}-heading`}>
        {isAdmin ? t('adminLogin') : t('userLogin')}
      </h3>
      <EmailField
        value={formData.email}
        onChange={handleEmailChange}
        testId={`${testId}-email`}
      />

      <PasswordField
        label={tCommon('password')}
        value={formData.password}
        onChange={handlePasswordChange}
        placeholder={tCommon('enterPassword')}
        testId={`${testId}-password`}
      />

      {enableRecaptcha && RECAPTCHA_SITE_KEY && (
        <div data-testid="recaptcha-placeholder">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token): void => setRecaptchaToken(token)}
            onExpired={(): void => setRecaptchaToken(null)}
            data-testid="recaptcha-container"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={
          loading ||
          (enableRecaptcha && !!RECAPTCHA_SITE_KEY && !recaptchaToken)
        }
        data-testid={`${testId}-submit`}
        className="w-100 mt-3"
      >
        {loading ? t('loading') : tCommon('login')}
      </Button>
    </form>
  );
};

export default LoginForm;
