/**
 * DonationCard Component
 *
 * Renders a card displaying donation details including donor name,
 * donation amount, and donation date.
 *
 * @component
 * @param props - Props for the DonationCard component.
 * @param props.name - Name of the donor.
 * @param props.amount - Donated amount.
 * @param props.updatedAt - ISO timestamp of the donation.
 *
 * @returns JSX.Element representing a donation card.
 *
 * @remarks
 * - Formats the donation date into a readable string.
 * - Uses `UserPortalCard` for consistent layout.
 * - Styling is handled via CSS Modules.
 *
 * @example
 * ```tsx
 * <DonationCard
 *   name="John Doe"
 *   amount={100}
 *   updatedAt={dayjs.utc().subtract(1, 'year').month(2).date(15).hour(12).toISOString()}
 * />
 * ```
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';
import type { InterfaceDonationCardProps } from 'types/Donation/interface';
import styles from 'style/app-fixed.module.css';

const DonationCard: React.FC<InterfaceDonationCardProps> = ({
  id,
  name,
  amount,
  updatedAt,
}) => {
  const { t, i18n } = useTranslation();

  const formattedDate =
    updatedAt && updatedAt.length > 0
      ? new Intl.DateTimeFormat(i18n.language ?? 'en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(new Date(updatedAt))
      : '';

  return (
    <UserPortalCard
      variant="compact"
      dataTestId={t('donation.card_test_id', {
        defaultValue: 'donation-card-{{id}}',
        id,
      })}
      ariaLabel={t('donation.card_aria', 'Donation card')}
      imageSlot={
        <div
          className={styles.donationAvatar}
          aria-hidden="true"
          data-testid={`donation-${id}-avatar`}
        />
      }
      actionsSlot={
        <Button
          size="sm"
          className="addButton"
          type="button"
          data-testid={`donation-${id}-view`}
        >
          {t('common.view', 'View')}
        </Button>
      }
    >
      <div className={styles.donationDetails}>
        <div
          className={`${styles.donationRow} ${styles.donorName}`}
          data-testid="DonorName"
        >
          {name}
        </div>

        <div
          className={`${styles.donationRow} ${styles.donationMeta}`}
          data-testid="donation-amount"
        >
          {t('donation.amount_label', 'Amount')}: {amount}
        </div>

        {formattedDate && (
          <div
            className={`${styles.donationRow} ${styles.donationMeta}`}
            data-testid="donation-date"
          >
            {t('donation.date_label', 'Date')}: {formattedDate}
          </div>
        )}
      </div>
    </UserPortalCard>
  );
};

export default DonationCard;
