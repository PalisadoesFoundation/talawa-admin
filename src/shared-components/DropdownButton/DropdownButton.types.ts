export type DropdownItem = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export type DropdownButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger';

export type DropdownButtonSize = 'sm' | 'md' | 'lg' | 'xl';
