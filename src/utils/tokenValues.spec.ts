import { describe, it, expect } from 'vitest';
import {
  spacingTokens,
  getSpacingValue,
  isSpacingToken,
  type SpacingToken,
} from './tokenValues';

describe('tokenValues', () => {
  describe('spacingTokens', () => {
    it('contains all expected token keys from space-0 to space-29', () => {
      const expectedKeys = [
        'space-0',
        'space-0-5',
        'space-1',
        'space-2',
        'space-3',
        'space-4',
        'space-5',
        'space-6',
        'space-7',
        'space-8',
        'space-9',
        'space-10',
        'space-11',
        'space-12',
        'space-13',
        'space-14',
        'space-15',
        'space-16',
        'space-17',
        'space-18',
        'space-19',
        'space-20',
        'space-21',
        'space-22',
        'space-23',
        'space-24',
        'space-25',
        'space-26',
        'space-27',
        'space-28',
        'space-29',
      ];

      expectedKeys.forEach((key) => {
        expect(spacingTokens).toHaveProperty(key);
      });
    });

    it('has correct pixel values for commonly used tokens', () => {
      expect(spacingTokens['space-0']).toBe(0);
      expect(spacingTokens['space-5']).toBe(16);
      expect(spacingTokens['space-8']).toBe(32);
      expect(spacingTokens['space-10']).toBe(48);
      expect(spacingTokens['space-11']).toBe(64);
      expect(spacingTokens['space-13']).toBe(96);
      expect(spacingTokens['space-15']).toBe(150);
      expect(spacingTokens['space-16']).toBe(160);
      expect(spacingTokens['space-17']).toBe(220);
    });

    it('has all values as numbers', () => {
      Object.values(spacingTokens).forEach((value) => {
        expect(typeof value).toBe('number');
      });
    });
  });

  describe('getSpacingValue', () => {
    it('returns correct pixel value for valid tokens', () => {
      expect(getSpacingValue('space-0')).toBe(0);
      expect(getSpacingValue('space-0-5')).toBe(1);
      expect(getSpacingValue('space-5')).toBe(16);
      expect(getSpacingValue('space-10')).toBe(48);
      expect(getSpacingValue('space-15')).toBe(150);
      expect(getSpacingValue('space-29')).toBe(1400);
    });

    it('throws error for invalid token', () => {
      expect(() => getSpacingValue('invalid-token' as SpacingToken)).toThrow(
        'Unknown spacing token: "invalid-token"',
      );
    });

    it('throws error for empty string', () => {
      expect(() => getSpacingValue('' as SpacingToken)).toThrow(
        'Unknown spacing token: ""',
      );
    });
  });

  describe('isSpacingToken', () => {
    it('returns true for valid spacing token names', () => {
      expect(isSpacingToken('space-0')).toBe(true);
      expect(isSpacingToken('space-5')).toBe(true);
      expect(isSpacingToken('space-15')).toBe(true);
      expect(isSpacingToken('space-29')).toBe(true);
      expect(isSpacingToken('space-0-5')).toBe(true);
    });

    it('returns false for invalid token names', () => {
      expect(isSpacingToken('invalid')).toBe(false);
      expect(isSpacingToken('space-30')).toBe(false);
      expect(isSpacingToken('space30')).toBe(false);
      expect(isSpacingToken('')).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(isSpacingToken(123)).toBe(false);
      expect(isSpacingToken(null)).toBe(false);
      expect(isSpacingToken(undefined)).toBe(false);
      expect(isSpacingToken({})).toBe(false);
      expect(isSpacingToken([])).toBe(false);
    });

    it('returns false for numeric values that could be pixel values', () => {
      expect(isSpacingToken(16)).toBe(false);
      expect(isSpacingToken(150)).toBe(false);
    });
  });
});
