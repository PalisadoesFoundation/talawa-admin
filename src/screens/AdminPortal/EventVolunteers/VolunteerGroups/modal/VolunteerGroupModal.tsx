import type {
  InterfaceCreateVolunteerGroup,
  InterfaceUserInfoPG,
  InterfaceVolunteerGroupInfo,
} from 'utils/interfaces';
import type { InterfaceCreateVolunteerGroupData } from 'types/Volunteer/interface';
import styles from './VolunteerGroupModal.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Autocomplete } from '@mui/material';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  CREATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_GROUP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { errorHandler } from 'utils/errorHandler';
import {
  CreateModal,
  EditModal,
  useMutationModal,
} from 'shared-components/CRUDModalTemplate';

export interface InterfaceVolunteerGroupModal {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  orgId: string;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
  mode: 'create' | 'edit';
  // New props for recurring events
  isRecurring?: boolean;
  baseEvent?: { id: string } | null;
  recurringEventInstanceId?: string;
}

/**
 * A modal dialog for creating or editing a volunteer group.
 *
 * @remarks
 * Renders inputs for the group name, description, leader, volunteers, and required count, and wires them to create/update mutations with success and error handling.
 *
 * @returns A modal that handles create and edit flows for volunteer groups.
 */

const VolunteerGroupModal: React.FC<InterfaceVolunteerGroupModal> = ({
  isOpen,
  hide,
  eventId,
  orgId,
  group,
  refetchGroups,
  mode,
  isRecurring = false,
  baseEvent = null,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState<InterfaceCreateVolunteerGroup>({
    name: group?.name ?? '',
    description: group?.description ?? '',
    leader: group?.leader ?? null,
    volunteerUsers: group?.volunteers?.map((volunteer) => volunteer.user) ?? [],
    volunteersRequired: group?.volunteersRequired ?? null,
  });

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');

  const [updateVolunteerGroup] = useMutation(UPDATE_VOLUNTEER_GROUP);
  const [createVolunteerGroup] = useMutation(CREATE_VOLUNTEER_GROUP);

  const { data: membersData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  const members = useMemo(
    () => membersData?.usersByOrganizationId || [],
    [membersData],
  );

  useEffect(() => {
    setFormState({
      name: group?.name ?? '',
      description: group?.description ?? '',
      leader: group?.leader ?? null,
      volunteerUsers:
        group?.volunteers.map((volunteer) => volunteer.user) ?? [],
      volunteersRequired: group?.volunteersRequired ?? null,
    });
  }, [group]);

  const { name, description, leader, volunteerUsers, volunteersRequired } =
    formState;

  const { isSubmitting: isUpdating, execute: executeUpdate } = useMutationModal<
    Record<string, never>
  >(
    async () => {
      if (!group?.id) {
        throw new Error('Group ID is required for update');
      }

      const updatedFields: {
        [key: string]: number | string | undefined | null;
      } = {};

      if (name !== group?.name) {
        updatedFields.name = name;
      }
      if (description !== group?.description) {
        updatedFields.description = description;
      }
      if (volunteersRequired !== group?.volunteersRequired) {
        updatedFields.volunteersRequired = volunteersRequired;
      }

      await updateVolunteerGroup({
        variables: {
          id: group.id,
          data: { ...updatedFields, eventId },
        },
      });
    },
    {
      onSuccess: () => {
        NotificationToast.success(t('volunteerGroupUpdated'));
        refetchGroups();
        hide();
      },
      onError: (error) => {
        errorHandler(t, error);
      },
    },
  );

  const { isSubmitting: isCreating, execute: executeCreate } = useMutationModal<
    Record<string, never>
  >(
    async () => {
      if (isRecurring && !baseEvent) {
        NotificationToast.error(t('baseEventRequired'));
        throw new Error('Base event is required for recurring events');
      }

      const mutationData: InterfaceCreateVolunteerGroupData = {
        eventId: isRecurring && baseEvent ? baseEvent.id : eventId,
        leaderId: leader?.id,
        name,
        description,
        volunteersRequired,
        volunteerUserIds: volunteerUsers.map((user) => user.id),
      };

      if (isRecurring) {
        if (applyTo === 'series') {
          mutationData.scope = 'ENTIRE_SERIES';
        } else {
          mutationData.scope = 'THIS_INSTANCE_ONLY';
          mutationData.recurringEventInstanceId = eventId;
        }
      }

      await createVolunteerGroup({
        variables: {
          data: mutationData,
        },
      });
    },
    {
      onSuccess: () => {
        NotificationToast.success(t('volunteerGroupCreated'));
        refetchGroups();
        setFormState({
          name: '',
          description: '',
          leader: null,
          volunteerUsers: [],
          volunteersRequired: null,
        });
        setApplyTo('series');
        hide();
      },
      onError: (error) => {
        errorHandler(t, error);
      },
    },
  );

  const updateGroupHandler = async (): Promise<void> => {
    if (!group?.id) {
      NotificationToast.error(tCommon('errorOccured'));
      return;
    }
    await executeUpdate({});
  };

  const createGroupHandler = async (): Promise<void> => {
    await executeCreate({});
  };

  const isSubmitDisabled =
    mode === 'edit'
      ? isUpdating || !group?.id
      : isCreating || (isRecurring && !baseEvent);

  const formContent = (
    <>
      {isRecurring && mode === 'create' ? (
        <fieldset className={`mb-3 ${styles.radioFieldset}`}>
          <legend className={styles.radioLegend}>{t('applyTo')}</legend>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="applyTo"
                id="applyToSeries"
                value="series"
                checked={applyTo === 'series'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setApplyTo('series');
                  }
                }}
              />
              <label htmlFor="applyToSeries">{t('entireSeries')}</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="applyTo"
                id="applyToInstance"
                value="instance"
                checked={applyTo === 'instance'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setApplyTo('instance');
                  }
                }}
              />
              <label htmlFor="applyToInstance">{t('thisEventOnly')}</label>
            </div>
          </div>
        </fieldset>
      ) : null}

      <FormTextField
        name="name"
        label={tCommon('name')}
        required
        value={name}
        onChange={(value) => setFormState({ ...formState, name: value })}
        data-testid="groupNameInput"
      />

      <FormTextField
        name="description"
        label={tCommon('description')}
        value={description ?? ''}
        onChange={(value) => setFormState({ ...formState, description: value })}
        data-testid="groupDescriptionInput"
      />

      <div className="d-flex mb-3 w-100">
        <Autocomplete
          className={`${styles.noOutline} w-100`}
          limitTags={2}
          data-testid="leaderSelect"
          options={members}
          value={leader}
          disabled={mode === 'edit'}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          filterSelectedOptions={true}
          getOptionLabel={(member: InterfaceUserInfoPG): string => member.name}
          aria-label={t('leader')}
          onChange={(_, newLeader): void => {
            if (newLeader) {
              setFormState({
                ...formState,
                leader: newLeader,
                volunteerUsers: [...volunteerUsers, newLeader],
              });
            } else {
              setFormState({
                ...formState,
                leader: null,
                volunteerUsers: volunteerUsers.filter(
                  (user) => user.id !== leader?.id,
                ),
              });
            }
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref} className="position-relative">
              <label htmlFor="leader-input" className="form-label">
                {t('leader')} <span aria-label={tCommon('required')}>*</span>
              </label>
              <input
                {...params.inputProps}
                id="leader-input"
                className="form-control"
                placeholder={`${t('leader')} *`}
              />
            </div>
          )}
        />
      </div>

      <div className="d-flex mb-3 w-100">
        <Autocomplete
          multiple
          className={`${styles.noOutline} w-100`}
          limitTags={2}
          data-testid="volunteerSelect"
          options={members}
          value={volunteerUsers}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          filterSelectedOptions={true}
          getOptionLabel={(member: InterfaceUserInfoPG): string => member.name}
          disabled={mode === 'edit'}
          aria-label={t('volunteers')}
          onChange={(_, newUsers): void => {
            setFormState({
              ...formState,
              volunteerUsers: newUsers,
            });
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref} className="position-relative">
              <label htmlFor="volunteers-input" className="form-label">
                {t('volunteers')}
                <span aria-label={tCommon('required')}>*</span>
              </label>
              <input
                {...params.inputProps}
                id="volunteers-input"
                className="form-control"
                placeholder={`${t('volunteers')} *`}
              />
            </div>
          )}
        />
      </div>

      <FormTextField
        name="volunteersRequired"
        label={t('volunteersRequired')}
        type="number"
        value={volunteersRequired !== null ? String(volunteersRequired) : ''}
        onChange={(value) => {
          if (value === '') {
            setFormState({
              ...formState,
              volunteersRequired: null,
            });
          } else {
            const parsed = parseInt(value);
            if (!isNaN(parsed) && parsed > 0) {
              setFormState({
                ...formState,
                volunteersRequired: parsed,
              });
            }
          }
        }}
        data-testid="volunteersRequiredInput"
      />
    </>
  );

  if (mode === 'edit') {
    return (
      <EditModal
        open={isOpen}
        title={t('updateGroup')}
        onClose={hide}
        onSubmit={updateGroupHandler}
        loading={isUpdating}
        submitDisabled={isSubmitDisabled}
        data-testid="volunteerGroupModal"
      >
        {formContent}
      </EditModal>
    );
  }

  return (
    <CreateModal
      open={isOpen}
      title={t('createGroup')}
      onClose={hide}
      onSubmit={createGroupHandler}
      loading={isCreating}
      submitDisabled={isSubmitDisabled}
      data-testid="volunteerGroupModal"
    >
      {formContent}
    </CreateModal>
  );
};
export default VolunteerGroupModal;
