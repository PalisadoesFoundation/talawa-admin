/**
 * A modal component for updating the status of an action item.
 *
 * @remarks
 * This component allows users to update the completion status of an action item.
 * It provides a form to add post-completion notes when marking an item as completed.
 * The modal uses Apollo Client's `useMutation` hook to perform the update operation
 * and displays success or error messages using NotificationToast.
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
import React, { type FC, useEffect, useState } from 'react';
import Button from 'shared-components/Button/Button';
import { useTranslation } from 'react-i18next';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import styles from './ActionItemUpdateStatusModal.module.css';
import { useMutation } from '@apollo/client';
import {
  UPDATE_ACTION_ITEM_MUTATION,
  MARK_ACTION_ITEM_AS_PENDING_MUTATION,
  COMPLETE_ACTION_ITEM_FOR_INSTANCE,
  MARK_ACTION_ITEM_AS_PENDING_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type {
  IActionItemInfo,
  IUpdateActionItemInput,
  IMarkActionItemAsPendingInput,
} from 'types/shared-components/ActionItems/interface';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';

export interface IItemUpdateStatusModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItemsRefetch: () => void;
  actionItem: IActionItemInfo;
  isRecurring?: boolean;
  eventId?: string;
}

const ItemUpdateStatusModal: FC<IItemUpdateStatusModalProps> = ({
  hide,
  isOpen,
  actionItemsRefetch,
  actionItem,
  eventId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const { id, isCompleted } = actionItem;

  const [postCompletionNotes, setPostCompletionNotes] = useState<string>(
    actionItem.postCompletionNotes ?? '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [completeActionForInstance] = useMutation(
    COMPLETE_ACTION_ITEM_FOR_INSTANCE,
    {
      refetchQueries: ['GetEventActionItems'],
    },
  );

  const [markActionAsPendingForInstance] = useMutation(
    MARK_ACTION_ITEM_AS_PENDING_FOR_INSTANCE,
    {
      refetchQueries: ['GetEventActionItems'],
    },
  );

  /**
   * Handles the form submission for updating an action item.
   */
  const updateActionItemHandler = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
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
          NotificationToast.error({
            key: 'postCompletionNotesRequired',
            namespace: 'translation',
          });
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

        NotificationToast.success({
          key: 'isCompleted',
          namespace: 'translation',
        });
      }

      actionItemsRefetch();
      hide();
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeActionForInstanceHandler = async (): Promise<void> => {
    try {
      if (!postCompletionNotes.trim()) {
        NotificationToast.error({
          key: 'postCompletionNotesRequired',
          namespace: 'translation',
        });
        return;
      }

      setIsSubmitting(true);
      await completeActionForInstance({
        variables: {
          input: {
            actionId: id,
            eventId,
            postCompletionNotes: postCompletionNotes.trim(),
          },
        },
      });

      NotificationToast.success({
        key: 'isCompleted',
        namespace: 'translation',
      });
      actionItemsRefetch();
      hide();
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const markActionAsPendingForInstanceHandler = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      await markActionAsPendingForInstance({
        variables: {
          input: {
            actionId: id,
            eventId,
          },
        },
      });

      NotificationToast.success({
        key: 'isPending',
        namespace: 'translation',
      });
      actionItemsRefetch();
      hide();
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setPostCompletionNotes(actionItem.postCompletionNotes ?? '');
  }, [actionItem]);

  const renderFooter = () => {
    if (isCompleted) {
      if (actionItem.isTemplate) {
        return (
          <>
            <Button
              onClick={markActionAsPendingForInstanceHandler}
              className={styles.addButton}
              disabled={isSubmitting}
            >
              {t('pendingForInstance')}
            </Button>
            {!actionItem.isInstanceException && (
              <Button
                onClick={updateActionItemHandler}
                className={styles.addButton}
                disabled={isSubmitting}
              >
                {t('pendingForSeries')}
              </Button>
            )}
          </>
        );
      }
      return (
        <>
          <Button
            onClick={updateActionItemHandler}
            className={styles.addButton}
            data-testid="yesBtn"
            disabled={isSubmitting}
          >
            {tCommon('yes')}
          </Button>
          <Button
            className={`btn btn-danger ${styles.removeButton}`}
            onClick={hide}
            disabled={isSubmitting}
          >
            {tCommon('no')}
          </Button>
        </>
      );
    }

    if (actionItem.isTemplate) {
      return (
        <>
          <Button
            onClick={completeActionForInstanceHandler}
            className={styles.addButton}
            disabled={isSubmitting}
          >
            {t('completeForInstance')}
          </Button>
          {!actionItem.isInstanceException && (
            <Button
              onClick={updateActionItemHandler}
              className={styles.addButton}
              disabled={isSubmitting}
            >
              {t('completeForSeries')}
            </Button>
          )}
        </>
      );
    }

    return (
      <Button
        onClick={updateActionItemHandler}
        className={styles.addButton}
        data-testid="createBtn"
        data-cy="markCompletionForSeries"
        disabled={isSubmitting}
      >
        {t('markCompletion')}
      </Button>
    );
  };

  return (
    <CRUDModalTemplate
      open={isOpen}
      onClose={hide}
      title={t('actionItemStatus')}
      loading={isSubmitting}
      customFooter={renderFooter()}
      data-testid="updateStatusModal"
    >
      <div className="mb-2 d-flex align-items-center gap-2">
        <StatusBadge
          variant={isCompleted ? 'completed' : 'pending'}
          size="md"
          dataTestId="update-status-badge"
          ariaLabel={isCompleted ? tCommon('completed') : tCommon('pending')}
        />
      </div>
      {!isCompleted ? (
        <FormFieldGroup
          name="postCompletionNotes"
          label={t('postCompletionNotes')}
          required
        >
          <textarea
            id="postCompletionNotes"
            data-cy="postCompletionNotes"
            className="form-control"
            value={postCompletionNotes}
            onChange={(e) => setPostCompletionNotes(e.target.value)}
            rows={4}
            required
          />
        </FormFieldGroup>
      ) : (
        <p>{t('updateStatusMsg')}</p>
      )}
    </CRUDModalTemplate>
  );
};

export default ItemUpdateStatusModal;
