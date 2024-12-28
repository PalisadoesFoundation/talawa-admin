// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
global.fetch = jest.fn();

import { format } from 'util';

global.console.error = function (...args): void {
  throw new Error(format(...args));
};

global.console.warn = function (...args): void {
  throw new Error(format(...args));
};
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => ({}),
});

import { jestPreviewConfigure } from 'jest-preview';

// Global CSS here
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});

jest.setTimeout(18000);
