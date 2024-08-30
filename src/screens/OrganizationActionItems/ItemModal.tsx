import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent, FC } from 'react';
import styles from './OrganizationActionItems.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  InterfaceActionItemCategoryInfo,
  InterfaceActionItemCategoryList,
  InterfaceActionItemInfo,
  InterfaceMemberInfo,
  InterfaceMembersList,
} from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { Autocomplete, FormControl, TextField } from '@mui/material';

/**
 * Interface for the form state used in the `ItemModal` component.
 */
interface InterfaceFormStateType {
  dueDate: Date;
  actionItemCategoryId: string;
  assigneeId: string;
  eventId?: string;
  preCompletionNotes: string;
  postCompletionNotes: string | null;
  allotedHours: number | null;
  isCompleted: boolean;
}

/**
 * Props for the `ItemModal` component.
 */
export interface InterfaceItemModalProps {
  isOpen: boolean;
  hide: () => void;
  orgId: string;
  actionItemsRefetch: () => void;
  actionItem: InterfaceActionItemInfo | null;
  editMode: boolean;
}

/**
 * A modal component for creating action items.
 *
 * @param props - The properties passed to the component.
 * @returns The `ItemModal` component.
 */
const ItemModal: FC<InterfaceItemModalProps> = ({
  isOpen,
  hide,
  orgId,
  actionItem,
  editMode,
  actionItemsRefetch,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [actionItemCategory, setActionItemCategory] =
    useState<InterfaceActionItemCategoryInfo | null>(null);
  const [assignee, setAssignee] = useState<InterfaceMemberInfo | null>(null);

  const [formState, setFormState] = useState<InterfaceFormStateType>({
    dueDate: new Date(),
    actionItemCategoryId: '',
    assigneeId: '',
    preCompletionNotes: '',
    postCompletionNotes: null,
    allotedHours: null,
    isCompleted: false,
  });

  const {
    dueDate,
    actionItemCategoryId,
    assigneeId,
    preCompletionNotes,
    postCompletionNotes,
    allotedHours,
    isCompleted,
  } = formState;

  /**
   * Query to fetch action item categories for the organization.
   */
  const {
    data: actionItemCategoriesData,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: orgId,
      where: { is_disabled: false },
    },
  });

  /**
   * Query to fetch members of the organization.
   */
  const {
    data: membersData,
  }: {
    data: InterfaceMembersList | undefined;
  } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

  const actionItemCategories = useMemo(
    () => actionItemCategoriesData?.actionItemCategoriesByOrganization || [],
    [actionItemCategoriesData],
  );

  const members = useMemo(
    () => membersData?.organizations[0].members || [],
    [membersData],
  );

  /**
   * Mutation to create & update a new action item.
   */
  const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  /**
   * Handler function to create a new action item.
   *
   * @param e - The form submit event.
   * @returns A promise that resolves when the action item is created.
   */
  const createActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItem({
        variables: {
          assigneeId: assignee?._id,
          actionItemCategoryId: actionItemCategory?._id,
          preCompletionNotes: preCompletionNotes,
          allotedHours: allotedHours,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
        },
      });

      // Reset form and date after successful creation
      setFormState({
        dueDate: new Date(),
        assigneeId: '',
        actionItemCategoryId: '',
        preCompletionNotes: '',
        postCompletionNotes: null,
        allotedHours: null,
        isCompleted: false,
      });
      setActionItemCategory(null);
      setAssignee(null);

      actionItemsRefetch();
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * Handles the form submission for updating an action item.
   *
   * @param  e - The form submission event.
   */
  const updateActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedFields: {
        [key: string]: number | string | boolean | Date | undefined | null;
      } = {};

      if (actionItemCategoryId !== actionItem?.actionItemCategory?._id) {
        updatedFields.actionItemCategoryId = actionItemCategoryId;
      }
      if (assigneeId !== actionItem?.assignee._id) {
        updatedFields.assigneeId = assigneeId;
      }

      if (preCompletionNotes !== actionItem?.preCompletionNotes) {
        updatedFields.preCompletionNotes = preCompletionNotes;
      }

      if (postCompletionNotes !== actionItem?.postCompletionNotes) {
        updatedFields.postCompletionNotes = postCompletionNotes;
      }

      if (allotedHours !== actionItem?.allotedHours) {
        updatedFields.allotedHours = allotedHours;
      }

      if (dueDate !== actionItem?.dueDate) {
        updatedFields.dueDate = dayjs(dueDate).format('YYYY-MM-DD');
      }

      if (Object.keys(updatedFields).length === 0) {
        toast.warning(t('noneUpdated'));
        return;
      }

      await updateActionItem({
        variables: {
          actionItemId: actionItem?._id,
          assigneeId: assigneeId,
          ...updatedFields,
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
      setFormState({
        dueDate: actionItem.dueDate,
        actionItemCategoryId: actionItem.actionItemCategory?._id ?? '',
        assigneeId: actionItem.assignee._id,
        preCompletionNotes: actionItem.preCompletionNotes,
        postCompletionNotes: actionItem.postCompletionNotes,
        allotedHours: actionItem.allotedHours,
        isCompleted: actionItem.isCompleted,
      });
    } else {
      setFormState({
        dueDate: new Date(),
        actionItemCategoryId: '',
        assigneeId: '',
        preCompletionNotes: '',
        postCompletionNotes: null,
        allotedHours: null,
        isCompleted: false,
      });
      setActionItemCategory(null);
      setAssignee(null);
    }
  }, [actionItem]);

  useEffect(() => {
    if (editMode && actionItemCategories.length > 0) {
      const category = actionItemCategories.find(
        (category) => category._id === actionItemCategoryId,
      );
      setActionItemCategory(category ?? null);
    }
  }, [editMode, actionItemCategories, actionItemCategoryId]);

  useEffect(() => {
    if (editMode && members.length > 0) {
      const assignee = members.find((member) => member._id === assigneeId);
      setAssignee(assignee ?? null);
    }
  }, [editMode, members, assigneeId]);

  return (
    <Modal className={styles.itemModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={styles.titlemodal}>
          {editMode ? t('updateActionItem') : t('createActionItem')}
        </p>
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
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterSelectedOptions={true}
              getOptionLabel={(item: InterfaceActionItemCategoryInfo): string =>
                item.name
              }
              onChange={(_, newCategory): void => {
                setFormState({
                  ...formState,
                  actionItemCategoryId: newCategory?._id ?? '',
                });
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
            {isCompleted && (
              <>
                {/* Input text Component to add alloted Hours for action item  */}
                <FormControl>
                  <TextField
                    label={t('allotedHours')}
                    variant="outlined"
                    className={styles.noOutline}
                    value={allotedHours ?? ''}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setFormState({
                          ...formState,
                          allotedHours: null,
                        });
                      } else if (parseInt(e.target.value) > 0) {
                        setFormState({
                          ...formState,
                          allotedHours: parseInt(e.target.value),
                        });
                      }
                    }}
                  />
                </FormControl>
              </>
            )}
          </Form.Group>
          {!isCompleted && (
            <>
              <Form.Group className="mb-3 w-100">
                <Autocomplete
                  className={`${styles.noOutline} w-100`}
                  data-testid="memberSelect"
                  options={members}
                  value={assignee}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  filterSelectedOptions={true}
                  getOptionLabel={(member: InterfaceMemberInfo): string =>
                    `${member.firstName} ${member.lastName}`
                  }
                  onChange={(_, newAssignee): void => {
                    setFormState({
                      ...formState,
                      assigneeId: newAssignee?._id ?? '',
                    });
                    setAssignee(newAssignee);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('assignee')} required />
                  )}
                />
              </Form.Group>

              <Form.Group className="d-flex gap-3 mx-auto  mb-3">
                {/* Date Calendar Component to select due date of an action item */}
                <DatePicker
                  format="DD/MM/YYYY"
                  label={t('dueDate')}
                  className={styles.noOutline}
                  value={dayjs(dueDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setFormState({
                        ...formState,
                        dueDate: date.toDate(),
                      });
                    }
                  }}
                />

                {/* Input text Component to add alloted Hours for action item  */}
                <FormControl>
                  <TextField
                    label={t('allotedHours')}
                    variant="outlined"
                    className={styles.noOutline}
                    value={allotedHours ?? ''}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        /* istanbul ignore next */
                        setFormState({
                          ...formState,
                          allotedHours: null,
                        });
                      } else if (parseInt(e.target.value) > 0) {
                        setFormState({
                          ...formState,
                          allotedHours: parseInt(e.target.value),
                        });
                      }
                    }}
                  />
                </FormControl>
              </Form.Group>

              {/* Input text Component to add notes for action item */}
              <FormControl fullWidth className="mb-2">
                <TextField
                  label={t('preCompletionNotes')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={preCompletionNotes ?? ''}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      preCompletionNotes: e.target.value,
                    })
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
                value={postCompletionNotes}
                multiline
                maxRows={3}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    postCompletionNotes: e.target.value,
                  })
                }
              />
            </FormControl>
          )}

          <Button
            type="submit"
            className={styles.greenregbtn}
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
