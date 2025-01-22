import React from 'react';
import styles from '../../style/app.module.css';

/**
 * A component that displays an indicator for the current hour.
 *
 * @returns JSX.Element - The rendered component showing the current hour indicator.
 */
const CurrentHourIndicator = (): JSX.Element => {
  return (
    <div
      className={styles.currentHourIndicator_container}
      data-testid="container"
    >
      <div className={styles.currentHourIndicator_round}></div>
      <div className={styles.currentHourIndicator_line}></div>
    </div>
  );
};

export default CurrentHourIndicator;
