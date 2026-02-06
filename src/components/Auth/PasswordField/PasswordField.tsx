import React from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { usePasswordVisibility } from '../../../hooks/usePasswordVisibility';
import type { InterfacePasswordFieldProps } from '../../../types/Auth/PasswordField/interface';

/**
 * Reusable password field component with visibility toggle functionality.
 * Uses usePasswordVisibility hook by default but supports external control.
 */
export const PasswordField: React.FC<InterfacePasswordFieldProps> = ({
  label,
  name = 'password',
  value,
  onChange,
  placeholder,
  error,
  testId,
  showPassword: externalShowPassword,
  onToggleVisibility: externalToggle,
}) => {
  const { t } = useTranslation();
  const internal = usePasswordVisibility();
  const showPassword = externalShowPassword ?? internal.showPassword;
  const togglePassword = externalToggle ?? internal.togglePassword;

  return (
    <FormTextField
      name={name}
      label={label || ''}
      className="mb-3"
      error={error ?? undefined}
      touched={true}
      value={value}
      onChange={(value: string) => {
        const syntheticEvent = {
          target: { value },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }}
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      data-testid={testId}
      endAdornment={
        <InputGroup.Text
          as="button"
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
          className="bg-white"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </InputGroup.Text>
      }
    />
  );
};
