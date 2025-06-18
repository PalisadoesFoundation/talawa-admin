import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { format } from 'util';

window.fetch = vi.fn();

window.console.error = function (...args): void {
  throw new Error(format(...args));
};

window.console.warn = function (...args): void {
  throw new Error(format(...args));
};

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
