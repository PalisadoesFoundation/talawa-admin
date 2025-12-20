import { TextEncoder, TextDecoder } from 'util';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Enable React act environment for testing
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// Handle unhandled rejections from Apollo Client cleanup (AbortError)
// This is a known issue with Apollo Client 4.x and rxjs when components unmount
// while queries are still in flight
process.on('unhandledRejection', (reason: unknown) => {
  if (
    reason instanceof Error &&
    (reason.name === 'AbortError' ||
      reason.message === 'The operation was aborted.')
  ) {
    // Suppress expected AbortError from Apollo Client cleanup
    return;
  }
  // Re-throw other unhandled rejections
  throw reason;
});

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
  cleanup();
  vi.clearAllMocks();
});

// Global mocks for URL API (needed for file upload tests)
// TODO: Remove once test isolation is properly fixed in individual test files
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock HTMLFormElement.prototype.requestSubmit for jsdom
// TODO: Remove once jsdom adds native support
HTMLFormElement.prototype.requestSubmit = function () {
  if (this.checkValidity()) {
    this.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true }),
    );
  }
};
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Polyfill for @pdfme
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}
