import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './OrganizationAgendaCategory.module.css';

interface InterfaceAgendaCategoryDeleteModalProps {
  agendaCategoryDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaCategoryHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const AgendaCategoryDeleteModal: React.FC<
  InterfaceAgendaCategoryDeleteModalProps
> = ({
  agendaCategoryDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaCategoryHandler,
  t,
  tCommon,
}) => {
  return (
    <Modal
      size="sm"
      id={`deleteAgendaCategoryModal`}
      className={styles.agendaCategoryModal}
      show={agendaCategoryDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-primary">
        <Modal.Title className="text-white" id={`deleteAgendaCategory`}>
          {t('deleteAgendaCategory')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('deleteAgendaCategoryMsg')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          className="btn btn-danger"
          data-dismiss="modal"
          onClick={toggleDeleteModal}
          data-testid="cancelDeleteAgendaCategoryBtn"
        >
          {tCommon('no')}
        </Button>
        <Button
          type="button"
          className="btn btn-success"
          onClick={deleteAgendaCategoryHandler}
          data-testid="deleteAgendaCategoryBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgendaCategoryDeleteModal;
