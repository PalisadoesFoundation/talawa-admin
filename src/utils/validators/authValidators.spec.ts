import { vi, describe, it, expect, afterEach } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordConfirmation,
  getPasswordRequirements,
  PASSWORD_REGEX,
} from './authValidators';

describe('authValidators', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com').isValid).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk').isValid).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const result = validateEmail('bad');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('loginPage.emailInvalid');
    });

    it('should reject emails without @ symbol', () => {
      expect(validateEmail('userdomain.com').isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Bad1!pass').isValid).toBe(true);
    });

    it('should reject short passwords', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('loginPage.atleastEightCharLong');
    });

    it('should reject null/undefined passwords', () => {
      expect(validatePassword(null).isValid).toBe(false);
      expect(validatePassword(undefined).isValid).toBe(false);
    });

    it('should reject passwords missing requirements', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('loginPage.passwordInvalid');
    });
  });

  describe('validateName', () => {
    it('should validate proper names', () => {
      expect(validateName('Alex Doe').isValid).toBe(true);
      expect(validateName('Jo').isValid).toBe(true);
    });

    it('should reject short names', () => {
      const result = validateName(' ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('loginPage.nameInvalid');
    });

    it('should handle null/undefined names', () => {
      expect(validateName(null).isValid).toBe(false);
      expect(validateName(undefined).isValid).toBe(false);
    });
  });

  describe('validatePasswordConfirmation', () => {
    it('should validate matching passwords', () => {
      expect(validatePasswordConfirmation('Abcd123!', 'Abcd123!').isValid).toBe(
        true,
      );
    });

    it('should reject non-matching passwords', () => {
      const result = validatePasswordConfirmation('Abcd123!', 'xxxx');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('loginPage.passwordMismatches');
    });
  });

  describe('getPasswordRequirements', () => {
    it('should correctly identify password requirements', () => {
      const requirements = getPasswordRequirements('Test123!');
      expect(requirements.lowercase).toBe(true);
      expect(requirements.uppercase).toBe(true);
      expect(requirements.numeric).toBe(true);
      expect(requirements.specialChar).toBe(true);
    });

    it('should identify missing requirements', () => {
      const requirements = getPasswordRequirements('test');
      expect(requirements.lowercase).toBe(true);
      expect(requirements.uppercase).toBe(false);
      expect(requirements.numeric).toBe(false);
      expect(requirements.specialChar).toBe(false);
    });

    it('should handle empty/null passwords defensively', () => {
      const requirements = getPasswordRequirements('');
      expect(requirements.lowercase).toBe(false);
      expect(requirements.uppercase).toBe(false);
      expect(requirements.numeric).toBe(false);
      expect(requirements.specialChar).toBe(false);
    });
  });

  describe('PASSWORD_REGEX', () => {
    it('should correctly match character types', () => {
      expect(PASSWORD_REGEX.lowercase.test('a')).toBe(true);
      expect(PASSWORD_REGEX.uppercase.test('A')).toBe(true);
      expect(PASSWORD_REGEX.numeric.test('1')).toBe(true);
      expect(PASSWORD_REGEX.specialChar.test('!')).toBe(true);
    });
  });
});
