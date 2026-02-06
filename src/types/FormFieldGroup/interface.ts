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
  /** Additional HTML input attributes */
  id?: string;
  autoComplete?: string;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  pattern?: string;
  maxLength?: number;
  min?: number | string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  as?: string;
  rows?: number;
  fullWidth?: boolean;
  multiline?: boolean;
  minRows?: number;
  /** ARIA and other standard HTML attributes */
  role?: string;
  'aria-expanded'?: boolean;
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  'aria-controls'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  'data-cy'?: string;
}
