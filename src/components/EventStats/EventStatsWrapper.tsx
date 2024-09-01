import React, { useState } from 'react';
import { EventStats } from './EventStats';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './EventStatsWrapper.module.css';

// Props for the EventStatsWrapper component
type PropType = {
  eventId: string;
};

/**
 * Wrapper component that displays a button to show event statistics.
 *
 * @param eventId - The ID of the event.
 * @returns JSX element representing the wrapper with a button to view event statistics.
 */
export const EventStatsWrapper = ({ eventId }: PropType): JSX.Element => {
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
        key={eventId || 'eventStatsDetails'} // Use eventId as key for the component
        eventId={eventId}
      />
    </>
  );
};
