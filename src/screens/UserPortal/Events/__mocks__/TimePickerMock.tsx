import React from 'react';
import dayjs from 'dayjs';

type Props = {
  label?: string;
  value?: { format?: (fmt: string) => string } | null;
  onChange?: (v: unknown) => void;
  'data-testid'?: string;
  disabled?: boolean;
};

export default function TimePickerMock({
  label,
  value,
  onChange,
  'data-testid': dataTestId,
  disabled,
}: Props) {
  return (
    <input
      aria-label={label}
      data-testid={dataTestId || label}
      value={value?.format ? value.format('HH:mm:ss') : ''}
      disabled={disabled}
      onChange={(e) => {
        const parsed = dayjs(e.target.value, ['HH:mm:ss', 'hh:mm A']);
        onChange?.(parsed);
      }}
    />
  );
}
