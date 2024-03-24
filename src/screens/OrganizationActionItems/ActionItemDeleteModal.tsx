import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './OrganizationActionItems.module.css';

interface InterfaceActionItemCreateModalProps {
  actionItemDeleteModalIsOpen: boolean;
  deleteActionItemHandler: () => Promise<void>;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
}

console.log('hey');

const ActionItemPreviewModal: React.FC<InterfaceActionItemCreateModalProps> = ({
  actionItemDeleteModalIsOpen,
  deleteActionItemHandler,
  toggleDeleteModal,
  t,
}) => {
  return (
    <>
      <Modal
        size="sm"
        id={`deleteActionItemModal`}
        show={actionItemDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
        className={styles.actionItemModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`deleteActionItem`}>
            {t('deleteActionItem')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('deleteActionItemMsg')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="actionItemDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteActionItemHandler}
            data-testid="deleteActionItemBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActionItemPreviewModal;
