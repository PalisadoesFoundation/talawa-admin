// SKIP_LOCALSTORAGE_CHECK

import {
  getStorageKey,
  getItem,
  setItem,
  removeItem,
  clearAllItems,
  useLocalStorage,
} from './useLocalstorage';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Storage Helper Functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('generates correct storage key', () => {
    const key = 'testKey';
    const prefix = 'TestPrefix';
    const storageKey = getStorageKey(prefix, key);
    expect(storageKey).toBe('TestPrefix_testKey');
  });

  it('gets item from local storage', () => {
    const key = 'testKey';
    const prefix = 'TestPrefix';
    const value = 'data';
    localStorage.setItem('TestPrefix_testKey', JSON.stringify(value));

    const retrievedValue = getItem(prefix, key);

    expect(retrievedValue).toEqual(value);
  });

  it('returns null when getting a non-existent item', () => {
    const key = 'nonExistentKey';
    const prefix = 'TestPrefix';

    const retrievedValue = getItem(prefix, key);

    expect(retrievedValue).toBeNull();
  });

  it('returns null and logs error when parsing invalid JSON', () => {
    const key = 'testKey';
    const prefix = 'TestPrefix';
    const invalidJson = 'invalid-json';
    const prefixedKey = getStorageKey(prefix, key);

    localStorage.setItem(prefixedKey, invalidJson);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const retrievedValue = getItem(prefix, key);

    expect(retrievedValue).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      `Failed to parse localStorage key: ${prefixedKey}`,
    );
    consoleSpy.mockRestore();
  });

  it('sets item in local storage', () => {
    const key = 'testKey';
    const prefix = 'TestPrefix';
    const value = { some: 'data' };

    setItem(prefix, key, value);

    const storedData = localStorage.getItem('TestPrefix_testKey');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    expect(parsedData).toEqual(value);
  });

  it('removes item from local storage', () => {
    const key = 'testKey';
    const prefix = 'TestPrefix';
    const value = 'data';
    localStorage.setItem('TestPrefix_testKey', value);

    removeItem(prefix, key);

    const retrievedValue = localStorage.getItem('TestPrefix_testKey');
    expect(retrievedValue).toBeNull();
  });

  it('clears all prefixed items from local storage', () => {
    const prefix = 'TestPrefix';
    const data1 = 'data-1';
    const data2 = 'data-2';

    localStorage.setItem(`${prefix}_testKey-1`, data1); // key is testKey-1
    localStorage.setItem(`${prefix}_testKey-2`, data2); // key is testKey-2

    clearAllItems(prefix);

    const retrievedValue1 = localStorage.getItem('TestPrefix_testKey-1');
    const retrievedValue2 = localStorage.getItem('TestPrefix_testKey-2');

    expect(retrievedValue1).toBeNull();
    expect(retrievedValue2).toBeNull();
  });

  it('does not clear unprefixed items from local storage', () => {
    const prefix = 'TestPrefix';
    const changedPrefix = 'ChangedTestPrefix';
    const data1 = 'data-1';
    const data2 = 'data-2';
    localStorage.setItem(`${prefix}_testKey-1`, data1);
    localStorage.setItem(`${changedPrefix}_testKey-1`, data2);

    clearAllItems(prefix);
    const retrievedValue1 = localStorage.getItem(`${prefix}_testKey-1`);
    const retrievedValue2 = localStorage.getItem(`${changedPrefix}_testKey-1`);

    expect(retrievedValue1).toBeNull();
    expect(retrievedValue2).toBe(data2);
  });

  it('uses default prefix for useLocalStorage', () => {
    const storageHelper = useLocalStorage();
    const key = 'testKey';
    const value = { some: 'data' };

    storageHelper.setItem(key, value);

    const storedData = localStorage.getItem('Talawa-admin_testKey');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    expect(parsedData).toEqual(value);
  });

  it('uses provided prefix for useLocalStorage', () => {
    const customPrefix = 'CustomPrefix';
    const storageHelper = useLocalStorage(customPrefix);
    const key = 'testKey';
    const value = { some: 'data' };

    storageHelper.setItem(key, value);

    const storedData = localStorage.getItem('CustomPrefix_testKey');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    expect(parsedData).toEqual(value);
  });

  it('calls getStorageKey with the correct parameters', () => {
    const customPrefix = 'CustomPrefix';
    const storageHelper = useLocalStorage(customPrefix);
    const key = 'testKey';

    const spyGetStorageKey = vi.spyOn(storageHelper, 'getStorageKey');
    storageHelper.getStorageKey(key);

    expect(spyGetStorageKey).toHaveBeenCalledWith(key);
  });

  it('calls getItem with the correct parameters', () => {
    const customPrefix = 'CustomPrefix';
    const storageHelper = useLocalStorage(customPrefix);
    const key = 'testKey';

    const spyGetItem = vi.spyOn(storageHelper, 'getItem');
    storageHelper.getItem(key);

    expect(spyGetItem).toHaveBeenCalledWith(key);
  });

  it('calls setItem with the correct parameters', () => {
    const customPrefix = 'CustomPrefix';
    const storageHelper = useLocalStorage(customPrefix);
    const key = 'testKey';
    const value = 'data';

    const spySetItem = vi.spyOn(storageHelper, 'setItem');
    storageHelper.setItem(key, value);

    expect(spySetItem).toHaveBeenCalledWith(key, value);
  });

  it('calls removeItem with the correct parameters', () => {
    const customPrefix = 'CustomPrefix';
    const storageHelper = useLocalStorage(customPrefix);
    const key = 'testKey';

    const spyRemoveItem = vi.spyOn(storageHelper, 'removeItem');
    storageHelper.removeItem(key);

    expect(spyRemoveItem).toHaveBeenCalledWith(key);
  });

  it('calls clearAllItems with the correct parameters', () => {
    const customPrefix = 'CustomPrefix';
    const storageHelper = useLocalStorage(customPrefix);

    const spyClearAllItems = vi.spyOn(storageHelper, 'clearAllItems');
    storageHelper.clearAllItems();

    expect(spyClearAllItems).toHaveBeenCalledWith();
  });
});
