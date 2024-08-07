import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';

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
  const { eventId, orgId, handleClose, show } = props;
  const [member, setMember] = useState<InterfaceUser | null>(null);

  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);
  const [removeRegistrantMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');
  const {
    data: attendeesData,
    loading: attendeesLoading,
    refetch: attendeesRefetch,
  } = useQuery(EVENT_ATTENDEES, {
    variables: { id: eventId },
  });

  const { data: memberData, loading: memberLoading } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

  const addRegistrant = (): void => {
    if (member == null) {
      toast.warning('Please choose an user to add first!');
      return;
    }
    toast.warn('Adding the attendee...');
    addRegistrantMutation({
      variables: {
        userId: member._id,
        eventId: eventId,
      },
    })
      .then(() => {
        toast.success(tCommon('addedSuccessfully', { item: 'Attendee' }));
        attendeesRefetch();
      })
      .catch((err) => {
        toast.error(t('errorAddingAttendee'));
        toast.error(err.message);
      });
  };

  const deleteRegistrant = (userId: string): void => {
    toast.warn('Removing the attendee...');
    removeRegistrantMutation({
      variables: {
        userId,
        eventId: eventId,
      },
    })
      .then(() => {
        toast.success(tCommon('removedSuccessfully', { item: 'Attendee' }));
        attendeesRefetch();
      })
      .catch((err) => {
        toast.error(t('errorRemovingAttendee'));
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
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Registrants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-2"> Registered Registrants </h5>
          {attendeesData.event.attendees.length == 0
            ? `There are no registered attendees for this event.`
            : null}
          <Stack direction="row" className="flex-wrap gap-2">
            {attendeesData.event.attendees.map((attendee: InterfaceUser) => (
              <Chip
                avatar={
                  <Avatar>{`${attendee.firstName[0]}${attendee.lastName[0]}`}</Avatar>
                }
                label={`${attendee.firstName} ${attendee.lastName}`}
                variant="outlined"
                key={attendee._id}
                onDelete={(): void => deleteRegistrant(attendee._id)}
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
          <Button variant="success" onClick={addRegistrant}>
            Add Registrant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
