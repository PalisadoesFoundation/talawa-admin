import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router';

import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import { CREATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';

import type { InterfaceAgendaFolderCreateModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaFolderCreateModal
 *
 * Modal component for creating a new agenda folder within an event.
 * Calculates the next folder sequence based on existing folders and
 * submits the creation request via GraphQL.
 *
 * Displays validation and mutation feedback using NotificationToast
 * and refreshes agenda folder data on successful creation.
 *
 * @param isOpen - Controls modal visibility
 * @param hide - Callback to close the modal
 * @param eventId - ID of the event the folder belongs to
 * @param agendaFolderData - Existing agenda folder data for sequence calculation
 * @param t - i18n translation function
 * @param refetchAgendaFolder - Refetches agenda folder data after creation
 *
 * @returns JSX.Element | null
 */
// translation-check-keyPrefix: agendaSection
const AgendaFolderCreateModal: React.FC<
  InterfaceAgendaFolderCreateModalProps
> = ({ isOpen, hide, eventId, agendaFolderData, refetchAgendaFolder }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const { orgId } = useParams();

  const [createAgendaFolder] = useMutation(CREATE_AGENDA_FOLDER_MUTATION);

  const [formState, setFormState] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!orgId) {
      NotificationToast.error(t('organizationRequired'));
    }
  }, [orgId, t]);

  if (!orgId) {
    return null;
  }

  /**
   * Creates a new agenda folder for the current event.
   * Computes the next sequence number based on existing folders
   * and submits the creation request via GraphQL.
   */
  const handleCreate = async (): Promise<void> => {
    const agendaFolders = Array.isArray(
      agendaFolderData?.agendaFoldersByEventId,
    )
      ? agendaFolderData.agendaFoldersByEventId
      : [];

    const maxSequence = agendaFolders.reduce((max, folder) => {
      const sequence = Number.isFinite(folder.sequence) ? folder.sequence : 0;
      return Math.max(max, sequence);
    }, 0);

    try {
      await createAgendaFolder({
        variables: {
          input: {
            name: formState.name.trim(),
            description: formState.description.trim(),
            eventId,
            sequence: maxSequence + 1,
            organizationId: orgId,
          },
        },
      });

      NotificationToast.success(t('agendaFolderCreated') as string);
      setFormState({ name: '', description: '' });
      refetchAgendaFolder();
      hide();
    } catch (err) {
      if (err instanceof Error) {
        NotificationToast.error(err.message);
      }
    }
  };

  return (
    <CreateModal
      open={isOpen}
      onClose={hide}
      title={t('agendaFolderDetails')}
      onSubmit={handleCreate}
      submitDisabled={!formState.name.trim() || !formState.description.trim()}
      data-testid="createAgendaFolderModal"
    >
      <FormTextField
        name="folderName"
        type="text"
        label={t('folderName')}
        placeholder={t('folderNamePlaceholder')}
        value={formState.name}
        onChange={(val) => setFormState((prev) => ({ ...prev, name: val }))}
        required
      />

      <FormTextField
        name="folderDescription"
        type="text"
        label={t('description')}
        placeholder={t('description')}
        value={formState.description}
        onChange={(val) =>
          setFormState((prev) => ({ ...prev, description: val }))
        }
      />
    </CreateModal>
  );
};

export default AgendaFolderCreateModal;
