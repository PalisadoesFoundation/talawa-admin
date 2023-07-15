import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useMutation } from '@apollo/client';
import { SET_TASK_VOLUNTEERS_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

interface InterfaceUser {
  _id: string;
  firstName: string;
  lastName: string;
}

type ModalPropType = {
  show: boolean;
  taskId: string;
  organization: {
    _id: string;
    members: InterfaceUser[];
  };
  volunteers: InterfaceUser[];
  handleClose: () => void;
  refetchData: () => void;
};

export const ManageVolunteerModal = (props: ModalPropType): JSX.Element => {
  const [volunteers, setVolunteers] = useState<InterfaceUser[]>([]);

  useEffect(() => setVolunteers(props.volunteers), [props.volunteers]);

  const [setMutation] = useMutation(SET_TASK_VOLUNTEERS_MUTATION);

  const handleSubmit = (): void => {
    toast.warn('Updating the volunteers...');
    setMutation({
      variables: {
        id: props.taskId,
        volunteers: volunteers.map((volunteer) => volunteer._id),
      },
    })
      .then(() => {
        toast.success('Successfully updated the volunteers!');
        props.refetchData();
        props.handleClose();
      })
      .catch((err) => {
        toast.error('There was an error in updating the volunteers!');
        toast.error(err.message);
      });
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Volunteers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {' '}
            All the members of the organization of the event can be added as
            volunteers for a task.
          </p>
          <Stack spacing={3}>
            <Autocomplete
              value={volunteers}
              multiple
              id="volunteers-assigned-outlined"
              options={props.organization.members}
              getOptionLabel={(memberOption) =>
                `${memberOption.firstName} ${memberOption.lastName}`
              }
              filterSelectedOptions={true}
              // defaultValue={volunteers}
              onChange={(_, value) => {
                setVolunteers(value);
              }}
              autoHighlight={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Volunteers"
                  placeholder="Add or remove volunteers for this task"
                />
              )}
            />
          </Stack>
          <br />
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Update Volunteers
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
