import React, { useState } from 'react';
import { EventStats } from './EventStats';
import { Button } from 'react-bootstrap';

type PropType = {
  eventId: string;
};

export const EventStatsWrapper = (props: PropType): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        type="button"
        className="mt-3"
        variant="success"
        aria-label="eventStatistics"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        View Event Statistics
      </Button>
      {showModal && (
        <EventStats
          show={showModal}
          handleClose={(): void => setShowModal(false)}
          eventId={props.eventId}
        />
      )}
    </>
  );
};
