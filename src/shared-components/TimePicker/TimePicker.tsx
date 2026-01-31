import React from 'react';
import {
  TimePicker as MuiTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import styles from './TimePicker.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFieldGroup } from '../FormFieldGroup/FormFieldGroup';

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
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        <FormFieldGroup
          label={label || ''}
          name="time-picker"
          disabled={disabled}
          inputId={dataTestId || 'time-picker'}
        >
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
                    <input
                      {...inputProps}
                      {...other}
                      id={dataTestId}
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
