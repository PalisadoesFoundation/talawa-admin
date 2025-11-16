import '@testing-library/dom';
import { vi } from 'vitest';
global.fetch = vi.fn();

import { format } from 'util';

global.console.error = function (...args): void {
  throw new Error(format(...args));
};

global.console.warn = function (...args): void {
  throw new Error(format(...args));
};
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => {},
});

// Global CSS here
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';

vi.useFakeTimers();
vi.advanceTimersByTime(18000);

// Provide a resilient localStorage mock for jsdom-based tests
// Some suites expect setItem/getItem/clear to exist globally.
if (typeof globalThis.localStorage === 'undefined') {
  const createLocalStorageMock = () => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string): string | null => store[key] ?? null,
      setItem: (key: string, value: unknown): void => {
        store[key] = String(value);
      },
      removeItem: (key: string): void => {
        delete store[key];
      },
      clear: (): void => {
        store = {};
      },
      key: (index: number): string | null => Object.keys(store)[index] ?? null,
      get length(): number {
        return Object.keys(store).length;
      },
    };
  };
  globalThis.localStorage = createLocalStorageMock() as unknown as Storage;
}
