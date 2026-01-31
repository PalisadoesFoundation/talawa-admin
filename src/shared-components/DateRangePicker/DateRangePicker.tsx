/**
 * DateRangePicker
 *
 * A reusable, controlled component that provides unified date range selection
 * across the Talawa Admin application.
 *
 * @param props - Component props
 *
 * @returns DateRangePicker component
 *
 * @remarks
 * - Fully controlled component
 * - End date auto-adjusts if start date exceeds it
 * - End date enforces minDate = start date
 * - Timezone handling is deferred to API/middleware
 *
 * @example
 * ```tsx
 * <DateRangePicker value={range} onChange={setRange} />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import DatePicker from 'shared-components/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

import type {
  InterfaceDateRangePickerProps,
  IDateRangeValue,
  IDateRangePreset,
} from 'types/shared-components/DateRangePicker/interface';

import styles from './DateRangePicker.module.css';

function isDayjsLike(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  );
}

function normalizeToDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (isDayjsLike(value)) {
    const d = value.toDate();
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function toDayjs(value: Date | null): Dayjs | null {
  return value ? dayjs(value) : null;
}

function normalizeRange(partial: Partial<IDateRangeValue>): IDateRangeValue {
  return {
    startDate: partial.startDate ?? null,
    endDate: partial.endDate ?? null,
  };
}

export default function DateRangePicker({
  value,
  onChange,
  presets,
  disabled = false,
  error = false,
  helperText,
  className,
  dataTestId = 'date-range-picker',
  showPresets,
}: InterfaceDateRangePickerProps) {
  const { t } = useTranslation('common');

  const normalizedStartDate = normalizeToDate(value.startDate);
  const normalizedEndDate = normalizeToDate(value.endDate);

  const startDayjs = toDayjs(normalizedStartDate);
  const endDayjs = toDayjs(normalizedEndDate);

  const activePresetKey = useMemo(() => {
    if (!presets) return undefined;

    return presets.find((preset) => {
      const range = preset.getRange();
      return (
        range.startDate?.toDateString() === value.startDate?.toDateString() &&
        range.endDate?.toDateString() === value.endDate?.toDateString()
      );
    })?.key;
  }, [presets, value.startDate, value.endDate]);

  const handleStartChange = useCallback(
    (input: unknown) => {
      if (disabled) return;

      const nextStart = normalizeToDate(input);
      const currentEnd = normalizeToDate(value.endDate);

      if (!nextStart) return;

      if (currentEnd && nextStart > currentEnd) {
        onChange({ startDate: nextStart, endDate: nextStart });
        return;
      }

      onChange(
        normalizeRange({
          startDate: nextStart,
          endDate: currentEnd,
        }),
      );
    },
    [disabled, onChange, value.endDate],
  );

  const handleEndChange = useCallback(
    (input: unknown) => {
      if (disabled) return;

      const nextEnd = normalizeToDate(input);
      const currentStart = normalizeToDate(value.startDate);

      if (!nextEnd) return;

      onChange(
        normalizeRange({
          startDate: currentStart,
          endDate: nextEnd,
        }),
      );
    },
    [disabled, onChange, value.startDate],
  );

  const handlePresetClick = useCallback(
    (preset: IDateRangePreset) => {
      if (disabled) return;
      onChange(normalizeRange(preset.getRange()));
    },
    [disabled, onChange],
  );

  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
      data-testid={dataTestId}
    >
      <div className={styles.controlsRow}>
        <FormFieldGroup label={t('startDate')} name="startDate">
          <DatePicker
            value={startDayjs}
            name="start-date"
            onChange={handleStartChange}
            disabled={disabled}
            data-testid={`${dataTestId}-start-input`}
            slotProps={{
              textField: {
                'aria-label': t('startDate'),
              },
            }}
          />
        </FormFieldGroup>

        <FormFieldGroup label={t('endDate')} name="endDate">
          <DatePicker
            value={endDayjs}
            name="end-date"
            onChange={handleEndChange}
            disabled={disabled}
            minDate={
              normalizedStartDate ? dayjs(normalizedStartDate) : undefined
            }
            data-testid={`${dataTestId}-end-input`}
            slotProps={{
              textField: {
                'aria-label': t('endDate'),
              },
            }}
          />
        </FormFieldGroup>
      </div>

      {helperText && (
        <div
          data-testid={`${dataTestId}-helper`}
          className={error ? 'text-danger' : undefined}
        >
          {helperText}
        </div>
      )}

      {presets && presets.length > 0 && showPresets !== false && (
        <div className={styles.presetRow}>
          {presets.map((preset) => {
            const isActive = preset.key === activePresetKey;

            return (
              <button
                key={preset.key}
                type="button"
                disabled={disabled}
                aria-pressed={isActive}
                data-testid={`${dataTestId}-preset-${preset.key}`}
                className={`${styles.presetButton} ${
                  isActive ? styles.presetButtonActive : ''
                }`}
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Re-exported MUI date picker LocalizationProvider for test utilities and localization support.
 * Allows tests and other modules to import MUI date picker localization without direct mui dependencies.
 * Requires mui/x-date-pickers to be installed.
 */
export { LocalizationProvider } from '@mui/x-date-pickers';

/**
 * Re-exported MUI date picker AdapterDayjs for Day.js integration.
 * Provides Day.js adapter for MUI date pickers. Requires both mui/x-date-pickers and dayjs to be installed and configured.
 */
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
