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
  labelClassName?: string;
  inline?: boolean;
  hideLabel?: boolean;
  className?: string;
  disabled?: boolean;
  inputId?: string;
}

export interface IFormTextFieldProps extends InterfaceFormFieldGroupProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  value: string;
  onChange?: (v: string) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  disabled?: boolean;
  /** Additional HTML input attributes passed through to the underlying control */
  [x: string]: unknown;
}
