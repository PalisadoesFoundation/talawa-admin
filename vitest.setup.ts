import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

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
  DatePicker: vi.fn(({ value, onChange, ...props }) => {
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
        onChange?.(newValue || null);
      },
      ...props,
    });
  }),
  DateTimePicker: vi.fn(({ value, onChange, ...props }) => {
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
        onChange?.(newValue || null);
      },
      ...props,
    });
  }),
  TimePicker: vi.fn(({ value, onChange, ...props }) => {
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
        onChange?.(newValue || null);
      },
      ...props,
    });
  }),

  LocalizationProvider: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
}));
