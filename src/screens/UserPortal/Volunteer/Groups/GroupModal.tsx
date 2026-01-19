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
 * The `GroupModal` component displays a form within a modal dialog for updating a Volunteer Group.
 * It includes fields for entering the group name, description, and volunteersRequired.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - A form with:
 * - An input field for entering the group name.
 * - A textarea for entering the group description.
 * - An input field for entering the number of volunteers required.
 * - A submit button to update the group.
 * On form submission, the component either:
 * - Calls `updateVolunteerGroup` mutation to update an existing group, or
 *
 * Success or error messages are displayed using toast notifications based on the result of the mutation.
 */
import type { ChangeEvent } from 'react';
import Button from 'shared-components/Button/Button';
import type {
  InterfaceCreateVolunteerGroup,
  InterfaceVolunteerMembership,
} from 'utils/interfaces';
import styles from './GroupModal.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';
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
import Avatar from 'shared-components/Avatar/Avatar';
import { FaXmark } from 'react-icons/fa6';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import type { InterfaceGroupModalProps } from 'types/UserPortal/GroupModal/interface';

const GroupModal: React.FC<InterfaceGroupModalProps> = ({
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
  const isNameInvalid = touched.name && !formState.name.trim();
  const nameError = isNameInvalid ? tCommon('nameRequired') : undefined;

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
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
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
        console.error(error);
        NotificationToast.error((error as Error).message);
      }
    },
    [formState, group, volunteersRequiredError, nameError],
  );

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      className={styles.groupModal}
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
          onSubmitCapture={updateGroupHandler}
          className="p-3"
        >
          {/* Input field to enter the group name */}
          <FormTextField
            name="name"
            label={tCommon('name')}
            required
            value={name}
            touched={touched.name}
            error={nameError}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, name: value }))
            }
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          />

          {/* 
            Description is optional and intentionally does not participate in validation.
            No touched/error props are passed to avoid displaying validation UI
            for a non-required field.
          */}
          <FormTextField
            name="description"
            label={tCommon('description')}
            value={description ?? ''}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, description: value }))
            }
          />

          <FormFieldGroup
            name="volunteersRequired"
            label={t('volunteersRequired')}
            touched={touched.volunteersRequired}
            error={volunteersRequiredError ? t('invalidNumber') : undefined}
          >
            <FormTextField
              name="volunteersRequired"
              label={t('volunteersRequired')}
              type="number"
              value={volunteersRequired ?? ''}
              touched={touched.volunteersRequired}
              error={volunteersRequiredError ? t('invalidNumber') : undefined}
              onChange={(value) => {
                const parsed = parseInt(value, 10);
                if (Number.isNaN(parsed) || parsed < 1) {
                  setVolunteersRequiredError(true);
                  setFormState((prev) => ({
                    ...prev,
                    volunteersRequired: null,
                  }));
                } else {
                  setVolunteersRequiredError(false);
                  setFormState((prev) => ({
                    ...prev,
                    volunteersRequired: parsed,
                  }));
                }
              }}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, volunteersRequired: true }))
              }
            />
          </FormFieldGroup>

          <Button
            type="submit"
            className={styles.regBtn}
            data-testid="submitBtn"
            disabled={volunteersRequiredError || isNameInvalid}
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
                          {avatarURL ? (
                            <img
                              src={avatarURL}
                              alt={t('volunteerAlt')}
                              data-testid={`image${id + 1}`}
                              className={styles.TableImage}
                            />
                          ) : (
                            <div className={styles.avatarContainer}>
                              <Avatar
                                containerStyle={styles.imageContainer}
                                avatarStyle={styles.TableImage}
                                name={name}
                                alt={name}
                                dataTestId="avatar"
                              />
                            </div>
                          )}
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
