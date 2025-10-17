import dayjs, { Dayjs } from 'dayjs';
import type { InputHTMLAttributes } from 'react';

interface InterfaceMockPickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (date: Dayjs) => void;
  value?: Dayjs | null;
  label?: string;
  disabled?: boolean;
}

export const MockPicker = ({
  onChange,
  value,
  label = '',
  disabled,
  ...props
}: InterfaceMockPickerProps) => {
  const isTime = /\bTime\b/.test(label);
  const format = isTime ? 'HH:mm:ss' : 'YYYY-MM-DD';
  const dataTestId = isTime ? `time-picker-${label}` : `date-picker-${label}`;

  return (
    <div>
      <label>{label}</label>
      <input
        {...props}
        type="text"
        data-testid={dataTestId}
        value={value ? dayjs(value).format(format) : ''}
        disabled={disabled}
        onChange={(e) => {
          const parsed = isTime
            ? dayjs(e.target.value, 'HH:mm:ss')
            : dayjs(e.target.value);
          if (onChange && parsed.isValid()) {
            onChange(parsed);
          }
        }}
      />
    </div>
  );
};
