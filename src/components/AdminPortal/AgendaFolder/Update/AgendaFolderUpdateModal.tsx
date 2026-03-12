import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import { UPDATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './AgendaFolderUpdateModal.module.css';

import type { InterfaceAgendaFolderUpdateModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaFolderUpdateModal
 *
 * Edit modal for updating an existing agenda folder.
 * Uses the shared `EditModal` for consistent update behavior.
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param folderFormState - Current agenda folder form state
 * @param setFolderFormState - Setter for agenda folder form state
 * @param agendaFolderId - ID of the agenda folder being updated
 * @param refetchAgendaFolder - Refetches agenda folder data after update
 * @param t - i18n translation function
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
const AgendaFolderUpdateModal: React.FC<
  InterfaceAgendaFolderUpdateModalProps
> = ({
  isOpen,
  onClose,
  folderFormState,
  setFolderFormState,
  agendaFolderId,
  refetchAgendaFolder,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const [updateAgendaFolder] = useMutation(UPDATE_AGENDA_FOLDER_MUTATION);

  /**
   * Updates the agenda folder details.
   * Trims user input, submits the update mutation, and refreshes
   * agenda folder data on successful completion.
   */
  const updateAgendaFolderHandler = async (): Promise<void> => {
    try {
      await updateAgendaFolder({
        variables: {
          input: {
            id: agendaFolderId,
            name: folderFormState.name?.trim() || undefined,
            description: folderFormState.description?.trim() || undefined,
          },
        },
      });

      NotificationToast.success(t('agendaFolderUpdated'));
      refetchAgendaFolder();
      onClose();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  return (
    <EditModal
      open={isOpen}
      onClose={onClose}
      title={t('updateAgendaFolder')}
      onSubmit={updateAgendaFolderHandler}
      submitDisabled={!folderFormState.name?.trim()}
      data-testid="updateAgendaFolderModal"
    >
      <div className={styles.form}>
        <FormTextField
          name="folderName"
          type="text"
          label={t('folderName')}
          placeholder={t('folderNamePlaceholder')}
          value={folderFormState.name}
          onChange={(val) =>
            setFolderFormState({
              ...folderFormState,
              name: val,
            })
          }
          required
        />

        <FormTextField
          name="folderDescription"
          type="text"
          label={t('description')}
          placeholder={t('description')}
          value={folderFormState.description}
          onChange={(val) =>
            setFolderFormState({
              ...folderFormState,
              description: val,
            })
          }
        />
      </div>
    </EditModal>
  );
};

export default AgendaFolderUpdateModal;
