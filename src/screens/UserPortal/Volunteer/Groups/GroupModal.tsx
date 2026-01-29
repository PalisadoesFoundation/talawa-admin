import type {
  InterfaceCreateVolunteerGroup,
  InterfaceVolunteerGroupInfo,
  InterfaceVolunteerMembership,
} from 'utils/interfaces';
import styles from './GroupModal.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
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
import Button from 'shared-components/Button/Button';

/**
 * Props for the GroupModal component.
 */
export interface InterfaceGroupModal {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  group: InterfaceVolunteerGroupInfo;
  refetchGroups: () => void;
}

/**
 * A modal dialog for editing a volunteer group.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param eventId - The ID of the event associated with the volunteer group.
 * @param group - The volunteer group object to be edited.
 * @param refetchGroups - Function to refetch the volunteer groups after an update.
 * @returns The rendered modal component.
 *
 * The `GroupModal` component displays a form within a modal dialog for editing a Volunteer Group.
 * It includes fields for entering the group name, description, and volunteersRequired.
 *
 * The modal includes:
 * - A toggle to switch between "details" and "requests" views.
 * - A form with:
 *   - An input field for entering the group name.
 *   - A textarea for entering the group description.
 *   - An input field for entering the number of volunteers required.
 *   - A submit button to update the group.
 * - A requests view showing pending membership requests with accept/reject actions.
 *
 * On form submission, the component calls `updateVolunteerGroup` mutation to update the group.
 * Success or error messages are displayed using toast notifications based on the result of the mutation.
 */
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (isSubmitting) return;

      if (volunteersRequiredError || nameError) {
        return;
      }

      setIsSubmitting(true);
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, group, volunteersRequiredError, nameError, isSubmitting],
  );

  return (
    <CRUDModalTemplate
      open={isOpen}
      onClose={hide}
      title={t('manageGroup')}
      className={styles.groupModal}
      loading={isSubmitting}
      showFooter={false}
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
          data-testid="groupForm"
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
            <input
              id="name"
              type="text"
              aria-label={tCommon('name')}
              required
              className={`form-control ${styles.noOutline}`}
              value={name}
              data-testid="nameInput"
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, name: true })}
            />
          </FormFieldGroup>

          {/* Input field to enter the group description */}
          <FormFieldGroup name="description" label={tCommon('description')}>
            <textarea
              id="description"
              aria-label={tCommon('description')}
              rows={3}
              className={`form-control ${styles.noOutline}`}
              value={description ?? ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  description: e.target.value,
                })
              }
            />
          </FormFieldGroup>

          <FormFieldGroup
            name="volunteersRequired"
            label={t('volunteersRequired')}
            touched={touched.volunteersRequired}
            error={volunteersRequiredError ? t('invalidNumber') : undefined}
          >
            <input
              id="volunteersRequired"
              type="number"
              min="1"
              aria-label={t('volunteersRequired')}
              className={`form-control ${styles.noOutline}`}
              value={volunteersRequired !== null ? volunteersRequired : ''}
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

          <Button
            type="submit"
            className={styles.regBtn}
            data-testid="submitBtn"
            disabled={volunteersRequiredError || !!nameError || isSubmitting}
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
    </CRUDModalTemplate>
  );
};

export default GroupModal;
