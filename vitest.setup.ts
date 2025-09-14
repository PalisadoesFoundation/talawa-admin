import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi, afterEach, beforeAll, afterAll } from 'vitest';
import React from 'react';

// Basic cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock component props interface
interface InterfaceMockComponentProps {
  value?: unknown;
  onChange?: (value: unknown) => void;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Factory function to create mock date input components
const createMockDateInput = (inputType: string, dateFormat: string) => {
  return function MockDateComponent({
    value,
    onChange,
    ...props
  }: InterfaceMockComponentProps) {
    return React.createElement('input', {
      type: inputType,
      value:
        value && typeof value === 'object' && 'format' in value
          ? (value as { format: (f: string) => string }).format(dateFormat)
          : '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.value),
      ...props,
    });
  };
};

// Factory function for provider components
const createMockProvider = () => {
  return function MockProvider({ children }: InterfaceMockComponentProps) {
    return children;
  };
};

// Mock MUI X Date Pickers for ES module compatibility
vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: createMockDateInput('date', 'YYYY-MM-DD'),
}));

vi.mock('@mui/x-date-pickers/TimePicker', () => ({
  TimePicker: createMockDateInput('time', 'HH:mm'),
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', () => ({
  DateTimePicker: createMockDateInput('datetime-local', 'YYYY-MM-DDTHH:mm'),
}));

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: createMockProvider(),
}));

vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: class AdapterDayjs {},
}));

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
