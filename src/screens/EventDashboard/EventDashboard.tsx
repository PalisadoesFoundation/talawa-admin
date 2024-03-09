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

  return (
    <LeftDrawerEventWrapper
      event={eventData.event}
      key={`${eventData?.event._id || 'loading'}EventDashboard`}
    >
      <Row>
        <Col>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              {/* Side Bar - Static Information about the Event */}
              <h4 className={styles.titlename}>{eventData.event.title}</h4>
              <p className={styles.description}>
                {eventData.event.description}
              </p>
              <p className={styles.toporgloc}>
                <b>Location:</b> {eventData.event.location}
              </p>
              <p className={styles.toporgloc}>
                <b>Start:</b> {eventData.event.startDate}{' '}
                {eventData.event.startTime !== null
                  ? `- ${eventData.event.startTime}`
                  : ``}
              </p>
              <p className={styles.toporgloc}>
                <b>End:</b> {eventData.event.endDate}{' '}
                {eventData.event.endTime !== null
                  ? `- ${eventData.event.endTime}`
                  : ``}
              </p>
              <p className={styles.toporgloc}>
                <b>Registrants:</b> {eventData.event.attendees.length}
              </p>
              <br />
            </div>
          </div>
        </Col>
      </Row>
    </LeftDrawerEventWrapper>
  );
};

export default EventDashboard;
