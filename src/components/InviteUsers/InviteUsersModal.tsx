import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import { INVITE_USER } from 'GraphQl/Mutations/EventAttendeeMutations';
import styles from './InviteUserModal.module.css';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GET_EVENT_ATTENDEE, MEMBERS_LIST } from 'GraphQl/Queries/Queries';

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

interface InterfaceUser2 {
  userId: string;
  isInvited: boolean;
}

export const InviteUserModal = (props: ModalPropType): JSX.Element => {
  const [member, setMember] = useState<InterfaceUser | null>(null);

  const [inviteUsersMutation] = useMutation(INVITE_USER);

  const {
    data: invitedUserData,
    loading: invitedUserLoading,
    refetch: invitedUsersRefectch,
  } = useQuery(GET_EVENT_ATTENDEE, {
    variables: { eventId: props.eventId },
  });

  console.log(JSON.stringify(invitedUserData, null, 2));
  // console.log(`ye hai na: ${invitedUserData.getEventAttendeesByEventId}`);

  const { data: memberData, loading: memberLoading } = useQuery(MEMBERS_LIST, {
    variables: { id: props.orgId },
  });

  console.log(`organization data is: ${memberData}`);

  const InviteEventAttendee = (): void => {
    if (member === null) {
      toast.warning(`Please choose an user to Invite first!`);
      return;
    }
    toast.warn(`Inviting the attendee...`);
    inviteUsersMutation({
      variables: {
        userId: member._id,
        eventId: props.eventId,
      },
    })
      .then(() => {
        toast.success(`Invited the Attendee successfully!`);
        invitedUsersRefectch();
      })
      .catch((err) => {
        toast.error('There was an error in adding the attendee!');
        toast.error(err.message);
      });
  };

  // Render the loading screen
  if (invitedUserLoading || memberLoading) {
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
          <Modal.Title className="text-white">
            Invite Event Attendee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-2">Registered Registrants</h5>
          {invitedUserData.getEventAttendeesByEventId.length === 0
            ? `There are no registered attendee for this event.`
            : null}
          <Stack direction="row" className="flex-wrap gap-2">
            {invitedUserData.getEventAttendeesByEventId.map(
              (invitedAttendee: InterfaceUser2) => {
                console.log(JSON.stringify(invitedAttendee, null, 2));
                console.log(`mera answer hai: ${invitedAttendee.userId}`);
                return (
                  <React.Fragment key={invitedAttendee.userId}>
                    <Chip
                      avatar={
                        <Avatar>{`${invitedAttendee.userId} ${invitedAttendee.userId}`}</Avatar>
                      }
                      label={`${invitedAttendee.userId} ${invitedAttendee.userId}`}
                      variant="outlined"
                      key={invitedAttendee.userId}
                    />
                  </React.Fragment>
                );
              },
            )}
          </Stack>

          <br />
          <Autocomplete
            id="inviteAttendee"
            onChange={(_, member): void => {
              setMember(member);
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
          <Button variant="success" onClick={InviteEventAttendee}>
            Invite Attendee
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
