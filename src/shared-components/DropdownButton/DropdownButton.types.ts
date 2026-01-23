import type { ReactNode } from 'react';
import { ButtonSize } from 'shared-components/Button';

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

export type DropdownButtonProps = {
  label: ReactNode;
  items: DropdownItem[];

  disabled?: boolean;
  variant?: DropdownButtonVariant;
  size?: ButtonSize;

  align?: 'start' | 'end';
  dataTestId?: string;
  className?: string;
};
