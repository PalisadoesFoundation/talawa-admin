import React, { useState } from 'react';
import { EventStats } from './Statistics/EventStats';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './css/EventStatsWrapper.module.css';
/**
 * Wrapper component that displays a button to show event statistics.
 *
 * @param _id - The ID of the event.
 * @returns JSX element representing the wrapper with a button to view event statistics.
 */
export const EventStatsWrapper = ({ _id }: { _id: string }): JSX.Element => {
  // State to control the visibility of the EventStats component
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Button to open the event statistics view */}
      <Button
        variant="light"
        className="text-secondary"
        aria-label="checkInRegistrants"
        onClick={(): void => {
          setShowModal(true); // Show the EventStats component when button is clicked
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Event Stats" fill="var(--bs-secondary)" />
        </div>
        View Event Statistics
      </Button>

      {/* Render the EventStats component if showModal is true */}
      <EventStats
        show={showModal}
        handleClose={(): void => setShowModal(false)} // Hide the EventStats component when closed
        key={_id || 'eventStatsDetails'} // Use _id as key for the component
        eventId={_id}
      />
    </>
  );
};
