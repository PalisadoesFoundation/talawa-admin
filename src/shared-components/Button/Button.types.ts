import type { ReactNode, HTMLAttributes } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonIconPosition = 'start' | 'end';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark'
  | 'outlined'
  | 'outline'
  | 'contained'
  | 'text'
  | 'toolbar'
  | 'toolbar-action'
  | (string & {});

export interface InterfaceButtonProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'size'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: ReactNode;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  name?: string;
  value?: string | number | readonly string[];
  form?: string;
}

export type ButtonProps = InterfaceButtonProps;
