import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import styles from './EventDashboard.module.css';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { LeftDrawerEventWrapper } from 'components/LeftDrawerEvent/LeftDrawerEventWrapper';
import { Navigate, useParams } from 'react-router-dom';

const EventDashboard = (): JSX.Element => {
  // Get the Event ID from the URL
  document.title = 'Event Dashboard';

  const { eventId } = useParams();
  if (!eventId) {
    return <Navigate to={'/orglist'} />;
  }

  // Data fetching
  const { data: eventData, loading: eventInfoLoading } = useQuery(
    EVENT_DETAILS,
    {
      variables: { id: eventId },
    },
  );

  // Render the loading screen
  if (eventInfoLoading) {
    return <Loader />;
  }

  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    return `${hours}:${minutes}`;
  }

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

  return (
    <LeftDrawerEventWrapper
      event={eventData.event}
      key={`${eventData?.event._id || 'loading'}EventDashboard`}
    >
      <div className={styles.content}>
        <Row>
          <Col>
            <div className={styles.eventContainer}>
              <div className={styles.eventDetailsBox}>
                {/* Side Bar - Static Information about the Event */}
                <div className={styles.time}>
                  <p>
                    <b className={styles.startTime}>
                      {eventData.event.startTime !== null
                        ? `${formatTime(eventData.event.startTime)}`
                        : ``}
                    </b>{' '}
                    <span className={styles.startDate}>
                      {formatDate(eventData.event.startDate)}{' '}
                    </span>
                  </p>
                  <p className={styles.to}>TO</p>
                  <p>
                    <b className={styles.endTime}>
                      {' '}
                      {eventData.event.endTime !== null
                        ? `${formatTime(eventData.event.endTime)}`
                        : ``}
                    </b>{' '}
                    <span className={styles.endDate}>
                      {formatDate(eventData.event.endDate)}{' '}
                    </span>
                  </p>
                </div>
                <h4 className={styles.titlename}>{eventData.event.title}</h4>
                <p className={styles.description}>
                  {eventData.event.description}
                </p>
                <p className={styles.toporgloc}>
                  <b>Location:</b> <span>{eventData.event.location}</span>
                </p>
                <p className={styles.toporgloc}>
                  <b>Registrants:</b>{' '}
                  <span>{eventData.event.attendees.length}</span>
                </p>
                <br />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </LeftDrawerEventWrapper>
  );
};

export default EventDashboard;
