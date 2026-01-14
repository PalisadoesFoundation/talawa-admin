import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Suppress known React 18 warnings
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
    if (args.some(shouldSuppressError)) return;
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    if (args.some(shouldSuppressError)) return;
    originalWarn.call(console, ...args);
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// URL mocks (used by file upload tests)
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// HTMLFormElement.requestSubmit mock
if (typeof HTMLFormElement.prototype.requestSubmit === 'undefined') {
  HTMLFormElement.prototype.requestSubmit = function () {
    if (this.checkValidity()) {
      this.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
    }
  };
}

/**
 * ✅ Global localStorage mock (CRITICAL)
 */
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

vi.stubGlobal('localStorage', localStorageMock);

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
