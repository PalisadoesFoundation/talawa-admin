import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '../../../../style/app-fixed.module.css';
import {
  type RecurringEventMutationType,
  recurringEventMutationOptions,
} from 'utils/recurrenceUtils';

import type { InterfaceDeleteEventModalProps } from 'types/Event/interface';

/**
 * DeleteModal: A modal displaying events with the ability to delete.
 */

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
