import React, { useState } from 'react';
import { FormField } from '../FormField/FormField';
import { EmailField } from '../EmailField/EmailField';
import { PasswordField } from '../PasswordField/PasswordField';
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
  const [f, setF] = useState<IRegistrationFormData>({
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
  const { register, loading } = useRegistration({ onSuccess, onError });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidation = validateName(f.name);
    const emailValidation = validateEmail(f.email);
    const passwordValidation = validatePassword(f.password);
    const confirmPasswordValidation = validatePasswordConfirmation(
      f.password,
      f.confirmPassword,
    );

    setErrors({
      name: nameValidation.isValid ? '' : 'Name is required',
      email: emailValidation.isValid ? '' : 'Valid email is required',
      password: passwordValidation.isValid ? '' : 'Password is required',
      confirmPassword: confirmPasswordValidation.isValid
        ? ''
        : 'Passwords must match',
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
      name: f.name,
      email: f.email,
      password: f.password,
      organizationId: f.orgId || '',
    });
  };

  return (
    <form onSubmit={submit} aria-busy={loading}>
      <FormField
        label=""
        name="name"
        placeholder=""
        data-field="name"
        value={f.name}
        onChange={(e) => setF((s) => ({ ...s, name: e.target.value }))}
      />
      {errors.name && <div className="text-danger small">{errors.name}</div>}

      <EmailField
        value={f.email}
        onChange={(e) => setF((s) => ({ ...s, email: e.target.value }))}
      />
      {errors.email && <div className="text-danger small">{errors.email}</div>}

      <PasswordField
        label=""
        name="password"
        placeholder=""
        data-field="password"
        value={f.password}
        onChange={(e) => setF((s) => ({ ...s, password: e.target.value }))}
      />
      {errors.password && (
        <div className="text-danger small">{errors.password}</div>
      )}

      <PasswordField
        label=""
        name="confirmPassword"
        placeholder=""
        data-field="confirmPassword"
        value={f.confirmPassword}
        onChange={(e) =>
          setF((s) => ({ ...s, confirmPassword: e.target.value }))
        }
      />
      {errors.confirmPassword && (
        <div className="text-danger small">{errors.confirmPassword}</div>
      )}
      <PasswordStrengthIndicator password={f.password} isVisible />
      <OrgSelector
        options={organizations}
        value={f.orgId}
        onChange={(orgId) => setF((s) => ({ ...s, orgId }))}
      />
      {enableRecaptcha && (
        <div data-testid="recaptcha-placeholder" data-content="recaptcha-ready">
          {/* reCAPTCHA component will be rendered here */}
        </div>
      )}
      <button type="submit" disabled={loading} data-action="submit">
        {loading ? '...' : ''}
      </button>
    </form>
  );
};
