import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { RECAPTCHA_SITE_KEY } from 'Constant/constant';
import { FormField } from '../../../shared-components/Auth/FormField/FormField';
import { EmailField } from '../../../shared-components/Auth/EmailField/EmailField';
import { PasswordField } from '../../../shared-components/Auth/PasswordField/PasswordField';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { OrgSelector } from '../OrgSelector/OrgSelector';
import { useRegistration } from '../../../hooks/auth/useRegistration';
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../../../utils/validators/authValidators';
import type {
  IRegistrationFormProps,
  IRegistrationFormData,
} from '../../../types/Auth/RegistrationForm/interface';

/**
 * RegistrationForm component for user registration with validation and reCAPTCHA support
 */
export const RegistrationForm = ({
  organizations,
  onSuccess,
  onError,
  enableRecaptcha = false,
}: IRegistrationFormProps) => {
  const { t } = useTranslation('common');
  const { t: tErrors } = useTranslation('translation');
  const [formData, setFormData] = useState<IRegistrationFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    orgId: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { register, loading } = useRegistration({
    onSuccess,
    onError: (err) => {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      onError?.(err);
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword,
    );

    const getTranslatedError = (validation: {
      isValid: boolean;
      error?: string;
    }) => {
      return validation.isValid || !validation.error
        ? ''
        : tErrors(validation.error);
    };

    setErrors({
      name: getTranslatedError(nameValidation),
      email: getTranslatedError(emailValidation),
      password: getTranslatedError(passwordValidation),
      confirmPassword: getTranslatedError(confirmPasswordValidation),
    });

    if (
      !nameValidation.isValid ||
      !emailValidation.isValid ||
      !passwordValidation.isValid ||
      !confirmPasswordValidation.isValid
    ) {
      return;
    }

    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      organizationId: formData.orgId || '',
      recaptchaToken: recaptchaToken ?? undefined,
    });
  };

  return (
    <form onSubmit={submit} aria-busy={loading}>
      <FormField
        label={t('firstName')}
        name="name"
        value={formData.name}
        error={errors.name}
        onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
      />

      <EmailField
        value={formData.email}
        error={errors.email}
        onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
        testId="signInEmail"
      />

      <PasswordField
        label={t('password')}
        name="password"
        value={formData.password}
        error={errors.password}
        onChange={(e) =>
          setFormData((s) => ({ ...s, password: e.target.value }))
        }
        testId="passwordField"
      />

      <PasswordField
        label={t('confirmPassword')}
        name="confirmPassword"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) =>
          setFormData((s) => ({ ...s, confirmPassword: e.target.value }))
        }
        testId="cpassword"
      />
      <PasswordStrengthIndicator password={formData.password} isVisible />
      <OrgSelector
        options={organizations}
        value={formData.orgId}
        onChange={(orgId) => setFormData((s) => ({ ...s, orgId }))}
        testId="selectOrg"
      />
      {enableRecaptcha && (
        <div data-testid="recaptcha-placeholder">
          {RECAPTCHA_SITE_KEY && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token): void => setRecaptchaToken(token)}
              onExpired={(): void => setRecaptchaToken(null)}
              data-testid="recaptcha-container"
            />
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={
          loading ||
          (enableRecaptcha && !!RECAPTCHA_SITE_KEY && !recaptchaToken)
        }
        data-testid="registrationBtn"
      >
        {loading ? t('loading') : t('register')}
      </button>
    </form>
  );
};
