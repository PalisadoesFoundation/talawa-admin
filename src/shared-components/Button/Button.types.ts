import type { ReactNode } from 'react';
import type { ButtonProps as BootstrapButtonProps } from 'react-bootstrap/Button';
import type { ButtonVariant as BootstrapButtonVariant } from 'react-bootstrap/esm/types';

/**
 * Supported sizes for the shared Button component.
 * - `md` maps to the default react-bootstrap size.
 * - `xl` applies custom padding/typography via CSS modules.
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/** Position of an optional icon relative to the label. */
export type ButtonIconPosition = 'start' | 'end';

/**
 * Variant palette supported by react-bootstrap (including outline variants) plus
 * a couple of legacy aliases used in the app codebase.
 */
export type ButtonVariant =
  | BootstrapButtonVariant
  | 'outlined'
  | 'outline'
  | (string & {});

/**
 * Props for the shared Button wrapper.
 * Extends react-bootstrap Button props and adds loading, icon, and layout helpers.
 */
export interface InterfaceButtonProps extends Omit<
  BootstrapButtonProps,
  'size' | 'variant'
> {
  /** Visual variant (e.g., primary, outline-primary, danger). */
  variant?: ButtonVariant;
  /** Size token. `md` is the default; `xl` uses custom styling. */
  size?: ButtonSize;
  /** Stretch to the parent width. */
  fullWidth?: boolean;
  /** Show the loading spinner and disable interactions. */
  isLoading?: boolean;
  /** Optional text to display while loading; falls back to children. */
  loadingText?: ReactNode;
  /** Optional leading/trailing icon. */
  icon?: ReactNode;
  /** Placement of the icon relative to the text. */
  iconPosition?: ButtonIconPosition;
}

/** Consumer-friendly alias that matches existing imports. */
export type ButtonProps = InterfaceButtonProps;
