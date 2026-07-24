import React from 'react';
import type { InterfaceFormFieldProps } from '../../../types/shared-components/Auth/FormField/interface';

/**
 * Reusable form field component with validation and accessibility support.
 *
 * @remarks
 * This component integrates with Phase 1 validators via the `error` prop
 * and provides aria-live announcements for screen readers.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 *   error={emailError}
 *   required
 * />
 * ```
 */
export const FormField: React.FC<InterfaceFormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  testId,
  dataCy,
  error,
  helperText,
  ariaLive = true,
}) => {
  const hasError = !!error;
  const errorId = hasError ? `${name}-error` : undefined;
  const helperId = helperText && !hasError ? `${name}-helper` : undefined;
  const describedBy = errorId || helperId || undefined;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && (
            <span style={{ color: 'var(--red-500, #ef4444)' }}> *</span>
          )}
        </label>
      )}

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        data-testid={testId}
        data-cy={dataCy}
        className="form-input"
        style={
          hasError ? { borderColor: 'var(--red-500, #ef4444)' } : undefined
        }
      />

      {/* Error message with aria-live for screen reader announcements */}
      {hasError && (
        <div
          id={errorId}
          style={{
            display: 'block',
            color: 'var(--red-500, #ef4444)',
            fontSize: '0.875em',
            marginTop: '0.25rem',
          }}
          role={ariaLive ? 'status' : undefined}
          aria-live={ariaLive ? 'polite' : undefined}
        >
          {error}
        </div>
      )}

      {/* Helper text displayed when no error */}
      {helperText && !hasError && (
        <small id={helperId} style={{ color: 'var(--gray-500, #6b7280)' }}>
          {helperText}
        </small>
      )}
    </div>
  );
};
