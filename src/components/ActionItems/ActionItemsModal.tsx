import React from 'react';
import { Modal } from 'react-bootstrap';
import styles from 'components/ActionItems/ActionItemsWrapper.module.css';
import { ActionItemsModalBody } from './ActionItemsModalBody';

export interface InterfaceModalProp {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

export const ActionItemsModal = (props: InterfaceModalProp): JSX.Element => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        centered
        dialogClassName={styles.actionItemsModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" data-testid="modal-title">
            Event Action Items
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActionItemsModalBody
            organizationId={props.orgId}
            eventId={props.eventId}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
