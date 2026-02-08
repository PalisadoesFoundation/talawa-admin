import React from 'react';
import styles from './EventCalender.module.css';
import { months } from 'types/Event/utils';
import type { InterfaceHoliday } from 'types/Event/utils';

interface CalendarInfoCardsProps {
  filteredHolidays: InterfaceHoliday[];
  t: (key: string) => string;
}

const CalendarInfoCards: React.FC<CalendarInfoCardsProps> = ({
  filteredHolidays,
  t,
}) => {
  return (
    <div className={styles.calendar_infocards}>
      <section className={styles.holidays_card} aria-label={t('holidays')}>
        <h3 className={styles.card_title}>{t('holidays')}</h3>
        <ul className={styles.card_list}>
          {filteredHolidays.map((holiday, index) => (
            <li className={styles.card_list_item} key={index}>
              <span className={styles.holiday_date}>
                {months[parseInt(holiday.date.slice(0, 2), 10) - 1]}{' '}
                {holiday.date.slice(3)}
              </span>
              <span className={styles.holiday_name}>{holiday.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.events_card} aria-label={t('events')}>
        <h3 className={styles.card_title}>{t('events')}</h3>
        <div className={styles.legend}>
          <div className={styles.eventsLegend} data-testid="events-legend">
            <span
              className={styles.organizationIndicator}
              data-testid="org-indicator"
            ></span>
            <span className={styles.legendText}>
              {t('eventsCreatedByOrganization')}
            </span>
          </div>
          <div
            className={styles.list_container_holidays}
            data-testid="holidays-list"
          >
            <span
              className={styles.holidayIndicator}
              data-testid="holiday-indicator"
            ></span>
            <span className={styles.holidayText}>{t('holidays')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalendarInfoCards;
