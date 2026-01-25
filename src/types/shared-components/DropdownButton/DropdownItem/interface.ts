export type DropdownItem = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  dataTestId?: string;
  labelTestId?: string;
};
