import type { TargetsType } from 'state/reducers/routesReducer';
export interface InterfaceDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}

/**
 * Props for DynamicDropDown change-handling variant.
 * @typeParam T - Form state shape.
 */
export interface InterfaceChangeDropDownProps<T>
  extends InterfaceDropDownProps {
  /** State setter for the form. */
  setFormState: React.Dispatch<React.SetStateAction<T>>;
  /** Current form state. */
  formState: T;
  /** Dropdown options. */
  fieldOptions: { value: string; label: string }[];
  /** Form field name bound to this dropdown. */
  fieldName: string;
  /** Optional custom change handler. */
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface InterfaceCollapsibleDropdown {
  showDropdown: boolean;
  target: TargetsType;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}
