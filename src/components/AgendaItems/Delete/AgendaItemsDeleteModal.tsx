/**
 * AgendaItemsDeleteModal Component
 *
 * This component renders a modal dialog for confirming the deletion of an agenda item.
 * It provides a user-friendly interface to either confirm or cancel the deletion action.
 *
 * @component
 * @param {InterfaceAgendaItemsDeleteModalProps} props - The props for the component.
 * @param {boolean} props.agendaItemDeleteModalIsOpen - Determines whether the modal is open or closed.
 * @param {() => void} props.toggleDeleteModal - Function to toggle the visibility of the modal.
 * @param {() => void} props.deleteAgendaItemHandler - Function to handle the deletion of the agenda item.
 * @param {(key: string) => string} props.t - Translation function for agenda-specific text.
 * @param {(key: string) => string} props.tCommon - Translation function for common text (e.g., "yes", "no").
 *
 * @returns {JSX.Element} A modal dialog with options to confirm or cancel the deletion of an agenda item.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and functionality.
 * - The `t` and `tCommon` props are used for internationalization (i18n).
 * - The modal is styled using a CSS module (`app-fixed.module.css`).
 *
 * @example
 * ```tsx
 * <AgendaItemsDeleteModal
 *   agendaItemDeleteModalIsOpen={true}
 *   toggleDeleteModal={handleToggleModal}
 *   deleteAgendaItemHandler={handleDeleteAgendaItem}
 *   t={(key) => translations[key]}
 *   tCommon={(key) => commonTranslations[key]}
 * />
 * ```
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import styles from 'style/app-fixed.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/Agenda/interface';

// translation-check-keyPrefix: agendaItems
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({
  agendaItemDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaItemHandler,
  t,
  tCommon,
}) => {
  const { t: tErrors } = useTranslation('errors');

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
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
    </ErrorBoundaryWrapper>
  );
};

export default AgendaItemsDeleteModal;
