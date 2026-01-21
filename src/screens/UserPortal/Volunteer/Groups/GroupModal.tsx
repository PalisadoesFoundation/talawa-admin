/**
 * A modal dialog for creating or editing a volunteer group.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param eventId - The ID of the event associated with volunteer group.
 * @param orgId - The ID of the organization associated with volunteer group.
 * @param group - The volunteer group object to be edited.
 * @param refetchGroups - Function to refetch the volunteer groups after creation or update.
 * @returns The rendered modal component.
 *
 * The `VolunteerGroupModal` component displays a form within a modal dialog for creating or editing a Volunteer Group.
 * It includes fields for entering the group name, description, volunteersRequired, and selecting volunteers/leaders.
 *
 * The modal includes:
 * - A header with a title indicating the current mode (create or edit) and a close button.
 * - A form with:
 * - An input field for entering the group name.
 * - A textarea for entering the group description.
 * - An input field for entering the number of volunteers required.
 * - A submit button to create or update the pledge.
 *
 * On form submission, the component either:
 * - Calls `updateVoluneerGroup` mutation to update an existing group, or
 *
 * Success or error messages are displayed using toast notifications based on the result of the mutation.
 */
import type { FormEvent } from 'react';
import Button from 'shared-components/Button/Button';
import FormControl from 'react-bootstrap/FormControl';
import type {
  InterfaceCreateVolunteerGroup,
  InterfaceVolunteerMembership,
} from 'utils/interfaces';
import styles from './GroupModal.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  UPDATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { PiUserListBold } from 'react-icons/pi';
import { TbListDetails } from 'react-icons/tb';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import { FaXmark } from 'react-icons/fa6';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { InterfaceGroupModal } from 'types/UserPortal/GroupModal/interface';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

