import React, { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { usePasswordVisibility } from '../../../hooks/usePasswordVisibility';
import type { InterfacePasswordFieldProps } from '../../../types/shared-components/Auth/PasswordField/interface';

/**
 * Reusable password input field with visibility toggle (show/hide password).
 *
 * @param props - Component props (see {@link InterfacePasswordFieldProps}): label, name, value, onChange,
 *   placeholder, error, testId, dataCy, showPassword, onToggleVisibility.
 * @remarks
 * Uses FormTextField with an endAdornment button to toggle visibility.
 * Visibility can be controlled via showPassword/onToggleVisibility or managed
 * internally via usePasswordVisibility. Renders a password (or text) input
 * with an eye icon to show/hide the value.
 * @returns The rendered password input field with visibility toggle.
 * @example
 * ```tsx
 * <PasswordField
 *   label="Password"
 *   name="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   testId="passwordField"
 * />
 * ```
 */
export const PasswordField: React.FC<InterfacePasswordFieldProps> = ({
  label,
  name = 'password',
  value,
  onChange,
  placeholder,
  error,
  testId,
  dataCy,
  showPassword: externalShowPassword,
  onToggleVisibility: externalToggle,
}) => {
  const { t } = useTranslation();
  const internal = usePasswordVisibility();
  const showPassword = externalShowPassword ?? internal.showPassword;
  const togglePassword = externalToggle ?? internal.togglePassword;

  const visibilityToggle = (
    <button
      type="button"
      onClick={togglePassword}
      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
      aria-pressed={showPassword}
      className="input-group-text bg-white border-start-0"
    >
      {showPassword ? (
        <AiOutlineEyeInvisible aria-hidden />
      ) : (
        <AiOutlineEye aria-hidden />
      )}
    </button>
  );

  return (
    <FormTextField
      name={name}
      label={label ?? ''}
      hideLabel={!label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={(v) =>
        onChange({
          target: { name, value: v },
        } as ChangeEvent<HTMLInputElement>)
      }
      error={error ?? undefined}
      touched={!!error}
      endAdornment={visibilityToggle}
      data-testid={testId}
      data-cy={dataCy}
      className="mb-3"
    />
  );
};
