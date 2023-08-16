import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { DELETE_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';

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

export const DeleteEventProjectModal = (props: ModalPropType): JSX.Element => {
  const [deleteMutation] = useMutation(DELETE_EVENT_PROJECT_MUTATION);

  const deleteProject = (): void => {
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
        toast.error('There was an error in deleting the project details!');
        toast.error(err.message);
      });
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
          <Modal.Title className="text-white">Delete Event Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="m-1 text-lg mb-0" id="deleteEventProjectConfirm">
            Are you sure you want to delete this?
          </div>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
};
