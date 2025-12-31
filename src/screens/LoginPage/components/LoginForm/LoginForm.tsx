import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { EmailField } from '../../../../components/Auth/EmailField/EmailField';
import { PasswordField } from '../../../../components/Auth/PasswordField/PasswordField';
import { SIGNIN_QUERY } from '../../../../GraphQl/Queries/Queries';
import type {
  InterfaceLoginFormData,
  InterfaceLoginFormProps,
} from '../../../../types/Auth/LoginForm/interface';

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
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');

  const [formData, setFormData] = useState<InterfaceLoginFormData>({
    email: '',
    password: '',
  });

  const [signin, { loading, data, error }] = useLazyQuery(SIGNIN_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Handle successful login
  useEffect(() => {
    if (data?.signIn?.authenticationToken) {
      onSuccess?.(data.signIn.authenticationToken);
    }
  }, [data, onSuccess]);

  // Handle login error
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await signin({
      variables: {
        email: formData.email,
        password: formData.password,
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
    <Form onSubmit={handleSubmit} data-testid={testId} aria-busy={loading}>
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

      <Button
        type="submit"
        disabled={loading}
        data-testid={`${testId}-submit`}
        className="w-100 mt-3"
      >
        {loading ? t('loading') : tCommon('login')}
      </Button>
    </Form>
  );
};

export default LoginForm;
