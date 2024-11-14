import React, { useState } from 'react';
import { CheckInModal } from './CheckInModal';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './CheckInWrapper.module.css';

type PropType = {
  eventId: string;
};

/**
 * Wrapper component that displays a button to open the CheckInModal.
 *
 * @param eventId - The ID of the event for which check-in management is being handled.
 *
 * @returns JSX.Element - The rendered CheckInWrapper component.
 */
export const CheckInWrapper = ({ eventId }: PropType): JSX.Element => {
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
          eventId={eventId}
        />
      )}
    </>
  );
};
