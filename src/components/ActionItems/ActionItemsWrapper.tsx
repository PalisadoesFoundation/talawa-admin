import React, { useState } from 'react';
import { ActionItemsModal } from './ActionItemsModal';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './ActionItemsWrapper.module.css';
import { useTranslation } from 'react-i18next';

type PropType = {
  orgId: string;
  eventId: string;
};

/**
 * A React functional component that provides a button to open a modal for viewing and managing action items related to a specific event.
 *
 * This component displays a button that, when clicked, opens a modal dialog (`ActionItemsModal`). The modal allows users to interact with action items specific to the organization and event IDs passed as props.
 *
 * @param props - The props that define the organization's and event's context for the action items.
 * @param orgId - The unique identifier for the organization. This ID is used to fetch and manage the organization's action items.
 * @param eventId - The unique identifier for the event. This ID is used to fetch and manage the action items associated with the specific event.
 *
 * @returns The JSX element representing the action items button and modal.
 *
 * @example
 * ```tsx
 * <ActionItemsWrapper orgId="12345" eventId="67890" />
 * ```
 * This example renders the `ActionItemsWrapper` component for an organization with ID "12345" and an event with ID "67890". The button will open a modal for managing action items related to this event.
 */
export const ActionItemsWrapper = ({
  orgId,
  eventId,
}: PropType): JSX.Element => {
  // Extract the translation function from the useTranslation hook, specifying the namespace and key prefix for translations
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  // State to control the visibility of the ActionItemsModal
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Button to open the ActionItemsModal */}
      <Button
        variant="light"
        className="text-secondary"
        aria-label="eventDashboardActionItems"
        onClick={(): void => {
          setShowModal(true); // Set showModal state to true to open the modal
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Action Items" fill="var(--bs-secondary)" />
        </div>
        {t('eventActionItems')} {/* Translated text for the button */}
      </Button>

      {/* Conditionally render the ActionItemsModal if showModal is true */}
      {showModal && (
        <ActionItemsModal
          show={showModal}
          handleClose={(): void => setShowModal(false)} // Function to close the modal
          orgId={orgId}
          eventId={eventId}
        />
      )}
    </>
  );
};
