/**
 * DatePicker component - A wrapper around MUI DatePicker with FormFieldGroup integration
 *
 * @remarks
 * This component integrates MUI DatePicker with our FormFieldGroup pattern to provide:
 * - Consistent validation and error handling
 * - Proper accessibility with ARIA attributes
 * - Label and help text management
 * - Touch state tracking for validation UX
 *
 * Note: This component sets `enableAccessibleFieldDOMStructure` to false
 * to maintain compatibility with react-bootstrap styling while still
 * providing full accessibility through FormFieldGroup's ARIA support.
 */
import React, { useId } from 'react';
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFieldGroup } from '../FormFieldGroup/FormFieldGroup';
import styles from './DatePicker.module.css';
import { InterfaceDatePickerProps } from 'types/shared-components/DatePicker/interface';

const DatePicker: React.FC<InterfaceDatePickerProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  minDate,
  maxDate,
  disabled,
  required,
  error,
  touched,
  helpText,
  className,
  'data-testid': dataTestId,
  'data-cy': dataCy,
  slotProps,
  slots: customSlots,
  format = 'MM/DD/YYYY',
}) => {
  const generatedId = useId();
  const effectiveName = name || generatedId;
  const inputId = (dataTestId || `datepicker-${effectiveName}`) as string;
  const showError = touched && error;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormFieldGroup
        name={effectiveName}
        label={label || ''}
        required={required}
        // Use local showError logic to ensure error is hidden when not touched,
        // as FormFieldGroup's internal logic might differ or be bypassed in some contexts.
        error={showError ? error : undefined}
        touched={touched}
        helpText={helpText}
        className={className}
        disabled={disabled}
        inputId={inputId}
      >
        <div className={styles.datePickerContainer}>
          <MuiDatePicker
            format={format}
            value={value === undefined ? null : value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            className={styles.fullWidth}
            enableAccessibleFieldDOMStructure={false}
            reduceAnimations
            slotProps={{
              ...slotProps,
              popper: {
                ...slotProps?.popper,
                // Enforce modal positioning - these must come after spread to prevent override
                placement: 'bottom-start' as const,
                disablePortal: true,
              },
              textField:
                typeof slotProps?.textField === 'function'
                  ? slotProps.textField
                  : {
                      ...slotProps?.textField,
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                        onBlur?.();
                        const textFieldProps = slotProps?.textField;
                        if (
                          textFieldProps &&
                          typeof textFieldProps === 'object' &&
                          'onBlur' in textFieldProps &&
                          typeof textFieldProps.onBlur === 'function'
                        ) {
                          textFieldProps.onBlur(e);
                        }
                      },
                    },
            }}
            slots={{
              ...customSlots,
              textField: (props) => {
                const {
                  inputProps,
                  ref,
                  ownerState: _ownerState,
                  InputProps,
                  error: _error,
                  label: _label,
                  focused: _focused,
                  helperText: _helperText,
                  className: textFieldClassName,
                  ...other
                } = props;

                return (
                  <div
                    ref={ref}
                    className={`${styles.wrapper} ${textFieldClassName || ''}`.trim()}
                  >
                    <input
                      {...inputProps}
                      {...other}
                      id={inputId}
                      required={required}
                      disabled={disabled}
                      aria-required={required}
                      aria-invalid={showError ? 'true' : 'false'}
                      aria-describedby={
                        showError
                          ? `${inputId}-error`
                          : helpText
                            ? `${inputId}-help`
                            : undefined
                      }
                      data-testid={dataTestId}
                      data-cy={dataCy}
                      className={`form-control ${styles.fullWidth} ${textFieldClassName || ''} ${InputProps?.endAdornment ? styles.paddedInput : ''} ${showError ? 'is-invalid' : ''}`.trim()}
                    />
                    {InputProps?.endAdornment && (
                      <div
                        className={styles.adornment}
                        data-testid="datepicker-adornment"
                      >
                        {InputProps.endAdornment}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>
      </FormFieldGroup>
    </LocalizationProvider>
  );
};

export default DatePicker;

export { LocalizationProvider } from '@mui/x-date-pickers';
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
