/**
 * DatePicker component - A wrapper around MUI DatePicker with FormFieldGroup integration
 *
 * @remarks
 * Note: This component sets enableAccessibleFieldDOMStructure={false}
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFieldGroup } from '../FormFieldGroup/FormFieldGroup';
import styles from './DatePicker.module.css';
import { InterfaceDatePickerProps } from 'types/shared-components/DatePicker/interface';

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
      <FormFieldGroup
        name={effectiveName}
        label={label || ''}
        required={required}
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
          className={styles.fullWidth}
          enableAccessibleFieldDOMStructure={false}
          reduceAnimations
          slotProps={{
            ...slotProps,
            textField: {
              ...slotProps?.textField,
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
                >
                  <input
                    {...inputProps}
                    {...other}
                    id={inputId}
                    ref={ref as React.Ref<HTMLInputElement>}
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
                    className={`${styles.pickerInput} ${showError ? 'is-invalid' : ''}`.trim()}
                  />
                  {InputProps?.endAdornment && (
                    <div className={styles.pickerIconButton}>
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
