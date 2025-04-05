/**
 * ItemDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an action item.
 * It provides a user-friendly interface to confirm or cancel the deletion process.
 *
 * @component
 * @param {InterfaceItemDeleteModalProps} props - The props for the ItemDeleteModal component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to hide the modal.
 * @param {InterfaceActionItemInfo | null} props.actionItem - The action item to be deleted.
 * @param {() => void} props.actionItemsRefetch - Function to refetch the list of action items after deletion.
 *
 * @returns {React.FC} A React functional component rendering the delete confirmation modal.
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and button components.
 * - Integrates with Apollo Client's `useMutation` for handling the deletion of the action item.
 * - Displays success or error messages using `react-toastify`.
 * - Supports internationalization with `react-i18next`.
 *
 * @example
 * ```tsx
 * <ItemDeleteModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   actionItem={selectedActionItem}
 *   actionItemsRefetch={refetchActionItems}
 * />
 * ```
 *
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useMutation } from '@apollo/client';
import { DELETE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import type { InterfaceActionItem } from 'utils/interfaces';

export interface InterfaceItemDeleteModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItem: InterfaceActionItem | null;
  actionItemsRefetch: () => void;
}

const ItemDeleteModal: React.FC<InterfaceItemDeleteModalProps> = ({
  isOpen,
  hide,
  actionItem,
  actionItemsRefetch,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const [removeActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION);

  /**
   * Handles the action item deletion.
   */
  const deleteActionItemHandler = async (): Promise<void> => {
    try {
      await removeActionItem({
        variables: {
          input: {
            id: actionItem?.id, // Now we send the input object with the id field
          },
        },
      });

      actionItemsRefetch();
      hide();
      toast.success(t('successfulDeletion'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Modal className={styles.itemModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('deleteActionItem')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.closeButton}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <p>{t('deleteActionItemMsg')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={deleteActionItemHandler}
          data-testid="deleteyesbtn"
        >
          {tCommon('yes')}
        </Button>
        <Button variant="secondary" onClick={hide} data-testid="deletenobtn">
          {tCommon('no')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemDeleteModal;
