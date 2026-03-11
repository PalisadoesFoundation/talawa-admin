import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import { DELETE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/AgendaFolderMutations';

import type { InterfaceAgendaFolderDeleteModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaFolderDeleteModal
 *
 * Confirmation modal for deleting an agenda folder.
 * Uses `DeleteModal` to provide consistent delete confirmation UI.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param agendaFolderId - ID of the agenda folder to delete
 * @param refetchAgendaFolder - Refetches agenda folder data after deletion
 * @param t - i18n translation function
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaFolderDeleteModal: React.FC<
  InterfaceAgendaFolderDeleteModalProps
> = ({ isOpen, onClose, agendaFolderId, refetchAgendaFolder }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const [deleteAgendaFolder] = useMutation(DELETE_AGENDA_FOLDER_MUTATION);

  /**
   * Deletes the selected agenda folder and refreshes agenda data on success.
   * Displays user feedback for both success and error states.
   */
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
    } catch (err) {
      if (err instanceof Error) {
        NotificationToast.error(err.message);
      }
    }
  };

  return (
    <DeleteModal
      open={isOpen}
      title={t('deleteAgendaFolder')}
      onClose={onClose}
      onDelete={deleteAgendaFolderHandler}
      data-testid="deleteAgendaFolderModal"
    >
      <p>{t('deleteAgendaFolderMsg')}</p>
    </DeleteModal>
  );
};

export default AgendaFolderDeleteModal;
