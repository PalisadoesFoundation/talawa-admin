import '@testing-library/dom';
import { vi } from 'vitest';

global.fetch = vi.fn();

/**
 * Fully mock localStorage for jsdom + vitest
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

/**
 * IMPORTANT: mock BOTH window and globalThis
 */
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

vi.stubGlobal('localStorage', localStorageMock);
