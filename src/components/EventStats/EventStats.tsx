import React from 'react';
import { Modal, Row, Col, Container } from 'react-bootstrap';
import { FeedbackStats } from './Statistics/Feedback';
import { ReviewStats } from './Statistics/Review';
import { AverageRating } from './Statistics/AverageRating';
import styles from './Loader.module.css';
import eventStatsStyles from './EventStats.module.css';
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';

type ModalPropType = {
  eventId: string;
};

export const EventStats = ({ eventId }: ModalPropType): JSX.Element => {
  const { data, loading } = useQuery(EVENT_FEEDBACKS, {
    variables: { id: eventId },
  });

  // Render the loading screen
  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Container style={{ padding: '0px' }}>
        <Row style={{ height: '100%' }}>
          <Col md={{ span: 7 }} style={{ padding: '5px', marginRight: '30px' }}>
            <FeedbackStats data={data} />

            <div style={{ marginTop: '20px' }}>
              <AverageRating data={data} />
            </div>
          </Col>
          <Col>
            <ReviewStats data={data} />
          </Col>
        </Row>
      </Container>
    </>
  );
};
