import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const STORAGE_KEY = 'localStorage';

describe('setupTests', () => {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalFetch = global.fetch;
  const originalStorageDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    STORAGE_KEY,
  );
  // ✅ FIX #1: Capture original HTMLMediaElement.prototype.muted descriptor
  const originalMutedDescriptor = Object.getOwnPropertyDescriptor(
    HTMLMediaElement.prototype,
    'muted',
  );

  beforeEach(() => {
    // ✅ FIX #2: Reset to real timers BEFORE each test as safety measure
    vi.useRealTimers();
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

    // ✅ FIX #3: Properly restore localStorage using descriptor
    if (originalStorageDescriptor) {
      Reflect.defineProperty(
        globalThis,
        STORAGE_KEY,
        originalStorageDescriptor,
      );
    } else {
      Reflect.deleteProperty(globalThis, STORAGE_KEY);
    }

    // ✅ FIX #1: Restore HTMLMediaElement.prototype.muted to prevent test pollution
    if (originalMutedDescriptor) {
      Object.defineProperty(
        HTMLMediaElement.prototype,
        'muted',
        originalMutedDescriptor,
      );
    } else {
      Reflect.deleteProperty(HTMLMediaElement.prototype, 'muted');
    }

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
