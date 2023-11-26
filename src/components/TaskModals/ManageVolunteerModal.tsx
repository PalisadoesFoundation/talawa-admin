import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Button } from 'react-bootstrap';
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
  const notify = (): Promise<void> => {
    return toast.promise(handleSubmit, {
      pending: 'Updating the volunteers...',
      success: 'Successfully updated the volunteers!',
      error: 'There was an error in updating the volunteers!',
    });
  };
  const handleSubmit = async (): Promise<void> => {
    await setMutation({
      variables: {
        id: props.taskId,
        volunteers: volunteers.map((volunteer) => volunteer._id),
      },
    });
    props.refetchData();
    props.handleClose();
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Manage Volunteers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            All the members of the organization of the event can be added as
            volunteers for a task.
          </p>
          <Stack spacing={3}>
            <Autocomplete
              value={volunteers}
              multiple
              id="volunteers-assigned-outlined"
              options={props.organization.members}
              getOptionLabel={(memberOption): string =>
                `${memberOption.firstName} ${memberOption.lastName}`
              }
              filterSelectedOptions={true}
              onChange={(_, value): void => {
                setVolunteers(value);
              }}
              autoHighlight={true}
              renderInput={(params): React.ReactNode => (
                <TextField
                  {...params}
                  label="Assign Volunteers"
                  placeholder="Add or remove volunteers for this task"
                />
              )}
            />
          </Stack>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" color="success" onClick={notify}>
            Update Volunteers
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
