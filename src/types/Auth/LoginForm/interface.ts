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
 * Props for the LoginForm component.
 *
 * @remarks
 * LoginForm composes EmailField and PasswordField to create a reusable
 * login form with callback support for success/error handling.
 */
export interface InterfaceLoginFormProps {
  /** Whether this is an admin login form (affects heading text) */
  isAdmin?: boolean;
  /** Callback fired on successful login with authentication token */
  onSuccess?: (token: string) => void;
  /** Callback fired when login fails with error details */
  onError?: (error: Error) => void;
  /** Test ID for testing purposes */
  testId?: string;
}
