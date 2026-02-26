/**
 * AgendaItemsContainer Component
 *
 * This component is responsible for displaying and managing agenda items.
 * It supports functionalities such as previewing, updating, deleting, and
 * reordering agenda items using drag-and-drop.
 *
 * @param agendaItemConnection - The type of connection for agenda items (e.g., 'Event')
 * @param agendaItemData - Array of agenda item data to display
 * @param agendaItemRefetch - Function to refetch agenda item data after updates
 * @param agendaItemCategories - Array of available agenda item categories
 *
 * @returns Rendered component
 *
 * @remarks
 * Uses `@hello-pangea/dnd` for drag-and-drop functionality.
 * Integrates with `react-toastify` for user notifications.
 * Includes modals for previewing, updating, and deleting agenda items.
 *
 * @example
 * ```tsx
 * <AgendaItemsContainer
 *   agendaItemConnection="Event"
 *   agendaItemData={agendaItems}
 *   agendaItemRefetch={refetchAgendaItems}
 *   agendaItemCategories={categories}
 * />
 * ```
 */
// translation-check-keyPrefix: agendaSection
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { JSX } from 'react';
import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaItemCategoryInfo,
  InterfaceAgendaFolderInfo,
} from 'types/AdminPortal/Agenda/interface';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import AgendaItemsPreviewModal from 'components/AdminPortal/AgendaItems/Preview/AgendaItemsPreviewModal';
import AgendaItemsDeleteModal from 'components/AdminPortal/AgendaItems/Delete/AgendaItemsDeleteModal';
import AgendaItemsUpdateModal from 'components/AdminPortal/AgendaItems/Update/AgendaItemsUpdateModal';
import AgendaFolderDeleteModal from 'components/AdminPortal/AgendaFolder/Delete/AgendaFolderDeleteModal';
import AgendaFolderUpdateModal from './Update/AgendaFolderUpdateModal';
import AgendaDragAndDrop from './DragAndDrop/AgendaDragAndDrop';
import { useMinioDownload } from 'utils/MinioDownload';
import { useParams } from 'react-router';

