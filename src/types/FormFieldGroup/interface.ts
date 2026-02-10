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

export interface IFormTextFieldProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'name' | 'disabled' | 'value' | 'onChange' | 'size' | 'as'
    >,
    InterfaceFormFieldGroupProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  value: string;
  onChange?: (v: string) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
  as?: 'input' | 'textarea';
}
