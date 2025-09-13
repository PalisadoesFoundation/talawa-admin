// ---- MUST BE FIRST ----
// Stabilize date behavior across machines/CI
process.env.TZ = 'UTC';

import '@testing-library/dom';
import { afterEach, beforeAll, beforeEach, vi } from 'vitest';

// Minimal global fetch mock (reset per test below)
global.fetch = vi.fn() as unknown as typeof fetch;

// Keep logs visible but avoid turning every warning into a hard failure.
// You can tighten this later by throwing on specific unexpected messages.
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    const allowlist: (RegExp | string)[] = [
      // Add regex or strings for known noisy errors you want to ignore.
      // /Warning:.*act\(\)/i,
    ];
    if (
      allowlist.some((x) =>
        x instanceof RegExp ? x.test(msg) : msg.includes(x),
      )
    ) {
      return;
    }
    // Surface errors in test output (without throwing globally)
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    const allowlist: (RegExp | string)[] = [
      // Add regex or strings for known noisy warnings you want to ignore.
    ];
    if (
      allowlist.some((x) =>
        x instanceof RegExp ? x.test(msg) : msg.includes(x),
      )
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
});

// Use real timers by default; tests can opt into fake timers explicitly.
beforeEach(() => {
  vi.useRealTimers();
});

// Reset fetch mocks after each test to avoid cross-test bleed.
afterEach(() => {
  (global.fetch as any)?.mockReset?.();
});

// Prevent JSDOM crashes on media controls in components
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  configurable: true,
  set: () => {},
});

// ---- Global styles (CSS only) ----
// Keep Bootstrap JS out unless a test truly needs it, as it can manipulate DOM.
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.min.js'; // uncomment only if needed
import 'react-datepicker/dist/react-datepicker.css';
import 'flag-icons/css/flag-icons.min.css';
