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

  const register = async () => {
    setLoading(true);
    try {
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
