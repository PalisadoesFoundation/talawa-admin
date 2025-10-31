import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Mock window.confirm for tests that use it
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(() => true),
});

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
