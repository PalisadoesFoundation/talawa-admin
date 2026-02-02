/**
 * This file contains the ItemModal component, which is used for creating and updating action items.
 * It includes a form with fields for assignee, category, assignment date, and completion notes.
 * The modal handles both creation and editing of action items, including specific logic for recurring events.
 * It allows users to specify whether an action item should apply to an entire series of recurring events or just a single instance.
 * The component uses Apollo Client for GraphQL mutations and queries, and provides user feedback through notifications.
 *
 * @param props - Component props from IItemModalProps
 *
 * @returns A React component that renders a modal for creating or updating action items.
 *
 * @example
 * ```tsx
 * <ItemModal
 *   isOpen={true}
 *   hide={() => setModalOpen(false)}
 *   orgId="org123"
 *   eventId="event456"
 *   actionItem={selectedActionItem}
 *   editMode={true}
 *   actionItemsRefetch={refetchActionItems}
 *   isRecurring={true}
 *   baseEvent={baseEvent}
 * />
 * ```
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import styles from './ActionItemModal.module.css';
import DatePicker from 'shared-components/DatePicker/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import ApplyToSelector from 'components/AdminPortal/ApplyToSelector/ApplyToSelector';
import type { ApplyToType } from 'types/AdminPortal/ApplyToSelector/interface';
import AssignmentTypeSelector from 'components/AdminPortal/AssignmentTypeSelector/AssignmentTypeSelector';
import type { AssignmentType } from 'types/AdminPortal/AssignmentTypeSelector/interface';

import type {
  IActionItemCategoryInfo,
  IActionItemInfo,
  ICreateActionItemInput,
  IUpdateActionItemInput,
  IUpdateActionForInstanceInput,
  IEventVolunteerGroup,
  IFormStateType,
  IItemModalProps,
} from 'types/shared-components/ActionItems/interface';

import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  GET_EVENT_VOLUNTEERS,
  GET_EVENT_VOLUNTEER_GROUPS,
} from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceEventVolunteerInfo } from 'types/Volunteer/interface';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import Autocomplete from '@mui/material/Autocomplete';

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

/**
 * Modal component for creating and editing action items.
 *
 * Supports assigning action items to volunteers or volunteer groups,
 * with options for applying to recurring event series or single instances.
 *
 * @param props - Component props from IItemModalProps
 * @returns Modal dialog for action item management
 */
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
  const [assignmentType, setAssignmentType] =
    useState<AssignmentType>('volunteer');

  const [formState, setFormState] = useState<IFormStateType>(
    initializeFormState(actionItem),
  );

  const [applyTo, setApplyTo] = useState<ApplyToType>('instance');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const isApplyToRelevant =
    Boolean(isRecurring) &&
    (!editMode ||
      (Boolean(actionItem?.isTemplate) && !actionItem?.isInstanceException));

  const volunteers = useMemo(() => {
    const allVolunteers = volunteersData?.event?.volunteers || [];

    if (!isApplyToRelevant) return allVolunteers;
    if (applyTo === 'series') {
      // For entire series, show only template volunteers
      return allVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) =>
          volunteer.isTemplate === true,
      );
    }
    return allVolunteers;
  }, [volunteersData, applyTo, isApplyToRelevant]);

  const volunteerGroups = useMemo(() => {
    const allVolunteerGroups =
      volunteerGroupsData?.event?.volunteerGroups || [];

    if (!isApplyToRelevant) return allVolunteerGroups;
    if (applyTo === 'series') {
      // For entire series, show only template volunteer groups
      return allVolunteerGroups.filter(
        (group: IEventVolunteerGroup) => group.isTemplate === true,
      );
    }
    return allVolunteerGroups;
  }, [volunteerGroupsData, applyTo, isApplyToRelevant]);

  // Determine if assignment type chips should be disabled
  const isVolunteerChipDisabled =
    editMode && Boolean(actionItem?.volunteerGroup?.id);

  const isVolunteerGroupChipDisabled =
    editMode && Boolean(actionItem?.volunteer?.id);

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

  const runRefetches = (): void => {
    actionItemsRefetch();
    orgActionItemsRefetch?.();
  };

  const handleFormChange = useCallback(
    (
      field: keyof IFormStateType,
      value: string | boolean | Date | undefined | null,
    ): void => {
      setFormState((prevState) => ({ ...prevState, [field]: value }));
    },
    [],
  );

  const handleClearVolunteer = useCallback(() => {
    handleFormChange('volunteerId', '');
    setSelectedVolunteer(null);
  }, [handleFormChange]);

  const handleClearVolunteerGroup = useCallback(() => {
    handleFormChange('volunteerGroupId', '');
    setSelectedVolunteerGroup(null);
  }, [handleFormChange]);

  const createActionItemHandler = async (): Promise<void> => {
    try {
      if (!categoryId || (!volunteerId && !volunteerGroupId)) {
        NotificationToast.error({
          key: 'selectCategoryAndAssignment',
          namespace: 'translation',
        });
        return;
      }

      setIsSubmitting(true);
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

      runRefetches();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulCreation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateActionItemHandler = async (): Promise<void> => {
    try {
      if (!actionItem?.id) {
        NotificationToast.error({
          key: 'unknownError',
          namespace: 'errors',
        });
        return;
      }

      setIsSubmitting(true);
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
      runRefetches();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulUpdation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateActionForInstanceHandler = async (): Promise<void> => {
    try {
      if (!actionItem?.id) {
        NotificationToast.error({
          key: 'unknownError',
          namespace: 'errors',
        });
        return;
      }

      setIsSubmitting(true);
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
      runRefetches();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulUpdation',
        namespace: 'translation',
      });
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
    if (!isOpen) return;
    setFormState(initializeFormState(actionItem));
  }, [isOpen, actionItem?.id]);

  useEffect(() => {
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
    } else if (actionItem?.isTemplate) {
      setApplyTo('series');
    } else if (actionItem) {
      setApplyTo('instance');
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
    }
  }, [actionItem, volunteersData, volunteerGroupsData, isOpen]);

  // Separate useEffect for resetting selections when opening in Create Mode
  useEffect(() => {
    if (isOpen && !actionItem) {
      // For new action items, reset selections
      setSelectedVolunteer(null);
      setSelectedVolunteerGroup(null);
      setAssignmentType('volunteer');
    }
  }, [isOpen, actionItem]);

  // Clear volunteer/volunteer group selections when applyTo changes
  useEffect(() => {
    if (!isApplyToRelevant) return;
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
  }, [
    applyTo,
    selectedVolunteer,
    selectedVolunteerGroup,
    isApplyToRelevant,
    handleFormChange,
  ]);

  // Reset applyTo to default when modal opens for creating a new action item
  useEffect(() => {
    if (isOpen && !editMode && !actionItem) {
      setApplyTo('instance'); // Default to 'instance' for new action items
    }
  }, [isOpen, editMode, actionItem]);

  const getSubmitHandler = (): (() => Promise<void>) => {
    if (!editMode) return createActionItemHandler;
    if (actionItem?.isTemplate && applyTo === 'instance') {
      return updateActionForInstanceHandler;
    }
    return updateActionItemHandler;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    getSubmitHandler()();
  };

  const isFormValid = categoryId && (volunteerId || volunteerGroupId);

  const modalContent = (
    <>
      {isRecurring && !editMode && (
        <ApplyToSelector applyTo={applyTo} onChange={setApplyTo} />
      )}
      {editMode &&
        actionItem?.isTemplate &&
        !actionItem.isInstanceException && (
          <ApplyToSelector applyTo={applyTo} onChange={setApplyTo} />
        )}
      <div className="d-flex gap-3 mb-3">
        <Autocomplete
          className={`${styles.noOutline} w-100`}
          data-testid="categorySelect"
          data-cy="categorySelect"
          options={actionItemCategories}
          value={actionItemCategory}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          filterSelectedOptions={true}
          getOptionLabel={(item: IActionItemCategoryInfo): string => item.name}
          onChange={(_, newCategory): void => {
            handleFormChange('categoryId', newCategory?.id ?? '');
            setActionItemCategory(newCategory);
          }}
          renderInput={(params) => {
            const { InputProps, inputProps } = params;
            const {
              ref,
              className,
              startAdornment,
              endAdornment,
              onMouseDown,
            } = InputProps;
            return (
              <FormFieldGroup
                name="categorySelect"
                label={t('actionItemCategory')}
                required
              >
                <div
                  ref={ref}
                  className={`${className ?? ''} ${styles.autocompleteWrapper}`}
                  onMouseDown={onMouseDown}
                  role="presentation"
                  tabIndex={-1}
                >
                  {startAdornment}
                  <input
                    {...inputProps}
                    className={`${(inputProps as { className?: string }).className ?? ''} form-control`}
                    required
                  />
                  {endAdornment}
                </div>
              </FormFieldGroup>
            );
          }}
        />
      </div>

      {!isCompleted && (
        <>
          <AssignmentTypeSelector
            assignmentType={assignmentType}
            onTypeChange={setAssignmentType}
            isVolunteerDisabled={isVolunteerChipDisabled}
            isVolunteerGroupDisabled={isVolunteerGroupChipDisabled}
            onClearVolunteer={handleClearVolunteer}
            onClearVolunteerGroup={handleClearVolunteerGroup}
          />

          {assignmentType === 'volunteer' && (
            <div className="mb-3 w-100">
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
                  return volunteer.user?.name || t('unknownVolunteer');
                }}
                onChange={(_, newVolunteer): void => {
                  const volunteerId = newVolunteer?.id;
                  handleFormChange('volunteerId', volunteerId);
                  handleFormChange('volunteerGroupId', '');
                  setSelectedVolunteer(newVolunteer);
                  setSelectedVolunteerGroup(null);
                }}
                renderInput={(params) => {
                  const { InputProps, inputProps } = params;
                  const {
                    ref,
                    className,
                    startAdornment,
                    endAdornment,
                    onMouseDown,
                  } = InputProps;
                  return (
                    <FormFieldGroup
                      name="volunteerSelect"
                      label={t('volunteer')}
                      required
                    >
                      <div
                        ref={ref}
                        className={`${className ?? ''} ${styles.autocompleteWrapper}`}
                        onMouseDown={onMouseDown}
                        role="presentation"
                        tabIndex={-1}
                      >
                        {startAdornment}
                        <input
                          {...inputProps}
                          className={`${(inputProps as { className?: string }).className ?? ''} form-control`}
                          required
                        />
                        {endAdornment}
                      </div>
                    </FormFieldGroup>
                  );
                }}
              />
            </div>
          )}

          {assignmentType === 'volunteerGroup' && (
            <div className="mb-3 w-100">
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
                  return group.name;
                }}
                onChange={(_, newGroup): void => {
                  const groupId = newGroup?.id;
                  handleFormChange('volunteerGroupId', groupId);
                  handleFormChange('volunteerId', '');
                  setSelectedVolunteerGroup(newGroup);
                  setSelectedVolunteer(null);
                }}
                renderInput={(params) => {
                  const { InputProps, inputProps } = params;
                  const {
                    ref,
                    className,
                    startAdornment,
                    endAdornment,
                    onMouseDown,
                  } = InputProps;
                  return (
                    <FormFieldGroup
                      name="volunteerGroupSelect"
                      label={t('volunteerGroup')}
                      required
                    >
                      <div
                        ref={ref}
                        className={`${className ?? ''} ${styles.autocompleteWrapper}`}
                        onMouseDown={onMouseDown}
                        role="presentation"
                        tabIndex={-1}
                      >
                        {startAdornment}
                        <input
                          {...inputProps}
                          className={`${(inputProps as { className?: string }).className ?? ''} form-control`}
                          required
                        />
                        {endAdornment}
                      </div>
                    </FormFieldGroup>
                  );
                }}
              />
            </div>
          )}

          <div className="d-flex gap-3 mx-auto mb-3">
            <DatePicker
              format="DD/MM/YYYY"
              label={t('assignmentDate')}
              className={styles.noOutline}
              value={dayjs(assignedAt)}
              disabled={editMode}
              data-testid="assignmentDate"
              onChange={(date: Dayjs | null): void => {
                if (date && !editMode) {
                  handleFormChange('assignedAt', date.toDate());
                }
              }}
            />
          </div>

          <FormTextField
            name="preCompletionNotes"
            label={t('preCompletionNotes')}
            data-cy="preCompletionNotes"
            className={styles.noOutline}
            value={preCompletionNotes}
            onChange={(value) => handleFormChange('preCompletionNotes', value)}
          />
        </>
      )}

      {isCompleted && (
        <FormTextField
          name="postCompletionNotes"
          label={t('postCompletionNotes')}
          className={styles.noOutline}
          value={postCompletionNotes || ''}
          onChange={(value) => handleFormChange('postCompletionNotes', value)}
          as="textarea"
          rows={3}
        />
      )}
    </>
  );

  if (editMode) {
    return (
      <EditModal
        open={isOpen}
        title={t('updateActionItem')}
        onClose={hide}
        onSubmit={handleSubmit}
        loading={isSubmitting}
        data-testid="actionItemModal"
        className={styles.itemModal}
      >
        {modalContent}
      </EditModal>
    );
  }

  return (
    <CreateModal
      open={isOpen}
      title={t('createActionItem')}
      onClose={hide}
      onSubmit={handleSubmit}
      loading={isSubmitting}
      submitDisabled={!isFormValid}
      data-testid="actionItemModal"
      className={styles.itemModal}
    >
      {modalContent}
    </CreateModal>
  );
};

export default ItemModal;
