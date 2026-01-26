import React from 'react';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import Button from 'shared-components/Button/Button';
import type { ChangeEvent } from 'react';

import styles from 'style/app-fixed.module.css';

interface InterfaceFormStateType {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
  };
}

interface InterfaceAgendaCategoryUpdateModalProps {
  agendaFolderUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  folderFormState: InterfaceFormStateType;
  setFolderFormState: (
    state: React.SetStateAction<InterfaceFormStateType>,
  ) => void;
  updateAgendaFolderHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
}

const AgendaFolderUpdateModal: React.FC<
  InterfaceAgendaCategoryUpdateModalProps
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
