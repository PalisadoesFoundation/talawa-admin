import type React from 'react';

/**
 * Domain-specific status variants that map to semantic meanings.
 * These represent business logic states that are mapped to visual representations.
 */
export type StatusVariant =
  | 'completed' // -> success
  | 'pending' // -> warning
  | 'active' // -> success
  | 'inactive' // -> neutral
  | 'approved' // -> success
  | 'rejected' // -> error
  | 'disabled' // -> neutral
  | 'accepted' // -> success
  | 'declined' // -> error
  | 'no_response'; // -> info

/**
 * Semantic variants for internal mapping.
 * These represent the visual state of the badge.
 */
export type SemanticVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

/**
 * Size variants for the badge.
 * Small (sm), Medium (md), and Large (lg) sizes are available.
 */
export type StatusSize = 'sm' | 'md' | 'lg';

/**
 * Props interface for the StatusBadge component.
 */
export interface InterfaceStatusBadgeProps {
  /** The domain-specific status variant */
  variant: StatusVariant;
  /** The size of the badge (optional, defaults to 'md') */
  size?: StatusSize;
  /** Custom label text (optional, overrides i18n) */
  label?: string;
  /** Optional icon to display in the badge */
  icon?: React.ReactNode;
  /** Custom aria-label for accessibility (optional, overrides default) */
  ariaLabel?: string;
  /** Additional CSS classes to apply */
  className?: string;
  /** Test ID for component testing (forwarded as data-testid) */
  dataTestId?: string;
}
