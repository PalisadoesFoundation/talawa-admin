import React from 'react';
import { FormField } from '../FormField/FormField';
import type { InterfaceEmailFieldProps } from '../../../types/Auth/EmailField/interface';

/**
 * Reusable email input field component.
 *
 * @remarks
 * This component wraps FormField with email-specific defaults including:
 * - HTML5 email input type for built-in validation
 * - Default label "Email" and placeholder "name@example.com"
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
  label = 'Email',
  name = 'email',
  value,
  onChange,
  placeholder = 'name@example.com',
  error,
  testId,
}) => (
  <FormField
    label={label}
    name={name}
    type="email"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    error={error}
    testId={testId}
    required
  />
);

export default EmailField;
