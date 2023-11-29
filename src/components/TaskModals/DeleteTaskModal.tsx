import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { DELETE_EVENT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';

type ModalPropType = {
  show: boolean;
  taskId: string;
  handleClose: () => void;
  refetchData: () => void;
};

export const DeleteTaskModal = (props: ModalPropType): JSX.Element => {
  const [deleteMutation] = useMutation(DELETE_EVENT_TASK_MUTATION);
  const notify = (): Promise<void> => {
    return toast.promise(deleteProject, {
      pending: 'Deleting the task...',
      success: 'Deleted the task successfully!',
      error: 'There was an error in deleting the task!',
    });
  };
  const deleteProject = async (): Promise<void> => {
    await deleteMutation({
      variables: {
        id: props.taskId,
      },
    });
    props.refetchData();
    props.handleClose();
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
          <Modal.Title className="text-white">Delete Task</Modal.Title>
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
          <Button variant="danger" onClick={notify} className="m-1">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
