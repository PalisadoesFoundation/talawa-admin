/**
 * @description Mock component for DatePicker used in testing the Events screen.
 * Parses date input using dayjs and forwards parsed values via onChange callback.
 */

import React from 'react';
import dayjs from 'dayjs';

type Props = {
  label?: string;
  value?: { format?: (fmt: string) => string } | null;
  onChange?: (v: unknown) => void;
  'data-testid'?: string;
};

export default function DatePickerMock({
  label,
  value,
  onChange,
  'data-testid': dataTestId,
}: Props) {
  return (
    <input
      aria-label={label}
      data-testid={dataTestId || label}
      value={value?.format ? value.format('MM/DD/YYYY') : ''}
      onChange={(e) => {
        const parsed = dayjs(e.target.value, ['MM/DD/YYYY', 'YYYY-MM-DD']);
        onChange?.(parsed);
      }}
    />
  );
}
