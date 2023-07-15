import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { UPDATE_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';

type ModalPropType = {
  show: boolean;
  project: {
    _id: string;
    title: string;
    description: string;
  };
  handleClose: () => void;
  refetchData: () => void;
};

export const UpdateEventProjectModal = (props: ModalPropType): JSX.Element => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTitle(props.project.title);
    setDescription(props.project.description);
  }, [props.project]);

  const [updateMutation] = useMutation(UPDATE_EVENT_PROJECT_MUTATION);

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
      toast.warn('Updating the project...');
      updateMutation({
        variables: {
          id: props.project._id,
          title,
          description,
        },
      })
        .then(() => {
          toast.success('Updated the project successfully!');
          props.refetchData();
          props.handleClose();
        })
        .catch((err) => {
          toast.error('There was an error in updating the project details!');
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Event Project</Modal.Title>
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
            <Button variant="success" type="submit">
              Update Details
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
