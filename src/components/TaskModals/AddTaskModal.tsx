import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ADD_EVENT_PROJECT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';

type ModalPropType = {
  show: boolean;
  projectId: string;
  handleClose: () => void;
  refetchData: () => void;
};

export const AddTaskModal = ({
  show,
  handleClose,
  refetchData,
  projectId,
}: ModalPropType): JSX.Element => {
  const today = dayjs(new Date());

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<null | Dayjs>(today);

  const [addMutation] = useMutation(ADD_EVENT_PROJECT_TASK_MUTATION);

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
      toast.warn('Adding the task...');
      addMutation({
        variables: {
          title,
          description,
          projectId,
          deadline,
        },
      })
        .then(() => {
          toast.success('Added the task successfully!');
          refetchData();
          setTitle('');
          setDescription('');
          handleClose();
        })
        .catch((err) => {
          toast.error('There was an error in adding the task!');
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add an Event Task</Modal.Title>
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
                defaultValue={today}
                onChange={(date: Dayjs | null) => {
                  setDeadline(date);
                }}
                disablePast
              />
            </Form.Group>
            <br />
            <Button variant="success" type="submit">
              Create Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
