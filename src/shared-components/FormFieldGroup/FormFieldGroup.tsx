import React from 'react';
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
          <label
            htmlFor={effectiveInputId}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              borderWidth: 0,
            }}
          >
            {label}
            {required && <span aria-label={tCommon('required')}>*</span>}
          </label>
        )}
        {children}
        {showError && (
          <div
            style={{
              display: 'block',
              color: 'var(--red-500, #ef4444)',
              fontSize: '0.875em',
              marginTop: '0.25rem',
            }}
          >
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={effectiveInputId}
        className={labelClassName || undefined}
        style={
          hideLabel
            ? {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                borderWidth: 0,
              }
            : disabled
              ? { opacity: 0.5 }
              : undefined
        }
      >
        {label}
        {required && <span aria-label={tCommon('required')}> *</span>}
      </label>

      {children}

      {helpText && !showError && (
        <small
          id={`${effectiveInputId}-help`}
          style={{ color: 'var(--gray-500, #6b7280)' }}
        >
          {helpText}
        </small>
      )}

      {showError && (
        <div
          id={`${effectiveInputId}-error`}
          style={{
            display: 'block',
            color: 'var(--red-500, #ef4444)',
            fontSize: '0.875em',
            marginTop: '0.25rem',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export * from './FormTextField';
export * from './FormSelectField';
