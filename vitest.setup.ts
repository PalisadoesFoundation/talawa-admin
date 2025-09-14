import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import {
  DatePickerComponent,
  TimePickerComponent,
  DateTimePickerComponent,
  LocalizationProviderComponent,
} from './src/utils/muiDatePickerMocks';

// Mock MUI date picker components to avoid ES module issues
vi.mock('@mui/x-date-pickers', () => ({
  LocalizationProvider: LocalizationProviderComponent,
  DatePicker: DatePickerComponent,
  TimePicker: TimePickerComponent,
  DateTimePicker: DateTimePickerComponent,
}));

vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: class MockAdapterDayjs {},
}));

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
