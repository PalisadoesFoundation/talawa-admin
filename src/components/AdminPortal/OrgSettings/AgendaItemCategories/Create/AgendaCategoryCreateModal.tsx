/**
 * AgendaCategoryCreateModal Component
 *
 * This component renders a modal for creating a new agenda category.
 * It provides a form with fields for the category name and description,
 * and allows users to submit the new category.
 */
import React from 'react';
import type { FormEvent } from 'react';
import styles from 'style/app-fixed.module.css';
import { CreateModal } from 'shared-components/CRUDModalTemplate';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

interface InterfaceFormStateType {
  name: string;
  description: string;
  createdBy: string;
}
interface InterfaceAgendaCategoryCreateModalProps {
  agendaCategoryCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createAgendaCategoryHandler: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
}

const AgendaCategoryCreateModal: React.FC<
  InterfaceAgendaCategoryCreateModalProps
> = ({
  agendaCategoryCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createAgendaCategoryHandler,
  t,
}) => {
  return (
    <CreateModal
      open={agendaCategoryCreateModalIsOpen}
      onClose={hideCreateModal}
      onSubmit={createAgendaCategoryHandler}
      title={t('agendaCategoryDetails')}
      className={`mt-5 ${styles.campaignModal}`}
      data-testid="agendaCategoryCreateModal"
      primaryText={t('createAgendaCategory')}
    >
      <FormTextField
        name="name"
        label={t('name')}
        placeholder={t('name')}
        value={formState.name}
        required
        onChange={(value: string) =>
          setFormState({ ...formState, name: value })
        }
        data-testid="agendaCategoryNameInput"
      />
      <FormTextField
        name="description"
        label={t('description')}
        placeholder={t('description')}
        required
        value={formState.description}
        onChange={(value: string) =>
          setFormState({ ...formState, description: value })
        }
        data-testid="agendaCategoryDescriptionInput"
      />
    </CreateModal>
  );
};

export default AgendaCategoryCreateModal;
