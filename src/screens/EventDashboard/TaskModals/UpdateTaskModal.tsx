import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { UPDATE_EVENT_PROJECT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';

interface ModalPropType {
  show: boolean;
  task: {
    _id: string;
    title: string;
    description: string;
    deadline: string;
  };
  handleClose: () => void;
  refetchData: () => void;
}

export const UpdateTaskModal = (props: ModalPropType) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<null | Dayjs>(null);

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
                onChange={(date: Dayjs | null) => {
                  setDeadline(date);
                }}
                disablePast
              />
            </Form.Group>
            <br />
            <Button variant="success" type="submit" block>
              Update Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
