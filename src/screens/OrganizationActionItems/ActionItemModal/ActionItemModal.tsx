/**
 * A modal component for creating and editing action items.
 *
 * This component provides a form interface for:
 * - Creating new action items with category, assignee, date, and notes
 * - Editing existing action items with validation
 * - Handling both pre-completion and post-completion notes
 * - Integration with GraphQL mutations for data persistence
 *
 * The modal adapts its interface based on whether it's in create or edit mode,
 * and whether the action item is completed or not.
 *
 * @param props - Component props containing modal state and configuration
 * @returns JSX element representing the modal dialog
 *
 * @example
 * ```tsx
 * <ItemModal
 *   isOpen={showModal}
 *   hide={() => setShowModal(false)}
 *   orgId="org123"
 *   eventId="event456"
 *   actionItem={selectedItem}
 *   editMode={true}
 *   actionItemsRefetch={refetchData}
 * />
 * ```
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { FormEvent, FC } from 'react';
import styles from 'style/app-fixed.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  IActionItemCategoryInfo,
  IActionItemInfo,
  ICreateActionItemInput,
  IUpdateActionItemInput,
} from 'types/Actions/interface';
import type { InterfaceUser } from 'types/User/interface';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

/**
 * Interface for the form state used in the `ItemModal` component.
 * Contains all form fields required for creating or updating an action item.
 */
interface IFormStateType {
  /** Date when the action item was assigned */
  assignedAt: Date;
  /** ID of the category this action item belongs to */
  categoryId: string;
  /** ID of the user assigned to this action item */
  assigneeId: string;
  /** Optional ID of the event this action item is associated with */
  eventId?: string;
  /** Notes added before completion of the action item */
  preCompletionNotes: string;
  /** Notes added after completion of the action item */
  postCompletionNotes: string | null;
  /** Whether the action item has been completed */
  isCompleted: boolean;
}

/**
 * Props for the `ItemModal` component.
 */
export interface IItemModalProps {
  /** Whether the modal is currently open/visible */
  isOpen: boolean;
  /** Function to hide/close the modal */
  hide: () => void;
  /** Organization ID for which the action item belongs */
  orgId: string;
  /** Optional event ID if the action item is associated with an event */
  eventId: string | undefined;
  /** Function to refetch action items data after mutation */
  actionItemsRefetch: () => void;
  /** Existing action item data (null for create mode) */
  actionItem: IActionItemInfo | null;
  /** Whether the modal is in edit mode (true) or create mode (false) */
  editMode: boolean;
}

/**
 * Initializes the form state for the `ItemModal` component.
 *
 * @param actionItem - The existing action item data or null for new items
 * @returns Initial form state with default or existing values
 */
const initializeFormState = (
  actionItem: IActionItemInfo | null,
): IFormStateType => ({
  assignedAt: actionItem?.assignedAt
    ? new Date(actionItem.assignedAt)
    : new Date(),
  categoryId: actionItem?.category?.id || '',
  assigneeId: actionItem?.assignee?.id || '',
  eventId: actionItem?.event?._id || undefined,
  preCompletionNotes: actionItem?.preCompletionNotes || '',
  postCompletionNotes: actionItem?.postCompletionNotes || null,
  isCompleted: actionItem?.isCompleted || false,
});

