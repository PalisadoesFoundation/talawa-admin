/**
 * This component is used for creating and updating action items.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import type { FormEvent, FC } from 'react';
import styles from 'style/app-fixed.module.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type {
  IActionItemCategoryInfo,
  IActionItemInfo,
  ICreateActionItemInput,
  IUpdateActionItemInput,
  IUpdateActionForInstanceInput,
  IEventVolunteerGroup,
} from 'types/ActionItems/interface';
import type {
  IFormStateType,
  IItemModalProps,
} from 'types/ActionItems/interface.ts';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
import BaseModal from 'shared-components/BaseModal/BaseModal';

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
    if (applyTo === 'series') {
      return allVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) =>
          volunteer.isTemplate === true,
      );
    } else {
      return allVolunteers;
    }
  }, [volunteersData, applyTo]);

  const volunteerGroups = useMemo(() => {
    const allVolunteerGroups =
      volunteerGroupsData?.event?.volunteerGroups || [];
    if (applyTo === 'series') {
      return allVolunteerGroups.filter(
        (group: IEventVolunteerGroup) => group.isTemplate === true,
      );
    } else {
      return allVolunteerGroups;
    }
  }, [volunteerGroupsData, applyTo]);

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

  const runRefetches = (): void => {
    actionItemsRefetch();
    orgActionItemsRefetch?.();
  };

  const handleFormChange = (
    field: keyof IFormStateType,
    value: string | boolean | Date | undefined | null,
  ): void => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const createActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!categoryId || (!volunteerId && !volunteerGroupId)) {
        NotificationToast.error({
          key: 'selectCategoryAndAssignment',
          namespace: 'translation',
        });
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
    }
  };

  const updateActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!actionItem?.id) {
        NotificationToast.error({
          key: 'unknownError',
          namespace: 'errors',
        });
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
    }
  };

  const updateActionForInstanceHandler = async (
    e: FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (!actionItem?.id) {
        NotificationToast.error({
          key: 'unknownError',
          namespace: 'errors',
        });
        return;
      }

      const input: IUpdateActionForInstanceInput = {
        actionId: actionItem.id,
        eventId: eventId,
      };

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

  useEffect(() => {
    if (actionItem?.isInstanceException) {
      setApplyTo('instance');
    } else if (actionItem) {
      setApplyTo('series');
    }
  }, [actionItem]);

  useEffect(() => {
    if (!isOpen) return;

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
      setSelectedVolunteer(null);
      setSelectedVolunteerGroup(null);
      setAssignmentType('volunteer');
    }
  }, [actionItem, volunteersData, volunteerGroupsData, isOpen]);

  useEffect(() => {
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

  useEffect(() => {
    if (isOpen && !editMode && !actionItem) {
      setApplyTo('instance');
    }
  }, [isOpen, editMode, actionItem]);

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={editMode ? t('updateActionItem') : t('createActionItem')}
      size="lg"
    >
      <Form
        onSubmit={
          editMode
            ? actionItem?.isInstanceException
              ? updateActionForInstanceHandler
              : updateActionItemHandler
            : createActionItemHandler
        }
      >
        {(isRecurring && !editMode) ||
        (editMode &&
          actionItem?.isTemplate &&
          !actionItem.isInstanceException) ? (
          <FormControl fullWidth margin="normal">
            <Typography variant="body1" gutterBottom>
              {t('applyTo')}
            </Typography>
            <Box display="flex" gap={2}>
              <Chip
                label={t('entireSeries')}
                variant={applyTo === 'series' ? 'filled' : 'outlined'}
                color={applyTo === 'series' ? 'primary' : 'default'}
                onClick={() => setApplyTo('series')}
              />
              <Chip
                label={t('thisInstance')}
                variant={applyTo === 'instance' ? 'filled' : 'outlined'}
                color={applyTo === 'instance' ? 'primary' : 'default'}
                onClick={() => setApplyTo('instance')}
              />
            </Box>
          </FormControl>
        ) : null}

        <FormControl fullWidth margin="normal">
          <Autocomplete
            id="actionItemCategorySelect"
            data-testid="formSelectActionItemCategory"
            options={actionItemCategories}
            value={actionItemCategory}
            isOptionEqualToValue={(option, value): boolean =>
              option.id === value.id
            }
            filterSelectedOptions={true}
            getOptionLabel={(item: IActionItemCategoryInfo): string =>
              item.name
            }
            onChange={(_, newCategory): void => {
              handleFormChange('categoryId', newCategory?.id ?? '');
              setActionItemCategory(newCategory);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('category') + ' *'} />
            )}
          />
        </FormControl>

        {!isCompleted && (
          <>
            <FormControl fullWidth margin="normal">
              <Typography variant="body1" gutterBottom>
                {t('assignTo')}
              </Typography>
              <Box display="flex" gap={2}>
                <Chip
                  label={t('volunteer')}
                  variant={
                    assignmentType === 'volunteer' ? 'filled' : 'outlined'
                  }
                  color={assignmentType === 'volunteer' ? 'primary' : 'default'}
                  onClick={() => {
                    if (!isVolunteerChipDisabled) {
                      setAssignmentType('volunteer');
                      handleFormChange('volunteerGroupId', '');
                      setSelectedVolunteerGroup(null);
                    }
                  }}
                  clickable={!isVolunteerChipDisabled}
                  sx={{
                    opacity: isVolunteerChipDisabled ? 0.6 : 1,
                    cursor: isVolunteerChipDisabled ? 'not-allowed' : 'pointer',
                  }}
                />
                <Chip
                  label={t('volunteerGroup')}
                  variant={
                    assignmentType === 'volunteerGroup' ? 'filled' : 'outlined'
                  }
                  color={
                    assignmentType === 'volunteerGroup' ? 'primary' : 'default'
                  }
                  onClick={() => {
                    if (!isVolunteerGroupChipDisabled) {
                      setAssignmentType('volunteerGroup');
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
            </FormControl>

            {assignmentType === 'volunteer' && (
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  id="volunteerSelect"
                  data-testid="volunteerSelect"
                  options={volunteers}
                  value={selectedVolunteer}
                  isOptionEqualToValue={(option, value): boolean =>
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
                  renderInput={(params) => (
                    <TextField {...params} label={t('volunteer') + ' *'} />
                  )}
                />
              </FormControl>
            )}

            {assignmentType === 'volunteerGroup' && (
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  id="volunteerGroupSelect"
                  data-testid="volunteerGroupSelect"
                  options={volunteerGroups}
                  value={selectedVolunteerGroup}
                  isOptionEqualToValue={(option, value): boolean =>
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
                  renderInput={(params) => (
                    <TextField {...params} label={t('volunteerGroup') + ' *'} />
                  )}
                />
              </FormControl>
            )}
          </>
        )}

        <FormControl fullWidth margin="normal">
          <DatePicker
            label={t('dueDate')}
            value={dayjs(assignedAt)}
            onChange={(date: Dayjs | null): void => {
              if (date && !editMode) {
                handleFormChange('assignedAt', date.toDate());
              }
            }}
          />
        </FormControl>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={t('preCompletionNotes')}
            value={preCompletionNotes}
            onChange={(e): void =>
              handleFormChange('preCompletionNotes', e.target.value)
            }
          />
        </Form.Group>

        {isCompleted && (
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t('postCompletionNotes')}
              value={postCompletionNotes || ''}
              onChange={(e): void =>
                handleFormChange('postCompletionNotes', e.target.value)
              }
            />
          </Form.Group>
        )}

        <Button
          type="submit"
          className={styles.greenregbtn}
          value="createActionItem"
          data-testid="submitBtn"
        >
          {editMode ? t('updateActionItem') : t('createActionItem')}
        </Button>
      </Form>
    </BaseModal>
  );
};

export default ItemModal;
