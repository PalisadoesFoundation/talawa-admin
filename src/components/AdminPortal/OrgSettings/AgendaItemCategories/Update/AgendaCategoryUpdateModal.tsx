/**
 * AgendaCategoryUpdateModal Component
 *
 * This component renders a modal for updating an agenda category.
 * It provides a form with fields for the category name and description,
 * and allows users to submit updates.
 */
import React from 'react';
import type { FormEvent } from 'react';
import styles from 'style/app-fixed.module.css';
import { EditModal } from 'shared-components/CRUDModalTemplate';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}

interface InterfaceAgendaCategoryUpdateModalProps {
  agendaCategoryUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateAgendaCategoryHandler: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
}

const AgendaCategoryUpdateModal: React.FC<
  InterfaceAgendaCategoryUpdateModalProps
> = ({
  agendaCategoryUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateAgendaCategoryHandler,
  t,
}) => {
    return (
      <EditModal
        open={agendaCategoryUpdateModalIsOpen}
        onClose={hideUpdateModal}
        onSubmit={updateAgendaCategoryHandler}
        title={t('updateAgendaCategory')}
        className={styles.campaignModal}
        data-testid="agendaCategoryUpdateModal"
        primaryText={t('update')}
      >
        <FormTextField
          name="name"
          label={t('name')}
          placeholder={t('name')}
          value={formState.name}
          required
          onChange={(value: string) => setFormState({ ...formState, name: value })}
          data-testid="agendaCategoryNameInput"
        />
        <FormTextField
          name="description"
          label={t('description')}
          placeholder={t('description')}
          value={formState.description}
          required
          onChange={(value: string) => setFormState({ ...formState, description: value })}
          data-testid="agendaCategoryDescriptionInput"
        />
      </EditModal>
    );
  };

export default AgendaCategoryUpdateModal;
