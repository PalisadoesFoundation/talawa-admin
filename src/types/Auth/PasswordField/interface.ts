import type { ChangeEvent } from 'react';

/**
 * Props interface for the PasswordField component.
 * Extends basic form field functionality with password visibility toggle features.
 */
export interface InterfacePasswordFieldProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  testId?: string;
  showPassword?: boolean;
  onToggleVisibility?: () => void;
}
