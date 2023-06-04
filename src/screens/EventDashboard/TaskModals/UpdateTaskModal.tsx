import React, { useEffect, useState } from 'react';
import { Modal, Button as BootstrapButton, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { UPDATE_EVENT_PROJECT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';
import { DeleteTaskModal } from './DeleteTaskModal';
import { ManageVolunteerModal } from './ManageVolunteerModal';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
}
interface TaskInterface {
  _id: string;
  title: string;
  deadline: string;
  description: string;
  volunteers: [UserInterface];
}

interface ModalPropType {
  show: boolean;
  task: TaskInterface;
  organization: {
    _id: string;
    members: [UserInterface];
  };
  handleClose: () => void;
  refetchData: () => void;
}

export const UpdateTaskModal = (props: ModalPropType) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<null | Dayjs>(null);

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showManageVolunteerModal, setShowManageVolunteerModal] =
    useState(false);

  useEffect(() => {
    setTitle(props.task.title);
    setDescription(props.task.description);
    setDeadline(dayjs(props.task.deadline));
  }, [props.task]);

  const [updateMutation] = useMutation(UPDATE_EVENT_PROJECT_TASK_MUTATION);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let toSubmit = true;

    if (title.trim().length == 0) {
      toast.error('Title cannot be empty!');
      toSubmit = false;
    }
    if (description.trim().length == 0) {
      toast.error('Description cannot be empty!');
      toSubmit = false;
    }

    if (toSubmit) {
      toast.warn('Adding the task...');
      updateMutation({
        variables: {
          taskId: props.task._id,
          title,
          description,
          deadline,
        },
      })
        .then(() => {
          toast.success('Updated the task successfully!');
          props.refetchData();
          props.handleClose();
        })
        .catch((err) => {
          toast.error('There was an error in updating the task!');
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update the Event Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title of the task."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="A brief desciption of what the jobs of the task are!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDeadline">
              <DateTimePicker
                label="Deadline"
                defaultValue={deadline}
                onChange={(date: Dayjs | null) => {
                  setDeadline(date);
                }}
                disablePast
              />
            </Form.Group>

            <Form.Group controlId="formVolunteers">
              <Form.Label>Volunteers</Form.Label>
              <br />
              {!props.task.volunteers.length
                ? `There are no volunteers assigned for this task.`
                : null}
              <Stack direction="row" spacing={1}>
                {props.task.volunteers.map((user) => (
                  <Chip
                    key={user._id}
                    avatar={
                      <Avatar>{`${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}</Avatar>
                    }
                    label={`${user.firstName} ${user.lastName}`}
                    variant="outlined"
                    onClick={() => {
                      console.log('I was clicked.');
                    }}
                    onDelete={() => {
                      console.log('I was deleted');
                    }}
                  />
                ))}
                <Button
                  variant="outlined"
                  endIcon={<ModeEditIcon />}
                  color="primary"
                  className="pt-2 mt-2"
                  onClick={() => {
                    setShowManageVolunteerModal(true);
                    props.handleClose();
                  }}
                >
                  Manage Volunteers
                </Button>
              </Stack>
            </Form.Group>

            <br />
            <BootstrapButton variant="success" type="submit" block>
              Update Task
            </BootstrapButton>
            <BootstrapButton
              variant="danger"
              block
              onClick={() => {
                setShowDeleteTaskModal(true);
                props.handleClose();
              }}
            >
              Delete Task
            </BootstrapButton>
          </Form>
        </Modal.Body>
      </Modal>
      <DeleteTaskModal
        show={showDeleteTaskModal}
        taskId={props.task._id}
        refetchData={props.refetchData}
        handleClose={() => {
          setShowDeleteTaskModal(false);
        }}
      />
      <ManageVolunteerModal
        show={showManageVolunteerModal}
        refetchData={props.refetchData}
        handleClose={() => {
          setShowManageVolunteerModal(false);
        }}
        volunteers={props.task.volunteers}
        organization={props.organization}
      />
    </>
  );
};
