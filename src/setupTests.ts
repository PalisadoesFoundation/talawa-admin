// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.fetch = jest.fn();

import { format } from 'util';

global.console.error = function (...args) {
  throw new Error(format(...args));
};

global.console.warn = function (...args) {
  throw new Error(format(...args));
};
