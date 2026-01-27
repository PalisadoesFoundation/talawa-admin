import React from 'react';
import Button from 'shared-components/Button/Button';
import styles from 'style/app-fixed.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { InterfaceAgendaFolderCreateModalProps } from 'types/Agenda/interface';

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
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            {t('folderName')}
          </label>
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder={t('folderNamePlaceholder')}
            value={formState.name}
            required
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
        </div>

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
