import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { InterfaceFormFieldGroupProps } from '../../types/FormFieldGroup/interface';

/**
 * Renders a grouped form field with label, help text, error, and children elements.
 *
 * @param props - The properties for the FormFieldGroup component.
 * @returns A form group React element.
 */
export const FormFieldGroup: React.FC<
  InterfaceFormFieldGroupProps & { children: React.ReactNode }
> = ({ name, label, required, helpText, error, touched, children }) => {
  const { t: tCommon } = useTranslation('common');
  const showError = touched && !!error;

  return (
    <Form.Group controlId={name}>
      <Form.Label htmlFor={name}>
        {label}
        {required && <span aria-label={tCommon('required')}>*</span>}
      </Form.Label>

      {children}

      {helpText && !showError && (
        <Form.Text className="text-muted">{helpText}</Form.Text>
      )}

      {showError && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export * from './FormTextField';
export * from './FormSelectField';
