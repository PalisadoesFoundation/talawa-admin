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
  UPDATE_ACTION_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

interface IFormStateType {
  assignedAt: Date;
  categoryId: string;
  assigneeId: string;
  eventId?: string;
  preCompletionNotes: string;
  postCompletionNotes: string | null;
  isCompleted: boolean;
}

export interface IItemModalProps {
  isOpen: boolean;
  hide: () => void;
  orgId: string;
  eventId: string | undefined;
  actionItemsRefetch: () => void;
  orgActionItemsRefetch?: () => void;
  actionItem: IActionItemInfo | null;
  editMode: boolean;
  isRecurring?: boolean;
  baseEvent?: { id: string } | null;
}

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
  isRecurring,
  baseEvent,
  orgActionItemsRefetch,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [actionItemCategory, setActionItemCategory] =
    useState<IActionItemCategoryInfo | null>(null);

  const [assigneeUser, setAssigneeUser] = useState<InterfaceUser | null>(null);

  const [formState, setFormState] = useState<IFormStateType>(
    initializeFormState(actionItem),
  );

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');

  const {
    assignedAt,
    categoryId,
    assigneeId,
    preCompletionNotes,
    postCompletionNotes,
    isCompleted,
  } = formState;

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

  const { data: membersData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  const members = useMemo(
    () => membersData?.usersByOrganizationId || [],
    [membersData],
  );

  const actionItemCategories = useMemo(
    () => actionItemCategoriesData?.actionCategoriesByOrganization || [],
    [actionItemCategoriesData],
  );

  const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION, {
    refetchQueries: ['ActionItemsByOrganization', 'GetEventActionItems'],
  });
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION, {
    refetchQueries: ['ActionItemsByOrganization', 'GetEventActionItems'],
  });

  const [updateActionForInstance] = useMutation(UPDATE_ACTION_FOR_INSTANCE, {
    refetchQueries: ['GetEventActionItems'],
  });

  const handleFormChange = (
    field: keyof IFormStateType,
    value: string | boolean | Date | undefined | null,
  ): void => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

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
        isTemplate: applyTo === 'series',
        ...(eventId &&
          (isRecurring
            ? applyTo === 'series'
              ? { eventId: baseEvent?.id }
              : { recurringEventInstanceId: eventId }
            : { eventId })),
      };

      await createActionItem({
        variables: { input },
      });

      setFormState(initializeFormState(null));
      setActionItemCategory(null);
      setAssigneeUser(null);

      actionItemsRefetch();
      if (orgActionItemsRefetch) {
        orgActionItemsRefetch();
      }
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

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
      if (orgActionItemsRefetch) {
        orgActionItemsRefetch();
      }
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const updateActionForInstanceHandler = async (
    e: FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (!actionItem?.id) {
        toast.error('Action item ID is missing');
        return;
      }

      const input: any = {
        actionId: actionItem.id,
        eventId: eventId,
      };

      // Include all fields that might have changed
      if (assigneeId) input.assigneeId = assigneeId;
      if (categoryId) input.categoryId = categoryId;
      if (assignedAt) input.assignedAt = dayjs(assignedAt).toISOString();
      if (preCompletionNotes !== undefined)
        input.preCompletionNotes = preCompletionNotes;

      await updateActionForInstance({
        variables: { input },
      });

      setFormState(initializeFormState(null));
      actionItemsRefetch();
      if (orgActionItemsRefetch) {
        orgActionItemsRefetch();
      }
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    setFormState(initializeFormState(actionItem));

    // If this action item is showing instance exception data, default to 'instance' since 'series' option is hidden
    if (actionItem?.isInstanceException) {
      setApplyTo('instance');
    } else {
      setApplyTo('series');
    }

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
            editMode
              ? actionItem?.isTemplate
                ? applyTo === 'series'
                  ? updateActionItemHandler
                  : updateActionForInstanceHandler
                : updateActionItemHandler
              : createActionItemHandler
          }
          className="p-2"
        >
          {isRecurring && !editMode ? (
            <Form.Group className="mb-3">
              <Form.Label>{t('applyTo')}</Form.Label>
              <Form.Check
                type="radio"
                label={t('entireSeries')}
                name="applyTo"
                id="applyToSeries"
                checked={applyTo === 'series'}
                onChange={() => setApplyTo('series')}
              />
              <Form.Check
                type="radio"
                label={t('thisEventOnly')}
                name="applyTo"
                id="applyToInstance"
                checked={applyTo === 'instance'}
                onChange={() => setApplyTo('instance')}
              />
            </Form.Group>
          ) : null}
          {editMode &&
            actionItem?.isTemplate &&
            !actionItem.isInstanceException && (
              <Form.Group className="mb-3">
                <Form.Label>{t('applyTo')}</Form.Label>
                <Form.Check
                  type="radio"
                  label={t('entireSeries')}
                  name="applyTo"
                  id="applyToSeries"
                  checked={applyTo === 'series'}
                  onChange={() => setApplyTo('series')}
                />
                <Form.Check
                  type="radio"
                  label={t('thisEventOnly')}
                  name="applyTo"
                  id="applyToInstance"
                  checked={applyTo === 'instance'}
                  onChange={() => setApplyTo('instance')}
                />
              </Form.Group>
            )}
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
