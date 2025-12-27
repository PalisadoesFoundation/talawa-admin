/**
 * Authentication validation utilities for form inputs.
 * Provides centralized, testable validation logic for email, password, and name fields.
 */

/**
 * Result of a validation operation.
 */
export interface InterfaceValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Password complexity requirements status.
 */
export interface InterfacePasswordRequirements {
  /** Has lowercase letter */
  lowercase: boolean;
  /** Has uppercase letter */
  uppercase: boolean;
  /** Has numeric digit */
  numeric: boolean;
  /** Has special character */
  specialChar: boolean;
}

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
    : { isValid: false, error: 'Invalid email format' };
}

/**
 * Validates password complexity requirements.
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function validatePassword(password: string): InterfaceValidationResult {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
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
    error:
      'Password must include lowercase, uppercase, number, and special character',
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
    : { isValid: false, error: 'Name must be at least 2 characters' };
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
    : { isValid: false, error: 'Passwords do not match' };
}
