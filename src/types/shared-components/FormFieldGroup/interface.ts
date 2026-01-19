import { InterfaceFormFieldGroupProps } from '../../../types/FormFieldGroup/interface';

/**
 * Props for FormSelectField component.
 */
export interface InterfaceFormSelectFieldProps
  extends InterfaceFormFieldGroupProps {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}
