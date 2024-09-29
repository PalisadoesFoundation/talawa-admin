import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ContriStats.module.css';

interface InterfaceContriStatsProps {
  id: string;
  recentAmount: string;
  highestAmount: string;
  totalAmount: string;
}

/**
 * A component that displays contribution statistics.
 *
 * @param props - The properties passed to the component, including `recentAmount`, `highestAmount`, and `totalAmount`.
 *
 * @returns JSX.Element - The rendered component displaying the contribution stats.
 */
function ContriStats(props: InterfaceContriStatsProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'contriStats',
  });

  return (
    <>
      <p className={styles.fonts}>
        {t('recentContribution')}: $&nbsp;<span>{props.recentAmount}</span>
      </p>
      <p className={styles.fonts}>
        {t('highestContribution')}: $&nbsp;<span>{props.highestAmount}</span>
      </p>
      <p className={styles.fonts}>
        {t('totalContribution')}: $&nbsp;<span>{props.totalAmount}</span>
      </p>
    </>
  );
}
export default ContriStats;
