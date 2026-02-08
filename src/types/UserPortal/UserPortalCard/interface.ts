import React from 'react';

/**
 * Props for UserPortalCard — a flexible layout wrapper for User Portal cards.
 *
 * Layout:
 * [ imageSlot ] [ children / content ] [ actionsSlot ]
 *
 * This component centralizes layout, spacing, and density while keeping
 * all content and text controlled by consuming components.
 *
 * @param imageSlot - (Optional) Left section (avatar, logo, thumbnail, icon)
 * @param children - Main content area (required)
 * @param actionsSlot - (Optional) Right section (buttons, badges, counters)
 * @param variant - Visual density preset controlling padding and spacing
 * @param className - (Optional) Additional class for the outer container
 * @param dataTestId - (Optional) Test id prefix for unit/e2e testing
 * @param ariaLabel - Accessible label for the card container (i18n required)
 */
export interface InterfaceUserPortalCardProps {
  imageSlot?: React.ReactNode;
  children: React.ReactNode;
  actionsSlot?: React.ReactNode;
  variant?: 'compact' | 'standard' | 'expanded';
  className?: string;
  dataTestId?: string;
  ariaLabel?: string;
}
