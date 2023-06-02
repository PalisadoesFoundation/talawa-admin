import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { DELETE_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';

interface ModalPropType {
  show: boolean;
  project: {
    _id: string;
    title: string;
    description: string;
  };
  handleClose: () => void;
  refetchData: () => void;
}

export const DeleteEventProjectModal = (props: ModalPropType) => {
  const [deleteMutation] = useMutation(DELETE_EVENT_PROJECT_MUTATION);

  const deleteProject = () => {
    toast.warn('Deleting the project...');
    deleteMutation({
      variables: {
        id: props.project._id,
      },
    })
      .then(() => {
        toast.success('Deleted the project successfully!');
        props.refetchData();
        props.handleClose();
      })
      .catch((err) => {
        toast.error('There was an error in updating the project details!');
        toast.error(err.message);
      });
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="m-1 text-lg mb-0">
            Are you sure you want to delete this?
          </div>
          <br />
          <Button
            variant="outline-secondary"
            onClick={props.handleClose}
            className="m-1"
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteProject} className="m-1">
            Delete
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
