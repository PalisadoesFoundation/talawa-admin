import React from 'react';
import type { InterfaceUserPortalCardProps } from 'types/UserPortal/UserPortalCard/interface';
import styles from './UserPortalCard.module.css';

/**
 * UserPortalCard
 *
 * Reusable 3-section layout wrapper for User Portal cards.
 *
 * Structure:
 * [ imageSlot ] [ content (children) ] [ actionsSlot ]
 *
 * Responsibilities:
 * - Centralizes spacing and alignment logic
 * - Supports density variants (compact / standard / expanded)
 * - Remains content-agnostic and styling-agnostic
 *
 * Accessibility:
 * - role="group"
 * - aria-label provided by consumer (i18n required)
 *
 * @example
 * <UserPortalCard
 *   variant="compact"
 *   ariaLabel={t('donation.card_aria')}
 *   imageSlot={<ProfileAvatarDisplay fallbackName="User Name" />}
 *   actionsSlot={<Button />}
 * >
 *   <CardContent />
 * </UserPortalCard>
 */
const UserPortalCard: React.FC<InterfaceUserPortalCardProps> = ({
  imageSlot,
  children,
  actionsSlot,
  variant = 'standard',
  className,
  dataTestId = 'user-portal-card',
  ariaLabel,
}) => {
  /**
   * Maps variant prop to CSS module class.
   * Variants control density only (padding/spacing).
   */
  const variantClasses: Record<'compact' | 'standard' | 'expanded', string> = {
    compact: styles.variantCompact,
    standard: styles.variantStandard,
    expanded: styles.variantExpanded,
  };

  const variantClass = variantClasses[variant];

  const containerClassName = [styles.container, variantClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClassName}
      data-testid={dataTestId}
      role="group"
      aria-label={ariaLabel}
    >
      {imageSlot && (
        <div
          className={styles.imageSection}
          data-testid={`${dataTestId}-image`}
        >
          {imageSlot}
        </div>
      )}

      <div
        className={styles.contentSection}
        data-testid={`${dataTestId}-content`}
      >
        {children}
      </div>

      {actionsSlot && (
        <div
          className={styles.actionsSection}
          data-testid={`${dataTestId}-actions`}
        >
          {actionsSlot}
        </div>
      )}
    </div>
  );
};

export default UserPortalCard;
