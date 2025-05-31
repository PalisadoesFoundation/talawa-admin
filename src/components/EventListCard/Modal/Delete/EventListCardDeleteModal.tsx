/**
 * EventListCardDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an event.
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
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
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
  return (
    <Modal
      size="sm"
      id={`deleteEventModal${eventListCardProps._id}`}
      show={eventDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className={`${styles.modalHeader}`}>
        <Modal.Title
          className="text-white"
          id={`deleteEventModalLabel${eventListCardProps._id}`}
        >
          {t('deleteEvent')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('deleteEventMsg')}</Modal.Body>
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
          onClick={deleteEventHandler}
          data-testid="deleteEventBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventListCardDeleteModal;
