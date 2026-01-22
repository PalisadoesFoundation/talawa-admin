import React from 'react';
import { Form } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';
import type { InterfaceFormSelectFieldProps } from '../../types/shared-components/FormFieldGroup/interface';

/**
 * Renders a select input field within a FormFieldGroup for consistent styling and validation.
 *
 * `@param` name - Field name/id.
 * `@param` label - Field label text.
 * `@param` required - Whether the field is required.
 * `@param` helpText - Helper text below the field.
 * `@param` error - Validation error message.
 * `@param` touched - Whether the field has been touched.
 * `@param` value - Current selected value.
 * `@param` onChange - Value change handler.
 * `@param` children - Option elements.
 * @returns A select field React element.
 */
export const FormSelectField: React.FC<InterfaceFormSelectFieldProps> = ({
  name,
  label,
  required,
  helpText,
  error,
  touched,
  value,
  onChange,
  children,
  'data-testid': dataTestId,
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
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        isInvalid={touched && !!error}
        required={required}
        aria-required={required ? 'true' : undefined}
        data-testid={dataTestId}
      >
        {children}
      </Form.Control>
    </FormFieldGroup>
  );
};
