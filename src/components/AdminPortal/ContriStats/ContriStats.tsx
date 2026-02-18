/**
 * A React functional component that displays contribution statistics.
 *
 * @param recentAmount - The most recent contribution amount.
 * @param highestAmount - The highest contribution amount.
 * @param totalAmount - The total contribution amount.
 *
 * @returns A JSX element displaying the contribution statistics.
 *
 * @remarks
 * This component uses the `useTranslation` hook from the `react-i18next` library
 * to provide internationalized text for the labels. The translations are fetched
 * from the `translation` namespace with the `contriStats` key prefix.
 *
 * @example
 * ```tsx
 * import ContriStats from './ContriStats';
 *
 * <ContriStats
 *   recentAmount={50}
 *   highestAmount={200}
 *   totalAmount={1000}
 * />
 * ```
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from 'style/app-fixed.module.css';
import type { InterfaceContriStatsProps } from 'types/AdminPortal/Contribution/interface';

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
