import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { ADD_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';

interface ModalPropType {
  show: boolean;
  eventId: string;
  handleClose: () => void;
  refetchData: () => void;
}

export const AddEventProjectModal = ({
  show,
  handleClose,
  refetchData,
  eventId,
}: ModalPropType) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [addMutation] = useMutation(ADD_EVENT_PROJECT_MUTATION);

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
      toast.warn('Adding the project...');
      addMutation({
        variables: {
          title,
          description,
          eventId,
        },
      })
        .then(() => {
          toast.success('Added the project successfully!');
          refetchData();
          setTitle('');
          setDescription('');
          handleClose();
        })
        .catch((err) => {
          toast.error('There was an error in adding the project!');
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add an Event Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title of the project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="A brief desciption of what the event is about!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button variant="success" type="submit" block>
              Create Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
