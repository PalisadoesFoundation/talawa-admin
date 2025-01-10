import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../../style/app.module.css';

interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaItemHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * Modal component for confirming the deletion of an agenda item.
 * Displays a confirmation dialog when a user attempts to delete an agenda item.
 *
 * @param agendaItemDeleteModalIsOpen - Boolean flag indicating if the modal is open.
 * @param toggleDeleteModal - Function to toggle the visibility of the modal.
 * @param deleteAgendaItemHandler - Function to handle the deletion of the agenda item.
 * @param t - Function for translating text based on keys.
 * @param tCommon - Function for translating common text keys.
 */
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
