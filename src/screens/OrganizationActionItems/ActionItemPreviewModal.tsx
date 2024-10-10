import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import styles from './OrganizationActionItems.module.css';
import dayjs from 'dayjs';
/**
 * State object for form details related to an action item.
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
 * Props for the `ActionItemPreviewModal` component.
 */
interface InterfaceActionItemCreateModalProps {
  actionItemPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;
  t: (key: string) => string;
  dueDate: Date | null;
  completionDate: Date | null;
  assignmentDate: Date | null;
}

/**
 * A modal component for previewing the details of an action item.
 *
 * @param props - The properties passed to the component.
 * @returns The `ActionItemPreviewModal` component.
 */
const ActionItemPreviewModal: React.FC<InterfaceActionItemCreateModalProps> = ({
  actionItemPreviewModalIsOpen,
  hidePreviewModal,
  showUpdateModal,
  toggleDeleteModal,
  formState,
  t,
  dueDate,
  completionDate,
  assignmentDate,
}) => {
  return (
    <>
      <Modal
        className={styles.actionItemModal}
        show={actionItemPreviewModalIsOpen}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            onClick={hidePreviewModal}
            data-testid="previewActionItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <p className={styles.preview}>
                {t('assignee')}:{' '}
                <span className={styles.view}>{formState.assignee}</span>
              </p>
              <p className={styles.preview}>
                {t('assigner')}:{' '}
                <span className={styles.view}>{formState.assigner}</span>
              </p>
              <p className={styles.preview}>
                {t('preCompletionNotes')}:
                <span className={styles.view}>
                  {formState.preCompletionNotes}
                </span>
              </p>
              <p className={styles.preview}>
                {t('postCompletionNotes')}:
                <span className={styles.view}>
                  {formState.postCompletionNotes}
                </span>
              </p>
              <p className={styles.preview}>
                {t('assignmentDate')}:{' '}
                <span className={styles.view}>
                  {dayjs(assignmentDate).format('YYYY-MM-DD')}
                </span>
              </p>
              <p className={styles.preview}>
                {t('dueDate')}:{' '}
                <span className={styles.view}>
                  {dayjs(dueDate).format('YYYY-MM-DD')}
                </span>
              </p>
              <p className={styles.preview}>
                {t('completionDate')}:{' '}
                <span className={styles.view}>
                  {dayjs(completionDate).format('YYYY-MM-DD')}
                </span>
              </p>
              <p className={styles.preview}>
                {t('status')}:{' '}
                <span className={styles.view}>
                  {formState.isCompleted ? 'Completed' : 'Active'}
                </span>
              </p>
            </div>
            <div className={styles.iconContainer}>
              <Button
                size="sm"
                data-testid="editActionItemPreviewModalBtn"
                className={styles.icon}
                onClick={() => {
                  hidePreviewModal();
                  showUpdateModal();
                }}
              >
                {' '}
                <i className="fas fa-edit"></i>
              </Button>
              <Button
                size="sm"
                data-testid="deleteActionItemPreviewModalBtn"
                className={`${styles.icon} ms-2`}
                onClick={toggleDeleteModal}
                variant="danger"
              >
                {' '}
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionItemPreviewModal;
