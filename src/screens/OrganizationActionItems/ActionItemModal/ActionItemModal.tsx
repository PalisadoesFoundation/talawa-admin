/**
 * @file This file contains the ItemModal component, which is used for creating and updating action items.
 * It includes a form with fields for assignee, category, assignment date, and completion notes.
 * The modal handles both creation and editing of action items, including specific logic for recurring events.
 * It allows users to specify whether an action item should apply to an entire series of recurring events or just a single instance.
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
} from 'types/ActionItems/interface';

interface IUpdateActionForInstanceInput {
  actionId: string;
  eventId?: string;
  volunteerId?: string;
  volunteerGroupId?: string;
  categoryId?: string;
  assignedAt?: string;
  preCompletionNotes?: string;
}
import type {
  IFormStateType,
  IItemModalProps,
} from 'types/ActionItems/interface.ts';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  Autocomplete,
  FormControl,
  TextField,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  GET_EVENT_VOLUNTEERS,
  GET_EVENT_VOLUNTEER_GROUPS,
} from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceEventVolunteerInfo } from 'types/Volunteer/interface';

interface IEventVolunteerGroup {
  id: string;
  name: string;
  description: string | null;
  volunteersRequired: number | null;
  isTemplate: boolean;
  isInstanceException: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  leader: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  volunteers: Array<{
    id: string;
    hasAccepted: boolean;
    user: {
      id: string;
      name: string;
      avatarURL?: string | null;
    };
  }>;
  event: {
    id: string;
  };
}

const initializeFormState = (
  actionItem: IActionItemInfo | null,
): IFormStateType => ({
  assignedAt: actionItem?.assignedAt
    ? new Date(actionItem.assignedAt)
    : new Date(),
  categoryId: actionItem?.category?.id || '',
  volunteerId: actionItem?.volunteer?.id || '',
  volunteerGroupId: actionItem?.volunteerGroup?.id || '',
  eventId: actionItem?.event?.id || undefined,
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

  const [selectedVolunteer, setSelectedVolunteer] =
    useState<InterfaceEventVolunteerInfo | null>(null);
  const [selectedVolunteerGroup, setSelectedVolunteerGroup] =
    useState<IEventVolunteerGroup | null>(null);
  const [assignmentType, setAssignmentType] = useState<
    'volunteer' | 'volunteerGroup'
  >('volunteer');

  const [formState, setFormState] = useState<IFormStateType>(
    initializeFormState(actionItem),
  );

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('instance');

  const {
    assignedAt,
    categoryId,
    volunteerId,
    volunteerGroupId,
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

  const { data: volunteersData } = useQuery(GET_EVENT_VOLUNTEERS, {
    variables: {
      input: { id: eventId },
      where: {},
    },
    skip: !eventId,
  });

  const { data: volunteerGroupsData } = useQuery(GET_EVENT_VOLUNTEER_GROUPS, {
    variables: {
      input: { id: eventId },
    },
    skip: !eventId,
  });

  const volunteers = useMemo(() => {
    const allVolunteers = volunteersData?.event?.volunteers || [];

    // Apply filtering based on applyTo selection for both create and edit modes
    if (applyTo === 'series') {
      // For entire series, show only template volunteers
      return allVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) =>
          volunteer.isTemplate === true,
      );
    } else {
      // For this event only, show all volunteers (template and non-template)
      return allVolunteers;
    }
  }, [volunteersData, applyTo]);

  const volunteerGroups = useMemo(() => {
    const allVolunteerGroups =
      volunteerGroupsData?.event?.volunteerGroups || [];

    // Apply filtering based on applyTo selection for both create and edit modes
    if (applyTo === 'series') {
      // For entire series, show only template volunteer groups
      return allVolunteerGroups.filter(
        (group: IEventVolunteerGroup) => group.isTemplate === true,
      );
    } else {
      // For this event only, show all volunteer groups (template and non-template)
      return allVolunteerGroups;
    }
  }, [volunteerGroupsData, applyTo]);

  // Determine if assignment type chips should be disabled
  const isVolunteerChipDisabled = useMemo(() => {
    return editMode && actionItem?.volunteerGroup?.id;
  }, [editMode, actionItem]);

  const isVolunteerGroupChipDisabled = useMemo(() => {
    return editMode && actionItem?.volunteer?.id;
  }, [editMode, actionItem]);

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

  const [updateActionForInstance] = useMutation(
    UPDATE_ACTION_ITEM_FOR_INSTANCE,
    {
      refetchQueries: ['GetEventActionItems'],
    },
  );

  const handleFormChange = (
    field: keyof IFormStateType,
    value: string | boolean | Date | undefined | null,
  ): void => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const createActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!categoryId || (!volunteerId && !volunteerGroupId)) {
        toast.error(t('selectCategoryAndAssignment'));
        return;
      }

      const input: ICreateActionItemInput = {
        volunteerId: volunteerId || undefined,
        volunteerGroupId: volunteerGroupId || undefined,
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
      setSelectedVolunteer(null);
      setSelectedVolunteerGroup(null);

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
        volunteerId: volunteerId || undefined,
        volunteerGroupId: volunteerGroupId || undefined,
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

      const input: IUpdateActionForInstanceInput = {
        actionId: actionItem.id,
        eventId: eventId,
      };

      // Include all fields that might have changed
      if (volunteerId) input.volunteerId = volunteerId;
      if (volunteerGroupId) input.volunteerGroupId = volunteerGroupId;
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
  }, [actionItem, actionItemCategories]);

  // Separate useEffect for applyTo initialization
  useEffect(() => {
    if (actionItem?.isInstanceException) {
      setApplyTo('instance');
    } else if (actionItem) {
      setApplyTo('series');
    }
  }, [actionItem]);

  // Separate useEffect for volunteer/volunteer group initialization (only when modal opens)
  useEffect(() => {
    if (!isOpen) return; // Only run when modal is open

    // Initialize volunteer/volunteer group selections
    if (actionItem?.volunteer?.id) {
      const allVolunteers = volunteersData?.event?.volunteers || [];
      const foundVolunteer: InterfaceEventVolunteerInfo | undefined =
        allVolunteers.find(
          (volunteer: InterfaceEventVolunteerInfo) =>
            volunteer.id === actionItem.volunteer?.id,
        );
      setSelectedVolunteer(foundVolunteer || null);
      setAssignmentType('volunteer');
    } else if (actionItem?.volunteerGroup?.id) {
      const allVolunteerGroups =
        volunteerGroupsData?.event?.volunteerGroups || [];
      const foundGroup: IEventVolunteerGroup | undefined =
        allVolunteerGroups.find(
          (group: IEventVolunteerGroup) =>
            group.id === actionItem.volunteerGroup?.id,
        );
      setSelectedVolunteerGroup(foundGroup || null);
      setAssignmentType('volunteerGroup');
    } else if (!actionItem) {
      // For new action items, reset selections
      setSelectedVolunteer(null);
      setSelectedVolunteerGroup(null);
      setAssignmentType('volunteer');
    }
  }, [actionItem, volunteersData, volunteerGroupsData, isOpen]);

  // Clear volunteer/volunteer group selections when applyTo changes
  useEffect(() => {
    // Check if current selections are still valid with the new filter (for both create and edit modes)
    if (
      selectedVolunteer &&
      applyTo === 'series' &&
      !selectedVolunteer.isTemplate
    ) {
      setSelectedVolunteer(null);
      handleFormChange('volunteerId', '');
    }
    if (
      selectedVolunteerGroup &&
      applyTo === 'series' &&
      !selectedVolunteerGroup.isTemplate
    ) {
      setSelectedVolunteerGroup(null);
      handleFormChange('volunteerGroupId', '');
    }
  }, [applyTo, selectedVolunteer, selectedVolunteerGroup]);

  // Reset applyTo to default when modal opens for creating a new action item
  useEffect(() => {
    if (isOpen && !editMode && !actionItem) {
      setApplyTo('instance'); // Default to 'instance' for new action items
    }
  }, [isOpen, editMode, actionItem]);

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
              data-cy="categorySelect"
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
              {/* Assignment Type Selection */}
              <Box className="mb-3">
                <Typography variant="subtitle2" className="mb-2">
                  {t('assignTo')}
                </Typography>
                <Box className="d-flex gap-2">
                  <Chip
                    label={t('volunteer')}
                    variant={
                      assignmentType === 'volunteer' ? 'filled' : 'outlined'
                    }
                    color={
                      assignmentType === 'volunteer' ? 'primary' : 'default'
                    }
                    onClick={() => {
                      if (!isVolunteerChipDisabled) {
                        setAssignmentType('volunteer');
                        // Clear volunteer group assignment when switching to volunteer
                        handleFormChange('volunteerGroupId', '');
                        setSelectedVolunteerGroup(null);
                      }
                    }}
                    clickable={!isVolunteerChipDisabled}
                    sx={{
                      opacity: isVolunteerChipDisabled ? 0.6 : 1,
                      cursor: isVolunteerChipDisabled
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                  />
                  <Chip
                    label={t('volunteerGroup')}
                    variant={
                      assignmentType === 'volunteerGroup'
                        ? 'filled'
                        : 'outlined'
                    }
                    color={
                      assignmentType === 'volunteerGroup'
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() => {
                      if (!isVolunteerGroupChipDisabled) {
                        setAssignmentType('volunteerGroup');
                        // Clear volunteer assignment when switching to volunteer group
                        handleFormChange('volunteerId', '');
                        setSelectedVolunteer(null);
                      }
                    }}
                    clickable={!isVolunteerGroupChipDisabled}
                    sx={{
                      opacity: isVolunteerGroupChipDisabled ? 0.6 : 1,
                      cursor: isVolunteerGroupChipDisabled
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                  />
                </Box>
              </Box>

              {/* Volunteer Selection */}
              {assignmentType === 'volunteer' && (
                <Form.Group className="mb-3 w-100">
                  <Autocomplete
                    className={`${styles.noOutline} w-100`}
                    data-testid="volunteerSelect"
                    data-cy="volunteerSelect"
                    options={volunteers}
                    value={selectedVolunteer}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    filterSelectedOptions={true}
                    getOptionLabel={(
                      volunteer: InterfaceEventVolunteerInfo,
                    ): string => {
                      return volunteer.user?.name || 'Unknown Volunteer';
                    }}
                    onChange={(_, newVolunteer): void => {
                      const volunteerId = newVolunteer?.id;
                      handleFormChange('volunteerId', volunteerId ?? '');
                      handleFormChange('volunteerGroupId', '');
                      setSelectedVolunteer(newVolunteer);
                      setSelectedVolunteerGroup(null);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={t('volunteer')} required />
                    )}
                  />
                </Form.Group>
              )}

              {/* Volunteer Group Selection */}
              {assignmentType === 'volunteerGroup' && (
                <Form.Group className="mb-3 w-100">
                  <Autocomplete
                    className={`${styles.noOutline} w-100`}
                    data-testid="volunteerGroupSelect"
                    data-cy="volunteerGroupSelect"
                    options={volunteerGroups}
                    value={selectedVolunteerGroup}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    filterSelectedOptions={true}
                    getOptionLabel={(group: IEventVolunteerGroup): string => {
                      return group.name || 'Unknown Group';
                    }}
                    onChange={(_, newGroup): void => {
                      const groupId = newGroup?.id;
                      handleFormChange('volunteerGroupId', groupId ?? '');
                      handleFormChange('volunteerId', '');
                      setSelectedVolunteerGroup(newGroup);
                      setSelectedVolunteer(null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('volunteerGroup')}
                        required
                      />
                    )}
                  />
                </Form.Group>
              )}

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
                  data-cy="preCompletionNotes"
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
            data-cy="submitBtn"
          >
            {editMode ? t('updateActionItem') : t('createActionItem')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
