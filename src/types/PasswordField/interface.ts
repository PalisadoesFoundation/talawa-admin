/**
 * Props for the PasswordField component
 */
export interface InterfacePasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  testId?: string;
  autoComplete?: string;
}
