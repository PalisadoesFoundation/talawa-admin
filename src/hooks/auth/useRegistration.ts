import { useState } from 'react';
import type { InterfaceSignUpData } from '../../types/Auth/RegistrationForm/interface';

/**
 * Props for the useRegistration hook
 */
interface IUseRegistrationProps {
  /** Callback function called on successful registration */
  onSuccess?: (signUpData: InterfaceSignUpData) => void;
  /** Callback function called on registration error */
  onError?: (error: Error) => void;
}

/**
 * Custom hook for user registration
 */
export const useRegistration = ({
  onSuccess,
  onError,
}: IUseRegistrationProps) => {
  const [loading, setLoading] = useState(false);

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    organizationId: string;
    recaptchaToken?: string;
  }) => {
    setLoading(true);
    try {
      // Mock registration - in real implementation, this would call GraphQL mutation
      // For now, we validate that data is provided
      if (!data.name || !data.email || !data.password) {
        throw new Error('Missing required registration data');
      }
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Mock signup data structure
      const mockSignUpData: InterfaceSignUpData = {
        signUp: {
          user: {
            id: 'mock-user-id',
          },
          authenticationToken: 'mock-auth-token',
        },
      };

      if (onSuccess) {
        onSuccess(mockSignUpData);
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
