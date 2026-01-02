/**
 * DateRangePicker types
 */

export type DateOrNull = Date | null;

/**
 * IDateRangeValue
 * Represents a start and end date.
 */
export interface IDateRangeValue {
  startDate: DateOrNull;
  endDate: DateOrNull;
}

/**
 * IDateRangePreset
 * Configuration for a preset date range.
 */
export interface IDateRangePreset {
  key: string;
  label: string;
  getRange: (refDate?: Date) => IDateRangeValue;
}

/**
 * InterfaceDateRangePickerProps
 * Controlled props for DateRangePicker.
 */
export interface InterfaceDateRangePickerProps {
  value: IDateRangeValue;
  onChange: (val: IDateRangeValue) => void;
  presets?: IDateRangePreset[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
  dataTestId?: string;
  showPresets?: boolean;
}
