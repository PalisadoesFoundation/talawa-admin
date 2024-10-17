import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from './OrganizationActionItems.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  InterfaceActionItemCategoryInfo,
  InterfaceMemberInfo,
} from 'utils/interfaces';

/**
 * Interface for the form state used in the `ActionItemCreateModal` component.
 */
interface InterfaceFormStateType {
  actionItemCategoryId: string;
  assigneeId: string;
  eventId?: string;
  preCompletionNotes: string;
}

/**
 * Props for the `ActionItemCreateModal` component.
 */
interface InterfaceActionItemCreateModalProps {
  actionItemCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createActionItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  actionItemCategories: InterfaceActionItemCategoryInfo[] | undefined;
  membersData: InterfaceMemberInfo[] | undefined;
  dueDate: Date | null;
  setDueDate: (state: React.SetStateAction<Date | null>) => void;
}

/**
 * A modal component for creating action items.
 *
 * @param props - The properties passed to the component.
 * @returns The `ActionItemCreateModal` component.
 */
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
      <Modal
        className={styles.actionItemModal}
        show={actionItemCreateModalIsOpen}
        onHide={hideCreateModal}
      >
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
              <Form.Label>{t('actionItemCategory')}</Form.Label>
              <Form.Select
                data-testid="formSelectActionItemCategory"
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
                {actionItemCategories?.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('assignee')}</Form.Label>
              <Form.Select
                data-testid="formSelectAssignee"
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {t('selectAssignee')}
                </option>
                {membersData?.map((member, index) => (
                  <option key={index} value={member._id}>
                    {`${member.firstName} ${member.lastName}`}
                  </option>
                ))}
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
              data-testid="createActionItemFormSubmitBtn"
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
