import React from 'react';
import { Form } from 'react-bootstrap';
import type { InterfaceFormFieldProps } from '../../../types/Auth/FormField/interface';

/**
 * Reusable form field component with accessibility features and error handling.
 * Supports text, email, password, and tel input types with Bootstrap styling.
 */
export const FormField: React.FC<InterfaceFormFieldProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  error,
  testId,
}) => {
  const errorId = error ? `${name}-error` : undefined;

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
        isInvalid={!!error}
        aria-describedby={errorId}
        data-testid={testId}
      />
      {error && (
        <Form.Control.Feedback type="invalid" id={errorId} className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
