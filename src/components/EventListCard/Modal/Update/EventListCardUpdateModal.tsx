/**
 * UpdateModal Component
 *
 * This component renders a modal for updating recurring event options.
 * It provides a user interface to select the type of update for a recurring event
 * and confirm or cancel the update action.
 *
 * @component
 * @param {InterfaceUpdateEventModalProps} props - The props for the UpdateModal component.
 * @param {object} props.eventListCardProps - Properties of the event card being updated.
 * @param {boolean} props.recurringEventUpdateModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.toggleRecurringEventUpdateModal - Function to toggle the modal visibility.
 * @param {(key: string) => string} props.t - Translation function for localized strings.
 * @param {(key: string) => string} props.tCommon - Common translation function for shared strings.
 * @param {RecurringEventMutationType} props.recurringEventUpdateType - Current selected update type.
 * @param {(type: RecurringEventMutationType) => void} props.setRecurringEventUpdateType -
 * Function to set the selected update type.
 * @param {string[]} props.recurringEventUpdateOptions - List of available update options.
 * @param {() => void} props.updateEventHandler - Function to handle the update action.
 *
 * @returns {JSX.Element} A modal component for updating recurring event options.
 *
 * @remarks
 * - The modal is centered and has a static backdrop to prevent accidental closure.
 * - The `recurringEventUpdateOptions` are rendered as radio buttons for user selection.
 * - The modal includes "Yes" and "No" buttons for confirming or canceling the update.
 *
 * @example
 * ```tsx
 * <UpdateModal
 *   eventListCardProps={eventProps}
 *   recurringEventUpdateModalIsOpen={true}
 *   toggleRecurringEventUpdateModal={toggleModal}
 *   t={translate}
 *   tCommon={translateCommon}
 *   recurringEventUpdateType="updateAll"
 *   setRecurringEventUpdateType={setUpdateType}
 *   recurringEventUpdateOptions={["updateAll", "updateFuture"]}
 *   updateEventHandler={handleUpdate}
 * />
 * ```
 */
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { type RecurringEventMutationType } from 'utils/recurrenceUtils';

import type { InterfaceUpdateEventModalProps } from 'types/Event/interface';

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
