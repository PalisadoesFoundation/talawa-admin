import React from 'react';
import styles from 'style/app-fixed.module.css';

/**
 * CurrentHourIndicator Component
 *
 * @description This component renders a visual indicator for the current hour.
 * It consists of a circular marker and a line to represent the current time.
 * The component is styled using CSS modules.
 * @returns {JSX.Element} A JSX element containing the current hour indicator.
 *
 * @remarks
 * - The component uses two main elements:
 *   1. A circular marker (`currentHourIndicator_round`) to represent the current hour.
 *   2. A line (`currentHourIndicator_line`) to visually extend the indicator.
 * - The `styles` object is imported from a CSS module to ensure scoped styling.
 *
 * @example
 * ```tsx
 * import CurrentHourIndicator from './CurrentHourIndicator';
 *
 * const App = () => (
 *   <div>
 *     <CurrentHourIndicator />
 *   </div>
 * );
 * ```
 *
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
