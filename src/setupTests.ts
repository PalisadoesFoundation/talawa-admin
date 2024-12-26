// vitest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { vi } from 'vitest';
import { format } from 'util';

// Mock global fetch
global.fetch = vi.fn();

// Override console methods to throw errors
global.console.error = (...args): void => {
  throw new Error(format(...args));
};

global.console.warn = (...args): void => {
  throw new Error(format(...args));
};

// Mock HTMLMediaElement.prototype.muted setter
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => ({}),
});

// Import global CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';

import { jestPreviewConfigure } from 'jest-preview';

// Configure Jest Preview for Vitest
jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});

// Set Vitest timeout
vi.setConfig({ testTimeout: 400000 });
