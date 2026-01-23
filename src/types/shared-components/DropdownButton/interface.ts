import type { ReactNode } from 'react';
import { ButtonSize } from 'shared-components/Button';
import {
  DropdownItem,
  DropdownButtonVariant,
} from 'shared-components/DropdownButton/DropdownButton.types';

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
  dataTestId?: string;
  className?: string;
}
