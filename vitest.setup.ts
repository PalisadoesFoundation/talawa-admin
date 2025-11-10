import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

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

// Simple console error handler for React 18 and Apollo deprecation warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string' &&
      (/Warning: ReactDOM.render is no longer supported in React 18./.test(
        firstArg,
      ) ||
        /Please remove the `addTypename` option from MockedProvider/.test(
          firstArg,
        ))
    ) {
      return; // Suppress known deprecation warnings (to be fixed in follow-up issues)
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
