import React from 'react';
import { Form } from 'react-bootstrap';
import type { FormFieldProps } from '../../../types/Auth/FormField/interface';

export const FormField: React.FC<FormFieldProps> = (p) => {
  const errorId = p.error ? `${p.name}-error` : undefined;

  return (
    <Form.Group className="mb-3" controlId={p.name}>
      {p.label && (
        <Form.Label>
          {p.label}
          {p.required && <span className="text-danger"> *</span>}
        </Form.Label>
      )}
      <Form.Control
        type={p.type ?? 'text'}
        name={p.name}
        value={p.value}
        onChange={p.onChange}
        onBlur={p.onBlur}
        placeholder={p.placeholder}
        disabled={p.disabled}
        isInvalid={!!p.error}
        aria-invalid={!!p.error}
        aria-describedby={errorId}
        data-testid={p.testId}
      />
      {p.error && (
        <Form.Control.Feedback type="invalid" id={errorId} className="d-block">
          {p.error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
