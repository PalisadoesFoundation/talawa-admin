import React from 'react';
import styles from './HolidayCard.module.css';

interface InterfaceHolidayList {
  holidayName: string;
}
const HolidayCard = (props: InterfaceHolidayList): JSX.Element => {
  /*istanbul ignore next*/
  return <div className={styles.card}>{props?.holidayName}</div>;
};

export default HolidayCard;
