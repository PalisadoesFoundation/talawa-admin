import React from 'react';

/**
 * Props for UserPortalCard — a flexible layout wrapper for User Portal cards.
 *
 * Layout:
 * [ imageSlot ] [ children / content ] [ actionsSlot ]
 *
 * This component centralizes layout, spacing, and density while keeping
 * all content and text controlled by consuming components.
 */
export interface InterfaceUserPortalCardProps {
  /** (Optional) Left section (avatar, logo, thumbnail, icon) */
  imageSlot?: React.ReactNode;
  /** Main content area (required) */
  children: React.ReactNode;
  /** (Optional) Right section (buttons, badges, counters) */
  actionsSlot?: React.ReactNode;
  /** Visual density preset controlling padding and spacing */
  variant?: 'compact' | 'standard' | 'expanded';
  /** (Optional) Additional class for the outer container */
  className?: string;
  /** (Optional) Test id prefix for unit/e2e testing */
  dataTestId?: string;
  /** (Optional) Accessible label for the card container (i18n required) */
  ariaLabel?: string;
}
