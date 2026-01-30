/**
 * Modal component for confirming deletion of an agenda folder.
 *
 * Displays a confirmation dialog with Yes/No buttons before deleting.
 *
 * `@param` props - Component props from InterfaceAgendaFolderDeleteModalProps
 * `@returns` JSX.Element
 */
import React from 'react';
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button/Button';
import styles from './AgendaFolderDeleteModal.module.css';
import type { InterfaceAgendaFolderDeleteModalProps } from 'types/AdminPortal/Agenda/interface';

// translation-check-keyPrefix: agendaSection
/**
 * Modal component for confirming deletion of an agenda folder.
 *
 * Displays a confirmation dialog with Yes/No buttons before deleting.
 *
 * @param agendaFolderDeleteModalIsOpen - Controls modal visibility.
 * @param toggleDeleteModal - Closes the modal.
 * @param deleteAgendaFolderHandler - Triggers deletion of the folder.
 * @param t - Agenda section i18n translator.
 * @param tCommon - Common i18n translator.
 * @returns JSX.Element
 */
const AgendaFolderDeleteModal: React.FC<
  InterfaceAgendaFolderDeleteModalProps
> = ({
  agendaFolderDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaFolderHandler,
  t,
  tCommon,
}) => {
  return (
    <BaseModal
      size="sm"
      dataTestId={`deleteAgendaFolderModal`}
      className={styles.agendaFolderModal}
      show={agendaFolderDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      backdrop="static"
      keyboard={false}
      title={t('deleteAgendaFolder')}
      headerClassName="bg-primary text-white"
      footer={
        <>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={toggleDeleteModal}
            data-testid="deleteAgendaFolderCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteAgendaFolderHandler}
            data-testid="deleteAgendaFolderBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      <p>{t('deleteAgendaFolderMsg')}</p>
    </BaseModal>
  );
};

export default AgendaFolderDeleteModal;
