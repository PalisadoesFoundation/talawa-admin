import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CalendarInfoCards.module.css';

type Holiday = {
  name: string;
  date: string;
};

/**
 * Props for {@link CalendarInfoCards}.
 */
type CalendarInfoCardsProps = {
  /** Holidays already filtered for the currently visible month. */
  filteredHolidays: Holiday[];
  /** Calendar year used to localize and format holiday labels. */
  currentYear: number;
  /** Active i18n language code (for month name localization). */
  language: string;
};

/**
 * Renders the right-side monthly calendar info cards (holidays and legend).
 *
 * @param props - Component props containing filtered holidays and translation helpers.
 * @returns JSX containing holiday list and events legend cards.
 */
const CalendarInfoCards: React.FC<CalendarInfoCardsProps> = ({
  filteredHolidays,
  currentYear,
  language,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventCalendar',
  });

  return (
    <div className={styles.calendar_infocards}>
      <section className={styles.holidays_card} aria-label={t('holidays')}>
        <h3 className={styles.card_title}>{t('holidays')}</h3>
        <ul className={styles.card_list}>
          {filteredHolidays.length > 0 ? (
            filteredHolidays.map((holiday, index) => {
              const holidayDate = dayjs(
                `${currentYear}-${holiday.date}`,
                'YYYY-MM-DD',
              );
              const localizedMonth = holidayDate
                .locale(language)
                .format('MMMM');
              const day = holiday.date.slice(3);

              const translationKey = holiday.name
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .map((word, idx) =>
                  idx === 0
                    ? word.toLowerCase()
                    : word.charAt(0).toUpperCase() +
                      word.slice(1).toLowerCase(),
                )
                .join('');

              const translatedName = t(
                ['holidayNames', translationKey].join('.'),
                { defaultValue: holiday.name },
              );

              return (
                <li className={styles.card_list_item} key={index}>
                  <span className={styles.holiday_date}>
                    {localizedMonth} {day}
                  </span>
                  <span className={styles.holiday_name}>{translatedName}</span>
                </li>
              );
            })
          ) : (
            <li className={styles.card_list_item}>
              {t('noHolidaysAvailable')}
            </li>
          )}
        </ul>
      </section>

      <section className={styles.events_card} aria-label={t('events')}>
        <h3 className={styles.card_title}>{t('events')}</h3>
        <div className={styles.legend}>
          <div className={styles.eventsLegend}>
            <span className={styles.organizationIndicator}></span>
            <span className={styles.legendText}>
              {t('eventsCreatedByOrganization')}
            </span>
          </div>
          <div className={styles.list_container_holidays}>
            <span className={styles.holidayIndicator}></span>
            <span className={styles.holidayText}>{t('holidays')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalendarInfoCards;
