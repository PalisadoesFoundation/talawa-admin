import type {
  InterfaceCreateVolunteerGroup,
  InterfaceVolunteerGroupInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import type { InterfaceCreateVolunteerGroupData } from 'types/Volunteer/interface';
import styles from './VolunteerGroupModal.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client/react';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { getMemberLabel } from 'utils/autocompleteHelpers';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
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

  const members = useMemo(() => {
    const typed = membersData as
      | { usersByOrganizationId: InterfaceUserInfoPG[] }
      | undefined;
    return typed?.usersByOrganizationId || [];
  }, [membersData]);

  useEffect(() => {
    setFormState({
      name: group?.name ?? '',
      description: group?.description ?? '',
      leader: group?.leader ?? null,
      volunteerUsers:
        group?.volunteers?.map((volunteer) => volunteer.user) ?? [],
      volunteersRequired: group?.volunteersRequired ?? null,
    });
  }, [group]);

  const { name, description, leader, volunteerUsers, volunteersRequired } =
    formState;

  // Filter out the leader from available volunteers
  const availableVolunteers = useMemo(() => {
    if (!leader) return members;
    return members.filter(
      (member: InterfaceUserInfoPG) => member.id !== leader.id,
    );
  }, [members, leader]);

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

      // Get unique volunteer IDs, ensuring leader is included first
      const volunteerIds = volunteerUsers.map((user) => user.id);
      const leaderIdToAdd = leader?.id;

      // Create final list with leader FIRST, then volunteers (excluding duplicate leader)
      const uniqueVolunteerIds = leaderIdToAdd
        ? [leaderIdToAdd, ...volunteerIds.filter((id) => id !== leaderIdToAdd)]
        : volunteerIds;

      const mutationData: InterfaceCreateVolunteerGroupData = {
        eventId: isRecurring && baseEvent ? baseEvent.id : eventId,
        leaderId: leader?.id,
        name,
        description,
        volunteersRequired,
        volunteerUserIds: uniqueVolunteerIds,
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
        onChange={(value: string) =>
          setFormState({ ...formState, name: value })
        }
        data-testid="groupNameInput"
      />

      <FormTextField
        name="description"
        label={tCommon('description')}
        value={description ?? ''}
        onChange={(value: string) =>
          setFormState({ ...formState, description: value })
        }
        data-testid="groupDescriptionInput"
      />

      <div className="d-flex mb-3 w-100">
        <FormFieldGroup
          name="leaderSelect"
          label={t('leader')}
          required
          touched={false}
        >
          <select
            id="leaderSelect"
            className={`form-select ${styles.noOutline}`}
            data-testid="leaderSelect"
            value={leader?.id ?? ''}
            onChange={(e) => {
              const nextLeader = members.find(
                (member) => member.id === e.target.value,
              );
              setFormState({
                ...formState,
                leader: nextLeader ?? null,
              });
            }}
            disabled={mode === 'edit'}
          >
            <option value="">{t('selectLeader')}</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {getMemberLabel(member)}
              </option>
            ))}
          </select>
        </FormFieldGroup>
      </div>

      <div className="d-flex mb-3 w-100">
        <FormFieldGroup name="volunteers" label={t('volunteers')} required>
          <select
            id="volunteers"
            className="form-select"
            data-testid="volunteersInput"
            multiple
            value={volunteerUsers.map((user) => user.id)}
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions).map(
                (opt) => opt.value,
              );
              const selectedUsers = availableVolunteers.filter((member) =>
                selectedIds.includes(member.id),
              );
              setFormState({
                ...formState,
                volunteerUsers: selectedUsers,
              });
            }}
            disabled={mode === 'edit'}
            aria-label={t('volunteers')}
          >
            {availableVolunteers.map((member) => (
              <option key={member.id} value={member.id}>
                {getMemberLabel(member)}
              </option>
            ))}
          </select>
        </FormFieldGroup>
      </div>

      <FormTextField
        name="volunteersRequired"
        label={t('volunteersRequired')}
        type="number"
        value={volunteersRequired !== null ? String(volunteersRequired) : ''}
        onChange={(value: string) => {
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
            } else {
              setFormState({
                ...formState,
                volunteersRequired: null,
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
