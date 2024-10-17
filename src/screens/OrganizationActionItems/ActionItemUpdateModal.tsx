import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import styles from './OrganizationActionItems.module.css';
import type { InterfaceMemberInfo } from 'utils/interfaces';

/**
 * InterfaceFormStateType is an object containing the form state
 */
interface InterfaceFormStateType {
  assigneeId: string;
  assignee: string;
  assigner: string;
  isCompleted: boolean;
  preCompletionNotes: string;
  postCompletionNotes: string;
}

/**
 * ActionItemUpdateModal component is used to update the action item details like assignee, preCompletionNotes, dueDate, completionDate
 * @param  actionItemUpdateModalIsOpen - boolean value to check if the modal is open or not
 * @param  hideUpdateModal - function to hide the modal
 * @param  formState - object containing the form state
 * @param  setFormState - function to set the form state
 * @param  updateActionItemHandler - function to update the action item
 * @param  t - i18n function to translate the text
 * @param  membersData - array of members data
 * @param  dueDate - due date of the action item
 * @param  setDueDate - function to set the due date
 * @param  completionDate - completion date of the action item
 * @param  setCompletionDate - function to set the completion date
 * @returns  returns the ActionItemUpdateModal component
 */
interface InterfaceActionItemCreateModalProps {
  actionItemUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateActionItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  membersData: InterfaceMemberInfo[] | undefined;
  dueDate: Date | null;
  setDueDate: (state: React.SetStateAction<Date | null>) => void;
  completionDate: Date | null;
  setCompletionDate: (state: React.SetStateAction<Date | null>) => void;
}

const ActionItemUpdateModal: React.FC<InterfaceActionItemCreateModalProps> = ({
  actionItemUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateActionItemHandler,
  t,
  membersData,
  dueDate,
  setDueDate,
  completionDate,
  setCompletionDate,
}) => {
  return (
    <>
      <Modal
        className={styles.actionItemModal}
        show={actionItemUpdateModalIsOpen}
        onHide={hideUpdateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideUpdateModal}
            data-testid="updateActionItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateActionItemHandler}>
            <Form.Group className="mb-2">
              <Form.Label>{t('assignee')}</Form.Label>
              <Form.Select
                data-testid="formUpdateAssignee"
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {formState.assignee}
                </option>
                {membersData?.map((member: InterfaceMemberInfo) => {
                  const currMemberName = `${member.firstName} ${member.lastName}`;
                  if (currMemberName !== formState.assignee) {
                    return (
                      <option key={member._id} value={member._id}>
                        {`${member.firstName} ${member.lastName}`}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>

            <label htmlFor="actionItemPreCompletionNotes">
              {t('preCompletionNotes')}
            </label>
            <Form.Control
              type="actionItemPreCompletionNotes"
              id="actionItemPreCompletionNotes"
              placeholder={t('preCompletionNotes')}
              autoComplete="off"
              value={formState.preCompletionNotes || ''}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
              className="mb-2"
            />

            <div className={`${styles.datediv} mt-3 mb-2`}>
              <DatePicker
                label={t('dueDate')}
                className={styles.datebox}
                value={dayjs(dueDate)}
                onChange={
                  /* istanbul ignore next */ (date: Dayjs | null): void => {
                    /* istanbul ignore next */
                    if (date) {
                      setDueDate(date?.toDate());
                    }
                  }
                }
              />
              &nbsp;
              <DatePicker
                label={t('completionDate')}
                className={styles.datebox}
                value={dayjs(completionDate)}
                onChange={
                  /* istanbul ignore next */ (date: Dayjs | null): void => {
                    /* istanbul ignore next */
                    if (date) {
                      setCompletionDate(date?.toDate());
                    }
                  }
                }
              />
            </div>

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="editActionItem"
              data-testid="editActionItemBtn"
            >
              {t('editActionItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionItemUpdateModal;
