import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createLocalStorageMock,
  setupLocalStorageMock,
} from './localStorageMock';

describe('localStorageMock', () => {
  describe('createLocalStorageMock', () => {
    let mockStorage: Storage;

    beforeEach(() => {
      mockStorage = createLocalStorageMock();
    });

    it('should set and get items', () => {
      mockStorage.setItem('key', 'value');
      expect(mockStorage.getItem('key')).toBe('value');
    });

    it('should return null for non-existent keys', () => {
      expect(mockStorage.getItem('nonexistent')).toBeNull();
    });

    it('should remove items', () => {
      mockStorage.setItem('key', 'value');
      mockStorage.removeItem('key');
      expect(mockStorage.getItem('key')).toBeNull();
    });

    it('should clear all items', () => {
      mockStorage.setItem('key1', 'value1');
      mockStorage.setItem('key2', 'value2');
      mockStorage.clear();
      expect(mockStorage.getItem('key1')).toBeNull();
      expect(mockStorage.getItem('key2')).toBeNull();
    });

    it('should return correct length', () => {
      expect(mockStorage.length).toBe(0);
      mockStorage.setItem('key1', 'value1');
      expect(mockStorage.length).toBe(1);
      mockStorage.setItem('key2', 'value2');
      expect(mockStorage.length).toBe(2);
      mockStorage.removeItem('key1');
      expect(mockStorage.length).toBe(1);
    });

    it('should return key by index', () => {
      mockStorage.setItem('key1', 'value1');
      mockStorage.setItem('key2', 'value2');
      expect(mockStorage.key(0)).toBe('key1');
      expect(mockStorage.key(1)).toBe('key2');
      expect(mockStorage.key(2)).toBeNull();
    });

    it('should overwrite existing key and maintain correct length', () => {
      mockStorage.setItem('key', 'value1');
      expect(mockStorage.length).toBe(1);
      mockStorage.setItem('key', 'value2');
      expect(mockStorage.getItem('key')).toBe('value2');
      expect(mockStorage.length).toBe(1);
    });

    it('should handle removing non-existent key without errors', () => {
      expect(mockStorage.length).toBe(0);
      mockStorage.removeItem('nonexistent');
      expect(mockStorage.length).toBe(0);
    });

    it('should handle empty string keys and values', () => {
      mockStorage.setItem('', '');
      mockStorage.setItem('nonEmptyKey', '');
      expect(mockStorage.getItem('')).toBe('');
      expect(mockStorage.getItem('nonEmptyKey')).toBe('');
      expect(mockStorage.length).toBe(2);
      expect(mockStorage.key(0)).toBe('');
      expect(mockStorage.key(1)).toBe('nonEmptyKey');
    });

    it('should handle special characters in keys and values', () => {
      mockStorage.setItem('key-with-dashes', 'value');
      mockStorage.setItem('key.with.dots', 'value with spaces');
      expect(mockStorage.getItem('key-with-dashes')).toBe('value');
      expect(mockStorage.getItem('key.with.dots')).toBe('value with spaces');
      expect(mockStorage.length).toBe(2);
    });
  });

  describe('setupLocalStorageMock', () => {
    let originalLocalStorage: Storage;

    beforeEach(() => {
      originalLocalStorage = window.localStorage;
    });

    afterEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true,
      });
    });

    it('should configure window.localStorage', () => {
      const mock = setupLocalStorageMock();
      expect(window.localStorage).toBe(mock);
    });

    it('should allow setting and getting from window.localStorage', () => {
      const mock = setupLocalStorageMock();
      window.localStorage.setItem('testKey', 'testValue');
      expect(window.localStorage.getItem('testKey')).toBe('testValue');
      expect(mock.getItem('testKey')).toBe('testValue');
    });

    it('should allow clearing window.localStorage', () => {
      setupLocalStorageMock();
      window.localStorage.setItem('key1', 'value1');
      window.localStorage.setItem('key2', 'value2');
      window.localStorage.clear();
      expect(window.localStorage.getItem('key1')).toBeNull();
      expect(window.localStorage.getItem('key2')).toBeNull();
    });
  });
});
