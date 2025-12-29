/**
 * @file StatusBadge.tsx
 * @description A reusable status badge component that wraps MUI Chip with consistent styling and i18n support
 *
 * This component provides a standardized way to display status information across the application.
 * It maps domain-specific status variants to semantic visual representations and supports
 * internationalization, accessibility, and customization.
 *
 * @module StatusBadge
 *
 * @example
 * // Basic usage
 * <StatusBadge variant="completed" />
 *
 * @example
 * // With custom size and icon
 * <StatusBadge variant="pending" size="lg" icon={<ClockIcon />} />
 *
 * @example
 * // With custom label
 * <StatusBadge variant="active" label="Currently Active" />
 */

import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type {
  InterfaceStatusBadgeProps,
  SemanticVariant,
} from 'types/StatusBadge/interface';
import styles from './StatusBadge.module.css';

/**
 * Maps domain-specific status variants to semantic visual variants.
 * This provides a consistent mapping between business logic states and UI representations.
 */
const variantMapping: Record<string, SemanticVariant> = {
  completed: 'success',
  pending: 'warning',
  active: 'success',
  inactive: 'neutral',
  approved: 'success',
  rejected: 'error',
  disabled: 'neutral',
  accepted: 'success',
  declined: 'error',
  no_response: 'info',
};

/**
 * StatusBadge component for displaying status information with consistent styling.
 *
 * @param {InterfaceStatusBadgeProps} props - Component props
 * @returns {JSX.Element} A styled badge displaying the status
 */
const StatusBadge: React.FC<InterfaceStatusBadgeProps> = ({
  variant,
  size = 'md',
  label,
  icon,
  ariaLabel,
  className,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'statusBadge',
  });

  // Map domain variant to semantic variant
  const semanticVariant = variantMapping[variant];

  // Get label from i18n or use provided label
  const badgeLabel = label || t(variant);

  // Get aria-label
  const ariaLabelText = ariaLabel || badgeLabel;

  return (
    <Chip
      label={badgeLabel}
      icon={icon ? (icon as React.ReactElement) : undefined}
      role="status"
      aria-label={ariaLabelText}
      className={`${styles.statusBadge} ${styles[semanticVariant]} ${styles[size]} ${className || ''}`}
    />
  );
};

export default StatusBadge;
