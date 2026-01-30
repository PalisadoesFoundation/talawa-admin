import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
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
  startAdornment,
  endAdornment,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  'data-testid': dataTestId,
  ...props
}) => {
  const isInvalid = touched && !!error;

  const renderControl = () => (
    <Form.Control
      {...(props.as !== 'textarea' && { type })}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      isInvalid={isInvalid}
      disabled={disabled}
      data-testid={dataTestId}
      {...props}
    />
  );
  return (
    <FormFieldGroup
      name={name}
      label={label}
      required={required}
      helpText={helpText}
      error={error}
      touched={touched}
    >
      {startAdornment || endAdornment ? (
        <React.Fragment>
          <InputGroup>
            {startAdornment}
            {renderControl()}
            {endAdornment}
          </InputGroup>
          {/*
              Bootstraps Form.Control inside InputGroup doesn't show standard validation feedback automatically
              in the same way or position, but FormFieldGroup handles error text display below the child.
              However, Form.Control.isInvalid handles the red border.
           */}
        </React.Fragment>
      ) : (
        renderControl()
      )}
    </FormFieldGroup>
  );
};
