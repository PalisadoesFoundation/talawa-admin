import React from 'react';
import { Form } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';
import type { IFormSelectFieldProps } from '../../types/FormFieldGroup/interface';

/**
 * Renders a select input field within a FormFieldGroup for consistent styling and validation.
 *
 * @param props - The properties for the FormSelectField component.
 * @returns A select field React element.
 */
export const FormSelectField: React.FC<IFormSelectFieldProps> = ({
  name,
  label,
  required,
  helpText,
  error,
  touched,
  value,
  onChange,
  children,
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
        as="select"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        isInvalid={touched && !!error}
      >
        {children}
      </Form.Control>
    </FormFieldGroup>
  );
};
