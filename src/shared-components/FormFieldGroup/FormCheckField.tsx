import React from 'react';
import { Form } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';
import type { InterfaceFormCheckFieldProps } from '../../types/shared-components/FormFieldGroup/interface';

/**
 * Renders a checkbox, radio, or switch input field within a FormFieldGroup for consistent styling and validation.
 * Use this component to wrap Form.Check and Form.Switch elements.
 *
 * @param props - The properties for the FormCheckField component.
 * @returns A form check React element.
 */
export const FormCheckField: React.FC<InterfaceFormCheckFieldProps> = ({
  name,
  label,
  type = 'checkbox',
  id,
  checked,
  onChange,
  disabled,
  inline,
  className,
  'data-testid': dataTestId,
  // FormFieldGroup props
  required,
  helpText,
  error,
  touched,
  ...props
}) => {
  // If it's a switch, we use Form.Switch, otherwise Form.Check
  // Note: Form.Switch is essentially a styled Form.Check in newer Bootstrap versions,
  // but we'll use the specific component if type is switch for clarity if needed,
  // or just pass type="switch" to Form.Check which is standard React-Bootstrap.
  // React-Bootstrap documentation suggests using Form.Check with type="switch".

  const checkComponent = (
    <Form.Check
      type={type}
      id={id || name}
      label={label}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      inline={inline}
      className={className}
      isInvalid={touched && !!error}
      data-testid={dataTestId}
      {...props}
    />
  );

  if (inline) {
    return checkComponent;
  }

  return (
    <FormFieldGroup
      name={name}
      // Form.Check renders its own visible label inline so the group label is intentionally left empty
      // to avoid duplicate labels. FormFieldGroup still supplies field-level help/error,
      // but the visible label is provided by the check input for accessibility.
      label=""
      required={required}
      helpText={helpText}
      error={error}
      touched={touched}
    >
      {checkComponent}
    </FormFieldGroup>
  );
};
