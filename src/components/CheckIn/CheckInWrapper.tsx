/**
 * A wrapper component for managing the "Check-In Members" functionality.
 *
 * This component renders a button that, when clicked, opens a modal for
 * checking in members for a specific event. The modal is controlled
 * using a local state to toggle its visibility.
 *
 * @component
 * @param {string} eventId - The unique identifier of the event for which
 * members are being checked in.
 *
 * @returns {JSX.Element} The rendered CheckInWrapper component.
 *
 * @remarks
 * - The `CheckInModal` component is used to handle the modal functionality.
 * - The button includes an image and text for user interaction.
 * - The `style.createButton` class is applied to the button for styling.
 *
 * @example
 * ```tsx
 * <CheckInWrapper eventId="12345" />
 * ```
 *
 */
import React, { useState } from 'react';
import { CheckInModal } from './Modal/CheckInModal';
import { Button } from 'react-bootstrap';
import style from '../../../src/style/app-fixed.module.css';

type PropType = {
  eventId: string;
  onCheckInUpdate?: () => void;
};

export const CheckInWrapper = ({
  eventId,
  onCheckInUpdate,
}: PropType): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        data-testid="stats-modal"
        className={`${style.createButton} ${style.statsButton}`}
        aria-label="checkInMembers"
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
        Check In Members
      </Button>
      {showModal && (
        <CheckInModal
          show={showModal}
          handleClose={(): void => setShowModal(false)}
          eventId={eventId}
          onCheckInUpdate={onCheckInUpdate}
        />
      )}
    </>
  );
};
