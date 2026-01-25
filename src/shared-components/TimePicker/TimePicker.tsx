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
import { Form } from 'react-bootstrap';
import React from 'react';
import {
  TimePicker as MuiTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import commonStyles from './TimePicker.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InterfaceTimePickerProps } from 'types/shared-components/TimePicker/interface';
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
  const generatedId = React.useId();
  const inputId = dataTestId ?? generatedId;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
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
                  className={`${commonStyles.fullWidth} ${textFieldClassName || ''} d-flex position-relative`.trim()}
                >
                  <Form.Control
                    {...inputProps}
                    {...other}
                    id={inputId}
                    ref={ref}
                    disabled={disabled}
                    required={props.required}
                    data-testid={dataTestId}
                    className={`${commonStyles.fullWidth} form-control ${
                      InputProps?.endAdornment ? commonStyles.paddedInput : ''
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

export type { TimePickerSlotProps } from '@mui/x-date-pickers';
export default TimePicker;
