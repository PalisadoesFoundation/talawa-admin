import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { ADD_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';

type ModalPropType = {
  show: boolean;
  eventId: string;
  handleClose: () => void;
  refetchData: () => void;
};

export const AddEventProjectModal = ({
  show,
  handleClose,
  refetchData,
  eventId,
}: ModalPropType): JSX.Element => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [addMutation] = useMutation(ADD_EVENT_PROJECT_MUTATION);

  const notify = (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    return toast.promise(handleSubmit, {
      pending: 'Adding the project...',
      success: 'Added the project successfully!',
      error: 'There was an error in adding the project!',
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
        eventId,
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
          <Modal.Title className="text-white">Add an Event Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={notify}>
          <Modal.Body>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                required
                placeholder="Enter title of the project"
                value={title}
                onChange={(e): void => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="A brief desciption of what the event is about!"
                className="mb-3"
                required
                value={description}
                onChange={(e): void => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Create Project
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
