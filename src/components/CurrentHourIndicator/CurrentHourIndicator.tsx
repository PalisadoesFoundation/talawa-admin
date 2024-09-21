import React from 'react';
import styles from './CurrentHourIndicator.module.css';

/**
 * A component that displays an indicator for the current hour.
 *
 * @returns JSX.Element - The rendered component showing the current hour indicator.
 */
const CurrentHourIndicator = (): JSX.Element => {
  return (
    <div className={styles.container} data-testid="container">
      <div className={styles.round}></div>
      <div className={styles.line}></div>
    </div>
  );
};

export default CurrentHourIndicator;
