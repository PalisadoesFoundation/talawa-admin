import React from 'react';
import { Form } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';
import type { IFormTextFieldProps } from '../../types/FormFieldGroup/interface';

export const FormTextField: React.FC<IFormTextFieldProps> = ({
  name,
  label,
  required,
  helpText,
  error,
  touched,
  type = 'text',
  placeholder,
  value,
  onChange,
}) => {
  return (
    <FormFieldGroup
      name={name}
      label={label}
      required={required}
      helpText={helpText}
      error={error}
      touched={touched}
    >
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        isInvalid={touched && !!error}
      />
    </FormFieldGroup>
  );
};
