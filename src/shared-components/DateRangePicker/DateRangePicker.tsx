/**
 * DateRangePicker
 *
 * A reusable, controlled component that provides unified date range selection
 * across the Talawa Admin application.
 *
 * @component
 *
 * @param {InterfaceDateRangePickerProps} props - Component props
 * @param {IDateRangeValue} props.value - Controlled value containing startDate and endDate
 * @param {(val: IDateRangeValue) => void} props.onChange - Callback fired when the date range changes
 * @param {IDateRangePreset[]} [props.presets] - Optional preset configurations
 * @param {boolean} [props.disabled=false] - Disables all interactions
 * @param {boolean} [props.error=false] - Displays error styling
 * @param {string} [props.helperText] - Helper or validation text
 * @param {string} [props.className] - Optional className for root container
 * @param {string} [props.dataTestId='date-range-picker'] - Base test id
 * @param {boolean} [props.showPresets=true] - Controls preset visibility
 *
 * @returns {JSX.Element} DateRangePicker component
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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      <Form.Group>
        <Row className={styles.controlsRow}>
          <Col xs={12} sm={6}>
            <Form.Label>{t('startDate')}</Form.Label>
            <DatePicker
              value={startDayjs}
              onChange={handleStartChange}
              disabled={disabled}
              slots={{
                textField: (props) => (
                  <Form.Control
                    {...props.inputProps}
                    ref={props.ref}
                    disabled={props.disabled}
                    required={props.required}
                    aria-label={t('startDate')}
                    data-testid={`${dataTestId}-start-input`}
                  />
                ),
              }}
            />
          </Col>

          <Col xs={12} sm={6}>
            <Form.Label>{t('endDate')}</Form.Label>
            <DatePicker
              value={endDayjs}
              onChange={handleEndChange}
              disabled={disabled}
              minDate={
                normalizedStartDate ? dayjs(normalizedStartDate) : undefined
              }
              slots={{
                textField: (props) => (
                  <Form.Control
                    {...props.inputProps}
                    ref={props.ref}
                    disabled={props.disabled}
                    required={props.required}
                    aria-label={t('endDate')}
                    data-testid={`${dataTestId}-end-input`}
                  />
                ),
              }}
            />
          </Col>
        </Row>

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

        {helperText && (
          <Form.Text
            className={error ? 'text-danger' : undefined}
            data-testid={`${dataTestId}-helper`}
          >
            {helperText}
          </Form.Text>
        )}
      </Form.Group>
    </div>
  );
}
