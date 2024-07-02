import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './AgendaItemsContainer.module.css';

interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaItemHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({
  agendaItemDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaItemHandler,
  t,
  tCommon,
}) => {
  return (
    <Modal
      size="sm"
      id={`deleteAgendaItemModal`}
      className={styles.agendaItemModal}
      show={agendaItemDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-primary">
        <Modal.Title className="text-white" id={`deleteAgendaItem`}>
          {t('deleteAgendaItem')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('deleteAgendaItemMsg')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          className="btn btn-danger"
          data-dismiss="modal"
          onClick={toggleDeleteModal}
          data-testid="deleteAgendaItemCloseBtn"
        >
          {tCommon('no')}
        </Button>
        <Button
          type="button"
          className="btn btn-success"
          onClick={deleteAgendaItemHandler}
          data-testid="deleteAgendaItemBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgendaItemsDeleteModal;
