import React from 'react';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import Button from 'shared-components/Button/Button';

import styles from './AgendaFolderUpdateModal.module.css';
import { InterfaceAgendaFolderUpdateModalProps } from 'types/AdminPortal/Agenda/interface';

// translation-check-keyPrefix: agendaSection
/**
 * AgendaFolderUpdateModal Component
 *
 * This component renders a modal for updating an existing agenda folder.
 * It provides form fields for editing the folder name and description
 * and submits the updated data using a provided handler.
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
const AgendaFolderUpdateModal: React.FC<
  InterfaceAgendaFolderUpdateModalProps
> = ({
  agendaFolderUpdateModalIsOpen,
  hideUpdateModal,
  folderFormState,
  setFolderFormState,
  updateAgendaFolderHandler,
  t,
}) => {
  return (
    <BaseModal
      show={agendaFolderUpdateModalIsOpen}
      onHide={hideUpdateModal}
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
