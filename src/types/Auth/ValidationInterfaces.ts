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
