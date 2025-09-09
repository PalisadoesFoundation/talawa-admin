/**
 * ItemDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an action item.
 * It provides a user-friendly interface to confirm or cancel the deletion process.
 *
 * @param  props - The props for the ItemDeleteModal component.
 * @param props - Determines whether the modal is visible.
 * @param  props - Function to hide the modal.
 * @param props - The action item to be deleted.
 * @param props - Function to refetch the list of action items after deletion.
 *
 * @returns  A React functional component rendering the delete confirmation modal.
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
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { DELETE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import type {
  IActionItemInfo,
  IDeleteActionItemInput,
} from 'types/Actions/interface';

export interface IItemDeleteModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItem: IActionItemInfo;
  actionItemsRefetch: () => void;
}

const ItemDeleteModal: React.FC<IItemDeleteModalProps> = ({
  isOpen,
  hide,
  actionItem,
  actionItemsRefetch,
}) => {
  const { t: tCommon } = useTranslation('translation');
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [deleteActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION, {
    refetchQueries: ['ActionItemsByOrganization', 'GetEventActionItems'],
  });

  const handleDelete = async (): Promise<void> => {
    try {
      const input: IDeleteActionItemInput = {
        id: actionItem.id,
      };

      await deleteActionItem({
        variables: { input },
      });

      actionItemsRefetch();
      hide();
      toast.success(t('successfulDeletion'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Modal show={isOpen} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('deleteActionItem')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p> {t('deleteActionItemMsg')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" data-testid="deletenobtn" onClick={hide}>
          {tCommon('no')}
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          data-testid="deleteyesbtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemDeleteModal;
