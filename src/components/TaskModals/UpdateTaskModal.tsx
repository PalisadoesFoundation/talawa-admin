import React, { useEffect, useState } from 'react';
import { Modal, Button as BootstrapButton, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { UPDATE_EVENT_PROJECT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';
import { DeleteTaskModal } from './DeleteTaskModal';
import { ManageVolunteerModal } from './ManageVolunteerModal';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';

interface InterfaceUser {
  _id: string;
  firstName: string;
  lastName: string;
}
interface InterfaceTask {
  _id: string;
  title: string;
  deadline: string;
  description: string;
  completed: boolean;
  volunteers: InterfaceUser[];
}

export type ModalPropType = {
  show: boolean;
  task: InterfaceTask;
  organization: {
    _id: string;
    members: InterfaceUser[];
  };
  handleClose: () => void;
  refetchData: () => void;
};

export const UpdateTaskModal = (props: ModalPropType): JSX.Element => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<null | Dayjs>(null);
  const [completed, setCompleted] = useState(false);

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showManageVolunteerModal, setShowManageVolunteerModal] =
    useState(false);

  useEffect(() => {
    setTitle(props.task.title);
    setDescription(props.task.description);
    setDeadline(dayjs(props.task.deadline));
    setCompleted(props.task.completed);
  }, [props.task]);

  const [updateMutation] = useMutation(UPDATE_EVENT_PROJECT_TASK_MUTATION);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
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
      toast.warn('Updating the task...');
      updateMutation({
        variables: {
          taskId: props.task._id,
          title,
          description,
          deadline,
          completed,
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
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">
            Update the Event Task
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                placeholder="Enter title of the task."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                placeholder="A brief desciption of what the jobs of the task are!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <DateTimePicker
              label="Deadline"
              defaultValue={deadline}
              onChange={(date: Dayjs | null) => {
                setDeadline(date);
              }}
              disablePast
              className="mb-1"
            />

            <Form.Group className="m-1 p-1">
              <Form.Label htmlFor="completedSwitch">Completed</Form.Label>
              <Form.Check
                id="completedSwitch"
                type="switch"
                checked={completed}
                onChange={() => setCompleted(!completed)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="volunteersList">Volunteers</Form.Label>
              <div id="VolunteersList">
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
                    />
                  ))}
                </Stack>
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
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <BootstrapButton variant="success" type="submit" className="m-2">
              Update Task
            </BootstrapButton>
            <BootstrapButton
              variant="danger"
              onClick={() => {
                setShowDeleteTaskModal(true);
                props.handleClose();
              }}
            >
              Delete Task
            </BootstrapButton>
          </Modal.Footer>
        </Form>
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
        taskId={props.task._id}
      />
    </>
  );
};
