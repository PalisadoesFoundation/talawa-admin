import React from 'react';
import styles from './CurrentHourIndicator.module.css';

const CurrentHourIndicator = (): JSX.Element => {
  return (
    <div className={styles.container} data-testid="container">
      <div className={styles.round}></div>
      <div className={styles.line}></div>
    </div>
  );
};

export default CurrentHourIndicator;
