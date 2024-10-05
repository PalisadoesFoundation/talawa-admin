import React, { useState } from 'react';
import { EventRegistrantsModal } from './EventRegistrantsModal';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './EventRegistrantsWrapper.module.css';

type PropType = {
  eventId: string;
  orgId: string;
};

export const EventRegistrantsWrapper: React.FC<PropType> = ({
  eventId,
  orgId,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="light"
        className="text-secondary"
        aria-label="showAttendees"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent
            name="List Event Registrants"
            fill="var(--bs-secondary)"
          />
        </div>
        Show Registrants
      </Button>

      {showModal && (
        <EventRegistrantsModal
          show={showModal}
          handleClose={(): void => {
            setShowModal(false);
          }}
          eventId={eventId}
          orgId={orgId}
        />
      )}
    </>
  );
};
