/**
 * A functional React component that renders a styled card displaying the name of a holiday.
 * This file contains the `HolidayCard` component, which is a reusable UI component
 * for displaying holiday information in a styled card format.
 * @param props - The props object containing the holiday name.
 * @returns A JSX element representing the holiday card.
 *
 * @example
 * ```tsx
 * <HolidayCard holidayName="Christmas" />
 * ```
 *
 * @remarks
 * - The component uses CSS modules for styling, with styles imported from `HolidayCard.module.css`.
 * - The `data-testid` attribute is included for testing purposes.
 */

import React from 'react';
import styles from './HolidayCard.module.css';

interface InterfaceHolidayList {
  holidayName: string;
}

const HolidayCard = (props: InterfaceHolidayList): JSX.Element => {
  return (
    <div className={styles.holidayCard} data-testid="holiday-card">
      {props?.holidayName}
    </div>
  );
};

export default HolidayCard;
