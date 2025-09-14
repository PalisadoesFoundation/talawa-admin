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
  DatePicker: vi.fn(({ value, onChange }) => {
    return React.createElement('input', {
      'data-testid': 'date-picker',
      type: 'date',
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
    });
  }),
  DateTimePicker: vi.fn(({ value, onChange }) => {
    return React.createElement('input', {
      'data-testid': 'datetime-picker',
      type: 'datetime-local',
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
    });
  }),
  TimePicker: vi.fn(({ value, onChange }) => {
    return React.createElement('input', {
      'data-testid': 'time-picker',
      type: 'time',
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
    });
  }),

  LocalizationProvider: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
  default: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
}));
