import React, { useState } from 'react';
import { EventRegistrantsModal } from './EventRegistrantsModal';
import { Button } from 'react-bootstrap';

type PropType = {
  eventId: string;
  orgId: string;
};

export const EventRegistrantsWrapper = (props: PropType): JSX.Element => {
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
        Show Registrants
      </Button>
      {showModal ? (
        <EventRegistrantsModal
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
