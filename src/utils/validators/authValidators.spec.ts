/**
 * Test suite for authentication validation utilities.
 */

import {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordConfirmation,
  PASSWORD_REGEX,
} from './authValidators';

describe('authValidators', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
      ];

      validEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        'user@',
        '@domain.com',
        'user@domain',
        'user.domain.com',
        'user @domain.com',
        'user@domain .com',
        '',
      ];

      invalidEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email format');
      });
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MyStr0ng@Pass',
        'C0mplex#Pass',
        'Secure1$',
      ];

      strongPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject passwords shorter than 8 characters', () => {
      const shortPasswords = ['Pass1!', 'Ab1!', ''];

      shortPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Password must be at least 8 characters');
      });
    });

    it('should reject passwords missing lowercase letters', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must include lowercase, uppercase, number, and special character',
      );
    });

    it('should reject passwords missing uppercase letters', () => {
      const result = validatePassword('password123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must include lowercase, uppercase, number, and special character',
      );
    });

    it('should reject passwords missing numbers', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must include lowercase, uppercase, number, and special character',
      );
    });

    it('should reject passwords missing special characters', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must include lowercase, uppercase, number, and special character',
      );
    });

    it('should handle null/undefined passwords', () => {
      const result = validatePassword(null as unknown as string);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });
  });

  describe('validateName', () => {
    it('should validate names with 2 or more characters', () => {
      const validNames = [
        'John Doe',
        'Alice',
        'Bob',
        'María García',
        '李小明',
        'A B',
      ];

      validNames.forEach((name) => {
        const result = validateName(name);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject names shorter than 2 characters', () => {
      const invalidNames = ['A', '', ' '];

      invalidNames.forEach((name) => {
        const result = validateName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Name must be at least 2 characters');
      });
    });

    it('should trim whitespace before validation', () => {
      const result = validateName('  John  ');
      expect(result.isValid).toBe(true);
    });

    it('should handle null/undefined names', () => {
      const result = validateName(null as unknown as string);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });
  });

  describe('validatePasswordConfirmation', () => {
    it('should validate matching passwords', () => {
      const password = 'Password123!';
      const result = validatePasswordConfirmation(password, password);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-matching passwords', () => {
      const result = validatePasswordConfirmation(
        'Password123!',
        'Different123!',
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should handle empty passwords', () => {
      const result = validatePasswordConfirmation('', '');
      expect(result.isValid).toBe(true);
    });

    it('should be case sensitive', () => {
      const result = validatePasswordConfirmation(
        'Password123!',
        'password123!',
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });
  });

  describe('PASSWORD_REGEX', () => {
    it('should correctly identify lowercase letters', () => {
      expect(PASSWORD_REGEX.lowercase.test('abc')).toBe(true);
      expect(PASSWORD_REGEX.lowercase.test('ABC')).toBe(false);
      expect(PASSWORD_REGEX.lowercase.test('123')).toBe(false);
    });

    it('should correctly identify uppercase letters', () => {
      expect(PASSWORD_REGEX.uppercase.test('ABC')).toBe(true);
      expect(PASSWORD_REGEX.uppercase.test('abc')).toBe(false);
      expect(PASSWORD_REGEX.uppercase.test('123')).toBe(false);
    });

    it('should correctly identify numeric digits', () => {
      expect(PASSWORD_REGEX.numeric.test('123')).toBe(true);
      expect(PASSWORD_REGEX.numeric.test('abc')).toBe(false);
      expect(PASSWORD_REGEX.numeric.test('ABC')).toBe(false);
    });

    it('should correctly identify special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';
      expect(PASSWORD_REGEX.specialChar.test(specialChars)).toBe(true);
      expect(PASSWORD_REGEX.specialChar.test('abc123')).toBe(false);
    });
  });
});
