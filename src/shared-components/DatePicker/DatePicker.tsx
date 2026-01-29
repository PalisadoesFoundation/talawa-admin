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
  DatePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import { FormFieldGroup } from '../FormFieldGroup/FormFieldGroup';
import styles from './DatePicker.module.css';

/**
 * Component Props for DatePicker
 */
interface InterfaceDatePickerProps {
  /** Unique name identifier for the field */
  name?: string;
  /** Label displayed for the date picker */
  label?: string;
  /**
   * Current date value.
   * Represented as a Dayjs object or null if no date is selected.
   */
  value?: Dayjs | null;
  /**
   * Callback fired when the date changes.
   * @param date - The new date value.
   */
  onChange: (date: Dayjs | null) => void;
  /**
   * Callback fired when the field is blurred (for touch tracking)
   */
  onBlur?: () => void;
  /** Minimum selectable date constraint */
  minDate?: Dayjs;
  /** Maximum selectable date constraint */
  maxDate?: Dayjs;
  /** Whether the date picker is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display when validation fails */
  error?: string;
  /** Whether the field has been touched (for validation UX) */
  touched?: boolean;
  /** Additional help text displayed below the field */
  helpText?: string;
  /** Additional CSS class name to be applied to the root element */
  className?: string;
  /** Test ID for testing purposes, applied to the underlying input */
  'data-testid'?: string;
  /** Test ID for Cypress testing purposes */
  'data-cy'?: string;
  /** Additional props passed to MUI DatePicker slots (e.g., actionBar, layout) */
  slotProps?: Partial<DatePickerSlotProps<false>>;
  /** Custom slot component overrides (e.g., openPickerIcon, leftArrowIcon) */
  slots?: Record<string, React.ElementType>;
  /** Format of the date displayed in the input (e.g., "MM/DD/YYYY", "YYYY-MM-DD") */
  format?: string;
}

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
        error={showError ? error : undefined}
        helpText={helpText}
        className={className}
        disabled={disabled}
        inputId={inputId}
      >
        <MuiDatePicker
          format={format}
          value={value === undefined ? null : value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className={styles.fullWidth}
          enableAccessibleFieldDOMStructure={false}
          disableOpenPicker
          reduceAnimations
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
              // Handle onBlur with safe type checking
              onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                onBlur?.();
                const textFieldProps = slotProps?.textField;
                if (
                  typeof textFieldProps === 'object' &&
                  textFieldProps !== null &&
                  'onBlur' in textFieldProps &&
                  typeof (textFieldProps as { onBlur: unknown }).onBlur ===
                    'function'
                ) {
                  (
                    textFieldProps as {
                      onBlur: (ev: React.FocusEvent<HTMLInputElement>) => void;
                    }
                  ).onBlur(e);
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
                  className={`${styles.wrapper} ${textFieldClassName || ''}`.trim()}
                >
                  <input
                    {...inputProps}
                    {...other}
                    id={inputId}
                    ref={ref}
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
      </FormFieldGroup>
    </LocalizationProvider>
  );
};

export default DatePicker;

export { LocalizationProvider } from '@mui/x-date-pickers';
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
