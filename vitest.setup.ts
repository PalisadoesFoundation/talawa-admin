import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Optimized cleanup after each test
afterEach(() => {
  cleanup();
  // Clear all timers to prevent memory leaks
  vi.clearAllTimers();
  // Clear all mocks to reset state between tests
  vi.clearAllMocks();
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

// Aggressive memory cleanup for CI environments with happy-dom
if (global.gc && typeof global.gc === 'function') {
  const gcFunction = global.gc;
  if (process.env.CI) {
    afterEach(() => {
      gcFunction();
    });
  } else {
    afterAll(() => {
      gcFunction();
    });
  }
}
