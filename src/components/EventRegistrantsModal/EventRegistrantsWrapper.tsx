/**
 * A wrapper component for managing the visibility and functionality of the
 * `EventRegistrantsModal` component. This component provides a button to
 * open the modal and handles the modal's lifecycle, including invoking an
 * optional callback when the modal is closed.
 *
 * @component
 * @param {string} eventId - The unique identifier for the event.
 * @param {string} orgId - The unique identifier for the organization.
 * @param {() => void} [onUpdate] - Optional callback function to be executed
 * after the modal is closed.
 *
 * @returns {JSX.Element} A button to open the modal and the modal itself
 * when visible.
 *
 * @example
 * ```tsx
 * <EventRegistrantsWrapper
 *   eventId="12345"
 *   orgId="67890"
 *   onUpdate={() => console.log('Modal closed')}
 * />
 * ```
 *
 * @remarks
 * - The modal is displayed conditionally based on the `showModal` state.
 * - The `onUpdate` callback is invoked after the modal is closed, if provided.
 * - The button uses a custom style from `app-fixed.module.css`.
 */
import React, { useState } from 'react';
import { EventRegistrantsModal } from './Modal/EventRegistrantsModal';
import { Button } from 'react-bootstrap';
import style from 'style/app-fixed.module.css';

type PropType = { eventId: string; orgId: string; onUpdate?: () => void };

export const EventRegistrantsWrapper = ({
  eventId,
  orgId,
  onUpdate,
}: PropType): JSX.Element => {
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = (): void => {
    setShowModal(false);
    // Call onUpdate after modal is closed
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <>
      {/* Button to open the event registrants modal */}
      <Button
        data-testid="filter-button"
        className={`border-1 mx-4 ${style.createButton}`}
        aria-label="showAttendees"
        onClick={(): void => {
          setShowModal(true); // Show the modal when button is clicked
        }}
      >
        Add Registrants
      </Button>

      {/* Render the EventRegistrantsModal if showModal is true */}
      {showModal && (
        <EventRegistrantsModal
          show={showModal}
          handleClose={handleClose}
          eventId={eventId}
          orgId={orgId}
        />
      )}
    </>
  );
};
