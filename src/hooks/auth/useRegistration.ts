import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

/**
 * Error codes for registration validation (use as i18n keys in errors namespace).
 */
export const RegistrationErrorCode = {
  MISSING_REQUIRED_FIELDS: 'missingRegistrationFields',
  MISSING_ORGANIZATION_ID: 'missingOrganizationId',
} as const;

export type RegistrationErrorCodeType =
  (typeof RegistrationErrorCode)[keyof typeof RegistrationErrorCode];

/**
 * Error thrown when registration validation fails. Callers can use error.code
 * with t(error.code) for translated messages.
 */
export class RegistrationError extends Error {
  constructor(
    public readonly code: RegistrationErrorCodeType,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'RegistrationError';
    Object.setPrototypeOf(this, RegistrationError.prototype);
  }
}

/**
 * Result passed to onSuccess so the parent can handle session and redirect.
 */
export interface IRegistrationSuccessResult {
  signUp: { user: { id: string } };
  name: string;
  email: string;
}

/**
 * Props for the useRegistration hook
 */
interface IUseRegistrationProps {
  /** Callback function called on successful registration with result and form data */
  onSuccess?: (result: IRegistrationSuccessResult) => void;
  /** Callback function called on registration error */
  onError?: (error: Error) => void;
}

/**
 * Input for the register function (matches SIGNUP_MUTATION variables).
 */
export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  organizationId: string;
  recaptchaToken?: string | null;
}

/**
 * Custom hook for user registration using SIGNUP_MUTATION.
 */
export const useRegistration = ({
  onSuccess,
  onError,
}: IUseRegistrationProps) => {
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);
  const [error, setError] = useState<Error | null>(null);

  const register = async (data: IRegisterInput): Promise<void> => {
    setError(null);
    try {
      if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) {
        const err = new RegistrationError(
          RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
        );
        setError(err);
        onError?.(err);
        return;
      }
      const organizationId = data.organizationId?.trim();
      if (!organizationId) {
        const err = new RegistrationError(
          RegistrationErrorCode.MISSING_ORGANIZATION_ID,
        );
        setError(err);
        onError?.(err);
        return;
      }
      const { data: signUpData } = await signup({
        variables: {
          ID: organizationId,
          name: data.name,
          email: data.email,
          password: data.password,
          ...(data.recaptchaToken && { recaptchaToken: data.recaptchaToken }),
        },
      });

      if (signUpData?.signUp) {
        onSuccess?.({
          signUp: signUpData.signUp,
          name: data.name,
          email: data.email,
        });
      }
    } catch (caughtError) {
      const err = caughtError as Error;
      setError(err);
      onError?.(err);
    }
  };

  return { register, loading, error };
};
