import React from 'react';
import styles from './ContriStats.module.css';
interface ContriStatsProps {
  key: string;
  id: string;
  recentAmount: string;
  highestAmount: string;
  totalAmount: string;
}

/**
 * Displays statistics related to all the recent contributions made per country
 * @author Saumya Singh
 * @param {props} ContriStatsProps
 * @returns template for the contry statistics display 
 */
function ContriStats(props: ContriStatsProps): JSX.Element {
  return (
    <>
      <p className={styles.fonts}>
        Recent Contribution: $&nbsp;<span>{props.recentAmount}</span>
      </p>
      <p className={styles.fonts}>
        Highest Contribution: $&nbsp;<span>{props.highestAmount}</span>
      </p>
      <p className={styles.fonts}>
        Total Contribution: $&nbsp;<span>{props.totalAmount}</span>
      </p>
    </>
  );
}
export default ContriStats;
