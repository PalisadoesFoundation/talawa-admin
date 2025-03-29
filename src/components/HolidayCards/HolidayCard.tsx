/**
 * A functional React component that renders a styled card displaying the name of a holiday.
 * This file contains the `HolidayCard` component, which is a reusable UI component
 * for displaying holiday information in a styled card format.
 * @param {InterfaceHolidayList} props - The props object containing the holiday name.
 * @returns {JSX.Element} A JSX element representing the holiday card.
 *
 * @example
 * ```tsx
 * <HolidayCard holidayName="Christmas" />
 * ```
 *
 * @remarks
 * - The component uses CSS modules for styling, with styles imported from `app-fixed.module.css`.
 * - The `data-testid` attribute is included for testing purposes.
 *
 * @category UI Components
 */

import React from 'react';
import styles from 'style/app-fixed.module.css';

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
