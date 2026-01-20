import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '../FormField/FormField';
import type { InterfaceEmailFieldProps } from '../../../types/Auth/EmailField/interface';

/**
 * Reusable email input field component.
 *
 * @remarks
 * This component wraps FormField with email-specific defaults including:
 * - HTML5 email input type for built-in validation
 * - Default label and placeholder from i18n keys (email, emailPlaceholder)
 * - Required field marking
 * - Support for error display via string or null error prop
 *
 * @example
 * ```tsx
 * <EmailField
 *   value={email}
 *   onChange={handleEmailChange}
 *   error={emailError}
 * />
 * ```
 */
export const EmailField: React.FC<InterfaceEmailFieldProps> = ({
  label,
  name = 'email',
  value,
  onChange,
  placeholder,
  error,
  testId,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'auth.emailField' });

  return (
    <FormField
      label={label ?? t('label')}
      name={name}
      type="email"
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? t('placeholder')}
      error={error}
      testId={testId}
      required
    />
  );
};

export default EmailField;
