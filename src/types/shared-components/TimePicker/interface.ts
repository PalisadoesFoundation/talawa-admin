import type { Dayjs } from 'dayjs';
import { TimePickerSlotProps } from '@mui/x-date-pickers';

/**
 * Component Props for TimePicker
 */
export interface InterfaceTimePickerProps {
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
