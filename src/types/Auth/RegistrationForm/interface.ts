/**
 * @fileoverview RegistrationForm component interface definitions
 * @description Defines props and data structures for the RegistrationForm component
 */

import type { InterfaceUserData } from '../LoginForm/interface';

// Re-export for convenience
export type { InterfaceUserData };

/**
 * Organization option for selection dropdown
 */
export interface InterfaceOrganizationOption {
  label: string;
  id: string;
}

/**
 * Props for the RegistrationForm component
 */
export interface InterfaceRegistrationFormProps {
  /**
   * List of organizations for selection
   */
  organizations: InterfaceOrganizationOption[];

  /**
   * Callback fired on successful registration with complete user data
   */
  onSuccess: (userData: InterfaceUserData) => void;

  /**
   * Callback fired on registration error
   */
  onError: (error: string) => void;

  /**
   * reCAPTCHA site key for bot protection
   */
  recaptchaSiteKey?: string;

  /**
   * Pending invitation token from URL
   */
  pendingInvitationToken?: string | null;

  /**
   * Test ID for testing purposes
   */
  testId?: string;
}

/**
 * Registration form data structure
 */
export interface InterfaceRegistrationFormData {
  signName: string;
  signEmail: string;
  signPassword: string;
  cPassword: string;
  signOrg: string;
}

/**
 * Password validation state
 */
export interface InterfacePasswordValidation {
  lowercaseChar: boolean;
  uppercaseChar: boolean;
  numericValue: boolean;
  specialChar: boolean;
}
