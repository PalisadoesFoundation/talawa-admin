import type { ReactNode } from 'react';
import { ButtonSize } from 'shared-components/Button';
import { DropdownButtonVariant } from './DropdownButtonVariant/interface';
import { DropdownItem } from './DropdownItem/interface';
/**
 * Props for DropdownButton component.
 */
export interface InterfaceDropdownButtonProps {
  label: ReactNode;
  items: DropdownItem[];

  disabled?: boolean;
  variant?: DropdownButtonVariant;
  size?: ButtonSize;

  align?: 'start' | 'end';
  className?: string;
  dataTestId?: string;
  labelTestId?: string;
}
