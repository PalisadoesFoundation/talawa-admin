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
  const notify = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    toast.promise(handleSubmit, {
      pending: 'Adding the task...',
      success: 'Added the task successfully!',
      error: 'There was an error in adding the task!',
    });
  };
  const handleSubmit = async (): Promise<void> => {
    let toSubmit = true;

    if (title.trim().length == 0) {
      toast.error('Title cannot be empty!');
      toSubmit = false;
    }
    if (description.trim().length == 0) {
      toast.error('Description cannot be empty!');
      toSubmit = false;
    }
    if (!toSubmit) return Promise.reject();
    await addMutation({
      variables: {
        title,
        description,
        projectId,
        deadline,
      },
    });
    refetchData();
    setTitle('');
    setDescription('');
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Add an Event Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={notify}>
          <Modal.Body>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title of the task."
                value={title}
                className="mb-3"
                onChange={(e): void => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                className='"mb-3'
                placeholder="A brief desciption of what the jobs of the task are!"
                value={description}
                onChange={(e): void => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDeadline" className="pt-4">
              <DateTimePicker
                label="Deadline"
                defaultValue={today}
                onChange={(date: Dayjs | null): void => {
                  setDeadline(date);
                }}
                disablePast
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Create Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
