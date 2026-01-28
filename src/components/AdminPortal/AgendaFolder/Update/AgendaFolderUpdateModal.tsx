import React from 'react';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import Button from 'shared-components/Button/Button';

import styles from 'style/app-fixed.module.css';
import { InterfaceAgendaFolderUpdateModalProps } from 'types/AdminPortal/Agenda/interface';

// translation-check-keyPrefix: agendaSection
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
