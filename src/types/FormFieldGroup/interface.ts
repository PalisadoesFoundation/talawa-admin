export interface IFormFieldGroupProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  touched?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export interface IFormTextFieldProps extends IFormFieldGroupProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  showCharCount?: boolean;
}
