import type { TargetsType } from 'state/reducers/routesReducer';
export interface InterfaceDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}

export interface InterfaceCollapsibleDropdown {
  showDropdown: boolean;
  target: TargetsType;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}
