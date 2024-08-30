import React, { type FC, type FormEvent, useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import styles from './OrganizationActionItems.module.css';
import { useMutation } from '@apollo/client';
import { UPDATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import type { InterfaceActionItemInfo } from 'utils/interfaces';

export interface InterfaceItemUpdateStatusModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItemsRefetch: () => void;
  actionItem: InterfaceActionItemInfo | null;
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

  const [isCompleted, setIsCompleted] = useState<boolean>(
    actionItem?.isCompleted ?? false,
  );
  const [postCompletionNotes, setPostCompletionNotes] = useState<string>(
    actionItem?.postCompletionNotes ?? '',
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
          actionItemId: actionItem?._id,
          assigneeId: actionItem?.assignee?._id,
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
    if (actionItem) {
      setIsCompleted(actionItem?.isCompleted);
      setPostCompletionNotes(actionItem?.postCompletionNotes ?? '');
    }
  }, [actionItem]);

  return (
    <Modal className={styles.itemModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('actionItemStatus')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
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
              <Button type="submit" variant="primary" data-testid="yesBtn">
                {tCommon('yes')}
              </Button>
              <Button variant="secondary" onClick={hide}>
                {tCommon('no')}
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              className={styles.greenregbtn}
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
