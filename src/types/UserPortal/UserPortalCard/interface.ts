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
 * @property imageSlot Optional left section (avatar, logo, thumbnail, icon)
 * @property children Main content area (required)
 * @property actionsSlot Optional right section (buttons, badges, counters)
 * @property variant Visual density preset controlling padding and spacing
 * @property className Optional additional class for the outer container
 * @property dataTestId Optional test id prefix for unit/e2e testing
 * @property ariaLabel Accessible label for the card container (i18n required)
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
