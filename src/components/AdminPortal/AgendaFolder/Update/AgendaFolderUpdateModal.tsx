import React from 'react';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import Button from 'shared-components/Button/Button';

import styles from './AgendaFolderUpdateModal.module.css';
import { InterfaceAgendaFolderUpdateModalProps } from 'types/AdminPortal/Agenda/interface';
import { useMutation } from '@apollo/client';
import { UPDATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

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
  const [updateAgendaFolder] = useMutation(UPDATE_AGENDA_FOLDER_MUTATION);

  const updateAgendaFolderHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

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
    <BaseModal
      show={isOpen}
      onHide={onClose}
      title={t('updateAgendaFolder')}
      className={styles.campaignModal}
      dataTestId="updateAgendaFolderModal"
    >
      <form onSubmit={updateAgendaFolderHandler}>
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
          onChange={(e) =>
            setFolderFormState({
              ...folderFormState,
              description: e,
            })
          }
        />

        <Button
          type="submit"
          className={styles.regBtn}
          data-testid="editAgendaFolderBtn"
        >
          {t('update')}
        </Button>
      </form>
    </BaseModal>
  );
};

export default AgendaFolderUpdateModal;
