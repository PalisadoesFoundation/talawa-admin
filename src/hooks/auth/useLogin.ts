import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import type { InterfaceSignInResult } from 'types/Auth/LoginForm/interface';

export interface ILoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string | null;
}

export interface IUseLoginOptions {
  onSuccess?: (result: InterfaceSignInResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for user login.
 * Encapsulates login GraphQL logic with consistent error/success handling.
 */
export const useLogin = (opts?: IUseLoginOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [signin] = useLazyQuery(SIGNIN_QUERY, { fetchPolicy: 'network-only' });

  const login = async (
    credentials: ILoginCredentials,
  ): Promise<InterfaceSignInResult> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await signin({
        variables: {
          email: credentials.email,
          password: credentials.password,
          ...(credentials.recaptchaToken && {
            recaptchaToken: credentials.recaptchaToken,
          }),
        },
      });

      if (!data?.signIn) {
        throw new Error('Login failed');
      }

      const result: InterfaceSignInResult = data.signIn;
      opts?.onSuccess?.(result);
      return result;
    } catch (e: unknown) {
      const err = new Error((e as Error)?.message ?? 'Login failed');
      setError(err);
      opts?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
