/**
 * Helper interface for managing localStorage operations.
 * The 'any' type is necessary here to handle diverse data types that can be stored
 * in localStorage. While this violates TypeScript's strict typing principles,
 * it provides the flexibility needed for a general-purpose storage utility.
 * This file contains ESLint disable comments to suppress warnings about using 'any' type.
 */
interface InterfaceStorageHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItem: (key: string) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem: (key: string, value: any) => void;
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
 * @returns - The stored value for the given key from local storage.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getItem = (prefix: string, key: string): any => {
  const prefixedKey = getStorageKey(prefix, key);
  const storedData = localStorage.getItem(prefixedKey);
  return storedData ? JSON.parse(storedData) : null;
};

/**
 * Sets the value for the given key in local storage.
 * @param prefix - Prefix to be added to the key, common for all keys.
 * @param key - The unique name identifying the value.
 * @param value - The value for the key.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const setItem = (prefix: string, key: string, value: any): void => {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLocalStorage = (
  prefix: string = PREFIX,
): InterfaceStorageHelper => {
  return {
    getItem: (key: string) => getItem(prefix, key),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem: (key: string, value: any) => setItem(prefix, key, value),
    removeItem: (key: string) => removeItem(prefix, key),
    getStorageKey: (key: string) => getStorageKey(prefix, key),
  };
};

export default useLocalStorage;
