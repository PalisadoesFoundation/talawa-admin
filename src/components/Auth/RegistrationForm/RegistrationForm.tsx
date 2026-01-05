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
  const { register, loading } = useRegistration({ onSuccess, onError });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(f.name).isValid) return;
    if (!validateEmail(f.email).isValid) return;
    if (!validatePassword(f.password).isValid) return;
    if (!validatePasswordConfirmation(f.password, f.confirmPassword).isValid)
      return;
    await register({
      name: f.name,
      email: f.email,
      password: f.password,
      organizationId: f.orgId ?? '',
    });
  };

  return (
    <form onSubmit={submit} aria-busy={loading}>
      <FormField
        label="Name"
        name="name"
        value={f.name}
        onChange={(e) => setF((s) => ({ ...s, name: e.target.value }))}
      />
      <EmailField
        value={f.email}
        onChange={(e) => setF((s) => ({ ...s, email: e.target.value }))}
      />
      <PasswordField
        label="Password"
        name="password"
        value={f.password}
        onChange={(e) => setF((s) => ({ ...s, password: e.target.value }))}
      />
      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        value={f.confirmPassword}
        onChange={(e) =>
          setF((s) => ({ ...s, confirmPassword: e.target.value }))
        }
      />
      <PasswordStrengthIndicator password={f.password} isVisible />
      <OrgSelector
        options={organizations}
        value={f.orgId}
        onChange={(orgId) => setF((s) => ({ ...s, orgId }))}
      />
      {enableRecaptcha && (
        <div data-testid="recaptcha-placeholder">
          reCAPTCHA integration ready
        </div>
      )}
      <button type="submit" disabled={loading}>
        Create Account
      </button>
    </form>
  );
};
