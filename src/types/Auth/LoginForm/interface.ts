/**
 * @fileoverview LoginForm component interface definitions
 * @description Defines props and data structures for the LoginForm component
 */

/**
 * Essential user data returned on successful authentication
 */
export interface InterfaceUserData {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    emailAddress: string;
    role: 'administrator' | 'user';
    countryCode?: string;
    avatarURL?: string;
  };
}

/**
 * Props for the LoginForm component
 */
export interface InterfaceLoginFormProps {
  /**
   * Whether this is an admin login form
   */
  isAdmin: boolean;

  /**
   * Callback fired on successful login with complete user data
   */
  onSuccess: (userData: InterfaceUserData) => void;

  /**
   * Callback fired on login error
   */
  onError: (error: string) => void;

  /**
   * reCAPTCHA site key for bot protection
   */
  recaptchaSiteKey?: string;

  /**
   * Test ID for testing purposes
   */
  testId?: string;
}

/**
 * Login form data structure
 */
export interface InterfaceLoginFormData {
  email: string;
  password: string;
}
