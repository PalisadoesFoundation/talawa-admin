import { Form } from 'react-bootstrap';
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
import { Autocomplete, FormControl, TextField } from '@mui/material';

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

  const { isSubmitting: isUpdating, execute: executeUpdate } =
    useMutationModal<void>(
      async () => {
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
            id: group?.id,
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

  const { isSubmitting: isCreating, execute: executeCreate } =
    useMutationModal<void>(
      async () => {
        const mutationData: InterfaceCreateVolunteerGroupData = {
          eventId: isRecurring ? baseEvent?.id : eventId,
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
          setApplyTo('series'); // Reset to default
          hide();
        },
        onError: (error) => {
          errorHandler(t, error);
        },
      },
    );

  const updateGroupHandler = async (): Promise<void> => {
    await executeUpdate();
  };

  const createGroupHandler = async (): Promise<void> => {
    await executeCreate();
  };

  const formContent = (
    <>
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
          getOptionLabel={(member: InterfaceUserInfoPG): string => member.name}
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
          getOptionLabel={(member: InterfaceUserInfoPG): string => member.name}
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
      data-testid="volunteerGroupModal"
    >
      {formContent}
    </CreateModal>
  );
};
export default VolunteerGroupModal;
