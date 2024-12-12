import React, { useState } from 'react';
import { EventRegistrantsModal } from './EventRegistrantsModal';
import { Button } from 'react-bootstrap';

// Props for the EventRegistrantsWrapper component
type PropType = {
  eventId: string;
  orgId: string;
};

/**
 * Wrapper component that displays a button to show the event registrants modal.
 *
 * @param eventId - The ID of the event.
 * @param orgId - The ID of the organization.
 * @returns JSX element representing the wrapper with a button to show the modal.
 */
export const EventRegistrantsWrapper = ({
  eventId,
  orgId,
}: PropType): JSX.Element => {
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Button to open the event registrants modal */}
      <Button
        data-testid="filter-button"
        className={`border-1 mx-4`}
        aria-label="showAttendees"
        onClick={(): void => {
          setShowModal(true); // Show the modal when button is clicked
        }}
      >
        Add Registrants
      </Button>

      {/* Render the EventRegistrantsModal if showModal is true */}
      {showModal && (
        <EventRegistrantsModal
          show={showModal}
          handleClose={(): void => {
            setShowModal(false); // Hide the modal when closed
          }}
          eventId={eventId}
          orgId={orgId}
        />
      )}
    </>
  );
};
