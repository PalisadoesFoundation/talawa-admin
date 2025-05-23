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
 * @param props.isOpen - A boolean indicating whether the modal is open.
 * @param props.hide - A function to close the modal.
 * @param props.actionItemsRefetch - A function to refetch the list of action items.
 * @param props.actionItem - The action item object containing details to be updated.
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
 * @component
 * @category OrganizationActionItems
 * @requires `react-bootstrap`, `@mui/material`, `@apollo/client`, `react-toastify`
 * @requires `style/app-fixed.module.css`
 * @requires `GraphQl/Mutations/ActionItemMutations`
 */
import React, { type FC, type FormEvent, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import styles from 'style/app-fixed.module.css';
import { useMutation } from '@apollo/client';
import { UPDATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import type { InterfaceActionItemInfo } from 'utils/interfaces';

export interface InterfaceItemUpdateStatusModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItemsRefetch: () => void;
  actionItem: InterfaceActionItemInfo;
}

const ItemUpdateStatusModal: FC<InterfaceItemUpdateStatusModalProps> = ({
  hide,
  isOpen,
  actionItemsRefetch,
  actionItem,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const {
    _id,
    isCompleted,
    assignee,
    assigneeGroup,
    assigneeUser,
    assigneeType,
  } = actionItem;

  const [postCompletionNotes, setPostCompletionNotes] = useState<string>(
    actionItem.postCompletionNotes ?? '',
  );

  /**
   * Mutation to update an action item.
   */
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  /**
   * Handles the form submission for updating an action item.
   *
   * @param  e - The form submission event.
   */
  const updateActionItemHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await updateActionItem({
        variables: {
          actionItemId: _id,
          assigneeId:
            assigneeType === 'EventVolunteer'
              ? assignee?._id
              : assigneeType === 'EventVolunteerGroup'
                ? assigneeGroup?._id
                : assigneeUser?._id,
          assigneeType,
          postCompletionNotes: isCompleted ? '' : postCompletionNotes,
          isCompleted: !isCompleted,
        },
      });

      actionItemsRefetch();
      hide();
      toast.success(t('successfulUpdation'));
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
