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
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        Check In Registrants
      </Button>
      {showModal && (
        <CheckInModal
          show={showModal}
          handleClose={(): void => setShowModal(false)}
          eventId={props.eventId}
        />
      )}
    </>
  );
};
