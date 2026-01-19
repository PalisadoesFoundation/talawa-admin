/**
 * Props for FormFieldGroup component.
 */
export interface InterfaceFormFieldGroupProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  touched?: boolean;
  'data-testid'?: string;
  onBlur?: () => void;
}

export interface IFormTextFieldProps extends InterfaceFormFieldGroupProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  value: string | number;
  onChange: (v: string) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  disabled?: boolean;
  [x: string]: unknown;
}
