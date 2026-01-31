import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router';

import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import { CREATE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './AgendaFolderCreateModal.module.css';

import type { InterfaceAgendaFolderCreateModalProps } from 'types/AdminPortal/Agenda/interface';

/**
 * AgendaFolderCreateModal
 *
 * A modal component for creating a new agenda folder within an event.
 * It uses `CRUDModalTemplate` to provide a consistent CRUD-style UI and
 * handles folder creation via a GraphQL mutation.
 *
 * Responsibilities:
 * - Renders a form to capture agenda folder name and description
 * - Computes the next folder sequence based on existing folders
 * - Executes the `CREATE_AGENDA_FOLDER_MUTATION`
 * - Displays success and error notifications
 * - Refetches agenda folder data after successful creation
 * - Prevents rendering when organization context is missing
 *
 * @param isOpen - Controls whether the modal is visible
 * @param hide - Callback to close the modal
 * @param eventId - ID of the event for which the folder is being created
 * @param agendaFolderData - Existing agenda folder data used to calculate sequence
 * @param t - i18n translation function for agenda section
 * @param refetchAgendaFolder - Callback to refetch agenda folder data after creation
 *
 * @returns A JSX element rendering the agenda folder creation modal,
 *          or `null` if the organization ID is unavailable
 */
// translation-check-keyPrefix: agendaSection
const AgendaFolderCreateModal: React.FC<
  InterfaceAgendaFolderCreateModalProps
> = ({ isOpen, hide, eventId, agendaFolderData, t, refetchAgendaFolder }) => {
  const { orgId } = useParams();

  const [createAgendaFolder, { loading }] = useMutation(
    CREATE_AGENDA_FOLDER_MUTATION,
  );

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    creator: {
      name: '',
    },
  });

  useEffect(() => {
    if (!orgId) {
      NotificationToast.error(t('organizationRequired'));
    }
  }, [orgId, t]);

  if (!orgId) {
    return null;
  }

  const createAgendaFolderHandler = async (): Promise<void> => {
    const agendaFolders = Array.isArray(
      agendaFolderData?.agendaFoldersByEventId,
    )
      ? agendaFolderData.agendaFoldersByEventId
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
            eventId,
            sequence: nextSequence,
            organizationId: orgId,
          },
        },
      });

      setFormState({
        id: '',
        name: '',
        description: '',
        creator: {
          name: '',
        },
      });

      hide();
      refetchAgendaFolder();
      NotificationToast.success(t('agendaFolderCreated') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return (
    <CRUDModalTemplate
      open={isOpen}
      onClose={hide}
      title={t('agendaFolderDetails')}
      onPrimary={createAgendaFolderHandler}
      primaryText={t('createAgendaFolder')}
      loading={loading}
      className={`mt-5 ${styles.campaignModal}`}
      data-testid="createAgendaFolderModal"
    >
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
    </CRUDModalTemplate>
  );
};

export default AgendaFolderCreateModal;
