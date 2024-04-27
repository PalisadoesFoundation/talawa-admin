import React, { useState } from 'react';
import { CheckInModal } from './CheckInModal';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './CheckInWrapper.module.css';

type PropType = {
  eventId: string;
};

export const CheckInWrapper = (props: PropType): JSX.Element => {
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
          <IconComponent
            name="Check In Registrants"
            fill="var(--bs-secondary)"
          />
        </div>
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
