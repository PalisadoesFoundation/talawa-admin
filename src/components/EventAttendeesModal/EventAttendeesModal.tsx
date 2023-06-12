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
import styles from 'components/EventAttendeesModal/EventAttendeesModal.module.css';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface ModalPropType {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
}

export const EventAttendeesModal = (props: ModalPropType) => {
  const [member, setMember] = useState<UserInterface | null>(null);

  const [addAttendeeMutation] = useMutation(ADD_EVENT_ATTENDEE);
  const [removeAttendeeMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

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

  const addAttendee = () => {
    if (member == null) {
      toast.warning('Please choose an user to add first!');
      return;
    }
    toast.warn('Adding the attendee...');
    addAttendeeMutation({
      variables: {
        userId: member._id,
        eventId: props.eventId,
      },
    })
      .then(() => {
        toast.success('Added the attendee successfully!');
        attendeesRefetch();
      })
      .catch((err) => {
        toast.error('There was an error in adding the attendee!');
        toast.error(err.message);
      });
  };

  const deleteAttendee = (userId: string) => {
    toast.warn('Removing the attendee...');
    removeAttendeeMutation({
      variables: {
        userId,
        eventId: props.eventId,
      },
    })
      .then(() => {
        toast.success('Removed the attendee successfully!');
        attendeesRefetch();
      })
      .catch((err) => {
        toast.error('There was an error in removing the attendee!');
        toast.error(err.message);
      });
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
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Event Attendees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5> Registered Attendees</h5>
          {attendeesData.event.attendees.length == 0
            ? `There are no registered attendees for this event.`
            : null}
          <Stack direction="row" spacing={1}>
            {attendeesData.event.attendees.map((attendee: UserInterface) => (
              <Chip
                avatar={
                  <Avatar>{`${attendee.firstName[0]}${attendee.lastName[0]}`}</Avatar>
                }
                label={`${attendee.firstName} ${attendee.lastName}`}
                variant="outlined"
                key={attendee._id}
                onDelete={() => deleteAttendee(attendee._id)}
              />
            ))}
          </Stack>
          <br />

          <Autocomplete
            id="addAttendee"
            onChange={(_, newMember) => {
              setMember(newMember);
            }}
            options={memberData.organizations[0].members}
            getOptionLabel={(member: UserInterface) =>
              `${member.firstName} ${member.lastName}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add an Attendee"
                placeholder="Choose the user that you want to add"
              />
            )}
          />
          <br />
          <Button variant="success" onClick={addAttendee} block>
            Add Attendee
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
