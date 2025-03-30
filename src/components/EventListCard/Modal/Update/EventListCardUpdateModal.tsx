import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { type RecurringEventMutationType } from 'utils/recurrenceUtils';

import type { InterfaceUpdateEventModalProps } from 'types/Event/interface';

/**
 * UpdateModal: A modal displaying the recurring event update options.
 */

const UpdateModal: React.FC<InterfaceUpdateEventModalProps> = ({
  eventListCardProps,
  recurringEventUpdateModalIsOpen,
  toggleRecurringEventUpdateModal,
  t,
  tCommon,
  recurringEventUpdateType,
  setRecurringEventUpdateType,
  recurringEventUpdateOptions,
  updateEventHandler,
}) => {
  return (
    <Modal
      size="sm"
      id={`recurringEventUpdateOptions${eventListCardProps._id}`}
      show={recurringEventUpdateModalIsOpen}
      onHide={toggleRecurringEventUpdateModal}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className={`${styles.modalHeader}`}>
        <Modal.Title
          className="text-white"
          id={`recurringEventUpdateOptionsLabel${eventListCardProps._id}`}
        >
          {t('editEvent')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          {recurringEventUpdateOptions.map((option, index) => (
            <div key={index} className="my-0 d-flex align-items-center">
              <Form.Check
                type="radio"
                id={`radio-${index}`}
                label={t(option)}
                name="recurringEventUpdateType"
                value={option}
                onChange={(e) =>
                  setRecurringEventUpdateType(
                    e.target.value as RecurringEventMutationType,
                  )
                }
                defaultChecked={option === recurringEventUpdateType}
                data-testid={`update-${option}`}
                className={styles.switch}
              />
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          className={`btn btn-danger ${styles.removeButton}`}
          data-dismiss="modal"
          onClick={toggleRecurringEventUpdateModal}
          data-testid="eventUpdateOptionsModalCloseBtn"
        >
          {tCommon('no')}
        </Button>
        <Button
          type="button"
          className={`btn ${styles.addButton}`}
          onClick={updateEventHandler}
          data-testid="recurringEventUpdateOptionSubmitBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
