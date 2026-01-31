import React from 'react';
import { useMutation } from '@apollo/client';

import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import { UPDATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './AgendaFolderUpdateModal.module.css';

import type { InterfaceAgendaFolderUpdateModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaFolderUpdateModal Component
 *
 * This component renders a modal for updating an existing agenda folder.
 * It provides form fields for editing the folder name and description
 * and submits the updated data using an internal GraphQL mutation.
 *
 * @remarks
 * The component:
 * - Displays a modal using `BaseModal`
 * - Manages controlled form inputs for folder name and description
 * - Submits updated folder data via a callback function
 * - Supports internationalization using `react-i18next`
 *
 * @returns A JSX element that renders the agenda folder update modal.
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
  t,
}) => {
  const [updateAgendaFolder, { loading }] = useMutation(
    UPDATE_AGENDA_FOLDER_MUTATION,
  );

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

      NotificationToast.success(t('agendaFolderUpdated') as string);
      refetchAgendaFolder();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(t('agendaFolderUpdateFailed') as string);
      }
    }
  };

  return (
    <CRUDModalTemplate
      open={isOpen}
      onClose={onClose}
      title={t('updateAgendaFolder')}
      onPrimary={updateAgendaFolderHandler}
      primaryText={t('update')}
      loading={loading}
      className={styles.campaignModal}
      data-testid="updateAgendaFolderModal"
    >
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
    </CRUDModalTemplate>
  );
};

export default AgendaFolderUpdateModal;
