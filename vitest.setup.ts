import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Simple console error handler for React 18 warnings
const originalError = console.error;
const originalWarn = console.warn;
const shouldSuppressError = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    if (value instanceof Error) {
      return shouldSuppressError(value.message);
    }
    return false;
  }

  return value.includes(
    'Warning: ReactDOM.render is no longer supported in React 18.',
  );
};

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (args.some(shouldSuppressError)) {
      return; // Suppress known React 18 warnings
    }
    originalError.call(console, ...args);
  };
  console.warn = (...args: unknown[]) => {
    if (args.some(shouldSuppressError)) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

// Basic cleanup after each test
afterEach(() => {
  // Flush pending timers before cleanup to prevent state updates on unmounted components
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
  vi.clearAllMocks();
});

// Global mocks for URL API (needed for file upload tests)
// TODO: Remove once test isolation is properly fixed in individual test files
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock HTMLFormElement.prototype.requestSubmit for jsdom
// TODO: Remove once jsdom adds native support
if (typeof HTMLFormElement.prototype.requestSubmit === 'undefined') {
  HTMLFormElement.prototype.requestSubmit = function () {
    if (this.checkValidity()) {
      this.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
    }
  };
}
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
