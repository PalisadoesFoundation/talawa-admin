import React from 'react';
import styles from './HolidayCard.module.css';

// Props for the HolidayCard component
interface InterfaceHolidayList {
  holidayName: string;
}

/**
 * Component that displays a card with the name of a holiday.
 *
 * @param props - Contains the holidayName to be displayed on the card.
 * @returns JSX element representing a card with the holiday name.
 */
const HolidayCard = (props: InterfaceHolidayList): JSX.Element => {
  /*istanbul ignore next*/
  return <div className={styles.card}>{props?.holidayName}</div>;
};

export default HolidayCard;
