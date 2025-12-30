/**
 * @file interface.ts
 * @description Type definitions for the StatusBadge component
 *
 * This file contains all TypeScript interfaces and types used by the StatusBadge component.
 * It defines domain-specific status variants, semantic variants for internal mapping,
 * size variants, and the main component props interface.
 */

/**
 * Domain-specific status variants that map to semantic meanings.
 * These represent business logic states that are mapped to visual representations.
 */
export type StatusVariant =
  | 'completed' // → success
  | 'pending' // → warning
  | 'active' // → success
  | 'inactive' // → neutral
  | 'approved' // → success
  | 'rejected' // → error
  | 'disabled' // → neutral
  | 'accepted' // → success
  | 'declined' // → error
  | 'no_response'; // → info

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
 *
 * @interface InterfaceStatusBadgeProps
 * @property {StatusVariant} variant - The domain-specific status variant
 * @property {StatusSize} [size='md'] - The size of the badge (optional, defaults to 'md')
 * @property {string} [label] - Custom label text (optional, overrides i18n)
 * @property {React.ReactNode} [icon] - Optional icon to display in the badge
 * @property {string} [ariaLabel] - Custom aria-label for accessibility (optional, overrides default)
 * @property {string} [className] - Additional CSS classes to apply
 */
export interface InterfaceStatusBadgeProps {
  variant: StatusVariant;
  size?: StatusSize;
  label?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}
