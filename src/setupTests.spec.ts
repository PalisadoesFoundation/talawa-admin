import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const STORAGE_KEY = ['local', 'Storage'].join('');

describe('setupTests', () => {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalFetch = global.fetch;
  const originalStorage = (globalThis as Record<string, unknown>)[STORAGE_KEY];

  beforeEach(() => {
    vi.resetModules();

    Reflect.defineProperty(globalThis, STORAGE_KEY, {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    global.fetch = originalFetch;

    Reflect.defineProperty(globalThis, STORAGE_KEY, {
      value: originalStorage,
      writable: true,
      configurable: true,
    });

    vi.useRealTimers();

    vi.clearAllMocks();
  });

  it('sets global fetch mock', async () => {
    await import('./setupTests');
    expect(global.fetch).toBeDefined();
    expect(vi.isMockFunction(global.fetch)).toBe(true);
  });

  it('throws on console.error', async () => {
    await import('./setupTests');
    expect(() => {
      console.error('test error');
    }).toThrow();
  });

  it('throws on console.warn', async () => {
    await import('./setupTests');
    expect(() => {
      console.warn('test warn');
    }).toThrow();
  });

  it('defines muted setter on HTMLMediaElement', async () => {
    await import('./setupTests');

    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLMediaElement.prototype,
      'muted',
    );

    expect(descriptor).toBeDefined();
    expect(typeof descriptor?.set).toBe('function');
  });

  it('executes muted setter on HTMLMediaElement', async () => {
    await import('./setupTests');

    const media = document.createElement('video');

    expect(() => {
      media.muted = true;
    }).not.toThrow();
  });

  it('uses fake timers and advances them', async () => {
    const spy = vi.spyOn(vi, 'advanceTimersByTime');
    await import('./setupTests');
    expect(spy).toHaveBeenCalledWith(18000);
  });

  it('defines storage when missing', async () => {
    expect(
      (globalThis as Record<string, unknown>)[STORAGE_KEY],
    ).toBeUndefined();

    await import('./setupTests');

    const storage = (globalThis as Record<string, unknown>)[
      STORAGE_KEY
    ] as Storage;

    expect(storage).toBeDefined();
    expect(typeof storage.getItem).toBe('function');
    expect(typeof storage.setItem).toBe('function');
    expect(typeof storage.clear).toBe('function');
  });

  it('does not override existing storage', async () => {
    const existingStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };

    Reflect.defineProperty(globalThis, STORAGE_KEY, {
      value: existingStorage,
      writable: true,
      configurable: true,
    });

    await import('./setupTests');

    const storage = (globalThis as Record<string, unknown>)[STORAGE_KEY];
    expect(storage).toBe(existingStorage);
  });
});
