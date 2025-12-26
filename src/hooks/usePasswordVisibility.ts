import { useState } from 'react';
import type { IUsePasswordVisibilityReturn } from '../types/Auth/usePasswordVisibility';

/**
 * Custom hook to manage password visibility state for authentication inputs.
 *
 * @param initialVisible - Optional initial visibility state (defaults to false)
 * @returns Object containing showPassword state and togglePassword function
 */
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
