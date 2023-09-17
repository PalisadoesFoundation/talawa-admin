import React from 'react';
import styles from './UpcomingEventsCard.module.css';
import { ReactComponent as Marker } from '../../assets/svgs/icons/location.svg';
import { useTranslation } from 'react-i18next';

const UpcomingEventsCard = ({ events }: any): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'latestEvents',
  });

  const currentUrl = window.location.href.split('=')[1];

  return (
    <div className={styles.eventCardContainer}>
      <div className={styles.eventCardHeader}>
        <span className={styles.eventCardTitle}>{t('eventCardTitle')}</span>
        <a
          href={`/orgevents/id=${currentUrl}`}
          className={styles.eventCardSeeAll}
        >
          {t('eventCardSeeAll')} <i className="fas fa-arrow-right"></i>
        </a>
      </div>
      <div className={styles.eventCardBody}>
        {events.length === 0 ? (
          <p className={styles.noEvents}>{t('noEvents')}</p>
        ) : (
          events.map((event: any) => (
            <div key={event.id}>
              <div className={styles.eventDetails}>
                <a href="" className={styles.eventTitle}>
                  {event.title}
                </a>
                <small className={styles.eventDuration}>
                  {event.startDate} | {event.endDate}
                </small>
                <small className={styles.eventLocation}>
                  <Marker width={15} fill="#31bb6b" /> {event.location}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsCard;
