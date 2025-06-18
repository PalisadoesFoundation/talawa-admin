import '@testing-library/jest-dom';
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
  set: () => ({}),
});

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

vi.useFakeTimers();
vi.advanceTimersByTime(18000);
vi.advanceTimersByTime(18000);
