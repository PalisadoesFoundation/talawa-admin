import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from './OrganizationActionItems.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface InterfaceFormStateType {
  assigneeId: string;
  assignee: string;
  assigner: string;
  isCompleted: boolean;
  preCompletionNotes: string;
  postCompletionNotes: string;
}

interface InterfaceActionItemCreateModalProps {
  actionItemUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateActionItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  membersData: any;
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
      <Modal show={actionItemUpdateModalIsOpen} onHide={hideUpdateModal}>
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
            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {formState.assignee}
                </option>
                {membersData?.map((member: any, index: any) => {
                  const currMemberName = `${member.firstName} ${member.lastName}`;
                  if (currMemberName !== formState.assignee) {
                    return (
                      <option key={index} value={member._id}>
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
            />

            <label htmlFor="actionItemPostCompletionNotes">
              {t('postCompletionNotes')}
            </label>
            <Form.Control
              type="actionItemPostCompletionNotes"
              id="actionItemPostCompletionNotes"
              placeholder={t('postCompletionNotes')}
              autoComplete="off"
              value={formState.postCompletionNotes || ''}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  postCompletionNotes: e.target.value,
                });
              }}
            />

            <div className={styles.datediv}>
              <div>
                <DatePicker
                  label={t('dueDate')}
                  className={styles.datebox}
                  value={dayjs(dueDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setDueDate(date?.toDate());
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('completionDate')}
                  className={styles.datebox}
                  value={dayjs(completionDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setCompletionDate(date?.toDate());
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="allday">{t('isCompleted')}?</label>
                <Form.Switch
                  className="ms-2"
                  id="allday"
                  type="checkbox"
                  checked={formState.isCompleted}
                  data-testid="alldayCheck"
                  onChange={(): void =>
                    setFormState({
                      ...formState,
                      isCompleted: !formState.isCompleted,
                    })
                  }
                />
              </div>
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
