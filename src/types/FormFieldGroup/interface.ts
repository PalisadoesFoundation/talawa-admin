export interface InterfaceFormFieldGroupProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  touched?: boolean;
  'data-testid'?: string;
}

export interface IFormTextFieldProps extends InterfaceFormFieldGroupProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}
