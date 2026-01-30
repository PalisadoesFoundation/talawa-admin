import { TextEncoder, TextDecoder } from 'util';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

loadDevMessages();
loadErrorMessages();
import { setupLocalStorageMock } from './src/test-utils/localStorageMock';

// Setup localStorage mock globally for all tests
const localStorageMock = setupLocalStorageMock();

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = localStorageMock as unknown as Storage;
}

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

vi.stubGlobal('localStorage', localStorageMock);

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

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  get: () => localStorageMock as unknown as Storage,
  set: () => {
    // swallow attempts to overwrite window.localStorage from tests
  },
});

// Basic cleanup before each test
beforeEach(() => {
  const g = globalThis as unknown as { localStorage: unknown };
  if (g.localStorage !== (localStorageMock as unknown as Storage)) {
    vi.stubGlobal('localStorage', localStorageMock as unknown as Storage);
  }
});

// Basic cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorageMock.clear();
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

// Polyfill for @pdfme
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}
