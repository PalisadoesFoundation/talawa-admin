import { InterfaceFormFieldGroupProps } from '../../../types/FormFieldGroup/interface';

/**
 * Props for FormSelectField component.
 */
export interface InterfaceFormSelectFieldProps extends InterfaceFormFieldGroupProps {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}

/**
 * Props for FormCheckField component.
 * Used for checkbox, radio, and switch inputs.
 * Supports standard form attributes like checked, onChange, disabled, etc.
 */
export interface InterfaceFormCheckFieldProps extends InterfaceFormFieldGroupProps {
  type?: 'checkbox' | 'radio' | 'switch';
  id?: string;
  checked?: boolean;
  value?: string | number | readonly string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  inline?: boolean;
  className?: string;
}
