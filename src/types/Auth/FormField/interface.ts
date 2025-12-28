import type { ChangeEvent, FocusEvent } from 'react';

/**
 * Props interface for the FormField component.
 * Defines all available properties for form input fields with validation support.
 */
export interface InterfaceFormFieldProps {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  error?: string | null;
}
