/**
 * TimePicker component - A wrapper around MUI TimePicker with custom styling
 *
 * @remarks
 * Note: This component sets enableAccessibleFieldDOMStructure=\{false\}
 * to maintain compatibility with react-bootstrap Form.Control styling.
 * This disables MUI's accessible field structure. The tradeoff is acceptable
 * because we provide:
 * - Custom label element with htmlFor association
 * - aria-label on the input field via slotProps
 * - Proper keyboard navigation support
 * - Screen reader compatibility through ARIA attributes
 */
import React from 'react';
import {
  TimePicker as MuiTimePicker,
  TimePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import styles from './TimePicker.module.css';
import commonStyles from '../SharedPicker.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
/**
 * Component Props for TimePicker
 */
interface InterfaceTimePickerProps {
  /** Label displayed for the time picker */
  label?: string;
  /**
   * Current time value.
   * Represented as a Dayjs object or null if no time is selected.
   */
  value?: Dayjs | null;
  /**
   * Callback fired when the time changes.
   * @param date - The new time value.
   */
  onChange: (date: Dayjs | null) => void;
  /** Minimum selectable time constraint */
  minTime?: Dayjs;
  /** Maximum selectable time constraint */
  maxTime?: Dayjs;
  /** Whether the time picker is disabled */
  disabled?: boolean;
  /** Additional CSS class name to be applied to the root element */
  className?: string;
  /** Test ID for testing purposes, applied to the underlying input */
  'data-testid'?: string;
  /** Additional props passed to MUI TimePicker slots (e.g., actionBar, layout) */
  slotProps?: Partial<TimePickerSlotProps<false>>;
  /** Custom slot component overrides (e.g., openPickerIcon, leftArrowIcon) */
  slots?: Record<string, React.ElementType>;
  /** Step increments for time controls (hours, minutes, seconds) */
  timeSteps?: { hours?: number; minutes?: number; seconds?: number };
  /** Whether to disable the open picker button */
  disableOpenPicker?: boolean;
}

/**
 * TimePicker wrapper component that integrates MUI TimePicker with react-bootstrap styling.
 *
 * This component provides a standardized time picker interface that maintains consistency
 * across the application by using react-bootstrap Form.Control for styling.
 *
 * @param props - The component props.
 *
 * @example
 * ```tsx
 * <TimePicker
 *   label="Select Time"
 *   value={selectedTime}
 *   onChange={setSelectedTime}
 *   timeSteps={{ minutes: 15 }}
 * />
 * ```
 */
const TimePicker: React.FC<InterfaceTimePickerProps> = ({
  label,
  value,
  onChange,
  minTime,
  maxTime,
  disabled,
  className,
  'data-testid': dataTestId,
  slotProps,
  slots: customSlots,
  timeSteps,
  disableOpenPicker,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        {label && (
          <label
            htmlFor={dataTestId}
            className={`form-label ${disabled ? 'text-muted' : ''} ${commonStyles.pickerLabel}`}
          >
            {label}
          </label>
        )}
        <MuiTimePicker
          // Normalize undefined to null to prevent controlled/uncontrolled warnings
          value={value === undefined ? null : value}
          onChange={onChange}
          minTime={minTime}
          maxTime={maxTime}
          disabled={disabled}
          className={commonStyles.fullWidth} // Applied directly to component
          timeSteps={timeSteps}
          disableOpenPicker={disableOpenPicker}
          // Disabled to maintain compatibility with custom Form.Control slot
          // MUI's accessible field structure conflicts with our react-bootstrap integration
          enableAccessibleFieldDOMStructure={false}
          slotProps={slotProps}
          data-testid={dataTestId}
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
                  className={`${styles.fullWidth} ${textFieldClassName || ''} d-flex position-relative`.trim()}
                >
                  <FormTextField
                    {...inputProps}
                    {...other}
                    id={dataTestId} // Link label to input
                    ref={ref}
                    disabled={disabled}
                    required={props.required}
                    data-testid={dataTestId}
                    className={`${commonStyles.fullWidth} form-control ${
                      InputProps?.endAdornment ? styles.paddedInput : ''
                    }`.trim()}
                  />
                  {InputProps?.endAdornment && (
                    <div className="position-absolute end-0 top-50 translate-middle-y pe-2">
                      {InputProps.endAdornment}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default TimePicker;
