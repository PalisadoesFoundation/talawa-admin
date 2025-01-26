import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type {
  InterfaceCreateVolunteerGroup,
  InterfaceVolunteerGroupInfo,
  InterfaceVolunteerMembership,
} from 'utils/interfaces';
import styles from 'style/app.module.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import {
  FormControl,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import {
  UPDATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { PiUserListBold } from 'react-icons/pi';
import { TbListDetails } from 'react-icons/tb';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import Avatar from 'components/Avatar/Avatar';
import { FaXmark } from 'react-icons/fa6';

export interface InterfaceGroupModal {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  group: InterfaceVolunteerGroupInfo;
  refetchGroups: () => void;
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
 *   - An input field for entering the number of volunteers required.
 * - A submit button to create or update the pledge.
 *
 * On form submission, the component either:
 * - Calls `updateVoluneerGroup` mutation to update an existing group, or
 *
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
      toast.success(
        t(
          status === 'accepted' ? 'requestAccepted' : 'requestRejected',
        ) as string,
      );
      refetchRequests();
    } catch (error: unknown) {
      toast.error((error as Error).message);
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
        groupId: group._id,
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
  }, [group]);

  const { name, description, volunteersRequired } = formState;

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
        console.log(error);
        toast.error((error as Error).message);
      }
    },
    [formState, group],
  );

  return (
    <Modal className={styles.groupModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('manageGroup')}</p>
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
        <div
          className={`btn-group ${styles.toggleGroup} mt-0 px-3 mb-4 w-100`}
          role="group"
        >
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
          />
          <label
            className={`btn btn-outline-primary ${styles.toggleBtn}`}
            htmlFor="groupsRadio"
          >
            <PiUserListBold className="me-2" size={21} />
            {t('requests')}
          </label>
        </div>

        {modalType === 'details' ? (
          <Form
            data-testid="pledgeForm"
            onSubmitCapture={updateGroupHandler}
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
                  data-testid="nameInput"
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

            {/* Button to submit the pledge form */}
            <Button
              type="submit"
              className={styles.greenregbtn}
              data-testid="submitBtn"
            >
              {t('updateGroup')}
            </Button>
          </Form>
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
                <Table aria-label="group table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="fw-bold">Name</TableCell>
                      <TableCell className="fw-bold">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((request, index) => {
                      const { _id, firstName, lastName, image } =
                        request.volunteer.user;
                      return (
                        <TableRow
                          key={index + 1}
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
                            {image ? (
                              <img
                                src={image}
                                alt="volunteer"
                                data-testid={`image${_id + 1}`}
                                className={styles.TableImage}
                              />
                            ) : (
                              <div className={styles.avatarContainer}>
                                <Avatar
                                  key={_id + '1'}
                                  containerStyle={styles.imageContainer}
                                  avatarStyle={styles.TableImage}
                                  name={firstName + ' ' + lastName}
                                  alt={firstName + ' ' + lastName}
                                />
                              </div>
                            )}
                            {firstName + ' ' + lastName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div className="d-flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                style={{ minWidth: '32px' }}
                                className="me-2 rounded"
                                data-testid={`acceptBtn`}
                                onClick={() =>
                                  updateMembershipStatus(
                                    request._id,
                                    'accepted',
                                  )
                                }
                              >
                                <i className="fa fa-check" />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                className="rounded"
                                data-testid={`rejectBtn`}
                                onClick={() =>
                                  updateMembershipStatus(
                                    request._id,
                                    'rejected',
                                  )
                                }
                              >
                                <FaXmark size={18} fontWeight={900} />
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
      </Modal.Body>
    </Modal>
  );
};
export default GroupModal;
