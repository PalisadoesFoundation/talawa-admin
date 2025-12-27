import { useState, useCallback, useEffect } from 'react';
import type {
  IValidationResult,
  ValidationTrigger,
  IUseFieldValidationReturn,
} from '../types/Auth/useFieldValidation';

/**
 * Generic hook to manage field-level validation state.
 *
 * @param validator - Function that validates a field value
 * @param value - Current field value
 * @param trigger - Validation trigger strategy
 * @returns Validation error state and helper functions
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

  useEffect(() => {
    if (trigger === 'onChange') {
      validate();
    }
  }, [value, trigger, validate]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    error,
    validate,
    clearError,
  };
}