function AgendaFolderContainer({
  agendaFolderConnection,
  agendaFolderData,
  refetchAgendaFolder,
  agendaItemCategories,
}: {
  agendaFolderConnection: 'Event';
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined;
  refetchAgendaFolder: () => void;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
}): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const { getFileFromMinio } = useMinioDownload();
  const { orgId } = useParams();
  const organizationId = orgId ?? 'organization';

  const agendaItemPreviewModal = useModalState();
  const agendaItemUpdateModal = useModalState();
  const agendaItemDeleteModal = useModalState();
  const agendaFolderDeleteModal = useModalState();
  const agendaFolderUpdateModal = useModalState();

  // State for current agenda item ID and form data
  const [agendaItemId, setAgendaItemId] = useState('');
  const [agendaFolderId, setAgendaFolderId] = useState('');
  const [folder, setFolder] = useState<InterfaceAgendaFolderInfo[]>([]);
  useEffect(() => {
    if (agendaFolderData) {
      setFolder([...agendaFolderData].sort((a, b) => a.sequence - b.sequence));
    } else {
      setFolder([]);
    }
  }, [agendaFolderData]);
  const [folderFormState, setFolderFormState] = useState<{
    id: string;
    name: string;
    description: string;
    creator: {
      id: string;
      name: string;
    };
  }>({
    id: '',
    name: '',
    description: '',
    creator: {
      id: '',
      name: '',
    },
  });
  const [itemFormState, setItemFormState] = useState<{
    id: string;
    name: string;
    description: string;
    duration: string;
    notes: string;
    url: string[];
    folder?: string;
    category: string;
    attachments: {
      name: string;
      objectName: string;
      mimeType: string;
      fileHash: string;
      previewUrl?: string;
    }[];
  }>({
    id: '',
    name: '',
    description: '',
    duration: '',
    notes: '',
    url: [''],
    category: '',
    folder: '',
    attachments: [],
  });
  const [formState, setFormState] = useState<{
    id: string;
    name: string;
    description: string;
    duration: string;
    notes: string;
    attachment?: {
      objectName: string;
      mimeType: string;
      previewUrl: string;
    }[];
    sequence: number;
    category: {
      id: string;
      name: string;
      description: string;
    };
    creator: {
      id: string;
      name: string;
    };
    url: string[];
  }>({
    name: '',
    id: '',
    description: '',
    duration: '',
    notes: '',
    attachment: [],
    sequence: 0,
    category: {
      id: '',
      name: '',
      description: '',
    },
    creator: {
      id: '',
      name: '',
    },
    url: [''],
  });

  /**
   * Shows the preview modal with the details of the selected agenda item.
   * @param agendaItem - The agenda item to preview.
   */
  const showPreviewModal = async (
    agendaItem: InterfaceAgendaItemInfo,
  ): Promise<void> => {
    await setAgendaItemState(agendaItem);
    agendaItemPreviewModal.open();
  };

  /**
   * Handles click event to show the update modal for the selected agenda folder.
   * @param agendaFolder - The agenda folder to update.
   */
  const handleEditFolderClick = (
    agendaFolder: InterfaceAgendaFolderInfo,
  ): void => {
    setAgendaFolderState(agendaFolder);
    agendaFolderUpdateModal.open();
  };

  /**
   * Handles click event to show the update modal for the selected agenda item.
   * @param agendaItem - The agenda item to update.
   */
  const handleItemsEditClick = async (
    agendaItem: InterfaceAgendaItemInfo,
  ): Promise<void> => {
    await setAgendaUpdateItemState(agendaItem);
    agendaItemUpdateModal.open();
  };

  /**
   * Handles click event to show the delete modal for the selected agenda item.
   * @param agendaItem - The agenda item to delete.
   */
  const handleDeleteItemsClick = (
    agendaItem: InterfaceAgendaItemInfo,
  ): void => {
    setAgendaDeleteItemState(agendaItem);
    agendaItemDeleteModal.open();
  };

  /**
   * Sets the state for the selected agenda item.
   * @param agendaItem - The agenda item to update in the state.
   */
  const setAgendaUpdateItemState = async (
    agendaItem: InterfaceAgendaItemInfo,
  ): Promise<void> => {
    const attachmentsWithPreview = await Promise.all(
      (agendaItem.attachments ?? []).map(async (media) => ({
        name: media.name,
        objectName: media.objectName,
        mimeType: media.mimeType,
        fileHash: media.fileHash,
        previewUrl: await getFileFromMinio(media.objectName, organizationId),
      })),
    );

    setItemFormState({
      id: agendaItem.id,
      name: agendaItem.name,
      description: agendaItem.description,
      duration: agendaItem.duration,
      notes: agendaItem.notes,
      attachments: attachmentsWithPreview,
      category: agendaItem.category?.id ?? '',
      folder: agendaItem.folder?.id,
      url: agendaItem.url?.map((u) => u.url) ?? [],
    });

    setAgendaItemId(agendaItem.id);
  };

  /**
   * Sets the state for the selected agenda item.
   * @param agendaItem - The agenda item to update in the state.
   */
  const setAgendaDeleteItemState = (
    agendaItem: InterfaceAgendaItemInfo,
  ): void => {
    setAgendaItemId(agendaItem.id);
  };

  /**
   * Sets the state for the selected agenda item.
   * @param agendaItem - The agenda item to set in the state.
   */
  const setAgendaItemState = async (
    agendaItem: InterfaceAgendaItemInfo,
  ): Promise<void> => {
    const attachments = agendaItem.attachments ?? [];
    const attachmentsWithPreview = await Promise.all(
      attachments.map(async (att) => ({
        objectName: att.objectName,
        mimeType: att.mimeType,
        previewUrl: await getFileFromMinio(att.objectName, organizationId),
      })),
    );

    setFormState({
      id: agendaItem.id,
      name: agendaItem.name,
      description: agendaItem.description,
      duration: agendaItem.duration,
      notes: agendaItem.notes,
      attachment: attachmentsWithPreview,
      sequence: agendaItem.sequence,
      category: agendaItem.category
        ? {
            id: agendaItem.category.id,
            name: agendaItem.category.name,
            description: agendaItem.category.description,
          }
        : {
            id: '',
            name: t('noCategory'),
            description: '',
          },
      url: agendaItem.url?.map((u) => u.url) ?? [],
      creator: {
        id: agendaItem.creator.id,
        name: agendaItem.creator.name,
      },
    });

    setAgendaItemId(agendaItem.id);
  };

  const setAgendaFolderState = (
    agendaFolder: InterfaceAgendaFolderInfo,
  ): void => {
    setFolderFormState({
      ...folderFormState,
      name: agendaFolder.name,
      description: agendaFolder.description || '',
      creator: {
        id: agendaFolder.id,
        name: agendaFolder.name,
      },
    });
    setAgendaFolderId(agendaFolder.id);
  };

  return (
    <>
      <AgendaDragAndDrop
        folders={folder}
        setFolders={setFolder}
        agendaFolderConnection={agendaFolderConnection}
        refetchAgendaFolder={refetchAgendaFolder}
        t={t}
        onEditFolder={handleEditFolderClick}
        onDeleteFolder={(f) => {
          setAgendaFolderState(f);
          agendaFolderDeleteModal.open();
        }}
        onPreviewItem={showPreviewModal}
        onEditItem={handleItemsEditClick}
        onDeleteItem={handleDeleteItemsClick}
      />
      {/*Agenda Folder Delete modal */}
      <AgendaFolderDeleteModal
        isOpen={agendaFolderDeleteModal.isOpen}
        onClose={agendaFolderDeleteModal.close}
        agendaFolderId={agendaFolderId}
        refetchAgendaFolder={refetchAgendaFolder}
      />
      {/*Agenda Folder Update modal */}
      <AgendaFolderUpdateModal
        isOpen={agendaFolderUpdateModal.isOpen}
        onClose={agendaFolderUpdateModal.close}
        folderFormState={folderFormState}
        setFolderFormState={setFolderFormState}
        agendaFolderId={agendaFolderId}
        refetchAgendaFolder={refetchAgendaFolder}
      />
      <AgendaItemsPreviewModal
        isOpen={agendaItemPreviewModal.isOpen}
        hidePreviewModal={agendaItemPreviewModal.close}
        formState={formState}
      />
      {/*Agenda Item Update modal */}
      <AgendaItemsUpdateModal
        isOpen={agendaItemUpdateModal.isOpen}
        onClose={agendaItemUpdateModal.close}
        agendaItemId={agendaItemId}
        itemFormState={itemFormState}
        setItemFormState={setItemFormState}
        agendaItemCategories={agendaItemCategories}
        agendaFolderData={agendaFolderData}
        refetchAgendaFolder={refetchAgendaFolder}
      />
      {/*Agenda Item Delete modal */}
      <AgendaItemsDeleteModal
        isOpen={agendaItemDeleteModal.isOpen}
        onClose={agendaItemDeleteModal.close}
        agendaItemId={agendaItemId}
        refetchAgendaFolder={refetchAgendaFolder}
      />
    </>
  );
}

export default AgendaFolderContainer;
