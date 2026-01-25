import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '../FormField/FormField';
import type { InterfaceEmailFieldProps } from '../../../types/shared-components/Auth/EmailField/interface';

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
 * @param label - Optional label text displayed above the input
 * @param name - Name attribute for the input field (defaults to "email")
 * @param value - Current email input value
 * @param onChange - Change handler called when the input value changes
 * @param placeholder - Optional placeholder text for the input
 * @param error - Error message to display, if any
 * @param testId - Optional test ID for testing purposes
 *
 * @returns A JSX element rendering an email input field
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
  const { t } = useTranslation('common');

  return (
    <FormField
      label={label ?? t('email')}
      name={name}
      type="email"
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? t('emailPlaceholder')}
      error={error}
      testId={testId}
      required
    />
  );
};

export default EmailField;
