export interface IValidationResult {
  isValid: boolean;
  error?: string;
}

export type ValidationTrigger = 'onChange' | 'onBlur' | 'manual';

export interface IUseFieldValidationReturn {
  error: string | null;
  validate: () => boolean;
  clearError: () => void;
}
