/**
 * DateRangePicker shared types
 *
 * @remarks
 * All date values are local `Date` objects.
 * Timezone conversion and serialization (ISO strings, server formats)
 * must be handled by GraphQL middleware or API adapters.
 *
 * @example
 * ```tsx
 * const [range, setRange] = useState<IDateRangeValue>({
 *   startDate: null,
 *   endDate: null,
 * });
 *
 * <DateRangePicker value={range} onChange={setRange} />
 * ```
 */

export type DateOrNull = Date | null;

/**
 * IDateRangeValue
 *
 * Represents a controlled date range.
 */
export interface IDateRangeValue {
  startDate: DateOrNull;
  endDate: DateOrNull;
}

/**
 * IDateRangePreset
 *
 * Configuration for a preset date range button.
 *
 * @param refDate - Optional reference date for relative presets.
 * Defaults to the current date if not provided.
 *
 * @example
 * ```ts
 * {
 *   key: 'last7days',
 *   label: 'Last 7 Days',
 *   getRange: (refDate = new Date()) => ({
 *     startDate: dayjs(refDate).subtract(7, 'day').toDate(),
 *     endDate: refDate,
 *   }),
 * }
 * ```
 */
export interface IDateRangePreset {
  key: string;
  label: string;
  getRange: (refDate?: Date) => IDateRangeValue;
}

/**
 * InterfaceDateRangePickerProps
 *
 * Controlled props for the DateRangePicker component.
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
