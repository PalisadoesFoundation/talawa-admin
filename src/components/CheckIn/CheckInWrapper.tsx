import React, { useState } from 'react';
import { CheckInModal } from './CheckInModal';
import { Button } from 'react-bootstrap';

type PropType = {
  eventId: string;
};

export const CheckInWrapper = (props: PropType): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        type="button"
        className="mt-3"
        variant="success"
        aria-label="checkInAttendees"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Check In Attendees
      </Button>
      {showModal && (
        <CheckInModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          eventId={props.eventId}
        />
      )}
    </>
  );
};
