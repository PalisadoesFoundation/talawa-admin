/**
 * Form data structure for login form state.
 */
export interface InterfaceLoginFormData {
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Shape of the signIn result from SIGNIN_QUERY, passed to onSuccess so the
 * parent can handle session, redirect, and invitation logic.
 */
export interface InterfaceSignInResult {
  user: {
    id: string;
    name: string;
    emailAddress: string;
    role: string;
    countryCode: string | null;
    avatarURL: string | null;
    isEmailAddressVerified: boolean;
  };
  authenticationToken: string;
  refreshToken?: string;
}

/**
 * Props for the LoginForm component.
 *
 * @remarks
 * LoginForm composes EmailField and PasswordField to create a reusable
 * login form with callback support for success/error handling.
 */
export interface InterfaceLoginFormProps {
  /** Whether this is an admin login form (affects heading text) */
  isAdmin?: boolean;
  /** Callback fired on successful login with full signIn result (user + tokens) */
  onSuccess?: (signInResult: InterfaceSignInResult) => void;
  /** Callback fired when login fails with error details */
  onError?: (error: Error) => void;
  /** Test ID for testing purposes */
  testId?: string;
  /** When true, render ReCAPTCHA and send token with sign-in request */
  enableRecaptcha?: boolean;
}
