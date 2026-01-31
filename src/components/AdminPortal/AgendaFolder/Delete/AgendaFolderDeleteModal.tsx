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
import { useMutation } from '@apollo/client';
import { DELETE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/AgendaFolderMutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

/**
 * Modal component for confirming deletion of an agenda folder.
 *
 * Displays a confirmation dialog with Yes/No buttons before deleting.
 *
 * @param isOpen - Controls modal visibility.
 * @param onClose - Closes the modal.
 * @param agendaFolderId - ID of the agenda folder to delete.
 * @param refetchAgendaFolder - Refetches agenda folders after deletion.
 * @param t - Agenda section i18n translator.
 * @param tCommon - Common i18n translator.
 *
 * @returns JSX.Element
 */

// translation-check-keyPrefix: agendaSection
const AgendaFolderDeleteModal: React.FC<
  InterfaceAgendaFolderDeleteModalProps
> = ({ isOpen, onClose, agendaFolderId, refetchAgendaFolder, t, tCommon }) => {
  const [deleteAgendaFolder] = useMutation(DELETE_AGENDA_FOLDER_MUTATION);

  const deleteAgendaFolderHandler = async (): Promise<void> => {
    try {
      await deleteAgendaFolder({
        variables: {
          input: { id: agendaFolderId },
        },
      });

      NotificationToast.success(t('agendaFolderDeleted') as string);
      refetchAgendaFolder();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return (
    <BaseModal
      size="sm"
      // i18n-ignore-next-line
      dataTestId={`deleteAgendaFolderModal`}
      className={styles.agendaFolderModal}
      show={isOpen}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      title={t('deleteAgendaFolder')}
      headerClassName="bg-primary text-white"
      footer={
        <>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={onClose}
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
