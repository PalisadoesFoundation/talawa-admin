import React from 'react';
import { FormFieldGroup } from './FormFieldGroup';
import type { InterfaceFormSelectFieldProps } from '../../types/shared-components/FormFieldGroup/interface';

/**
 * Renders a select input field within a FormFieldGroup for consistent styling and validation.
 *
 * @returns A select field React element.
 */
export const FormSelectField: React.FC<InterfaceFormSelectFieldProps> = ({
  name,
  label,
  required,
  helpText,
  error,
  touched,
  className,
  value,
  onChange,
  children,
  'data-testid': dataTestId,
}) => {
  const isInvalid = touched && !!error;

  return (
    <FormFieldGroup
      name={name}
      label={label}
      required={required}
      helpText={helpText}
      error={error}
      touched={touched}
      className={className}
    >
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        required={required}
        aria-required={required ? 'true' : undefined}
        data-testid={dataTestId}
        className="form-input"
        style={isInvalid ? { borderColor: 'var(--red-500, #ef4444)' } : undefined}
      >
        {children}
      </select>
    </FormFieldGroup>
  );
};
