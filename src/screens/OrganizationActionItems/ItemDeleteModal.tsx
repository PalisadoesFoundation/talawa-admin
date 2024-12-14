import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../../style/app.module.css';
import { useMutation } from '@apollo/client';
import { DELETE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import type { InterfaceActionItemInfo } from 'utils/interfaces';

/**
 * Props for the `ItemDeleteModal` component.
 */
export interface InterfaceItemDeleteModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItem: InterfaceActionItemInfo | null;
  actionItemsRefetch: () => void;
}

/**
 * A modal component for confirming the deletion of an action item.
 *
 * @param props - The properties passed to the component.
 * @returns The `ItemDeleteModal` component.
 */
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
          actionItemId: actionItem?._id,
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
    <>
      <Modal className={styles.itemModal} onHide={hide} show={isOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deleteActionItem')}</p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="modalCloseBtn"
          >
            {' '}
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p> {t('deleteActionItemMsg')}</p>
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
    </>
  );
};

export default ItemDeleteModal;
