import React from 'react';

// MUI Date Picker Mock Interfaces - needed for date picker compatibility
interface IDatePickerProps {
  value?: IMockDate | string | null;
  onChange?: (value: IMockDate | null) => void;
  'data-testid'?: string;
  id?: string;
  [key: string]: unknown;
}

interface IMockDate {
  toISOString: () => string;
  format: (format: string) => string;
  toString: () => string;
  valueOf: () => number;
}

interface IPickerProps {
  value?: IMockDate | string | null;
  onChange?: (value: string) => void;
  [key: string]: unknown;
}

// DatePicker Component
export const DatePickerComponent = ({
  value,
  onChange,
  'data-testid': testId,
  ...props
}: IDatePickerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (onChange) {
      // Some components expect a date object with format method, others expect string
      if (dateValue) {
        const dateObj: IMockDate = {
          toISOString: () => new Date(dateValue).toISOString(),
          format: (format: string) => {
            const date = new Date(dateValue);
            if (format === 'YYYY-MM-DD') return dateValue;
            if (format === 'HH:mm') return date.toTimeString().slice(0, 5);
            if (format === 'YYYY-MM-DDTHH:mm')
              return date.toISOString().slice(0, 16);
            return dateValue;
          },
          toString: () => dateValue,
          valueOf: () => new Date(dateValue).valueOf(),
        };
        onChange(dateObj);
      } else {
        onChange(null);
      }
    }
  };

  return React.createElement('input', {
    type: 'date',
    value: (value as IMockDate)?.format?.('YYYY-MM-DD') || value || '',
    onChange: handleChange,
    'data-testid': testId || 'birth-date-input',
    id: props.id || 'birthDate',
    ...props,
  });
};

// TimePicker Component
export const TimePickerComponent = ({
  value,
  onChange,
  ...props
}: IPickerProps) =>
  React.createElement('input', {
    type: 'time',
    value: (value as IMockDate)?.format?.('HH:mm') || value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.(e.target.value),
    ...props,
  });

// DateTimePicker Component
export const DateTimePickerComponent = ({
  value,
  onChange,
  ...props
}: IPickerProps) =>
  React.createElement('input', {
    type: 'datetime-local',
    value: (value as IMockDate)?.format?.('YYYY-MM-DDTHH:mm') || value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange?.(e.target.value),
    ...props,
  });

// LocalizationProvider Component
export const LocalizationProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => children;
