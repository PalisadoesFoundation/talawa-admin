/**
 * EventListCardDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an event.
 * For standalone events, shows simple confirmation.
 * For recurring instances, shows three deletion options.
 *
 * @param  props - The props for the component.
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
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import type { InterfaceDeleteEventModalProps } from 'types/Event/interface';

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
    <Modal
      size={isRecurringInstance ? 'lg' : 'sm'}
      id={`deleteEventModal${eventListCardProps.id}`}
      show={eventDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className={`${styles.modalHeader}`}>
        <Modal.Title
          className="text-white"
          id={`deleteEventModalLabel${eventListCardProps.id}`}
        >
          {t('deleteEvent')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isRecurringInstance ? (
          <div>
            <p>{t('deleteRecurringEventMsg')}</p>
            <Form>
              <Form.Check
                type="radio"
                id="delete-single"
                name="deleteOption"
                value="single"
                checked={deleteOption === 'single'}
                onChange={() => setDeleteOption('single')}
                label={t('deleteThisInstance')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="delete-following"
                name="deleteOption"
                value="following"
                checked={deleteOption === 'following'}
                onChange={() => setDeleteOption('following')}
                label={t('deleteThisAndFollowing')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="delete-all"
                name="deleteOption"
                value="all"
                checked={deleteOption === 'all'}
                onChange={() => setDeleteOption('all')}
                label={t('deleteAllEvents')}
                className="mb-2"
              />
            </Form>
          </div>
        ) : (
          <p>{t('deleteEventMsg')}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          className={`btn btn-danger ${styles.removeButton}`}
          data-dismiss="modal"
          onClick={toggleDeleteModal}
          data-testid="eventDeleteModalCloseBtn"
        >
          {tCommon('no')}
        </Button>
        <Button
          type="button"
          className={`btn ${styles.addButton}`}
          onClick={handleDelete}
          data-testid="deleteEventBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventListCardDeleteModal;
