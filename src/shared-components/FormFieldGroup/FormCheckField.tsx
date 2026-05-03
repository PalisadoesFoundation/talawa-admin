import React from 'react';
import { FormFieldGroup } from './FormFieldGroup';
import type { InterfaceFormCheckFieldProps } from '../../types/shared-components/FormFieldGroup/interface';

/**
 * Renders a checkbox, radio, or switch input field within a FormFieldGroup for consistent styling and validation.
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
  const isInvalid = touched && !!error;

  const checkComponent = (
    <div className={className} style={inline ? { display: 'inline-block' } : undefined}>
      <input
        type={type === 'switch' ? 'checkbox' : type}
        role={type === 'switch' ? 'switch' : undefined}
        id={id || name}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        data-testid={dataTestId}
        style={isInvalid ? { borderColor: 'var(--red-500, #ef4444)' } : undefined}
        {...props}
      />
      {label && (
        <label htmlFor={id || name} style={{ marginLeft: '0.5rem' }}>
          {label}
        </label>
      )}
    </div>
  );

  if (inline) {
    return checkComponent;
  }

  return (
    <FormFieldGroup
      name={name}
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
