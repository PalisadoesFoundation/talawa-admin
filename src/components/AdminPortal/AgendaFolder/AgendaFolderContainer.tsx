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
import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { DropResult } from '@hello-pangea/dnd';
import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaItemCategoryInfo,
  InterfaceAgendaFolderInfo,
} from 'types/AdminPortal/Agenda/interface';
import { useAgendaMutations } from './Mutation/useAgendaMutation';
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
  t,
}: {
  agendaFolderConnection: 'Event';
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined;
  refetchAgendaFolder: () => void;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
  t: (key: string) => string;
}): JSX.Element {
  const { t: tCommon } = useTranslation('common');
  const { getFileFromMinio } = useMinioDownload();
  const { orgId } = useParams();
  const organizationId = orgId ?? 'organization';

  // State for modals
  const [agendaItemPreviewModalIsOpen, setAgendaItemPreviewModalIsOpen] =
    useState(false);
  const [agendaItemUpdateModalIsOpen, setAgendaItemUpdateModalIsOpen] =
    useState(false);
  const [agendaItemDeleteModalIsOpen, setAgendaItemDeleteModalIsOpen] =
    useState(false);

  // State for current agenda item ID and form data
  const [agendaItemId, setAgendaItemId] = useState('');
  const [agendaFolderId, setAgendaFolderId] = useState('');
  const [folder, setFolder] = useState<InterfaceAgendaFolderInfo[]>([]);
  const [agendaFolderDeleteModalIsOpen, setAgendaFolderDeleteModalIsOpen] =
    useState<boolean>(false);
  const [agendaFolderUpdateModalIsOpen, setAgendaFolderUpdateModalIsOpen] =
    useState<boolean>(false);
  useEffect(() => {
    if (agendaFolderData) {
      setFolder([...agendaFolderData].sort((a, b) => a.sequence - b.sequence));
    }
  }, [agendaFolderData]);
  const getSortedItems = useCallback(
    (agendaFolder: InterfaceAgendaFolderInfo) =>
      [...agendaFolder.items.edges]
        .map((e) => e.node)
        .sort((a, b) => a.sequence - b.sequence),
    [],
  );
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
    url: string[];
    folder?: string;
    category: string;
    attachments: {
      name: string;
      objectName: string;
      mimeType: string;
      fileHash: string;
      preview?: string;
    }[];
  }>({
    id: '',
    name: '',
    description: '',
    duration: '',
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

  const {
    updateAgendaItemHandler,
    deleteAgendaItemHandler,
    updateAgendaFolderHandler,
    deleteAgendaFolderHandler,
    updateAgendaItemSequenceHandler,
    updateAgendaFolderSequenceHandler,
  } = useAgendaMutations({
    refetchAgendaFolder,
    t,
  });

  /**
   * Shows the preview modal with the details of the selected agenda item.
   * @param agendaItem - The agenda item to preview.
   */
  const showPreviewModal = async (
    agendaItem: InterfaceAgendaItemInfo,
  ): Promise<void> => {
    await setAgendaItemState(agendaItem);
    setAgendaItemPreviewModalIsOpen(true);
  };

  /**
   * Hides the preview modal.
   */
  const hidePreviewModal = (): void => {
    setAgendaItemPreviewModalIsOpen(false);
  };

  /**
   * Toggles the visibility of the update modal.
   */
  const showUpdateModal = (): void => {
    setAgendaFolderUpdateModalIsOpen(!agendaFolderUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the update modal.
   */
  const hideUpdateModal = (): void => {
    setAgendaFolderUpdateModalIsOpen(!agendaFolderUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the update modal of agenda item.
   */
  const showUpdateItemModal = (): void => {
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the update modal of items.
   */
  const hideUpdateItemModal = (): void => {
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the delete modal of folders.
   */
  const toggleDeleteModal = (): void => {
    setAgendaFolderDeleteModalIsOpen(!agendaFolderDeleteModalIsOpen);
  };

  /**
   * Toggles the visibility of the delete modal of agenda items.
   */
  const toggleDeleteItemModal = (): void => {
    setAgendaItemDeleteModalIsOpen(!agendaItemDeleteModalIsOpen);
  };

  /**
   * Handles click event to show the update modal for the selected agenda folder.
   * @param agendaFolder - The agenda folder to update.
   */
  const handleEditFolderClick = (
    agendaFolder: InterfaceAgendaFolderInfo,
  ): void => {
    setAgendaFolderState(agendaFolder);
    showUpdateModal();
  };

  /**
   * Handles click event to show the update modal for the selected agenda item.
   * @param agendaItem - The agenda item to update.
   */
  const handleItemsEditClick = async (
    agendaItem: InterfaceAgendaItemInfo,
  ): Promise<void> => {
    await setAgendaUpdateItemState(agendaItem);
    showUpdateItemModal();
  };

  /**
   * Handles click event to show the delete modal for the selected agenda item.
   * @param agendaItem - The agenda item to delete.
   */
  const handleDeleteItemsClick = (
    agendaItem: InterfaceAgendaItemInfo,
  ): void => {
    setAgendaDeleteItemState(agendaItem);
    toggleDeleteItemModal();
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
      attachments: attachmentsWithPreview,
      category: agendaItem.category.id,
      folder: agendaItem.folder?.id,
      url: agendaItem.url.map((u) => u.url) ?? [],
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
      attachment: attachmentsWithPreview,
      sequence: agendaItem.sequence,
      category: {
        id: agendaItem.category.id,
        name: agendaItem.category.name,
        description: agendaItem.category.description,
      },
      url: agendaItem.url.map((u) => u.url),
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

  /**
   * Handles the end of a drag-and-drop operation.
   * @param result - The result of the drag-and-drop operation.
   */
  const onItemDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;

    // Dropped outside
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) return;

    if (source.index === destination.index) return;

    const folderId = source.droppableId.replace('agenda-items-', '');
    const targetFolder = folder.find((f) => f.id === folderId);
    if (!targetFolder) return;

    const items = getSortedItems(targetFolder);

    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);

    await updateAgendaItemSequenceHandler(items);
  };

  /**
   * Handles the end of a drag-and-drop operation.
   * @param result - The result of the drag-and-drop operation.
   */
  const onFolderDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }

    const updatedFolders = Array.from(folder);
    const [moved] = updatedFolders.splice(result.source.index, 1);
    updatedFolders.splice(result.destination.index, 0, moved);
    setFolder(updatedFolders);

    await updateAgendaFolderSequenceHandler(updatedFolders);
  };

  return (
    <>
      <AgendaDragAndDrop
        folders={folder}
        agendaFolderConnection={agendaFolderConnection}
        t={t}
        onFolderDragEnd={onFolderDragEnd}
        onItemDragEnd={onItemDragEnd}
        onEditFolder={handleEditFolderClick}
        onDeleteFolder={(f) => {
          setAgendaFolderState(f);
          toggleDeleteModal();
        }}
        onPreviewItem={showPreviewModal}
        onEditItem={handleItemsEditClick}
        onDeleteItem={handleDeleteItemsClick}
      />
      {/*Agenda Folder Delete modal */}
      <AgendaFolderDeleteModal
        agendaFolderDeleteModalIsOpen={agendaFolderDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        deleteAgendaFolderHandler={() =>
          deleteAgendaFolderHandler(agendaFolderId, toggleDeleteModal)
        }
        t={t}
        tCommon={tCommon}
      />
      {/*Agenda Folder Update modal */}
      <AgendaFolderUpdateModal
        agendaFolderUpdateModalIsOpen={agendaFolderUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        folderFormState={folderFormState}
        setFolderFormState={setFolderFormState}
        updateAgendaFolderHandler={(e) =>
          updateAgendaFolderHandler(
            e,
            agendaFolderId,
            folderFormState,
            hideUpdateModal,
          )
        }
        t={t}
      />
      <AgendaItemsPreviewModal
        agendaItemPreviewModalIsOpen={agendaItemPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateItemModal={showUpdateItemModal}
        toggleDeleteItemModal={toggleDeleteItemModal}
        formState={formState}
        t={t}
      />
      {/*Agenda Item Update modal */}
      <AgendaItemsUpdateModal
        agendaItemUpdateModalIsOpen={agendaItemUpdateModalIsOpen}
        hideUpdateItemModal={hideUpdateItemModal}
        itemFormState={itemFormState}
        setItemFormState={setItemFormState}
        updateAgendaItemHandler={(e) =>
          updateAgendaItemHandler(
            e,
            agendaItemId,
            itemFormState,
            hideUpdateItemModal,
          )
        }
        t={t}
        agendaItemCategories={agendaItemCategories}
        agendaFolderData={agendaFolderData}
      />
      {/*Agenda Item Delete modal */}
      <AgendaItemsDeleteModal
        agendaItemDeleteModalIsOpen={agendaItemDeleteModalIsOpen}
        toggleDeleteItemModal={toggleDeleteItemModal}
        deleteAgendaItemHandler={() =>
          deleteAgendaItemHandler(agendaItemId, toggleDeleteItemModal)
        }
        t={t}
        tCommon={tCommon}
      />
    </>
  );
}

export default AgendaFolderContainer;
