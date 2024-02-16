import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from './OrganizationActionItems.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  InterfaceActionItemCategoryInfo,
  InterfaceActionItemCategoryList,
} from 'utils/interfaces';

interface InterfaceFormStateType {
  actionItemCategoryId: string;
  assigneeId: string;
  eventId?: string;
  preCompletionNotes: string;
}

interface InterfaceActionItemCreateModalProps {
  actionItemCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createActionItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  actionItemCategories: InterfaceActionItemCategoryInfo[] | undefined;
  membersData: any;
  dueDate: Date | null;
  setDueDate: (state: React.SetStateAction<Date | null>) => void;
}

const ActionItemCreateModal: React.FC<InterfaceActionItemCreateModalProps> = ({
  actionItemCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createActionItemHandler,
  t,
  actionItemCategories,
  membersData,
  dueDate,
  setDueDate,
}) => {
  return (
    <>
      <Modal show={actionItemCreateModalIsOpen} onHide={hideCreateModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideCreateModal}
            data-testid="createActionItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createActionItemHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Action Item Category</Form.Label>
              <Form.Select
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    actionItemCategoryId: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  {t('selectActionItemCategory')}
                </option>
                {actionItemCategories?.map((category: any, index: any) => (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {t('selectAssignee')}
                </option>
                {membersData?.organizations[0].members.map(
                  (member: any, index: any) => (
                    <option key={index} value={member._id}>
                      {`${member.firstName} ${member.lastName}`}
                    </option>
                  )
                )}
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
              value={formState.preCompletionNotes}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
            />

            <div>
              <DatePicker
                label={t('dueDate')}
                className="mb-3 w-100"
                value={dayjs(dueDate)}
                onChange={(date: Dayjs | null): void => {
                  if (date) {
                    setDueDate(date?.toDate());
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="createActionItem"
              data-testid="createActionItem"
            >
              {t('createActionItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionItemCreateModal;
