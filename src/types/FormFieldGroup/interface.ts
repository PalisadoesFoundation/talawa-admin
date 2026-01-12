export interface IFormFieldGroupProps {
  name?: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  touched?: boolean;
}

export interface IFormTextFieldProps extends IFormFieldGroupProps {
  as?: 'input' | 'textarea';
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  value: string | number;
  id?: string;
  autoComplete?: string;
  className?: string;
  onChange: (value: string) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: string | number;
  disabled?: boolean;
}
export type FileInputProps = IFormFieldGroupProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    type: 'file';
    onChange: (files: FileList | null) => void;
  };
