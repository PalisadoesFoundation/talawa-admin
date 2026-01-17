/**
 * AgendaCategoryDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an agenda category.
 * It provides options to either confirm or cancel the deletion action.
 *
 * @component
 * @param {InterfaceAgendaCategoryDeleteModalProps} props - The props for the component.
 * @param {boolean} props.agendaCategoryDeleteModalIsOpen - Determines if the modal is open or closed.
 * @param {() => void} props.toggleDeleteModal - Function to toggle the visibility of the modal.
 * @param {() => Promise<void>} props.deleteAgendaCategoryHandler - Async function to handle the deletion of the agenda category.
 * @param {(key: string) => string} props.t - Translation function for component-specific strings.
 * @param {(key: string) => string} props.tCommon - Translation function for common strings.
 *
 * @returns {React.FC} A React functional component that renders the delete confirmation modal.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and functionality.
 * - The `t` and `tCommon` props are used for internationalization (i18n).
 * - The modal is styled using a CSS module imported as `styles`.
 *
 * @example
 * ```tsx
 * <AgendaCategoryDeleteModal
 *   agendaCategoryDeleteModalIsOpen={true}
 *   toggleDeleteModal={handleToggle}
 *   deleteAgendaCategoryHandler={handleDelete}
 *   t={(key) => translations[key]}
 *   tCommon={(key) => commonTranslations[key]}
 * />
 * ```
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';

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
