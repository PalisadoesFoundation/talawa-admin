import React, { useState } from 'react';
import { EventStats } from './EventStats';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './EventStatsWrapper.module.css';

type PropType = {
  eventId: string;
};

export const EventStatsWrapper = (props: PropType): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="light"
        className="text-secondary"
        aria-label="checkInRegistrants"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Event Stats" fill="var(--bs-secondary)" />
        </div>
        View Event Statistics
      </Button>
      <EventStats
        show={showModal}
        handleClose={(): void => setShowModal(false)}
        eventId={props.eventId}
      />
    </>
  );
};
