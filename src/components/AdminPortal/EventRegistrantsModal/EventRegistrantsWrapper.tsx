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
 * - The modal visibility is derived from `modalState.isOpen` via `useModalState`.
 * - The `onUpdate` callback is invoked after the modal is closed, if provided.
 * - The button uses a custom style from EventRegistrantsWrapper.module.css.
 */
import React from 'react';
import { EventRegistrantsModal } from './Modal/EventRegistrantsModal';
import Button from 'shared-components/Button';
import style from './EventRegistrantsWrapper.module.css';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';
import type { InterfaceEventRegistrantsWrapperProps } from 'types/AdminPortal/EventRegistrantsWrapper/interface';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';

export const EventRegistrantsWrapper = ({
  eventId,
  orgId,
  onUpdate,
}: InterfaceEventRegistrantsWrapperProps): JSX.Element => {
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const modalState = useModalState();

  const handleClose = (): void => {
    modalState.close();
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
      <Button
        data-testid="filter-button"
        className={style.createButton}
        aria-label={t('registerMember')}
        onClick={modalState.open}
      >
        {t('registerMember')}
      </Button>

      {/* Render the EventRegistrantsModal if showModal is true */}
      <EventRegistrantsModal
        show={modalState.isOpen}
        handleClose={handleClose}
        eventId={eventId}
        orgId={orgId}
      />
    </ErrorBoundaryWrapper>
  );
};
