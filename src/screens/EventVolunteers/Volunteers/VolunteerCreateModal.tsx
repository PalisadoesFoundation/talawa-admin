import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceUserInfo } from 'utils/interfaces';
import styles from '../../../style/app.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { Autocomplete, TextField } from '@mui/material';

import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { ADD_VOLUNTEER } from 'GraphQl/Mutations/EventVolunteerMutation';

export interface InterfaceVolunteerCreateModal {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  orgId: string;
  refetchVolunteers: () => void;
}

/**
 * A modal dialog for add a volunteer for an event.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param eventId - The ID of the event associated with volunteer.
 * @param orgId - The ID of the organization associated with volunteer.
 * @param refetchVolunteers - Function to refetch the volunteers after adding a volunteer.
 *
 * @returns The rendered modal component.
 *
 * The `VolunteerCreateModal` component displays a form within a modal dialog for adding a volunteer.
 * It includes fields for selecting user.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - A form with:
 * - A multi-select dropdown for selecting user be added as volunteer.
 * - A submit button to create or update the pledge.
 *
 * On form submission, the component:
 * - Calls `addVolunteer` mutation to add a new Volunteer.
 *
 * Success or error messages are displayed using toast notifications based on the result of the mutation.
 */

const VolunteerCreateModal: React.FC<InterfaceVolunteerCreateModal> = ({
  isOpen,
  hide,
  eventId,
  orgId,
  refetchVolunteers,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });

  const [userId, setUserId] = useState<string>('');
  const [members, setMembers] = useState<InterfaceUserInfo[]>([]);
  const [addVolunteer] = useMutation(ADD_VOLUNTEER);

  const { data: memberData } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

  useEffect(() => {
    if (memberData) {
      setMembers(memberData.organizations[0].members);
    }
  }, [memberData]);

  // Function to add a volunteer for an event
  const addVolunteerHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        e.preventDefault();
        await addVolunteer({
          variables: {
            data: {
              eventId,
              userId,
            },
          },
        });

        toast.success(t('volunteerAdded'));
        refetchVolunteers();
        setUserId('');
        hide();
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    },
    [userId, eventId],
  );

  return (
    <Modal className={styles.volunteerCreateModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('addVolunteer')}</p>
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
          data-testid="volunteerForm"
          onSubmitCapture={addVolunteerHandler}
          className="p-3"
        >
          {/* A Multi-select dropdown enables admin to invite a member as volunteer  */}
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="membersSelect"
              options={members}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfo): string =>
                `${member.firstName} ${member.lastName}`
              }
              onChange={
                /*istanbul ignore next*/
                (_, newVolunteer): void => {
                  setUserId(newVolunteer?._id ?? '');
                }
              }
              renderInput={(params) => <TextField {...params} label="Member" />}
            />
          </Form.Group>

          {/* Button to submit the volunteer form */}
          <Button
            type="submit"
            className={styles.greenregbtn}
            data-testid="submitBtn"
          >
            {t('addVolunteer')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default VolunteerCreateModal;
