import { useState, useCallback, useRef, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import type { InterfaceSignInResult } from 'types/Auth/LoginForm/interface';
import type {
  ILoginCredentials,
  IUseLoginOptions,
} from 'types/Auth/useLogin/interface';

/**
 * Custom hook for user login.
 * Encapsulates login GraphQL logic with consistent error/success handling.
 *
 * @param opts - Optional callbacks for success and error handling
 * @returns Object containing login function, loading state, and error state
 * @throws Error - Always rethrows errors after setting error state and calling onError callback.
 *                 Callers should either wrap login() in try/catch or rely on error state + onError.
 *
 * @example
 * ```tsx
 * const { login, loading, error } = useLogin({
 *   onSuccess: (result) => console.log('Logged in:', result.user.name),
 *   onError: (err) => console.error('Login failed:', err)
 * });
 * await login({ email: 'user@example.com', password: 'password123' });
 * ```
 */
export const useLogin = (opts?: IUseLoginOptions) => {
  // Manual loading state provides synchronous control before query fires
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [signin] = useLazyQuery<{
    signIn: InterfaceSignInResult;
  }>(SIGNIN_QUERY, { fetchPolicy: 'network-only' });

  // Stabilize callbacks with ref to prevent login recreation on every render
  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  }, [opts]);

  const login = useCallback(
    async (credentials: ILoginCredentials): Promise<InterfaceSignInResult> => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await signin({
          variables: {
            email: credentials.email,
            password: credentials.password,
            ...(credentials.recaptchaToken != null && {
              recaptchaToken: credentials.recaptchaToken,
            }),
          },
        });

        if (!data?.signIn) {
          throw new Error('Login failed');
        }

        const result: InterfaceSignInResult = data.signIn;
        optsRef.current?.onSuccess?.(result);
        return result;
      } catch (e: unknown) {
        const err = new Error((e as Error)?.message ?? 'Login failed', {
          cause: e,
        });
        setError(err);
        optsRef.current?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [signin],
  );

  return { login, loading, error };
};
