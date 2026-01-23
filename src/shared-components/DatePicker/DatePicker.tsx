/**
 * DatePicker component - A wrapper around MUI DatePicker with custom styling
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
  DatePicker as MuiDatePicker,
  DatePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import commonStyles from './DatePicker.module.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

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
 * DatePicker wrapper component that integrates MUI DatePicker with react-bootstrap styling.
 *
 * This component provides a standardized date picker interface that maintains consistency
 * across the application by using react-bootstrap Form.Control for styling.
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
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  className,
  'data-testid': dataTestId,
  'data-cy': dataCy,
  slotProps,
  slots: customSlots,
  format,
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
        <MuiDatePicker
          format={format}
          // Normalize undefined to null to prevent controlled/uncontrolled warnings
          value={value === undefined ? null : value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className={commonStyles.fullWidth} // Applied directly to component, className prop moved to wrapper div
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
                  <FormFieldGroup
                    {...inputProps}
                    {...other}
                    id={dataTestId} // Link label to input
                    ref={ref}
                    required={props.required}
                    disabled={props.disabled}
                    data-testid={dataTestId}
                    data-cy={dataCy}
                    className={`${commonStyles.fullWidth} ${textFieldClassName || ''} ${InputProps?.endAdornment ? commonStyles.paddedInput : ''}`.trim()}
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

export default DatePicker;

/**
 * Re-exported MUI date picker LocalizationProvider for test utilities and localization support.
 * Allows tests and other modules to import MUI date picker localization without direct \@mui dependencies.
 * Requires \@mui/x-date-pickers to be installed.
 */
export { LocalizationProvider } from '@mui/x-date-pickers';

/**
 * Re-exported MUI date picker AdapterDayjs for Day.js integration.
 * Provides Day.js adapter for MUI date pickers. Requires both \@mui/x-date-pickers and dayjs to be installed and configured.
 */
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
