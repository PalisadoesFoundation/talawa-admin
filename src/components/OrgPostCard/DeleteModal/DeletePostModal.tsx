/**
 * DeletePostModal Component
 *
 * This component renders a modal dialog for confirming the deletion of a post.
 * It provides options for the user to either confirm or cancel the deletion.
 *
 * @component
 * @param {InterfaceDeletePostModalProps} props - The props for the DeletePostModal component.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {() => void} props.onHide - Callback function to close the modal.
 * @param {() => void} props.onDelete - Callback function to handle the deletion of the post.
 *
 * @returns {JSX.Element} A modal dialog with delete confirmation options.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and structure.
 * - Translations are handled using the `react-i18next` library.
 * - The modal includes two buttons: "Yes" to confirm deletion and "No" to cancel.
 *
 * @example
 * ```tsx
 * <DeletePostModal
 *   show={isModalVisible}
 *   onHide={handleCloseModal}
 *   onDelete={handleDeletePost}
 * />
 * ```
 *
 * @fileoverview
 * This file defines the DeletePostModal component, which is used in the
 * Talawa Admin project to confirm post deletions within the organization post card.
 */
import React, { type FC } from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';

interface InterfaceDeletePostModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
}

const DeletePostModal: FC<InterfaceDeletePostModalProps> = ({
  show,
  onHide,
  onDelete,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPostCard' });
  const { t: tCommon } = useTranslation('common');

  const handleConfirmDelete = (): void => {
    onDelete();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} data-testid="delete-post-modal">
      <Modal.Header>
        <h5>{t('deletePost')}</h5>
        <Button variant="danger" onClick={onHide}>
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>{t('deletePostMsg')}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={onHide}
          data-testid="deleteModalNoBtn"
          className={styles.removeButton}
        >
          {tCommon('no')}
        </Button>
        <Button
          type="button"
          className={`btn ${styles.addButton}`}
          onClick={handleConfirmDelete}
          data-testid="deletePostBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePostModal;
