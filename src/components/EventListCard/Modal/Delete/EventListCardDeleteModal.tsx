// translation-check-keyPrefix: eventListCard
/**
 * EventListCardDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an event.
 * For standalone events, shows simple confirmation.
 * For recurring instances, shows three deletion options.
 *
 * @param eventListCardProps - The properties of the event to be deleted.
 * @param eventDeleteModalIsOpen - Determines if the modal is open.
 * @param toggleDeleteModal - Function to toggle the modal visibility.
 * @param t - Translation function for event-specific strings.
 * @param tCommon - Translation function for common strings.
 * @param deleteEventHandler - Function to handle the event deletion.
 *
 * @returns A modal component for confirming event deletion.
 *
 * @remarks
 * - The modal is styled using `app-fixed.module.css`.
 * - The modal is centered and has a static backdrop to prevent accidental closure.
 * - For recurring events, provides three deletion options: this instance, this and following, or all events.
 *
 * @example
 * ```tsx
 * <EventListCardDeleteModal
 *   eventListCardProps={event}
 *   eventDeleteModalIsOpen={isModalOpen}
 *   toggleDeleteModal={toggleModal}
 *   t={translate}
 *   tCommon={translateCommon}
 *   deleteEventHandler={handleDelete}
 * />
 * ```
 */
import React, { useId, useState } from 'react';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';

import styles from './EventListCardDeleteModal.module.css';
import type { InterfaceDeleteEventModalProps } from 'types/Event/interface';
import { TEST_ID_DELETE_EVENT_MODAL } from 'Constant/common';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import Button from 'shared-components/Button';

const EventListCardDeleteModal: React.FC<InterfaceDeleteEventModalProps> = ({
  eventListCardProps,
  eventDeleteModalIsOpen,
  toggleDeleteModal,
  t,
  tCommon,
  deleteEventHandler,
}) => {
  const [deleteOption, setDeleteOption] = useState<
    'single' | 'following' | 'all'
  >('single');

  const idPrefix = useId();

  // Check if this is a recurring instance
  const isRecurringInstance =
    !eventListCardProps.isRecurringEventTemplate &&
    !!eventListCardProps.baseEvent?.id;

  const handleDelete = () => {
    if (isRecurringInstance) {
      deleteEventHandler(deleteOption);
    } else {
      deleteEventHandler();
    }
  };
  return (
    <BaseModal
      size={isRecurringInstance ? 'lg' : 'sm'}
      id={`deleteEventModal${eventListCardProps.id}`}
      show={eventDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      backdrop="static"
      keyboard={false}
      centered
      title={<span>{t('deleteEvent')}</span>}
      dataTestId={TEST_ID_DELETE_EVENT_MODAL(eventListCardProps.id)}
      headerClassName={`${styles.modalHeader}`}
      footer={
        <>
          <Button
            variant="danger"
            className={`btn ${styles.removeButton}`}
            data-testid="eventDeleteModalCloseBtn"
            onClick={toggleDeleteModal}
          >
            {tCommon('no')}
          </Button>
          <Button
            className={`btn ${styles.addButton}`}
            onClick={handleDelete}
            data-testid="deleteEventBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      {isRecurringInstance ? (
        <div>
          <p>{t('deleteRecurringEventMsg')}</p>
          <FormCheckField
            type="radio"
            id={`${idPrefix}-delete-single`}
            name="deleteOption"
            value="single"
            checked={deleteOption === 'single'}
            onChange={() => setDeleteOption('single')}
            label={t('deleteThisInstance')}
            className="mb-2"
            data-testid="deleteThisInstance"
          />
          <FormCheckField
            type="radio"
            id={`${idPrefix}-delete-following`}
            name="deleteOption"
            value="following"
            checked={deleteOption === 'following'}
            onChange={() => setDeleteOption('following')}
            label={t('deleteThisAndFollowing')}
            className="mb-2"
            data-testid="deleteThisAndFollowing"
          />
          <FormCheckField
            type="radio"
            id={`${idPrefix}-delete-all`}
            name="deleteOption"
            value="all"
            checked={deleteOption === 'all'}
            onChange={() => setDeleteOption('all')}
            label={t('deleteAllEvents')}
            className="mb-2"
            data-testid="deleteAllEvents"
          />
        </div>
      ) : (
        <p>{t('deleteEventMsg')}</p>
      )}
    </BaseModal>
  );
};

export default EventListCardDeleteModal;
