import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormField } from '../FormField/FormField';
import { EmailField } from '../EmailField/EmailField';
import { PasswordField } from '../PasswordField/PasswordField';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator/PasswordStrengthIndicator';
import { OrgSelector } from '../OrgSelector/OrgSelector';
import { useRegistration } from '../../../hooks/auth/useRegistration';
import {
  REACT_APP_USE_RECAPTCHA,
  RECAPTCHA_SITE_KEY,
} from '../../../Constant/constant';
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

  // Reset ReCAPTCHA on registration failure
  const handleRegistrationError = (error: Error) => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setRecaptchaToken(null);
    }
    if (onError) {
      onError(error);
    }
  };

  const { register, loading } = useRegistration({
    onSuccess,
    onError: handleRegistrationError,
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
      ...(recaptchaToken && { recaptchaToken }),
    });
  };

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
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
      />

      <PasswordField
        label={t('password')}
        name="password"
        value={formData.password}
        error={errors.password}
        onChange={(e) =>
          setFormData((s) => ({ ...s, password: e.target.value }))
        }
      />

      <PasswordField
        label={t('confirmPassword')}
        name="confirmPassword"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) =>
          setFormData((s) => ({ ...s, confirmPassword: e.target.value }))
        }
      />
      <PasswordStrengthIndicator password={formData.password} isVisible />
      <OrgSelector
        options={organizations}
        value={formData.orgId}
        onChange={(orgId) => setFormData((s) => ({ ...s, orgId }))}
      />
      {REACT_APP_USE_RECAPTCHA === 'YES' && RECAPTCHA_SITE_KEY && (
        <div className="mt-3">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptcha}
            data-cy="registrationRecaptcha"
          />
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? t('loading') : t('register')}
      </button>
    </form>
  );
};

export default RegistrationForm;
