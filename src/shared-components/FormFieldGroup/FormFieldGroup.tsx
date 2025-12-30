import React from 'react';
import { Form } from 'react-bootstrap';
import type { FormFieldGroupProps } from './types';

export const FormFieldGroup: React.FC<
  FormFieldGroupProps & { children: React.ReactNode }
> = ({
  name,
  label,
  children,
  groupClass,
  labelClass,
  error,
  touched,
  required,
  helpText,
}) => {
  const errorId = `${label}-error`;

  return (
    <Form.Group controlId={name} className={groupClass}>
      {label && (
        <Form.Label className={labelClass}>
          {label} {required && <span aria-label="required">*</span>}
        </Form.Label>
      )}
      {children}
      {touched && error && (
        <Form.Control.Feedback
          aria-describedby={touched && error ? errorId : undefined}
          type="invalid"
          className="d-block"
        >
          {error}
        </Form.Control.Feedback>
      )}
      {helpText && !error && (
        <Form.Text className="text-muted">{helpText}</Form.Text>
      )}
    </Form.Group>
  );
};
