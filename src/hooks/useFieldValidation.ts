import { useState, useCallback, useEffect } from 'react';
import type {
  IValidationResult,
  ValidationTrigger,
  IUseFieldValidationReturn,
} from '../types/Auth/useFieldValidation';

/**
 * Generic hook to manage field-level validation state.
 */
export function useFieldValidation<T>(
  validator: (value: T) => IValidationResult,
  value: T,
  trigger: ValidationTrigger = 'onBlur',
): IUseFieldValidationReturn {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((): boolean => {
    const result = validator(value);
    setError(result.isValid ? null : (result.error ?? 'Invalid value'));
    return result.isValid;
  }, [validator, value]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  useEffect(() => {
    if (trigger === 'onChange') {
      validate();
    }
  }, [value, trigger, validate]);

  return {
    error,
    validate,
    clearError,
  };
}
