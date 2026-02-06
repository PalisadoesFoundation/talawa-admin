import React, { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { usePasswordVisibility } from '../../../hooks/usePasswordVisibility';
import type { InterfacePasswordFieldProps } from '../../../types/shared-components/Auth/PasswordField/interface';

/**
 * Reusable password field component with visibility toggle functionality.
 * Uses the shared FormTextField with endAdornment for show/hide password.
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePassword();
        }
      }}
      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
      aria-pressed={showPassword}
      className="input-group-text bg-white border-start-0"
      tabIndex={0}
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
        onChange({ target: { value: v } } as ChangeEvent<HTMLInputElement>)
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
