/**
 * Helper interface for managing localStorage operations.
 */
interface InterfaceStorageHelper {
  getItem: <T>(key: string) => T | null;
  setItem: (key: string, value: unknown) => void;
  removeItem: (key: string) => void;
  getStorageKey: (key: string) => string;
}

const PREFIX = 'Talawa-admin';

/**
 * Generates the prefixed key for storage.
 * @param prefix - Prefix to be added to the key, common for all keys.
 * @param key - The unique name identifying the value.
 * @returns - Prefixed key.
 */
export const getStorageKey = (prefix: string, key: string): string => {
  return `${prefix}_${key}`;
};

/**
 * Retrieves the stored value for the given key from local storage.
 * @param prefix - Prefix to be added to the key, common for all keys.
 * @param key - The unique name identifying the value.
 * @returns - The stored value parsed as type T or null.
 */
export const getItem = <T>(prefix: string, key: string): T | null => {
  const prefixedKey = getStorageKey(prefix, key);
  const storedData = localStorage.getItem(prefixedKey);
  return storedData ? (JSON.parse(storedData) as T) : null;
};

/**
 * Sets the value for the given key in local storage.
 * @param prefix - Prefix to be added to the key, common for all keys.
 * @param key - The unique name identifying the value.
 * @param value - The value to be stored (any type that can be serialized).
 */
export const setItem = (prefix: string, key: string, value: unknown): void => {
  const prefixedKey = getStorageKey(prefix, key);
  localStorage.setItem(prefixedKey, JSON.stringify(value));
};

/**
 * Removes the value associated with the given key from local storage.
 * @param prefix - Prefix to be added to the key, common for all keys.
 * @param key - The unique name identifying the value.
 */
export const removeItem = (prefix: string, key: string): void => {
  const prefixedKey = getStorageKey(prefix, key);
  localStorage.removeItem(prefixedKey);
};

/**
 * Custom hook for simplified localStorage operations.
 * @param prefix - Prefix to be added to the key, common for all keys. Default is 'Talawa-admin'.
 * @returns - Functions to getItem, setItem, removeItem, and getStorageKey.
 */
export const useLocalStorage = (
  prefix: string = PREFIX,
): InterfaceStorageHelper => {
  return {
    getItem: <T>(key: string) => getItem<T>(prefix, key),
    setItem: (key: string, value: unknown) => setItem(prefix, key, value),
    removeItem: (key: string) => removeItem(prefix, key),
    getStorageKey: (key: string) => getStorageKey(prefix, key),
  };
};

export default useLocalStorage;
