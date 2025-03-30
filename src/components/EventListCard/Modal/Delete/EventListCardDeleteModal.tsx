/**
 * EventListCardDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an event.
 * It supports both single and recurring events, providing options for handling
 * recurring event deletions.
 *
 * @component
 * @param {InterfaceDeleteEventModalProps} props - The props for the component.
 * @param {object} props.eventListCardProps - The properties of the event to be deleted.
 * @param {boolean} props.eventDeleteModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.toggleDeleteModal - Function to toggle the modal visibility.
 * @param {(key: string) => string} props.t - Translation function for event-specific strings.
 * @param {(key: string) => string} props.tCommon - Translation function for common strings.
 * @param {RecurringEventMutationType} props.recurringEventDeleteType - The selected option for recurring event deletion.
 * @param {(type: RecurringEventMutationType) => void} props.setRecurringEventDeleteType - Function to set the recurring event deletion type.
 * @param {() => void} props.deleteEventHandler - Function to handle the event deletion.
 *
 * @returns {JSX.Element} A modal component for confirming event deletion.
 *
 * @remarks
 * - For recurring events, radio buttons are displayed to select the deletion type.
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
 *   recurringEventDeleteType="ALL"
 *   setRecurringEventDeleteType={setDeleteType}
 *   deleteEventHandler={handleDelete}
 * />
 * ```
 */
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import {
  type RecurringEventMutationType,
  recurringEventMutationOptions,
} from 'utils/recurrenceUtils';

import type { InterfaceDeleteEventModalProps } from 'types/Event/interface';

const EventListCardDeleteModal: React.FC<InterfaceDeleteEventModalProps> = ({
  eventListCardProps,
  eventDeleteModalIsOpen,
  toggleDeleteModal,
  t,
  tCommon,
  recurringEventDeleteType,
  setRecurringEventDeleteType,
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
      <Modal.Body>
        {!eventListCardProps.recurring && t('deleteEventMsg')}
        {eventListCardProps.recurring && (
          <>
            <Form className="mt-3">
              {recurringEventMutationOptions.map((option, index) => (
                <div key={index} className="my-0 d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    id={`radio-${index}`}
                    label={t(option)}
                    name="recurringEventDeleteType"
                    value={option}
                    onChange={(e) =>
                      setRecurringEventDeleteType(
                        e.target.value as RecurringEventMutationType,
                      )
                    }
                    defaultChecked={option === recurringEventDeleteType}
                    data-testid={`delete-${option}`}
                    className={styles.switch}
                  />
                </div>
              ))}
            </Form>
          </>
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
