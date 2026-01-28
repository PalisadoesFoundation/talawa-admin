import React from 'react';
import Button from 'shared-components/Button/Button';
import styles from 'style/app-fixed.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { InterfaceAgendaFolderCreateModalProps } from 'types/AdminPortal/Agenda/interface';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

// translation-check-keyPrefix: agendaSection
const AgendaFolderCreateModal: React.FC<
  InterfaceAgendaFolderCreateModalProps
> = ({
  agendaFolderCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createAgendaFolderHandler,
  t,
}) => {
  return (
    <BaseModal
      className={`mt-5 ${styles.campaignModal}`}
      show={agendaFolderCreateModalIsOpen}
      onHide={hideCreateModal}
      title={t('agendaFolderDetails')}
      dataTestId="createAgendaFolderModal"
    >
      <form onSubmit={createAgendaFolderHandler}>
        <FormTextField
          name="folderName"
          type="text"
          label={t('folderName')}
          placeholder={t('folderNamePlaceholder')}
          value={formState.name}
          onChange={(val) => setFormState({ ...formState, name: val })}
          required
        />

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            {t('description')}
          </label>
          <input
            id="description"
            type="text"
            className="form-control"
            placeholder={t('description')}
            value={formState.description}
            required
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }
          />
        </div>

        <Button
          type="submit"
          className={styles.regBtn}
          value="createAgendaFolder"
          data-testid="createAgendaFolderFormSubmitBtn"
        >
          {t('createAgendaFolder')}
        </Button>
      </form>
    </BaseModal>
  );
};

export default AgendaFolderCreateModal;
