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

import { createLocalStorageMock } from './test-utils/localStorageMock';

// Provide a resilient localStorage mock for jsdom-based tests
// Some suites expect setItem/getItem/clear to exist globally.
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = createLocalStorageMock() as unknown as Storage;
}
