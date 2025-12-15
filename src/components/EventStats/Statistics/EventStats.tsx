/**
 * Component to display event statistics in a modal.
 *
 * This component fetches event feedback data using the `useQuery` hook
 * and displays various statistics such as feedback, reviews, and average ratings.
 *
 * @component
 * @param {ModalPropType} props - The properties passed to the component.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {string} props.eventId - The unique identifier of the event for which statistics are displayed.
 * @param {() => void} props.handleClose - Callback function to close the modal.
 *
 * @returns {JSX.Element} A modal containing event statistics.
 *
 * @remarks
 * - The component uses the `EVENT_FEEDBACKS` GraphQL query to fetch event feedback data.
 * - Displays a loading spinner while the data is being fetched.
 * - The modal is styled using `react-bootstrap` and custom CSS modules.
 *
 * @example
 * ```tsx
 * <EventStats
 *   show={true}
 *   eventId="12345"
 *   handleClose={() => console.log('Modal closed')}
 * />
 * ```
 *
 * @dependencies
 * - `react-bootstrap` for modal UI.
 * - `@apollo/client` for GraphQL query handling.
 * - Custom CSS modules for styling.
 */
import React from 'react';
import { Modal } from 'react-bootstrap';
import { FeedbackStats } from './Feedback/Feedback';
import { ReviewStats } from './Review/Review';
import { AverageRating } from './AverageRating/AverageRating';
import styles from 'style/app-fixed.module.css';
import eventStatsStyles from '../css/EventStats.module.css';
import { useQuery } from '@apollo/client/react';
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
  // Query to fetch event feedback data
  const { data, loading, error } = useQuery(EVENT_FEEDBACKS, {
    variables: { id: eventId },
    skip: !eventId,
  });

  // Show a loading screen while data is being fetched
  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  if (error || !data) {
    return <></>;
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
