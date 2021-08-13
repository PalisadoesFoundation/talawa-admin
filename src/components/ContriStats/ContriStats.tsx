import React from 'react';
import styles from './ContriStats.module.css';
interface ContriStatsProps {
  key: string;
  id: string;
  recentAmount: string;
  highestAmount: string;
  totalAmount: string;
}
function ContriStats(props: ContriStatsProps): JSX.Element {
  return (
    <>
      <p className={styles.fonts}>
        Recent Contribution: <span>${props.recentAmount}</span>
      </p>
      <p className={styles.fonts}>
        Highest Contribution: <span>${props.highestAmount}</span>
      </p>
      <p className={styles.fonts}>
        Total Contribution: <span>${props.totalAmount}</span>
      </p>
    </>
  );
}
export default ContriStats;
