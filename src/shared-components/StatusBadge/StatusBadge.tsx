/**
 * StatusBadge Component
 *
 * A reusable badge component for displaying status information with consistent styling,
 * accessibility features, and internationalization support.
 *
 * Features:
 * - Domain-to-semantic variant mapping for consistent visual representation
 * - Three size variants (sm, md, lg) for different contexts
 * - Full i18n support with fallback keys
 * - WCAG-compliant accessibility with role and aria-label
 * - Optional icon support with type safety
 * - Customizable labels and styling
 */

import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './StatusBadge.module.css';
import type {
  InterfaceStatusBadgeProps,
  SemanticVariant,
  StatusVariant,
} from 'types/shared-components/StatusBadge/interface';

/**
 * Maps domain-specific status variants to semantic visual variants.
 * This ensures consistent visual representation across the application.
 */
const variantMapping: Record<StatusVariant, SemanticVariant> = {
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
 * This component wraps MUI Chip and provides:
 * - Domain-to-semantic variant mapping (e.g., 'completed' implies 'success')
 * - Three size variants: sm (20px), md (24px), lg (32px)
 * - Internationalization support with fallback keys (statusBadge.variant)
 * - Accessibility features (role="status", aria-label)
 * - Optional icon and label customization
 *
 * @param props - Component properties
 *
 * @returns A styled badge component with semantic coloring
 *
 * @example
 * ```tsx
 * // Basic usage
 * <StatusBadge variant="completed" />
 *
 * // With size and icon
 * <StatusBadge variant="pending" size="lg" icon={<WarningIcon />} />
 *
 * // With custom label
 * <StatusBadge variant="approved" label="Verified" />
 * ```
 */
const StatusBadge: React.FC<InterfaceStatusBadgeProps> = ({
  variant,
  size = 'md',
  label,
  icon,
  ariaLabel,
  className,
  dataTestId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'statusBadge',
  });

  // Map domain variant to semantic variant for consistent visual representation
  const semanticVariant = variantMapping[variant];

  // Use custom label or fall back to i18n translation
  const badgeLabel = label || t(variant);

  // Use custom aria-label or fall back to the badge label
  const ariaLabelText = ariaLabel || badgeLabel;

  // Validate that icon is a proper ReactElement to prevent runtime errors
  const validIcon = React.isValidElement(icon) ? icon : undefined;

  return (
    <Chip
      label={badgeLabel}
      icon={validIcon}
      role="status"
      aria-label={ariaLabelText}
      className={`${styles.statusBadge} ${styles[semanticVariant]} ${styles[size]} ${className || ''}`}
      data-testid={dataTestId}
    />
  );
};

export default StatusBadge;
