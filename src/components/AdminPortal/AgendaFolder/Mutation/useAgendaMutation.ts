import { useMutation } from '@apollo/client';
import type { ChangeEvent, FormEvent } from 'react';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import {
  DELETE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_FOLDER_MUTATION,
  UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
} from 'GraphQl/Mutations/mutations';

import { DELETE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/AgendaFolderMutations';

import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaFolderInfo,
} from 'types/AdminPortal/Agenda/interface';

interface InterfaceUseAgendaMutationsProps {
  refetchAgendaFolder: () => void;
  t: (key: string) => string;
}

// translation-check-keyPrefix: agendaSection
export function useAgendaMutations({
  refetchAgendaFolder,
  t,
}: InterfaceUseAgendaMutationsProps) {
  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);
  const [deleteAgendaItem] = useMutation(DELETE_AGENDA_ITEM_MUTATION);
  const [updateAgendaFolder] = useMutation(UPDATE_AGENDA_FOLDER_MUTATION);
  const [deleteAgendaFolder] = useMutation(DELETE_AGENDA_FOLDER_MUTATION);
  const [updateAgendaItemSequence] = useMutation(
    UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
  );

  /**
   * Updates an agenda item.
   */
  const updateAgendaItemHandler = async (
    e: FormEvent<HTMLFormElement>,
    agendaItemId: string,
    itemFormState: {
      name: string;
      description: string;
      duration: string;
      folder?: string;
      url: string[];
    },
    onSuccess?: () => void,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await updateAgendaItem({
        variables: {
          input: {
            id: agendaItemId,
            name: itemFormState.name?.trim() || undefined,
            description: itemFormState.description?.trim() || undefined,
            duration: itemFormState.duration?.trim() || undefined,
            folderId: itemFormState.folder || undefined,
            url:
              itemFormState.url?.length > 0
                ? itemFormState.url.map((u) => ({ url: u }))
                : undefined,
          },
        },
      });

      refetchAgendaFolder();
      onSuccess?.();
      NotificationToast.success(t('agendaItemUpdated') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Deletes an agenda item.
   */
  const deleteAgendaItemHandler = async (
    agendaItemId: string,
    onSuccess?: () => void,
  ): Promise<void> => {
    try {
      await deleteAgendaItem({
        variables: {
          input: { id: agendaItemId },
        },
      });

      refetchAgendaFolder();
      onSuccess?.();
      NotificationToast.success(t('agendaItemDeleted') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Updates an agenda folder.
   */
  const updateAgendaFolderHandler = async (
    event: ChangeEvent<HTMLFormElement>,
    agendaFolderId: string,
    folderFormState: {
      name: string;
      description: string;
    },
    onSuccess?: () => void,
  ): Promise<void> => {
    event.preventDefault();

    try {
      await updateAgendaFolder({
        variables: {
          input: {
            id: agendaFolderId,
            name: folderFormState.name?.trim() || undefined,
            description: folderFormState.description?.trim() || undefined,
          },
        },
      });

      refetchAgendaFolder();
      onSuccess?.();
      NotificationToast.success(t('agendaFolderUpdated') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(t('agendaFolderUpdateFailed') as string);
      }
    }
  };

  /**
   * Deletes an agenda folder.
   */
  const deleteAgendaFolderHandler = async (
    agendaFolderId: string,
    onSuccess?: () => void,
  ): Promise<void> => {
    try {
      await deleteAgendaFolder({
        variables: {
          input: { id: agendaFolderId },
        },
      });

      refetchAgendaFolder();
      onSuccess?.();
      NotificationToast.success(t('agendaFolderDeleted') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Updates agenda item sequence after drag-and-drop.
   */
  const updateAgendaItemSequenceHandler = async (
    items: InterfaceAgendaItemInfo[],
  ): Promise<void> => {
    try {
      await Promise.all(
        items.map((item, index) => {
          const newSequence = index + 1;

          if (item.sequence !== newSequence) {
            return updateAgendaItemSequence({
              variables: {
                input: {
                  id: item.id,
                  sequence: newSequence,
                },
              },
            });
          }

          return Promise.resolve();
        }),
      );

      NotificationToast.success(t('itemSequenceUpdateSuccessMsg') as string);
      refetchAgendaFolder();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Updates agenda folder sequence after drag-and-drop.
   */
  const updateAgendaFolderSequenceHandler = async (
    folders: InterfaceAgendaFolderInfo[],
  ): Promise<void> => {
    try {
      await Promise.all(
        folders.map((folder, index) => {
          if (folder.sequence !== index + 1) {
            return updateAgendaFolder({
              variables: {
                input: {
                  id: folder.id,
                  sequence: index + 1,
                },
              },
            });
          }

          return Promise.resolve();
        }),
      );

      NotificationToast.success(t('sectionSequenceUpdateSuccessMsg') as string);
      refetchAgendaFolder();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  return {
    updateAgendaItemHandler,
    deleteAgendaItemHandler,
    updateAgendaFolderHandler,
    deleteAgendaFolderHandler,
    updateAgendaItemSequenceHandler,
    updateAgendaFolderSequenceHandler,
  };
}
