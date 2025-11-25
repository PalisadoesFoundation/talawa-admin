/**
 * Creates an in-memory localStorage mock for test isolation
 * Prevents tests from interfering with each other or real browser storage
 *
 * @returns Storage - Mock implementation of the Storage interface
 * @example
 * const mockStorage = createLocalStorageMock();
 * mockStorage.setItem('key', 'value');
 * expect(mockStorage.getItem('key')).toBe('value');
 * mockStorage.clear();
 */
export const createLocalStorageMock = (): Storage => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null =>
      Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
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
      return index >= 0 && index < keys.length ? keys[index] : null;
    },
  };
};

/**
 * Setup localStorage mock for tests
 * Configures window.localStorage with a mock implementation for test isolation
 *
 * @returns Storage - The configured localStorage mock instance
 * @example
 * // In your test file's setup:
 * const localStorageMock = setupLocalStorageMock();
 *
 * afterEach(() => {
 *   localStorageMock.clear();
 * });
 *
 * // Then in your tests:
 * window.localStorage.setItem('token', 'abc123');
 * expect(window.localStorage.getItem('token')).toBe('abc123');
 */
export const setupLocalStorageMock = (): Storage => {
  const localStorageMock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
  return localStorageMock;
};
