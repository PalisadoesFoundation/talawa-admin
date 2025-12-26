import { useState } from 'react';

export interface IUsePasswordVisibilityReturn {
  showPassword: boolean;
  togglePassword: () => void;
}

export function usePasswordVisibility(
  initialVisible: boolean = false,
): IUsePasswordVisibilityReturn {
  const [showPassword, setShowPassword] = useState<boolean>(initialVisible);

  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    togglePassword,
  };
}
