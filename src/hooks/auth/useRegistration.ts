import { useState } from 'react';

interface IUseRegistrationProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

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
  }) => {
    setLoading(true);
    try {
      // Mock registration - in real implementation, this would call GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (onSuccess) {
        onSuccess();
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
