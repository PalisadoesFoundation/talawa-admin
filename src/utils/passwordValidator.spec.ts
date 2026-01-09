import { describe, it, expect, vi, afterEach } from 'vitest';
import { validatePassword } from './passwordValidator';

describe('validatePassword', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return true for valid passwords', () => {
    const validPasswords = [
      'Password1!',
      'Complex123#',
      'SuperSecure2023!',
      'Test@1234',
      '!Abcd1234',
    ];

    validPasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(true);
    });
  });

  it('should return false for passwords shorter than 8 characters', () => {
    const shortPasswords = ['Pass1!', 'Ab1!def', 'A1!b'];

    shortPasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(false);
    });
  });

  it('should return false for passwords without special characters', () => {
    const noSpecialCharPasswords = [
      'Password123',
      'AbcdEfgh1',
      'ComplexPass123',
    ];

    noSpecialCharPasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(false);
    });
  });

  it('should return false for passwords without numbers', () => {
    const noNumberPasswords = ['Password!@', 'AbcdEfgh!', 'ComplexPass!'];

    noNumberPasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(false);
    });
  });

  it('should return false for passwords without uppercase letters', () => {
    const noUppercasePasswords = ['password1!', 'complex123!', 'test@1234'];

    noUppercasePasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(false);
    });
  });

  it('should return false for passwords without lowercase letters', () => {
    const noLowercasePasswords = ['PASSWORD1!', 'COMPLEX123!', 'TEST@1234'];

    noLowercasePasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(false);
    });
  });

  it('should return false for empty strings', () => {
    expect(validatePassword('')).toBe(false);
  });

  it('should return true for passwords with spaces', () => {
    const passwordsWithSpaces = ['Password 1!', 'Complex 123#', 'Test @ 1234'];

    passwordsWithSpaces.forEach((password) => {
      expect(validatePassword(password)).toBe(true);
    });
  });
});
