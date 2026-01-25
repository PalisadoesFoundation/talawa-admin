import type { ChangeEvent } from 'react';
import Button from 'shared-components/Button';
import type {
  InterfaceCreateVolunteerGroup,
  InterfaceVolunteerGroupInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import type { InterfaceCreateVolunteerGroupData } from 'types/Volunteer/interface';
import styles from './VolunteerGroupModal.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Autocomplete } from '@mui/material';
import { areOptionsEqual, getMemberLabel } from 'utils/autocompleteHelpers';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  CREATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_GROUP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { errorHandler } from 'utils/errorHandler';
import BaseModal from 'shared-components/BaseModal/BaseModal';

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

  const updateGroupHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

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
      try {
        await updateVolunteerGroup({
          variables: {
            id: group?.id,
            data: { ...updatedFields, eventId },
          },
        });
        NotificationToast.success(t('volunteerGroupUpdated'));
        refetchGroups();
        hide();
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [formState, group],
  );

  // Function to create a new volunteer group
  const createGroupHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        e.preventDefault();

        // Template-First Hierarchy: Use scope-based approach
        const mutationData: InterfaceCreateVolunteerGroupData = {
          eventId: isRecurring
            ? baseEvent?.id // Always use baseEvent for recurring events (templates stored in base)
            : eventId, // Use eventId for non-recurring events
          leaderId: leader?.id,
          name,
          description,
          volunteersRequired,
          volunteerUserIds: volunteerUsers.map((user) => user.id),
        };

        // Add Template-First recurring event logic
        if (isRecurring) {
          if (applyTo === 'series') {
            mutationData.scope = 'ENTIRE_SERIES';
            // No recurringEventInstanceId needed - template appears on all instances
          } else {
            mutationData.scope = 'THIS_INSTANCE_ONLY';
            mutationData.recurringEventInstanceId = eventId; // Current instance ID
          }
        }

        await createVolunteerGroup({
          variables: {
            data: mutationData,
          },
        });

        NotificationToast.success(t('volunteerGroupCreated'));
        refetchGroups();
        setFormState({
          name: '',
          description: '',
          leader: null,
          volunteerUsers: [],
          volunteersRequired: null,
        });
        setApplyTo('series'); // Reset to default
        hide();
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [formState, eventId, isRecurring, applyTo, baseEvent],
  );

  return (
    <BaseModal
      className={styles.groupModal}
      onHide={hide}
      show={isOpen}
      headerContent={
        <p className={styles.titlemodal}>
          {t(mode === 'edit' ? 'updateGroup' : 'createGroup')}
        </p>
      }
    >
      <form
        onSubmit={mode === 'edit' ? updateGroupHandler : createGroupHandler}
        className="p-3"
      >
        {/* Radio buttons for recurring events - only show in create mode */}
        {isRecurring && mode === 'create' ? (
          <fieldset className="mb-3">
            <legend>{t('applyTo')}</legend>
            <div>
              <input
                type="radio"
                name="applyTo"
                id="applyToSeries"
                checked={applyTo === 'series'}
                onChange={() => setApplyTo('series')}
              />
              <label htmlFor="applyToSeries">{t('entireSeries')}</label>
            </div>
            <div>
              <input
                type="radio"
                name="applyTo"
                id="applyToInstance"
                checked={applyTo === 'instance'}
                onChange={() => setApplyTo('instance')}
              />
              <label htmlFor="applyToInstance">{t('thisEventOnly')}</label>
            </div>
          </fieldset>
        ) : null}

        {/* Input field to enter the group name */}
        <div className="mb-3">
          <FormTextField
            name="name"
            label={tCommon('name')}
            value={name}
            onChange={(value) => setFormState({ ...formState, name: value })}
            required
            data-testid="groupName"
          />
        </div>
        {/* Input field to enter the group description */}
        <div className="mb-3">
          <FormTextField
            name="description"
            label={tCommon('description')}
            value={description ?? ''}
            onChange={(value) =>
              setFormState({ ...formState, description: value })
            }
            as="textarea"
            rows={3}
            data-testid="groupDescription"
          />
        </div>
        {/* A dropdown to select leader for volunteer group */}
        <div className="d-flex mb-3 w-100">
          <FormFieldGroup
            name="leaderSelect"
            label={t('leader')}
            required
            touched={false}
          >
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="leaderSelect"
              options={members}
              value={leader}
              disabled={mode === 'edit'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfoPG): string =>
                member.name
              }
              onChange={(_, newLeader): void => {
                if (newLeader) {
                  const leaderExists = volunteerUsers.some(
                    (user) => user.id === newLeader.id,
                  );
                  setFormState({
                    ...formState,
                    leader: newLeader,
                    volunteerUsers: leaderExists
                      ? volunteerUsers
                      : [...volunteerUsers, newLeader],
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
                <div ref={params.InputProps.ref} className="w-100">
                  <div className="d-flex align-items-center gap-2">
                    {params.InputProps.startAdornment}
                    <input
                      {...params.inputProps}
                      id="leaderSelect"
                      className={`form-control ${styles.noOutline}`}
                      placeholder={t('leader')}
                      aria-label={t('leader')}
                    />
                    {params.InputProps.endAdornment}
                  </div>
                </div>
              )}
            />
          </FormFieldGroup>
        </div>

        {/* A Multi-select dropdown to select more than one volunteer */}
        <div className="d-flex mb-3 w-100">
          <Autocomplete
            multiple
            className={`${styles.noOutline} w-100`}
            limitTags={2}
            data-testid="volunteerSelect"
            options={members}
            value={volunteerUsers}
            isOptionEqualToValue={areOptionsEqual}
            filterSelectedOptions={true}
            getOptionLabel={getMemberLabel}
            disabled={mode === 'edit'}
            onChange={(_, newUsers): void => {
              setFormState({
                ...formState,
                volunteerUsers: newUsers,
              });
            }}
            renderInput={(params) => (
              <FormFieldGroup
                name="volunteers"
                label={t('volunteers')}
                required
              >
                <div
                  ref={params.InputProps.ref}
                  className="d-flex align-items-center w-100"
                >
                  {params.InputProps.startAdornment}
                  <input
                    {...params.inputProps}
                    id="volunteers"
                    className="form-control"
                    data-testid="volunteersInput"
                  />
                  {params.InputProps.endAdornment}
                </div>
              </FormFieldGroup>
            )}
          />
        </div>
        <div className="mb-3">
          <FormTextField
            name="volunteersRequired"
            label={t('volunteersRequired')}
            type="number"
            value={volunteersRequired?.toString() ?? ''}
            onChange={(value) => {
              if (value && parseInt(value) > 0) {
                setFormState({
                  ...formState,
                  volunteersRequired: parseInt(value),
                });
              } else {
                setFormState({
                  ...formState,
                  volunteersRequired: null,
                });
              }
            }}
            data-testid="volunteersRequired"
          />
        </div>

        {/* Button to submit the volunteer group form */}
        <Button type="submit" className={styles.regBtn} data-testid="submitBtn">
          {t(mode === 'edit' ? 'updateGroup' : 'createGroup')}
        </Button>
      </form>
    </BaseModal>
  );
};
export default VolunteerGroupModal;
