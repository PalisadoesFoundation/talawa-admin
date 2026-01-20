import React, { useState, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '../../../shared-components/Button';
import { useTranslation } from 'react-i18next';
import { EmailField } from '../EmailField/EmailField';
import { PasswordField } from '../PasswordField/PasswordField';
import { SIGNIN_QUERY } from '../../../GraphQl/Queries/Queries';
import {
  REACT_APP_USE_RECAPTCHA,
  RECAPTCHA_SITE_KEY,
} from '../../../Constant/constant';
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
 * @example
 * ```tsx
 * <LoginForm
 *   isAdmin={false}
 *   onSuccess={(signInData) => console.log('Logged in:', signInData)}
 *   onError={(error) => console.error('Login failed:', error)}
 * />
 * ```
 */
export const LoginForm: React.FC<InterfaceLoginFormProps> = ({
  isAdmin = false,
  onSuccess,
  onError,
  testId = 'login-form',
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

  // Handle successful login
  useEffect(() => {
    if (data?.signIn?.authenticationToken) {
      onSuccessRef.current?.(data);
    }
  }, [data]);

  // Handle login error
  useEffect(() => {
    if (error) {
      // Reset ReCAPTCHA on error to allow retry
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
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
        ...(recaptchaToken && { recaptchaToken }),
      },
    });
  };

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
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

      {REACT_APP_USE_RECAPTCHA === 'YES' && RECAPTCHA_SITE_KEY && (
        <div className="mt-3">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptcha}
            data-cy="loginRecaptcha"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        data-testid={`${testId}-submit`}
        className="w-100 mt-3"
      >
        {loading ? t('loading') : tCommon('login')}
      </Button>
    </form>
  );
};

export default LoginForm;
