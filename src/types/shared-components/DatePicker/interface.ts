import type { Dayjs } from 'dayjs';
import { DatePickerSlotProps } from '@mui/x-date-pickers';

/**
 * Component Props for DatePicker
 */
export interface InterfaceDatePickerProps {
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
