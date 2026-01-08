import React, { useEffect, useMemo, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import type { FormEvent, FC } from 'react';
import styles from 'style/app-fixed.module.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

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
import { BaseModal } from 'shared-components/BaseModal';

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
 * Modal dialog for creating or editing an organization action item.
 *
 * @param props - Props for ItemModal
 * @returns The item modal element
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
    { variables: { input: { organizationId: orgId } } },
  );

  const { data: volunteersData } = useQuery(GET_EVENT_VOLUNTEERS, {
    variables: { input: { id: eventId }, where: {} },
    skip: !eventId,
  });

  const { data: volunteerGroupsData } = useQuery(GET_EVENT_VOLUNTEER_GROUPS, {
    variables: { input: { id: eventId } },
    skip: !eventId,
  });

  const volunteers = useMemo(() => {
    const all = volunteersData?.event?.volunteers || [];
    return applyTo === 'series'
      ? all.filter((v: InterfaceEventVolunteerInfo) => v.isTemplate)
      : all;
  }, [volunteersData, applyTo]);

  const volunteerGroups = useMemo(() => {
    const all = volunteerGroupsData?.event?.volunteerGroups || [];
    return applyTo === 'series'
      ? all.filter((g: IEventVolunteerGroup) => g.isTemplate)
      : all;
  }, [volunteerGroupsData, applyTo]);

  const isVolunteerChipDisabled = useMemo(
    () => editMode && actionItem?.volunteerGroup?.id,
    [editMode, actionItem],
  );
  const isVolunteerGroupChipDisabled = useMemo(
    () => editMode && actionItem?.volunteer?.id,
    [editMode, actionItem],
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
  const [updateActionForInstance] = useMutation(
    UPDATE_ACTION_ITEM_FOR_INSTANCE,
    { refetchQueries: ['GetEventActionItems'] },
  );

  const handleFormChange = (
    field: keyof IFormStateType,
    value: string | boolean | Date | undefined | null,
  ): void => {
    setFormState((prev) => ({ ...prev, [field]: value }));
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
        categoryId,
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
      await createActionItem({ variables: { input } });
      actionItemsRefetch();
      orgActionItemsRefetch?.();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulCreation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
    }
  };

  const updateActionItemHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!actionItem?.id) {
        NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
        return;
      }
      const input: IUpdateActionItemInput = {
        id: actionItem.id,
        isCompleted,
        categoryId,
        volunteerId: volunteerId || undefined,
        volunteerGroupId: volunteerGroupId || undefined,
        preCompletionNotes,
        postCompletionNotes: postCompletionNotes || undefined,
      };
      await updateActionItem({ variables: { input } });
      actionItemsRefetch();
      orgActionItemsRefetch?.();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulUpdation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
    }
  };

  const updateActionForInstanceHandler = async (
    e: FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (!actionItem?.id) {
        NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
        return;
      }
      const input: IUpdateActionForInstanceInput = {
        actionId: actionItem.id,
        eventId,
      };
      if (volunteerId) input.volunteerId = volunteerId;
      if (volunteerGroupId) input.volunteerGroupId = volunteerGroupId;
      if (categoryId) input.categoryId = categoryId;
      if (assignedAt) input.assignedAt = dayjs(assignedAt).toISOString();
      if (preCompletionNotes !== undefined)
        input.preCompletionNotes = preCompletionNotes;

      await updateActionForInstance({ variables: { input } });
      actionItemsRefetch();
      orgActionItemsRefetch?.();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulUpdation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
    }
  };

  useEffect(() => {
    setFormState(initializeFormState(actionItem));
  }, [actionItem]);

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      headerContent={
        <p className={styles.titlemodal}>
          {editMode ? t('updateActionItem') : t('createActionItem')}
        </p>
      }
    >
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
        {(isRecurring && !editMode) ||
        (editMode &&
          actionItem?.isTemplate &&
          !actionItem.isInstanceException) ? (
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

        <Form.Group
          className="d-flex gap-3 mb-3"
          data-testid="categorySelect"
          data-cy="categorySelect"
        >
          <Autocomplete
            className={`${styles.noOutline} w-100`}
            options={actionItemCategories}
            value={actionItemCategory}
            getOptionLabel={(item: IActionItemCategoryInfo) => item.name}
            onChange={(_, val) => {
              handleFormChange('categoryId', val?.id ?? '');
              setActionItemCategory(val);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('actionItemCategory')} required />
            )}
          />
        </Form.Group>

        {!isCompleted && (
          <>
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
                  color={assignmentType === 'volunteer' ? 'primary' : 'default'}
                  onClick={() => {
                    if (!isVolunteerChipDisabled) {
                      setAssignmentType('volunteer');
                      handleFormChange('volunteerGroupId', '');
                      setSelectedVolunteerGroup(null);
                    }
                  }}
                  clickable={!isVolunteerChipDisabled}
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
                />
              </Box>
            </Box>

            {assignmentType === 'volunteer' && (
              <Form.Group
                className="mb-3 w-100"
                data-testid="volunteerSelect"
                data-cy="volunteerSelect"
              >
                <Autocomplete
                  options={volunteers}
                  value={selectedVolunteer}
                  getOptionLabel={(v: InterfaceEventVolunteerInfo) =>
                    v.user?.name || t('unknownVolunteer')
                  }
                  onChange={(_, val) => {
                    handleFormChange('volunteerId', val?.id);
                    handleFormChange('volunteerGroupId', '');
                    setSelectedVolunteer(val);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('volunteer')} required />
                  )}
                />
              </Form.Group>
            )}

            {assignmentType === 'volunteerGroup' && (
              <Form.Group
                className="mb-3 w-100"
                data-testid="volunteerGroupSelect"
              >
                <Autocomplete
                  options={volunteerGroups}
                  value={selectedVolunteerGroup}
                  getOptionLabel={(g: IEventVolunteerGroup) => g.name}
                  onChange={(_, val) => {
                    handleFormChange('volunteerGroupId', val?.id);
                    handleFormChange('volunteerId', '');
                    setSelectedVolunteerGroup(val);
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
                label={t('assignmentDate')}
                value={dayjs(assignedAt)}
                disabled={editMode}
                onChange={(date) =>
                  !editMode && handleFormChange('assignedAt', date?.toDate())
                }
              />
            </Form.Group>

            <FormControl fullWidth className="mb-2">
              <TextField
                label={t('preCompletionNotes')}
                variant="outlined"
                value={preCompletionNotes}
                onChange={(e) =>
                  handleFormChange('preCompletionNotes', e.target.value)
                }
                data-cy="preCompletionNotes"
                data-testid="preCompletionNotes"
              />
            </FormControl>
          </>
        )}

        {isCompleted && (
          <FormControl fullWidth className="mb-2">
            <TextField
              label={t('postCompletionNotes')}
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
    </BaseModal>
  );
};

export default ItemModal;
