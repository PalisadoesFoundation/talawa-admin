import React from 'react';
import { Form } from 'react-bootstrap';
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
  error,
  helperText,
  ariaLive = true,
}) => {
  const hasError = !!error;
  const errorId = hasError ? `${name}-error` : undefined;
  const helperId = helperText && !hasError ? `${name}-helper` : undefined;
  const describedBy = errorId || helperId || undefined;

  return (
    <Form.Group className="mb-3" controlId={name}>
      {label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger"> *</span>}
        </Form.Label>
      )}

      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        isInvalid={hasError}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        data-testid={testId}
      />

      {/* Error message with aria-live for screen reader announcements */}
      {hasError && (
        <Form.Control.Feedback
          type="invalid"
          id={errorId}
          className="d-block"
          role={ariaLive ? 'status' : undefined}
          aria-live={ariaLive ? 'polite' : undefined}
        >
          {error}
        </Form.Control.Feedback>
      )}

      {/* Helper text displayed when no error */}
      {helperText && !hasError && (
        <Form.Text id={helperId} className="text-muted">
          {helperText}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default FormField;
