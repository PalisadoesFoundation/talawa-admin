import React, { useState } from 'react';
import { EventAttendeesModal } from './EventAttendeesModal';
import { Button } from 'react-bootstrap';

type PropType = {
  eventId: string;
  orgId: string;
};

export const EventAttendeeWrapper = (props: PropType) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        type="button"
        className="mt-3"
        variant="success"
        aria-label="showAttendees"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Show Attendees
      </Button>
      {showModal ? (
        <EventAttendeesModal
          show={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
          eventId={props.eventId}
          orgId={props.orgId}
        />
      ) : null}
    </>
  );
};
