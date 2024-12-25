import React, { useState } from 'react';
import { CheckInModal } from './CheckInModal';
import { Button } from 'react-bootstrap';
import style from '../../style/app.module.css';

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
        data-testid="stats-modal"
        className={`border-1 bg-white text-success ${style.createButton} `}
        aria-label="checkInRegistrants"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <img
          src="/images/svg/options-outline.svg"
          width={30.63}
          height={30.63}
          alt="Sort"
        />
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
