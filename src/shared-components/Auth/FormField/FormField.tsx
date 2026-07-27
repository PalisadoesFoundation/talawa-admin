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
import styles from './FormField.module.css';

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
    <div className={styles.formFieldGroup}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className={styles.requiredAsterisk}> *</span>}
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
        className={`form-input ${hasError ? styles.inputError : ''}`.trim()}
      />

      {/* Error message with aria-live for screen reader announcements */}
      {hasError && (
        <div
          id={errorId}
          className={styles.errorMessage}
          role={ariaLive ? 'status' : undefined}
          aria-live={ariaLive ? 'polite' : undefined}
        >
          {error}
        </div>
      )}

      {/* Helper text displayed when no error */}
      {helperText && !hasError && (
        <small id={helperId} className={styles.helperText}>
          {helperText}
        </small>
      )}
    </div>
  );
};
