/**
 * Helper interface for managing localStorage operations.
 */
interface InterfaceStorageHelper {
  getItem: <T>(key: string) => T | null | string;
  setItem: (key: string, value: unknown) => void;
  removeItem: (key: string) => void;
  getStorageKey: (key: string) => string;
  clearAllItems: () => void;
}

export const PREFIX = 'Talawa-admin';

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
  if (!storedData) return null;
  try {
    return JSON.parse(storedData) as T;
  } catch {
    console.error(`Failed to parse localStorage key: ${prefixedKey}`);
    return null;
  }
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
 * Clears all items from localStorage with the given prefix.
 * @param prefix - Prefix to be added to the key, common for all keys.
 * @returns void
 */
export const clearAllItems = (prefix: string): void => {
  const allPrefixedKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      allPrefixedKeys.push(key);
    }
  }

  let size = allPrefixedKeys.length;
  for (let i = 0; i < size; i++) {
    localStorage.removeItem(allPrefixedKeys[i]);
  }
};
/**
 * Factory function that returns localStorage helper methods with a common prefix.
 * @param prefix - Prefix to be added to all keys, defaults to 'Talawa-admin'.
 * @returns InterfaceStorageHelper with getItem, setItem, removeItem, getStorageKey, and clearAllItems methods.
 */
export const useLocalStorage = (
  prefix: string = PREFIX,
): InterfaceStorageHelper => {
  return {
    // i18n-ignore-next-line
    getItem: <T>(key: string) => getItem<T>(prefix, key),
    setItem: (key: string, value: unknown) => setItem(prefix, key, value),
    removeItem: (key: string) => removeItem(prefix, key),
    getStorageKey: (key: string) => getStorageKey(prefix, key),
    clearAllItems: () => clearAllItems(prefix),
  };
};

export default useLocalStorage;
