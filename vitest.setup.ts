import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import dayjs from 'dayjs';

// Basic cleanup after each test
afterEach(() => {
  cleanup();
});

// Simple console error handler for React 18 warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string' &&
      /Warning: ReactDOM.render is no longer supported in React 18./.test(
        firstArg,
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Root module mock for @mui/x-date-pickers to cover all import patterns
vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: vi.fn(({ value, onChange, slotProps, label, ...props }) => {
    // Extract attributes from slotProps.textField.inputProps if available
    const inputProps = slotProps?.textField?.inputProps || {};

    // Filter out non-standard HTML attributes to avoid React warnings
    const { className, ...cleanProps } = props;

    return React.createElement('input', {
      'data-testid': inputProps['data-testid'] || 'date-picker',
      type: 'date',
      id: 'birthDate', // Set the id to match the label's for attribute
      'aria-label': inputProps['aria-label'] || label,
      label: label, // Pass through the label prop for components that use it as an attribute
      max: inputProps.max,
      className: className,
      value: value
        ? typeof value === 'string'
          ? value
          : value.format?.('YYYY-MM-DD') || ''
        : '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const isDayjs =
          value &&
          typeof value !== 'string' &&
          typeof (value as { format?: (format: string) => string }).format ===
            'function';
        onChange?.(newValue ? (isDayjs ? dayjs(newValue) : newValue) : null);
      },
      ...cleanProps,
    });
  }),
  DateTimePicker: vi.fn(({ value, onChange, slotProps, label, ...props }) => {
    const inputProps = slotProps?.textField?.inputProps || {};
    const { className, ...cleanProps } = props;

    return React.createElement('input', {
      'data-testid': inputProps['data-testid'] || 'datetime-picker',
      type: 'datetime-local',
      'aria-label': inputProps['aria-label'] || label,
      label: label,
      className: className,
      value: value
        ? typeof value === 'string'
          ? value
          : value.format?.('YYYY-MM-DDTHH:mm') || ''
        : '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const isDayjs =
          value &&
          typeof value !== 'string' &&
          typeof (value as { format?: (format: string) => string }).format ===
            'function';
        onChange?.(newValue ? (isDayjs ? dayjs(newValue) : newValue) : null);
      },
      ...cleanProps,
    });
  }),
  TimePicker: vi.fn(({ value, onChange, slotProps, label, ...props }) => {
    const inputProps = slotProps?.textField?.inputProps || {};
    const { className, ...cleanProps } = props;

    return React.createElement('input', {
      'data-testid': inputProps['data-testid'] || 'time-picker',
      type: 'time',
      'aria-label': inputProps['aria-label'] || label,
      label: label,
      className: className,
      value: value
        ? typeof value === 'string'
          ? value
          : value.format?.('HH:mm') || ''
        : '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const isDayjs =
          value &&
          typeof value !== 'string' &&
          typeof (value as { format?: (format: string) => string }).format ===
            'function';
        onChange?.(newValue ? (isDayjs ? dayjs(newValue) : newValue) : null);
      },
      ...cleanProps,
    });
  }),

  LocalizationProvider: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
  default: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
}));
