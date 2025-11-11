import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Simple console error handler for React 18 and Apollo deprecation warnings
const originalError = console.error;
const originalWarn = console.warn;
const shouldSuppressError = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    if (value instanceof Error) {
      return shouldSuppressError(value.message);
    }
    return false;
  }

  return (
    value.includes(
      'Warning: ReactDOM.render is no longer supported in React 18.',
    ) ||
    value.includes(
      'Please remove the `addTypename` option from MockedProvider',
    ) ||
    value.includes(
      'Please remove the `addTypename` option when initializing `InMemoryCache`',
    ) ||
    value.includes('Please remove this option.') ||
    (value.includes('go.apollo.dev/c/err') &&
      (value.includes('addTypename') ||
        value.includes('canonizeResults') ||
        value.includes('message%22%3A43') ||
        value.includes('message%22%3A49')))
  );
};

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (args.some(shouldSuppressError)) {
      return; // Suppress known deprecation warnings (to be fixed in follow-up issues)
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
