import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from 'style/app.module.css';

/**
 * InterfaceAgendaCategoryDeleteModalProps is an object containing the props for AgendaCategoryDeleteModal component
 */
interface InterfaceAgendaCategoryDeleteModalProps {
  agendaCategoryDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaCategoryHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * AgendaCategoryDeleteModal component is used to delete the agenda category
 * @param  agendaCategoryDeleteModalIsOpen - boolean value to check if the modal is open or not
 * @param  toggleDeleteModal - function to toggle the modal
 * @param  deleteAgendaCategoryHandler - function to delete the agenda category
 * @param  t - i18n function to translate the text
 * @param  tCommon - i18n function to translate the text
 * @returns  returns the AgendaCategoryDeleteModal component
 */
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
      className={styles.campaignModal}
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
          data-testid="deleteAgendaCategoryCloseBtn"
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