const ItemModal: FC<IItemModalProps> = ({
  isOpen,
  hide,
  orgId,
  eventId,
  actionItem,
  editMode,
  actionItemsRefetch,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  /** Currently selected action item category for the autocomplete */
  const [actionItemCategory, setActionItemCategory] =
    useState<IActionItemCategoryInfo | null>(null);

  /** Currently selected assignee user for the autocomplete */
  const [assigneeUser, setAssigneeUser] = useState<InterfaceUser | null>(null);

  /** Form state containing all input values */
  const [formState, setFormState] = useState<IFormStateType>(
    initializeFormState(actionItem),
  );

  const {
    assignedAt,
    categoryId,
    assigneeId,
    preCompletionNotes,
    postCompletionNotes,
    isCompleted,
  } = formState;

  /**
   * Query to fetch action item categories for the organization.
   * Used to populate the category dropdown.
   */
  const { data: actionItemCategoriesData } = useQuery(
    ACTION_ITEM_CATEGORY_LIST,
    {
      variables: {
        input: {
          organizationId: orgId,
        },
      },
    },
  );

  /**
   * Query to fetch members of the organization.
   * Used to populate the assignee dropdown.
   */
  const { data: membersData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  /** Memoized list of organization members */
  const members = useMemo(
    () => membersData?.usersByOrganizationId || [],
    [membersData],
  );

  /** Memoized list of action item categories */
  const actionItemCategories = useMemo(
    () => actionItemCategoriesData?.actionCategoriesByOrganization || [],
    [actionItemCategoriesData],
  );

  /**
   * GraphQL mutations for creating and updating action items
   */
  const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  /**
   * Handler function to update the form state.
   *
   * @param field - The form field to update
   * @param value - The new value for the field
   */
  const handleFormChange = (
    field: keyof IFormStateType,
    value: string | boolean | Date | undefined | null,
  ): void => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  /**
   * Handler function to create a new action item.
   * Validates required fields and calls the GraphQL mutation.
   *
   * @param e - Form submission event
   */
  const createActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!categoryId || !assigneeId) {
        toast.error('Please select both category and assignee');
        return;
      }

      const input: ICreateActionItemInput = {
        assigneeId: assigneeId,
        categoryId: categoryId,
        organizationId: orgId,
        preCompletionNotes: preCompletionNotes || undefined,
        assignedAt: dayjs(assignedAt).toISOString(),
        ...(eventId && { eventId }),
      };

      await createActionItem({
        variables: { input },
      });

      // Reset form after successful creation
      setFormState(initializeFormState(null));
      setActionItemCategory(null);
      setAssigneeUser(null);

      actionItemsRefetch();
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * Handles the form submission for updating an action item.
   * Only sends changed fields to optimize the mutation payload.
   *
   * @param e - Form submission event
   */
  const updateActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!actionItem?.id) {
        toast.error('Action item ID is missing');
        return;
      }

      const input: IUpdateActionItemInput = {
        id: actionItem.id,
        isCompleted: isCompleted,
        categoryId: categoryId,
        assigneeId: assigneeId,
        preCompletionNotes: preCompletionNotes,
        postCompletionNotes: postCompletionNotes || undefined,
      };

      await updateActionItem({
        variables: { input },
      });

      setFormState(initializeFormState(null));
      actionItemsRefetch();
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * Effect to initialize form state and selections when actionItem or related data changes.
   * Sets up the category and assignee selections based on the current action item.
   */
  useEffect(() => {
    setFormState(initializeFormState(actionItem));

    // Set category based on nested object
    if (actionItem?.category?.id) {
      const foundCategory: IActionItemCategoryInfo | undefined =
        actionItemCategories.find(
          (category: IActionItemCategoryInfo) =>
            category.id === actionItem.category?.id,
        );
      setActionItemCategory(foundCategory || null);
    } else {
      setActionItemCategory(null);
    }

    // Set assignee user based on nested object
    if (actionItem?.assignee?.id) {
      const foundUser: InterfaceUser | undefined = members.find(
        (member: InterfaceUser): boolean =>
          member.id === actionItem.assignee?.id,
      );
      setAssigneeUser(foundUser || null);
    } else {
      setAssigneeUser(null);
    }
  }, [actionItem, actionItemCategories, members]);

  return (
    <Modal className={styles.itemModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={styles.titlemodal}>
          {editMode ? t('updateActionItem') : t('createActionItem')}
        </p>
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
        <Form
          onSubmitCapture={
            editMode ? updateActionItemHandler : createActionItemHandler
          }
          className="p-2"
        >
          <Form.Group className="d-flex gap-3 mb-3">
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              data-testid="categorySelect"
              options={actionItemCategories}
              value={actionItemCategory}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions={true}
              getOptionLabel={(item: IActionItemCategoryInfo): string =>
                item.name
              }
              onChange={(_, newCategory): void => {
                handleFormChange('categoryId', newCategory?.id ?? '');
                setActionItemCategory(newCategory);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('actionItemCategory')}
                  required
                />
              )}
            />
          </Form.Group>

          {!isCompleted && (
            <>
              <Form.Group className="mb-3 w-100">
                <Autocomplete
                  className={`${styles.noOutline} w-100`}
                  data-testid="memberSelect"
                  options={members}
                  value={assigneeUser}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterSelectedOptions={true}
                  getOptionLabel={(member: InterfaceUser): string => {
                    return member.name || 'Unknown User';
                  }}
                  onChange={(_, newAssignee): void => {
                    const userId = newAssignee?.id;
                    handleFormChange('assigneeId', userId ?? '');
                    setAssigneeUser(newAssignee);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('assignee')} required />
                  )}
                />
              </Form.Group>

              <Form.Group className="d-flex gap-3 mx-auto mb-3">
                {/* Date Calendar Component to select assigned date of an action item */}
                <DatePicker
                  format="DD/MM/YYYY"
                  label={t('assignmentDate')}
                  className={styles.noOutline}
                  value={dayjs(assignedAt)}
                  disabled={editMode}
                  onChange={(date: Dayjs | null): void => {
                    if (date && !editMode) {
                      handleFormChange('assignedAt', date.toDate());
                    }
                  }}
                />
              </Form.Group>

              {/* Input text Component to add notes for action item */}
              <FormControl fullWidth className="mb-2">
                <TextField
                  label={t('preCompletionNotes')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={preCompletionNotes}
                  onChange={(e) =>
                    handleFormChange('preCompletionNotes', e.target.value)
                  }
                />
              </FormControl>
            </>
          )}

          {isCompleted && (
            <FormControl fullWidth className="mb-2">
              <TextField
                label={t('postCompletionNotes')}
                className={styles.noOutline}
                value={postCompletionNotes || ''}
                multiline
                maxRows={3}
                onChange={(e) =>
                  handleFormChange('postCompletionNotes', e.target.value)
                }
              />
            </FormControl>
          )}

          <Button
            type="submit"
            className={styles.addButton}
            data-testid="submitBtn"
          >
            {editMode ? t('updateActionItem') : t('createActionItem')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
