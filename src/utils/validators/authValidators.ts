/**
 * Authentication validation utilities for form inputs.
 * Provides centralized, testable validation logic for email, password, and name fields.
 */

import type { InterfaceValidationResult } from '../../types/Auth/ValidationInterfaces';

/**
 * Regular expressions for password validation.
 */
export const PASSWORD_REGEX = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  numeric: /[0-9]/,
  specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
} as const;

/**
 * Validates email format.
 * @param email - Email address to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): InterfaceValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
    ? { isValid: true }
    : { isValid: false, error: 'email_invalid' };
}

/**
 * Validates password complexity requirements.
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function validatePassword(password: string): InterfaceValidationResult {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'atleast_8_char_long' };
  }

  const hasLowercase = PASSWORD_REGEX.lowercase.test(password);
  const hasUppercase = PASSWORD_REGEX.uppercase.test(password);
  const hasNumeric = PASSWORD_REGEX.numeric.test(password);
  const hasSpecialChar = PASSWORD_REGEX.specialChar.test(password);

  if (hasLowercase && hasUppercase && hasNumeric && hasSpecialChar) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'password_invalid',
  };
}

/**
 * Validates name field requirements.
 * @param name - Name to validate
 * @returns Validation result with error message if invalid
 */
export function validateName(name: string): InterfaceValidationResult {
  const trimmedName = (name ?? '').trim();
  return trimmedName.length >= 2
    ? { isValid: true }
    : { isValid: false, error: 'fillCorrectly' };
}

/**
 * Validates password confirmation matches original password.
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Validation result with error message if passwords don't match
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): InterfaceValidationResult {
  return password === confirmPassword
    ? { isValid: true }
    : { isValid: false, error: 'passwordMismatches' };
}
