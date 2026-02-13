import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { RECAPTCHA_SITE_KEY } from 'Constant/constant';
import { getRecaptchaToken } from 'utils/recaptcha';
import { EmailField } from '../../../shared-components/Auth/EmailField/EmailField';
import { PasswordField } from '../../../shared-components/Auth/PasswordField/PasswordField';
import { SIGNIN_QUERY } from '../../../GraphQl/Queries/Queries';
import type {
  InterfaceLoginFormData,
  InterfaceLoginFormProps,
} from '../../../types/Auth/LoginForm/interface';
import styles from './LoginForm.module.css';

/**
 * Reusable login form component that composes EmailField and PasswordField.
 *
 * @remarks
 * This component handles the login form UI and submission logic, delegating
 * authentication to the SIGNIN_QUERY GraphQL query. It supports both admin
 * and user login modes via the isAdmin prop.
 *
 * @param isAdmin - Whether the login form is rendered for an admin user
 * @param onSuccess - Callback invoked with the full sign-in result (user + tokens)
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
  const reportedNotFoundRef = useRef(false);

  const [signin, { loading, data, error }] = useLazyQuery<{
    signIn?: import('types/Auth/LoginForm/interface').InterfaceSignInResult;
  }>(SIGNIN_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Single effect: error first, then success, then not-found
  useEffect(() => {
    if (error) {
      const isAbortError =
        (error instanceof DOMException && error.name === 'AbortError') ||
        (error as { networkError?: { name?: string } })?.networkError?.name ===
          'AbortError';
      if (isAbortError) return;
      reportedNotFoundRef.current = false;
      onErrorRef.current?.(error);
      return;
    }
    if (data?.signIn?.authenticationToken) {
      reportedNotFoundRef.current = false;
      onSuccessRef.current?.(data.signIn);
      return;
    }
    if (data !== undefined && !data?.signIn) {
      if (!reportedNotFoundRef.current) {
        reportedNotFoundRef.current = true;
        onErrorRef.current?.(new Error('Not found'));
      }
    }
  }, [data, error]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      // Get reCAPTCHA token dynamically
      const recaptchaToken =
        enableRecaptcha && RECAPTCHA_SITE_KEY
          ? await getRecaptchaToken(RECAPTCHA_SITE_KEY, 'login')
          : null;

      const variables = {
        email: formData.email,
        password: formData.password,
        ...(recaptchaToken && { recaptchaToken }),
      };

      await signin({ variables });
    } catch (err) {
      const isAbortError =
        (err instanceof DOMException && err.name === 'AbortError') ||
        (err as { networkError?: { name?: string } })?.networkError?.name ===
          'AbortError';
      if (isAbortError) return;
      onErrorRef.current?.(err as Error);
    }
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
        dataCy="loginEmail"
      />

      <PasswordField
        label={tCommon('password')}
        value={formData.password}
        onChange={handlePasswordChange}
        placeholder={tCommon('enterPassword')}
        testId={`${testId}-password`}
        dataCy="loginPassword"
      />

      <Button
        type="submit"
        disabled={loading}
        data-testid={`${testId}-submit`}
        data-cy="loginBtn"
        className={styles.submitBtn}
      >
        {loading ? t('loading') : tCommon('login')}
      </Button>
    </form>
  );
};
