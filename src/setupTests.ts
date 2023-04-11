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
import { jestPreviewConfigure } from 'jest-preview';

// TODO: To add your global css here
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';
import './css/index.css';

import './css/bootstrap.min.css';
import './css/index.css';

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});
