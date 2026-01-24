import type { TargetsType } from 'state/reducers/routesReducer';
export interface InterfaceDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}

export interface InterfaceChangeDropDownProps<
  T,
> extends InterfaceDropDownProps {
  setFormState: React.Dispatch<React.SetStateAction<T>>;
  formState: T;
  fieldOptions: { value: string; label: string }[];
  fieldName: string;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface InterfaceCollapsibleDropdown {
  showDropdown: boolean;
  target: TargetsType;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}
