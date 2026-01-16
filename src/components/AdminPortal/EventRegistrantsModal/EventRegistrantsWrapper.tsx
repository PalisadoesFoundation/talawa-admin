/**
 * A wrapper component for managing the visibility and functionality of the
 * `EventRegistrantsModal` component. This component provides a button to
 * open the modal and handles the modal's lifecycle, including invoking an
 * optional callback when the modal is closed.
 *
 * @param eventId - The unique identifier for the event.
 * @param orgId - The unique identifier for the organization.
 * @param onUpdate - Optional callback function to be executed
 * after the modal is closed.
 *
 * @returns A button to open the modal and the modal itself when visible.
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
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';

type PropType = { eventId: string; orgId: string; onUpdate?: () => void };

export const EventRegistrantsWrapper = ({
  eventId,
  orgId,
  onUpdate,
}: PropType): JSX.Element => {
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      {/* Button to open the event registrants modal */}
      <Button
        data-testid="filter-button"
        className={`border-1 mx-4 ${style.createButton}`}
        aria-label={t('registerMember')}
        onClick={(): void => {
          setShowModal(true); // Show the modal when button is clicked
        }}
      >
        {t('registerMember')}
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
    </ErrorBoundaryWrapper>
  );
};
