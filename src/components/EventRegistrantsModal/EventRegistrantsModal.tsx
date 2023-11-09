import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
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

type ModalPropType = {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
};

interface InterfaceUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export const EventRegistrantsModal = (props: ModalPropType): JSX.Element => {
  const [member, setMember] = useState<InterfaceUser | null>(null);

  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);
  const [removeRegistrantMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

  const {
    data: attendeesData,
    loading: attendeesLoading,
    refetch: attendeesRefetch,
  } = useQuery(EVENT_ATTENDEES, {
    variables: { id: props.eventId },
  });

  const { data: memberData, loading: memberLoading } = useQuery(MEMBERS_LIST, {
    variables: { id: props.orgId },
  });
  const notifyAddRegistrant = (): Promise<void> => {
    return toast.promise(addRegistrant, {
      pending: 'Adding the attendee...',
      success: 'Added the attendee successfully!',
      error: 'There was an error in adding the attendee!',
    });
  };
  const addRegistrant = async (): Promise<void> => {
    if (member == null) {
      toast.warning('Please choose an user to add first!');
      return Promise.reject();
    }

    await addRegistrantMutation({
      variables: {
        userId: member._id,
        eventId: props.eventId,
      },
    });
    attendeesRefetch();
  };

  const notifyDeleteRegistrant = (userId: string): Promise<void> => {
    return toast.promise(() => deleteRegistrant(userId), {
      pending: 'Removing the attendee...',
      success: 'Removed the attendee successfully!',
      error: 'There was an error in removing the attendee!',
    });
  };
  const deleteRegistrant = async (userId: string): Promise<void> => {
    await removeRegistrantMutation({
      variables: {
        userId,
        eventId: props.eventId,
      },
    });
    attendeesRefetch();
  };

  // Render the loading screen
  if (attendeesLoading || memberLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Registrants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-2"> Registered Registrants </h5>
          {attendeesData.event.attendees.length == 0
            ? `There are no registered attendees for this event.`
            : null}
          <Stack direction="row" spacing={1}>
            {attendeesData.event.attendees.map((attendee: InterfaceUser) => (
              <Chip
                avatar={
                  <Avatar>{`${attendee.firstName[0]}${attendee.lastName[0]}`}</Avatar>
                }
                label={`${attendee.firstName} ${attendee.lastName}`}
                variant="outlined"
                key={attendee._id}
                onDelete={() => notifyDeleteRegistrant(attendee._id)}
              />
            ))}
          </Stack>
          <br />

          <Autocomplete
            id="addRegistrant"
            onChange={(_, newMember): void => {
              setMember(newMember);
            }}
            options={memberData.organizations[0].members}
            getOptionLabel={(member: InterfaceUser): string =>
              `${member.firstName} ${member.lastName}`
            }
            renderInput={(params): React.ReactNode => (
              <TextField
                {...params}
                label="Add an Registrant"
                placeholder="Choose the user that you want to add"
              />
            )}
          />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={notifyAddRegistrant}>
            Add Registrant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
