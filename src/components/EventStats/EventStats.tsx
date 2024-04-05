import React from 'react';
import { Modal } from 'react-bootstrap';
import { FeedbackStats } from './Statistics/Feedback';
import { ReviewStats } from './Statistics/Review';
import { AverageRating } from './Statistics/AverageRating';
<<<<<<< HEAD
import styles from './Loader.module.css';
import eventStatsStyles from './EventStats.module.css';
=======
import Stack from '@mui/material/Stack';
import styles from './Loader.module.css';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';

type ModalPropType = {
  show: boolean;
  eventId: string;
  handleClose: () => void;
};

export const EventStats = ({
  show,
  handleClose,
  eventId,
}: ModalPropType): JSX.Element => {
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
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Statistics</Modal.Title>
        </Modal.Header>
<<<<<<< HEAD
        <Modal.Body className={eventStatsStyles.stackEvents}>
          <FeedbackStats data={data} />
          <div>
            <ReviewStats data={data} />
            <AverageRating data={data} />
          </div>
=======
        <Modal.Body>
          <Stack direction="row" spacing={2}>
            <FeedbackStats data={data} />
            <div>
              <ReviewStats data={data} />
              <AverageRating data={data} />
            </div>
          </Stack>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        </Modal.Body>
      </Modal>
    </>
  );
};
