import React from 'react';
import {
  TimePicker as MuiTimePicker,
  TimePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { FormControl } from 'react-bootstrap';
import type { Dayjs } from 'dayjs';
import styles from './TimePicker.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFieldGroup } from '../FormFieldGroup/FormFieldGroup';

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
        <FormFieldGroup label={label || ''} name="time-picker">
          <MuiTimePicker
            value={value === undefined ? null : value}
            onChange={onChange}
            minTime={minTime}
            maxTime={maxTime}
            disabled={disabled}
            className={styles.fullWidth}
            timeSteps={timeSteps}
            disableOpenPicker={disableOpenPicker}
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
                    <FormControl
                      {...inputProps}
                      {...other}
                      id={dataTestId}
                      ref={ref}
                      disabled={disabled}
                      required={props.required}
                      data-testid={dataTestId}
                      className={`${styles.fullWidth} form-control ${
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
        </FormFieldGroup>
      </div>
    </LocalizationProvider>
  );
};

export default TimePicker;
