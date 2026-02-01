/**
 * DatePicker component - A wrapper around MUI DatePicker with FormFieldGroup integration
 *
 * @remarks
 * Note: This component sets enableAccessibleFieldDOMStructure=\{false\}
 * to maintain compatibility with custom input styling.
 * This disables MUI's accessible field structure. The tradeoff is acceptable
 * because we provide:
 * - Custom label element with htmlFor association
 * - aria-label on the input field via slotProps
 * - Proper keyboard navigation support
 * - Screen reader compatibility through ARIA attributes
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
import type { Dayjs } from 'dayjs';
import styles from './DatePicker.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFieldGroup } from '../FormFieldGroup/FormFieldGroup';
import styles from './DatePicker.module.css';
import { InterfaceDatePickerProps } from 'types/shared-components/DatePicker/interface';

/**
 * Component Props for DatePicker
 */
interface InterfaceDatePickerProps {
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
  /** Minimum selectable date constraint */
  minDate?: Dayjs;
  /** Maximum selectable date constraint */
  maxDate?: Dayjs;
  /** Whether the date picker is disabled */
  disabled?: boolean;
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

/**
 * DatePicker wrapper component that integrates MUI DatePicker with custom styling.
 *
 * This component provides a standardized date picker interface that maintains consistency
 * across the application using design tokens for styling.
 *
 * @param props - The component props.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Select Date"
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   minDate={dayjs()}
 * />
 * ```
 */
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
      <div className={className}>
        {label && (
          <label
            htmlFor={dataTestId}
            className={`form-label ${disabled ? 'text-muted' : ''} ${styles.pickerLabel}`}
          >
            {label}
          </label>
        )}
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
        <MuiDatePicker
          format={format}
          value={value === undefined ? null : value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className={styles.fullWidth} // Applied directly to component, className prop moved to wrapper div
          // Disabled to maintain compatibility with custom textField slot
          // MUI's accessible field structure conflicts with our custom input styling
          className={styles.fullWidth}
          enableAccessibleFieldDOMStructure={false}
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
                  className={`${styles.pickerInputContainer} ${textFieldClassName || ''}`.trim()}
                  className={`${styles.wrapper} ${textFieldClassName || ''}`.trim()}
                >
                  <input
                    {...inputProps}
                    {...other}
                    id={dataTestId}
                    ref={ref as React.Ref<HTMLInputElement>}
                    required={props.required}
                    disabled={props.disabled}
                    data-testid={dataTestId}
                    data-cy={dataCy}
                    className={styles.pickerInput}
                  />
                  {InputProps?.endAdornment && (
                    <div className={styles.pickerIconButton}>
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
      </FormFieldGroup>
    </LocalizationProvider>
  );
};

export default DatePicker;

export { LocalizationProvider } from '@mui/x-date-pickers';
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
