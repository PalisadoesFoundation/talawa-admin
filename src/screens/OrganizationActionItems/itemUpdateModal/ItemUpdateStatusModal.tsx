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
// import { DatePicker } from '@mui/x-date-pickers';
// import dayjs from 'dayjs';
import styles from '../../../style/app-fixed.module.css';
import { useMutation, useQuery } from '@apollo/client';
import {
  UPDATE_ACTION_ITEM_MUTATION,
  MARK_ACTION_ITEM_AS_PENDING,
} from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import type { InterfaceActionItem } from 'utils/interfaces';
import {
  GET_USERS_BY_IDS,
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';
import Avatar from 'components/Avatar/Avatar';

export interface InterfaceItemUpdateStatusModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItemsRefetch: () => void;
  actionItem: InterfaceActionItem;
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

  // Destructure the action item fields as defined in InterfaceActionItem
  const {
    id,
    isCompleted,
    assignedAt,
    eventId,
    categoryId,
    assigneeId,
    creatorId,
    postCompletionNotes,
  } = actionItem;

  const [localPostCompletionNotes, setLocalPostCompletionNotes] =
    useState<string>(postCompletionNotes ?? '');

  const [newAssigneeId, setNewAssigneeId] = useState<string | null>(assigneeId);

  const [markActionItemAsPending] = useMutation(MARK_ACTION_ITEM_AS_PENDING);

  const userIds = Array.from(
    new Set([assigneeId, creatorId].filter(Boolean)),
  ) as string[];

  const { data: usersData } = useQuery(GET_USERS_BY_IDS, {
    variables: { input: { ids: userIds } },
    skip: userIds.length === 0,
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES_BY_IDS, {
    variables: { ids: categoryId ? [categoryId] : [] },
    skip: !categoryId,
  });

  const getUserName = (userId: string | null, defaultName: string): string => {
    if (!userId) return defaultName;
    const user = usersData?.usersByIds?.find(
      (u: { id: string; name: string }) => u.id === userId,
    );
    return user ? user.name : defaultName;
  };

  const getAssigneeDisplay = (): string =>
    getUserName(assigneeId, 'Unassigned');

  const getCategoryDisplay = (): string => {
    if (!categoryId) return 'No Category';
    const category = categoriesData?.categoriesByIds?.find(
      (cat: { id: string; name: string }) => cat.id === categoryId,
    );
    return category ? category.name : 'No Category';
  };

  // Mutation to update the action item using the provided mutation
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  useEffect(() => {
    setLocalPostCompletionNotes(postCompletionNotes ?? '');
    setNewAssigneeId(assigneeId);
  }, [actionItem, postCompletionNotes, assignedAt, assigneeId, eventId]);

  const handleMarkAsPending = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    if (!actionItem?.id) {
      toast.error('Action item ID is missing.');
      return;
    }

    try {
      await markActionItemAsPending({
        variables: { id: actionItem.id }, // ✅ Pass `id` correctly
      });

      actionItemsRefetch();
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const updateActionItemHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await updateActionItem({
        variables: {
          input: {
            id, // The id remains the same
            assigneeId: newAssigneeId,
            postCompletionNotes: isCompleted ? '' : localPostCompletionNotes,
            isCompleted: !isCompleted,
            // Remove assignedAt and eventId because they're not in the input type
            // If you need them, update your GraphQL schema accordingly.
          },
        },
      });
      actionItemsRefetch();
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  // Update local state when actionItem changes
  useEffect(() => {
    setLocalPostCompletionNotes(postCompletionNotes ?? '');
    setNewAssigneeId(assigneeId);
  }, [actionItem, postCompletionNotes, assignedAt, assigneeId, eventId]);

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
        {/* Summary Section: Display enriched details (Category, Assignee) */}
        <Form className="p-3">
          <Form.Group className="d-flex gap-3 mb-3">
            <FormControl fullWidth>
              <TextField
                label={t('category')}
                variant="outlined"
                className={styles.noOutline}
                value={getCategoryDisplay()}
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label={t('assignee')}
                variant="outlined"
                className={styles.noOutline}
                value={getAssigneeDisplay()}
                disabled
                InputProps={{
                  startAdornment: (
                    <Avatar
                      key={assigneeId || 'default'}
                      containerStyle={styles.imageContainer}
                      avatarStyle={styles.TableImage}
                      name={getAssigneeDisplay()}
                      alt="assignee avatar"
                    />
                  ),
                }}
              />
            </FormControl>
          </Form.Group>

          <Form
            onSubmitCapture={updateActionItemHandler}
            className="p-2"
            data-testid="update-form"
          >
            {!isCompleted ? (
              <FormControl fullWidth className="mb-2">
                <TextField
                  label={t('postCompletionNotes')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={localPostCompletionNotes}
                  onChange={(e) => setLocalPostCompletionNotes(e.target.value)}
                />
              </FormControl>
            ) : (
              <p>{t('updateStatusMsg')}</p>
            )}
            {isCompleted ? (
              <>
                <Button
                  type="button"
                  className={styles.addButton}
                  data-testid="yesBtn"
                  onClick={handleMarkAsPending}
                >
                  {tCommon('yes')}
                </Button>
                <Button
                  className={`btn btn-danger ${styles.removeButton}`}
                  onClick={hide}
                >
                  {tCommon('no')}
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                className={styles.addButton}
                data-testid="createBtn"
              >
                {t('markCompletion')}
              </Button>
            )}
          </Form>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemUpdateStatusModal;
