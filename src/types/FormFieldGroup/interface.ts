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
}

export interface IFormTextFieldProps extends InterfaceFormFieldGroupProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  value: string;
  onChange?: (v: string) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  disabled?: boolean;
  [x: string]: unknown;
}
