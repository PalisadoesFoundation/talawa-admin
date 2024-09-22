import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styles from './EventDashboard.module.css';
import { useTranslation } from 'react-i18next';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';

/**
 * Component that displays event details.
 *
 * @param  props - The props for the EventDashboard component.
 * @param eventId - The ID of the event to fetch and display.
 * @returns The rendered EventDashboard component.
 */
const EventDashboard = (props: { eventId: string }): JSX.Element => {
  const { eventId } = props;
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventManagement',
  });

  const { data: eventData, loading: eventInfoLoading } = useQuery(
    EVENT_DETAILS,
    {
      variables: { id: eventId },
    },
  );

  // Display a loader while fetching event data
  if (eventInfoLoading) {
    return <Loader />;
  }

  /**
   * Formats a time string (HH:MM) to a more readable format.
   *
   * @param  timeString - The time string to format.
   * @returns - The formatted time string.
   */
  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    return `${hours}:${minutes}`;
  }

  /**
   * Formats a date string to a more readable format (e.g., 1st Jan 2024).
   *
   * @param  dateString - The date string to format.
   * @returns - The formatted date string.
   */
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = suffixes[day % 10] || suffixes[0];

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedDate = `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
    return formattedDate;
  }
  if (!eventData || !eventData.event) {
    return <Loader />; // Fallback UI while data is loading
  }

  // Render event details
  return (
    <div>
      <Row>
        <Col>
          <div className={styles.eventContainer}>
            <div className={styles.eventDetailsBox}>
              <div className={styles.time}>
                <p>
                  <b className={styles.startTime}>
                    {eventData?.event?.startTime !== null
                      ? `${formatTime(eventData?.event?.startTime)}`
                      : ''}
                  </b>{' '}
                  <span className={styles.startDate}>
                    {formatDate(eventData?.event?.startDate)}{' '}
                  </span>
                </p>
                <p className={styles.to}>{t('to')}</p>
                <p>
                  <b className={styles.endTime}>
                    {eventData?.event?.endTime !== null
                      ? `${formatTime(eventData?.event?.endTime)}`
                      : ``}
                  </b>{' '}
                  <span className={styles.endDate}>
                    {formatDate(eventData?.event?.endDate)}{' '}
                  </span>
                </p>
              </div>
              <h4 className={styles.titlename}>{eventData?.event?.title}</h4>
              <p className={styles.description}>
                {eventData?.event?.description}
              </p>
              <p className={styles.toporgloc}>
                <b>Location:</b> <span>{eventData?.event?.location}</span>
              </p>
              <p className={styles.toporgloc}>
                <b>Registrants:</b>{' '}
                <span>{eventData?.event?.attendees?.length}</span>
              </p>
              <br />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EventDashboard;
