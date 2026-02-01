import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { InterfaceFormFieldGroupProps } from '../../types/FormFieldGroup/interface';

/**
 * Renders a grouped form field with label, help text, error, and children elements.
 *
 * @param props - The properties for the FormFieldGroup component.
 * @returns A form group React element.
 */
export const FormFieldGroup: React.FC<
  InterfaceFormFieldGroupProps & { children: React.ReactNode }
> = ({
  name,
  label,
  required,
  helpText,
  error,
  touched,
  children,
  labelClassName,
  inline,
  hideLabel,
  className,
  disabled,
  inputId,
}) => {
  const { t: tCommon } = useTranslation('common');
  const showError = touched && !!error;
  const effectiveInputId = inputId || name;

  if (inline) {
    return (
      <>
        {label && !hideLabel && (
          <Form.Label htmlFor={effectiveInputId} className="visually-hidden">
            {label}
            {required && <span aria-label={tCommon('required')}>*</span>}
          </Form.Label>
        )}
        {children}
        {showError && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {error}
          </Form.Control.Feedback>
        )}
      </>
    );
  }

  return (
    <Form.Group controlId={effectiveInputId} className={className}>
      <Form.Label
        htmlFor={effectiveInputId}
        className={`${hideLabel ? 'visually-hidden' : ''} ${disabled ? 'text-muted' : ''} ${labelClassName || ''}`.trim()}
      >
        {label}
        {required && <span aria-label={tCommon('required')}> *</span>}
      </Form.Label>

      {children}

      {helpText && !showError && (
        <Form.Text id={`${effectiveInputId}-help`} className="text-muted">
          {helpText}
        </Form.Text>
      )}

      {showError && (
        <Form.Control.Feedback
          id={`${effectiveInputId}-error`}
          type="invalid"
          className="d-block"
        >
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export * from './FormTextField';
export * from './FormSelectField';
