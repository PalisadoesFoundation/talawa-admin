/**
 * A modal component for updating the status of an action item.
 *
 * @remarks
 * This component allows users to update the completion status of an action item.
 * It provides a form to add post-completion notes when marking an item as completed.
 * The modal uses Apollo Client's `useMutation` hook to perform the update operation
 * and displays success or error messages using `react-toastify`.
 *
 * @param props - The props for the `ItemUpdateStatusModal` component.
 * @param props - A boolean indicating whether the modal is open.
 * @param props - A function to close the modal.
 * @param props - A function to refetch the list of action items.
 * @param props - The action item object containing details to be updated.
 *
 * @returns A React component that renders the modal for updating an action item's status.
 *
 * @example
 * ```tsx
 * <ItemUpdateStatusModal
 *   isOpen={true}
 *   hide={() => setModalOpen(false)}
 *   actionItemsRefetch={refetchActionItems}
 *   actionItem={selectedActionItem}
 * />
 * ```
 *
 */
import React, { type FC, type FormEvent, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import styles from 'style/app-fixed.module.css';
import { useMutation } from '@apollo/client';
import {
  UPDATE_ACTION_ITEM_MUTATION,
  MARK_ACTION_ITEM_AS_PENDING_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import type {
  IActionItemInfo,
  IUpdateActionItemInput,
  IMarkActionItemAsPendingInput,
} from 'types/Actions/interface';

export interface IItemUpdateStatusModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItemsRefetch: () => void;
  actionItem: IActionItemInfo;
}

const ItemUpdateStatusModal: FC<IItemUpdateStatusModalProps> = ({
  hide,
  isOpen,
  actionItemsRefetch,
  actionItem,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const { id, isCompleted } = actionItem;

  const [postCompletionNotes, setPostCompletionNotes] = useState<string>(
    actionItem.postCompletionNotes ?? '',
  );

  /**
   * Mutation to update an action item.
   */
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION, {
    refetchQueries: ['ActionItemsByOrganization', 'GetEventActionItems'],
  });

  /**
   * Mutation to mark an action item as pending.
   */
  const [markActionItemAsPending] = useMutation(
    MARK_ACTION_ITEM_AS_PENDING_MUTATION,
    {
      refetchQueries: ['ActionItemsByOrganization', 'GetEventActionItems'],
    },
  );

  /**
   * Handles the form submission for updating an action item.
   *
   * @param e - The form submission event.
   */
  const updateActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      if (isCompleted) {
        // Mark as pending
        const input: IMarkActionItemAsPendingInput = {
          id: id,
        };

        await markActionItemAsPending({
          variables: { input },
        });
      } else {
        // Mark as completed
        if (!postCompletionNotes.trim()) {
          toast.error(t('postCompletionNotesRequired'));
          return;
        }

        const input: IUpdateActionItemInput = {
          id: id,
          isCompleted: true,
          postCompletionNotes: postCompletionNotes.trim(),
        };

        await updateActionItem({
          variables: { input },
        });

        toast.success(t('isCompleted'));
      }

      actionItemsRefetch();
      hide();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    setPostCompletionNotes(actionItem.postCompletionNotes ?? '');
  }, [actionItem]);

  return (
    <Modal className={styles.itemModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('actionItemStatus')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.closeButton}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmitCapture={updateActionItemHandler} className="p-2">
          {!isCompleted ? (
            <FormControl fullWidth className="mb-2">
              <TextField
                label={t('postCompletionNotes')}
                variant="outlined"
                className={styles.noOutline}
                value={postCompletionNotes}
                onChange={(e) => setPostCompletionNotes(e.target.value)}
                multiline
                maxRows={4}
                required
              />
            </FormControl>
          ) : (
            <p>{t('updateStatusMsg')}</p>
          )}

          {isCompleted ? (
            <div className="d-flex gap-3 justify-content-end">
              <Button
                type="submit"
                className={styles.addButton}
                data-testid="yesBtn"
              >
                {tCommon('yes')}
              </Button>
              <Button
                className={`btn btn-danger ${styles.removeButton}`}
                onClick={hide}
              >
                {tCommon('no')}
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              className={`${styles.addButton}`}
              data-testid="createBtn"
            >
              {t('markCompletion')}
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemUpdateStatusModal;
