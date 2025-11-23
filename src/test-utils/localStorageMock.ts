/**
 * Shared localStorage mock for test isolation
 * Prevents tests from interfering with each other or real browser storage
 */
export const createLocalStorageMock = (): Storage => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

/**
 * Setup localStorage mock for tests
 * Call this in your test file's setup
 */
export const setupLocalStorageMock = (): Storage => {
  const localStorageMock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  return localStorageMock;
};
