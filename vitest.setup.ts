import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Strict cleanup after each test to prevent DOM pollution
afterEach(async () => {
  cleanup();
  // Clear all timers and pending async operations
  vi.clearAllTimers();
  vi.clearAllMocks();
  // Force clear document body to prevent test pollution
  document.body.innerHTML = '';
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
