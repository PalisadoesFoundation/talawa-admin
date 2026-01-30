import React, { FormEvent, useState } from 'react';
import Button from 'shared-components/Button/Button';
import styles from './AgendaFolderCreateModal.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { InterfaceAgendaFolderCreateModalProps } from 'types/AdminPortal/Agenda/interface';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { CREATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router';

// translation-check-keyPrefix: agendaSection
const AgendaFolderCreateModal: React.FC<
  InterfaceAgendaFolderCreateModalProps
> = ({
  agendaFolderCreateModalIsOpen,
  hideCreateModal,
  eventId,
  agendaFolderData,
  t,
  refetchAgendaFolder,
}) => {
  const { orgId } = useParams();
  // Mutation for creating an agenda item
  const [createAgendaFolder] = useMutation(CREATE_AGENDA_FOLDER_MUTATION);
  // State to manage form values
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    creator: {
      name: '',
    },
  });

  /**
   * Handler for creating a new agenda item.
   *
   * @param  e - The form submit event.
   */
  const createAgendaFolderHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const agendaFolders = Array.isArray(
      agendaFolderData?.agendaFoldersByEventId,
    )
      ? agendaFolderData?.agendaFoldersByEventId
      : [];
    const maxSequence = agendaFolders.reduce((max, folder) => {
      const sequence = Number.isFinite(folder.sequence) ? folder.sequence : 0;
      return Math.max(max, sequence);
    }, 0);
    const nextSequence = maxSequence + 1;
    try {
      await createAgendaFolder({
        variables: {
          input: {
            name: formState.name,
            description: formState.description,
            eventId: eventId,
            sequence: nextSequence, // Assign sequence based on current length
            organizationId: orgId,
          },
        },
      });

      // Reset form state and hide modal
      setFormState({
        id: '',
        name: '',
        description: '',
        creator: {
          name: '',
        },
      });
      hideCreateModal();
      refetchAgendaFolder();
      NotificationToast.success(t('agendaFolderCreated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

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