const GroupModal: React.FC<InterfaceGroupModal> = ({
  isOpen,
  hide,
  eventId,
  group,
  refetchGroups,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const [modalType, setModalType] = useState<'details' | 'requests'>('details');
  const [formState, setFormState] = useState<InterfaceCreateVolunteerGroup>({
    name: group.name,
    description: group.description ?? '',
    leader: group.leader,
    volunteerUsers: group.volunteers.map((volunteer) => volunteer.user),
    volunteersRequired: group.volunteersRequired ?? null,
  });
  const [volunteersRequiredError, setVolunteersRequiredError] =
    useState<boolean>(false);

  const [touched, setTouched] = useState<{
    name: boolean;
    volunteersRequired: boolean;
  }>({
    name: false,
    volunteersRequired: false,
  });

  const { name, description, volunteersRequired } = formState;
  const nameError =
    touched.name && !name.trim() ? tCommon('nameRequired') : undefined;

  const [updateVolunteerGroup] = useMutation(UPDATE_VOLUNTEER_GROUP);
  const [updateMembership] = useMutation(UPDATE_VOLUNTEER_MEMBERSHIP);

  const updateMembershipStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
  ): Promise<void> => {
    try {
      await updateMembership({
        variables: {
          id: id,
          status: status,
        },
      });
      NotificationToast.success(
        t(
          status === 'accepted' ? 'requestAccepted' : 'requestRejected',
        ) as string,
      );
      refetchRequests();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  /**
   * Query to fetch volunteer Membership requests for the event.
   */
  const {
    data: requestsData,
    refetch: refetchRequests,
  }: {
    data?: {
      getVolunteerMembership: InterfaceVolunteerMembership[];
    };
    refetch: () => void;
  } = useQuery(USER_VOLUNTEER_MEMBERSHIP, {
    variables: {
      where: {
        eventId,
        groupId: group.id,
        status: 'requested',
      },
    },
  });

  const requests = useMemo(() => {
    if (!requestsData) return [];
    return requestsData.getVolunteerMembership;
  }, [requestsData]);

  useEffect(() => {
    setFormState({
      name: group.name,
      description: group.description ?? '',
      leader: group.leader,
      volunteerUsers: group.volunteers.map((volunteer) => volunteer.user),
      volunteersRequired: group.volunteersRequired ?? null,
    });
    setVolunteersRequiredError(false);
  }, [group]);

  const updateGroupHandler = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      if (volunteersRequiredError || nameError) {
        return;
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
        NotificationToast.error((error as Error).message);
      }
    },
    [formState, group, volunteersRequiredError, nameError],
  );

  return (
    <BaseModal
      className={styles.groupModal}
      show={isOpen}
      onHide={hide}
      title={t('manageGroup')}
      dataTestId="groupModal"
      showCloseButton={false}
      headerContent={
        <div className="d-flex justify-content-between align-items-center w-100">
          <p className={styles.titlemodal}>{t('manageGroup')}</p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="modalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </div>
      }
    >
      <fieldset
        className={`btn-group ${styles.toggleGroup} mt-0 px-3 mb-4 w-100`}
      >
        <legend className="visually-hidden">{t('viewToggle')}</legend>
        <input
          type="radio"
          className={`btn-check ${styles.toggleBtn}`}
          name="btnradio"
          id="detailsRadio"
          checked={modalType === 'details'}
          onChange={() => setModalType('details')}
        />
        <label
          className={`btn btn-outline-primary ${styles.toggleBtn}`}
          htmlFor="detailsRadio"
        >
          <TbListDetails className="me-2" />
          {t('details')}
        </label>

        <input
          type="radio"
          className={`btn-check ${styles.toggleBtn}`}
          name="btnradio"
          id="groupsRadio"
          onChange={() => setModalType('requests')}
          checked={modalType === 'requests'}
          data-testid="requestsRadio"
        />
        <label
          className={`btn btn-outline-primary ${styles.toggleBtn}`}
          htmlFor="groupsRadio"
        >
          <PiUserListBold className="me-2" size={21} />
          {t('requests')}
        </label>
      </fieldset>

      {modalType === 'details' ? (
        <form
          data-testid="pledgeForm"
          onSubmit={updateGroupHandler}
          className="p-3"
        >
          {/* Input field to enter the group name */}
          <FormFieldGroup
            name="name"
            label={tCommon('name')}
            required
            touched={touched.name}
            error={nameError}
          >
            <FormControl
              required
              type="text"
              className={styles.noOutline}
              value={name}
              data-testid="nameInput"
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, name: true })}
              isInvalid={touched.name && !!nameError}
            />
          </FormFieldGroup>
          {/* Input field to enter the group description */}
          <FormFieldGroup name="description" label={tCommon('description')}>
            <FormControl
              as="textarea"
              rows={3}
              className={styles.noOutline}
              value={description ?? ''}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </FormFieldGroup>

          <FormFieldGroup
            name="volunteersRequired"
            label={t('volunteersRequired')}
            touched={touched.volunteersRequired}
            error={volunteersRequiredError ? t('invalidNumber') : undefined}
          >
            <FormControl
              type="number"
              className={styles.noOutline}
              min={1}
              value={volunteersRequired ?? ''}
              isInvalid={volunteersRequiredError}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setFormState({
                    ...formState,
                    volunteersRequired: null,
                  });
                  setVolunteersRequiredError(false);
                } else {
                  const parsed = parseInt(val, 10);
                  if (Number.isNaN(parsed) || parsed < 1) {
                    setVolunteersRequiredError(true);
                    setFormState({
                      ...formState,
                      volunteersRequired: null,
                    });
                  } else {
                    setVolunteersRequiredError(false);
                    setFormState({
                      ...formState,
                      volunteersRequired: parsed,
                    });
                  }
                }
              }}
              onBlur={() =>
                setTouched({ ...touched, volunteersRequired: true })
              }
            />
          </FormFieldGroup>

          {/* Button to submit the pledge form */}
          <Button
            type="submit"
            className={styles.regBtn}
            data-testid="submitBtn"
            disabled={volunteersRequiredError || !!nameError}
          >
            {t('updateGroup')}
          </Button>
        </form>
      ) : (
        <div className="px-3">
          {requests.length === 0 ? (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noRequests')}
            </Stack>
          ) : (
            <TableContainer
              component={Paper}
              variant="outlined"
              className={styles.modalTable}
            >
              <Table aria-label={t('groupTable')}>
                <TableHead>
                  <TableRow>
                    <TableCell className="fw-bold">
                      {t('volunteerName')}
                    </TableCell>
                    <TableCell className="fw-bold">
                      {t('volunteerActions')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request, _index) => {
                    const { id, name, avatarURL } = request.volunteer.user;
                    return (
                      <TableRow
                        key={request.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          className="d-flex gap-1 align-items-center"
                          data-testid="userName"
                        >
                          <ProfileAvatarDisplay
                            key={id + '1'}
                            imageUrl={avatarURL}
                            fallbackName={t('volunteerAlt')}
                            dataTestId={'image' + (id + 1)}
                            className={styles.TableImage}
                          />

                          {name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2 rounded"
                              data-testid={`acceptBtn`}
                              aria-label={t('acceptRequest')}
                              onClick={() =>
                                updateMembershipStatus(request.id, 'accepted')
                              }
                            >
                              <i className="fa fa-check" />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              className="rounded"
                              data-testid={`rejectBtn`}
                              aria-label={t('rejectRequest')}
                              onClick={() =>
                                updateMembershipStatus(request.id, 'rejected')
                              }
                            >
                              <FaXmark size={18} className="fw-bold" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </BaseModal>
  );
};
export default GroupModal;
