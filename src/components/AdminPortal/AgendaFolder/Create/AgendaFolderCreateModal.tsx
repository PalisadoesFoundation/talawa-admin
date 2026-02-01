import React, { useEffect, useState } from 'react';
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
 * Modal for creating a new agenda folder.
 */
// translation-check-keyPrefix: agendaSection
const AgendaFolderCreateModal: React.FC<
  InterfaceAgendaFolderCreateModalProps
> = ({ isOpen, hide, eventId, agendaFolderData, t, refetchAgendaFolder }) => {
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
      submitDisabled={!formState.name.trim()}
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
