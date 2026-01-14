import type { ChangeEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import type {
  InterfaceCreateVolunteerGroup,
  InterfaceUserInfoPG,
  InterfaceVolunteerGroupInfo,
} from 'utils/interfaces';
import type { InterfaceCreateVolunteerGroupData } from 'types/Volunteer/interface';
import styles from './VolunteerGroupModal.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Autocomplete, FormControl, TextField } from '@mui/material';

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
      <Form
        onSubmitCapture={
          mode === 'edit' ? updateGroupHandler : createGroupHandler
        }
        className="p-3"
      >
        {/* Radio buttons for recurring events - only show in create mode */}
        {isRecurring && mode === 'create' ? (
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

        {/* Input field to enter the group name */}
        <Form.Group className="mb-3">
          <FormControl fullWidth>
            <TextField
              required
              label={tCommon('name')}
              variant="outlined"
              className={styles.noOutline}
              value={name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </FormControl>
        </Form.Group>
        {/* Input field to enter the group description */}
        <Form.Group className="mb-3">
          <FormControl fullWidth>
            <TextField
              multiline
              rows={3}
              label={tCommon('description')}
              variant="outlined"
              className={styles.noOutline}
              value={description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </FormControl>
        </Form.Group>
        {/* A dropdown to select leader for volunteer group */}
        <Form.Group className="d-flex mb-3 w-100">
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
              <TextField {...params} label={`${t('leader')} *`} />
            )}
          />
        </Form.Group>

        {/* A Multi-select dropdown to select more than one volunteer */}
        <Form.Group className="d-flex mb-3 w-100">
          <Autocomplete
            multiple
            className={`${styles.noOutline} w-100`}
            limitTags={2}
            data-testid="volunteerSelect"
            options={members}
            value={volunteerUsers}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterSelectedOptions={true}
            getOptionLabel={(member: InterfaceUserInfoPG): string =>
              member.name
            }
            disabled={mode === 'edit'}
            onChange={(_, newUsers): void => {
              setFormState({
                ...formState,
                volunteerUsers: newUsers,
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label={`${t('volunteers')} *`} />
            )}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormControl fullWidth>
            <TextField
              label={t('volunteersRequired')}
              variant="outlined"
              className={styles.noOutline}
              value={volunteersRequired ?? ''}
              onChange={(e) => {
                if (parseInt(e.target.value) > 0) {
                  setFormState({
                    ...formState,
                    volunteersRequired: parseInt(e.target.value),
                  });
                } else if (e.target.value === '') {
                  setFormState({
                    ...formState,
                    volunteersRequired: null,
                  });
                }
              }}
            />
          </FormControl>
        </Form.Group>

        {/* Button to submit the volunteer group form */}
        <Button type="submit" className={styles.regBtn} data-testid="submitBtn">
          {t(mode === 'edit' ? 'updateGroup' : 'createGroup')}
        </Button>
      </Form>
    </BaseModal>
  );
};
export default VolunteerGroupModal;
