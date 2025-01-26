import React from 'react';
import { Modal } from 'react-bootstrap';
import { FeedbackStats } from './Statistics/Feedback';
import { ReviewStats } from './Statistics/Review';
import { AverageRating } from './Statistics/AverageRating';
import styles from './Loader.module.css';
import eventStatsStyles from './EventStats.module.css';
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';

// Props for the EventStats component
type ModalPropType = {
  show: boolean;
  eventId: string;
  handleClose: () => void;
};

/**
 * Component that displays event statistics in a modal.
 * Shows feedback, reviews, and average rating for the event.
 *
 * @param show - Whether the modal is visible or not.
 * @param handleClose - Function to close the modal.
 * @param eventId - The ID of the event.
 * @returns JSX element representing the event statistics modal.
 */
export const EventStats = ({
  show,
  handleClose,
  eventId,
}: ModalPropType): JSX.Element => {
  // Query to fetch event feedback data
  const { data, loading } = useQuery(EVENT_FEEDBACKS, {
    variables: { id: eventId },
  });

  // Show a loading screen while data is being fetched
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
        onHide={handleClose} // Close the modal when clicking outside or the close button
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Statistics</Modal.Title>
        </Modal.Header>
        <Modal.Body className={eventStatsStyles.stackEvents}>
          {/* Render feedback statistics */}
          <FeedbackStats data={data} />
          <div>
            {/* Render review statistics and average rating */}
            <ReviewStats data={data} />
            <AverageRating data={data} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
