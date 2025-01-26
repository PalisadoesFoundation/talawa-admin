import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type {
  InterfaceCreateVolunteerGroup,
  InterfaceUserInfo,
  InterfaceVolunteerGroupInfo,
} from 'utils/interfaces';
import styles from '../../../style/app.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { Autocomplete, FormControl, TextField } from '@mui/material';

import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  CREATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_GROUP,
} from 'GraphQl/Mutations/EventVolunteerMutation';

export interface InterfaceVolunteerGroupModal {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  orgId: string;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
  mode: 'create' | 'edit';
}

/**
 * A modal dialog for creating or editing a volunteer group.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param eventId - The ID of the event associated with volunteer group.
 * @param orgId - The ID of the organization associated with volunteer group.
 * @param group - The volunteer group object to be edited.
 * @param refetchGroups - Function to refetch the volunteer groups after creation or update.
 * @param mode - The mode of the modal (create or edit).
 * @returns The rendered modal component.
 *
 * The `VolunteerGroupModal` component displays a form within a modal dialog for creating or editing a Volunteer Group.
 * It includes fields for entering the group name, description, volunteersRequired, and selecting volunteers/leaders.
 *
 * The modal includes:
 * - A header with a title indicating the current mode (create or edit) and a close button.
 * - A form with:
 *   - An input field for entering the group name.
 *   - A textarea for entering the group description.
 *   - A multi-select dropdown for selecting leader.
 *   - A multi-select dropdown for selecting volunteers.
 *   - An input field for entering the number of volunteers required.
 * - A submit button to create or update the pledge.
 *
 * On form submission, the component either:
 * - Calls `updatePledge` mutation to update an existing pledge, or
 * - Calls `createPledge` mutation to create a new pledge.
 *
 * Success or error messages are displayed using toast notifications based on the result of the mutation.
 */

const VolunteerGroupModal: React.FC<InterfaceVolunteerGroupModal> = ({
  isOpen,
  hide,
  eventId,
  orgId,
  group,
  refetchGroups,
  mode,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState<InterfaceCreateVolunteerGroup>({
    name: group?.name ?? '',
    description: group?.description ?? '',
    leader: group?.leader ?? null,
    volunteerUsers: group?.volunteers.map((volunteer) => volunteer.user) ?? [],
    volunteersRequired: group?.volunteersRequired ?? null,
  });
  const [members, setMembers] = useState<InterfaceUserInfo[]>([]);

  const [updateVolunteerGroup] = useMutation(UPDATE_VOLUNTEER_GROUP);
  const [createVolunteerGroup] = useMutation(CREATE_VOLUNTEER_GROUP);

  const { data: memberData } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

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

  useEffect(() => {
    if (memberData) {
      setMembers(memberData.organizations[0].members);
    }
  }, [memberData]);

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
            id: group?._id,
            data: { ...updatedFields, eventId },
          },
        });
        toast.success(t('volunteerGroupUpdated'));
        refetchGroups();
        hide();
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    },
    [formState, group],
  );

  // Function to create a new volunteer group
  const createGroupHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        e.preventDefault();
        await createVolunteerGroup({
          variables: {
            data: {
              eventId,
              leaderId: leader?._id,
              name,
              description,
              volunteersRequired,
              volunteerUserIds: volunteerUsers.map((user) => user._id),
            },
          },
        });

        toast.success(t('volunteerGroupCreated'));
        refetchGroups();
        setFormState({
          name: '',
          description: '',
          leader: null,
          volunteerUsers: [],
          volunteersRequired: null,
        });
        hide();
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    },
    [formState, eventId],
  );

  return (
    <Modal className={styles.groupModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>
          {t(mode === 'edit' ? 'updateGroup' : 'createGroup')}
        </p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmitCapture={
            mode === 'edit' ? updateGroupHandler : createGroupHandler
          }
          className="p-3"
        >
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
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfo): string =>
                `${member.firstName} ${member.lastName}`
              }
              onChange={
                /*istanbul ignore next*/
                (_, newLeader): void => {
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
                        (user) => user._id !== leader?._id,
                      ),
                    });
                  }
                }
              }
              renderInput={(params) => (
                <TextField {...params} label="Leader *" />
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
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfo): string =>
                `${member.firstName} ${member.lastName}`
              }
              disabled={mode === 'edit'}
              onChange={
                /*istanbul ignore next*/
                (_, newUsers): void => {
                  setFormState({
                    ...formState,
                    volunteerUsers: newUsers,
                  });
                }
              }
              renderInput={(params) => (
                <TextField {...params} label="Invite Volunteers *" />
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
          <Button
            type="submit"
            className={styles.greenregbtn}
            data-testid="submitBtn"
          >
            {t(mode === 'edit' ? 'updateGroup' : 'createGroup')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default VolunteerGroupModal;
