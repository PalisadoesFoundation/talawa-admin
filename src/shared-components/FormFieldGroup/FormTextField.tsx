import React, { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';
import type { IFormTextFieldProps } from '../../types/FormFieldGroup/interface';

/**
 * Renders a text input field within a FormFieldGroup for consistent styling and validation.
 *
 * @param props - The properties for the FormTextField component.
 * @returns A text field React element.
 */
export const FormTextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  IFormTextFieldProps
>(
  (
    {
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
    },
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const isInvalid = touched && !!error;

    const renderControl = () => (
      <Form.Control
        ref={ref as any}
        {...(props.as !== 'textarea' && { type })}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        isInvalid={isInvalid}
        disabled={disabled}
        data-testid={dataTestId}
        {...(props as any)}
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
              {startAdornment as any}
              {renderControl()}
              {endAdornment as any}
            </InputGroup>
          </React.Fragment>
        ) : (
          renderControl()
        )}
      </FormFieldGroup>
    );
  },
);

FormTextField.displayName = 'FormTextField';

export default FormTextField;
