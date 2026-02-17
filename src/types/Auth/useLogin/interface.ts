import type { InterfaceSignInResult } from '../LoginForm/interface';

/**
 * Credentials required for login.
 */
export interface ILoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string | null;
}

/**
 * Options for the useLogin hook.
 */
export interface IUseLoginOptions {
  onSuccess?: (result: InterfaceSignInResult) => void;
  onError?: (error: Error) => void;
}
