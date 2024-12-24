import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../../style/app.module.css';

interface InterfaceContriStatsProps {
  id: string;
  recentAmount: string;
  highestAmount: string;
  totalAmount: string;
}

/**
 * A component that displays contribution statistics.
 *
 * @param recentAmount - The most recent contribution amount.
 * @param highestAmount - The highest contribution amount.
 * @param totalAmount - The total contribution amount.
 *
 * @returns JSX.Element - The rendered component displaying the contribution stats.
 */
function ContriStats({
  recentAmount,
  highestAmount,
  totalAmount,
}: InterfaceContriStatsProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'contriStats',
  });

  return (
    <>
      <p className={styles.fonts}>
        {t('recentContribution')}: $&nbsp;<span>{recentAmount}</span>
      </p>
      <p className={styles.fonts}>
        {t('highestContribution')}: $&nbsp;<span>{highestAmount}</span>
      </p>
      <p className={styles.fonts}>
        {t('totalContribution')}: $&nbsp;<span>{totalAmount}</span>
      </p>
    </>
  );
}

export default ContriStats;
