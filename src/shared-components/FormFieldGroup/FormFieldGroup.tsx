import React from 'react';
import { useTranslation } from 'react-i18next';
import type { InterfaceFormFieldGroupProps } from '../../types/FormFieldGroup/interface';
import styles from './FormFieldGroup.module.css';

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
          <label htmlFor={effectiveInputId} className={styles.srOnly}>
            {label}
            {required && <span aria-label={tCommon('required')}>*</span>}
          </label>
        )}
        {children}
        {showError && <div className={styles.errorText}>{error}</div>}
      </>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={effectiveInputId}
        className={
          `${labelClassName || ''} ${
            hideLabel ? styles.srOnly : disabled ? styles.disabledLabel : ''
          }`.trim() || undefined
        }
      >
        {label}
        {required && <span aria-label={tCommon('required')}> *</span>}
      </label>

      {children}

      {helpText && !showError && (
        <small id={`${effectiveInputId}-help`} className={styles.helpText}>
          {helpText}
        </small>
      )}

      {showError && (
        <div id={`${effectiveInputId}-error`} className={styles.errorText}>
          {error}
        </div>
      )}
    </div>
  );
};

export * from './FormTextField';
export * from './FormSelectField';
