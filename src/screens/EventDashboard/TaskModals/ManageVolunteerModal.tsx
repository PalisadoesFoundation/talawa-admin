import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ModalPropType {
  show: boolean;
  organization: {
    _id: string;
    members: [UserInterface];
  };
  volunteers: [UserInterface];
  handleClose: () => void;
  refetchData: () => void;
}

export const ManageVolunteerModal = (props: ModalPropType) => {
  const [volunteers, setVolunteers] = useState<UserInterface[]>([]);

  useEffect(() => {
    setVolunteers(props.volunteers);
  }, [props.volunteers]);

  const handleSubmit = () => {
    console.log('The form is now submitted');
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Volunteers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {' '}
            All the members of the organization of the event can be added as
            volunteers for a task.
          </p>
          <Stack spacing={3}>
            <Autocomplete
              multiple
              id="volunteers-assigned-outlined"
              options={props.organization.members}
              getOptionLabel={(memberOption) =>
                `${memberOption.firstName} ${memberOption.lastName}`
              }
              defaultValue={volunteers}
              filterSelectedOptions
              onChange={(_, value) => {
                setVolunteers(value);
              }}
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
