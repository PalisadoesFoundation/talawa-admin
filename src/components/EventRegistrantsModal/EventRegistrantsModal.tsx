import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  ADD_EVENT_ATTENDEE,
  REMOVE_EVENT_ATTENDEE,
} from 'GraphQl/Mutations/mutations';
import styles from 'components/EventRegistrantsModal/EventRegistrantsModal.module.css';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddOnSpotAttendee from './AddOnSpotAttendee';
import { useTranslation } from 'react-i18next';

// Props for the EventRegistrantsModal component
type ModalPropType = {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
};

// User information interface
interface InterfaceUser {
  _id: string;
  firstName: string;
  lastName: string;
}
/**
 * Modal component for managing event registrants.
 * Allows adding and removing attendees from an event.
 *
 * @param show - Whether the modal is visible or not.
 * @param eventId - The ID of the event.
 * @param orgId - The ID of the organization.
 * @param handleClose - Function to close the modal.
 * @returns JSX element representing the modal.
 */
export const EventRegistrantsModal = (props: ModalPropType): JSX.Element => {
  const { eventId, orgId, handleClose, show } = props;
  const [member, setMember] = useState<InterfaceUser | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE, {
    refetchQueries: [
      { query: EVENT_ATTENDEES, variables: { id: eventId } },
      { query: MEMBERS_LIST, variables: { id: orgId } },
    ],
  });
  const [open, setOpen] = useState(false);

  // Hooks for mutation operations
  const [removeRegistrantMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

  // Translation hooks
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');

  // Query hooks to fetch event attendees and organization members
  const {
    data: attendeesData,
    loading: attendeesLoading,
    refetch: attendeesRefetch,
  } = useQuery(EVENT_ATTENDEES, {
    variables: { id: eventId },
  });

  const {
    data: memberData,
    loading: memberLoading,
    refetch: memberRefetch,
  } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
    pollInterval: 5000,
  });

  // Function to add a new registrant to the event
  const addRegistrant = (): void => {
    if (member == null) {
      toast.warning('Please choose a user to add first!');
      return;
    }
    setIsAdding(true);
    toast.warn('Adding the attendee...');
    addRegistrantMutation({
      variables: {
        userId: member._id,
        eventId: eventId,
      },
    })
      .then(() => {
        toast.success(
          tCommon('addedSuccessfully', { item: 'Attendee' }) as string,
        );
        attendeesRefetch(); // Refresh the list of attendees
      })
      .catch((err) => {
        toast.error(t('errorAddingAttendee') as string);
        toast.error(err.message);
      })
      .finally(() => {
        setIsAdding(false); // Set loading state to false
      });
  };

  // Function to remove a registrant from the event
  const deleteRegistrant = (userId: string): void => {
    toast.warn('Removing the attendee...');
    removeRegistrantMutation({
      variables: {
        userId,
        eventId: eventId,
      },
    })
      .then(() => {
        toast.success(
          tCommon('removedSuccessfully', { item: 'Attendee' }) as string,
        );
        attendeesRefetch(); // Refresh the list of attendees
      })
      .catch((err) => {
        toast.error(t('errorRemovingAttendee') as string);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (show) {
      const refetchInterval = setInterval(() => {
        Promise.all([
          attendeesRefetch().catch((err) =>
            toast.error(`Failed to refresh attendees list: ${err.message}`),
          ),
          memberRefetch().catch((err) =>
            toast.error(`Failed to refresh members list: ${err.message}`),
          ),
        ]);
      }, 5000);

      return () => clearInterval(refetchInterval);
    }
  }, [show, attendeesRefetch, memberRefetch]);
  if (attendeesLoading || memberLoading) {
    return (
      <>
        <div className={styles.loader} data-testid="loader"></div>
      </>
    );
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <AddOnSpotAttendee
          show={open}
          handleClose={() => setOpen(false)}
          reloadMembers={() => {
            memberRefetch();
            attendeesRefetch();
          }}
        />
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Registrants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-2"> Registered Registrants </h5>
          {attendeesData.event.attendees.length === 0
            ? 'There are no registered attendees for this event.'
            : null}
          <Stack direction="row" className="flex-wrap gap-2">
            {attendeesData?.event?.attendees.map((attendee: InterfaceUser) => (
              <Chip
                avatar={
                  <Avatar>{`${attendee.firstName[0]}${attendee.lastName[0]}`}</Avatar>
                }
                label={`${attendee.firstName} ${attendee.lastName}`}
                variant="outlined"
                key={attendee._id}
                onDelete={() => deleteRegistrant(attendee._id)}
                deleteIcon={<span aria-label="Delete">×</span>}
              />
            ))}
          </Stack>
          <br />

          <Autocomplete
            id="addRegistrant"
            onChange={(_, newMember) => {
              setMember(newMember);
            }}
            noOptionsText={
              <div className="d-flex ">
                <p className="me-2">No Registrations found</p>
                <span
                  className="underline"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add Onspot Registration
                </span>
              </div>
            }
            options={memberData.organizations[0].members}
            getOptionLabel={(member: InterfaceUser): string =>
              `${member.firstName} ${member.lastName}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add a Registrant"
                placeholder="Choose the user that you want to add"
              />
            )}
          />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={addRegistrant}
            disabled={isAdding}
            data-testid="add-registrant-button"
          >
            {isAdding ? 'Adding...' : 'Add Registrant'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
