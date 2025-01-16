import React, { type FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app.module.css';

/**
 * A modal component that confirms a post delete operation.
 *
 * @param show - Whether the modal is visible.
 * @param onHide - Callback invoked when the modal is dismissed.
 * @param onDelete - Callback invoked to actually delete the post.
 * @returns A rendered React Bootstrap Modal for post deletion.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.addButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

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
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPostCard',
  });
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
