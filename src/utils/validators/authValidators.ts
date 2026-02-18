import type {
  InterfaceValidationResult,
  InterfacePasswordRequirements,
} from '../../types/Auth/ValidationInterfaces';

export const PASSWORD_REGEX = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  numeric: /[0-9]/,
  specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
} as const;

/**
 * Validates email format.
 * Note: Uses basic regex validation. Does not enforce RFC 5322 compliance.
 * @param email - Email address to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): InterfaceValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
    ? { isValid: true }
    : { isValid: false, error: 'loginPage.emailInvalid' };
}

/**
 * Validates password complexity requirements.
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function validatePassword(
  password: string | null | undefined,
): InterfaceValidationResult {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'loginPage.atleastEightCharLong' };
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
    error: 'loginPage.passwordInvalid',
  };
}

/**
 * Validates name field requirements.
 * @param name - Name to validate
 * @returns Validation result with error message if invalid
 */
export function validateName(
  name: string | null | undefined,
): InterfaceValidationResult {
  const trimmedName = (name ?? '').trim();
  return trimmedName.length >= 2
    ? { isValid: true }
    : { isValid: false, error: 'loginPage.nameInvalid' };
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
    : { isValid: false, error: 'loginPage.passwordMismatches' };
}

/**
 * Checks password requirements status.
 * @param password - Password to check
 * @returns Object indicating which requirements are met
 */
export function getPasswordRequirements(
  password: string,
): InterfacePasswordRequirements {
  if (!password) {
    return {
      lowercase: false,
      uppercase: false,
      numeric: false,
      specialChar: false,
    };
  }

  return {
    lowercase: PASSWORD_REGEX.lowercase.test(password),
    uppercase: PASSWORD_REGEX.uppercase.test(password),
    numeric: PASSWORD_REGEX.numeric.test(password),
    specialChar: PASSWORD_REGEX.specialChar.test(password),
  };
}
