import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

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

  const register = async (data: IRegisterInput): Promise<void> => {
    try {
      if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) {
        onError?.(new Error('Missing required registration data'));
        return;
      }
      const { data: signUpData } = await signup({
        variables: {
          ID: data.organizationId || '',
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
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return { register, loading };
};
