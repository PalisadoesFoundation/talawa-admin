import React from 'react';
import { FormFieldGroup } from './FormFieldGroup';
import type { IFormTextFieldProps } from '../../types/FormFieldGroup/interface';
import styles from './FormFieldGroup.module.css';

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
  hideLabel,
  className,
  'data-testid': dataTestId,
  ...props
}) => {
  const isInvalid = touched && !!error;

  const renderControl = () => {
    if (props.as === 'textarea') {
      return (
        <textarea
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
          disabled={disabled}
          data-testid={dataTestId}
          className={`form-input ${isInvalid ? styles.inputError : ''}`.trim()}
        />
      );
    }
    return (
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        disabled={disabled}
        data-testid={dataTestId}
        className={`form-input ${isInvalid ? styles.inputError : ''}`.trim()}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  };

  return (
    <FormFieldGroup
      name={name}
      label={label}
      required={required}
      helpText={helpText}
      error={error}
      touched={touched}
      hideLabel={hideLabel}
      className={className}
    >
      {startAdornment || endAdornment ? (
        <div className={styles.adornmentGroup}>
          {startAdornment}
          {renderControl()}
          {endAdornment}
        </div>
      ) : (
        renderControl()
      )}
    </FormFieldGroup>
  );
};
