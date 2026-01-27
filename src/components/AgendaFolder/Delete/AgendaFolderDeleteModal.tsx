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
import styles from 'style/app-fixed.module.css';
import type { InterfaceAgendaFolderDeleteModalProps } from 'types/Agenda/interface';

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
      className={styles.agendaItemModal}
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
