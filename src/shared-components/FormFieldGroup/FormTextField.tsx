import React from 'react';
import { Form } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';
import type { IFormTextFieldProps } from '../../types/FormFieldGroup/interface';

/**
 * Renders a text input field within a FormFieldGroup for consistent styling and validation.
 *
 * @param props - The properties for the FormTextField component.
 * @returns A text field React element.
 */
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
