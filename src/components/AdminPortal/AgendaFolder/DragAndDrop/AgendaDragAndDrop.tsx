import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import Button from 'shared-components/Button';
import styles from './AgendaDragAndDrop.module.css';
import type { InterfaceAgendaDragAndDropProps } from 'types/AdminPortal/Agenda/interface';
import { useMutation } from '@apollo/client';
import {
  UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
  UPDATE_AGENDA_FOLDER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';

/**
 * AgendaDragAndDrop
 *
 * Renders draggable agenda folders and items with support for reordering.
 * Handles folder-level and item-level drag-and-drop with optimistic UI updates
 * and backend sequence synchronization.
 *
 * @param folders - List of agenda folders with their items
 * @param setFolders - State updater for agenda folders
 * @param agendaFolderConnection - Context in which agenda folders are rendered
 * @param t - i18n translation function
 * @param onEditFolder - Callback to edit an agenda folder
 * @param onDeleteFolder - Callback to delete an agenda folder
 * @param onPreviewItem - Callback to preview an agenda item
 * @param onEditItem - Callback to edit an agenda item
 * @param onDeleteItem - Callback to delete an agenda item
 * @param refetchAgendaFolder - Refetches agenda folder data after updates
 *
 * @returns JSX.Element
 */
// translation-check-keyPrefix: agendaSection
export default function AgendaDragAndDrop({
  folders,
  setFolders,
  agendaFolderConnection,
  onEditFolder,
  onDeleteFolder,
  onPreviewItem,
  onEditItem,
  onDeleteItem,
  refetchAgendaFolder,
}: InterfaceAgendaDragAndDropProps) {
  const [updateAgendaItemSequence] = useMutation(
    UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
  );
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });

  const [updateAgendaFolder] = useMutation(UPDATE_AGENDA_FOLDER_MUTATION);
  /**
   * Prevent concurrent drag mutations
   */
  const isMutatingRef = React.useRef(false);

  /**
   * Handles reordering of agenda items within the same folder.
   * Applies optimistic UI updates and syncs sequence changes to the backend.
   */
  const handleItemReorder = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (source.index === destination.index) return;

    const folderId = source.droppableId.replace('agenda-items-', '');
    const folderIndex = folders.findIndex((f) => f.id === folderId);
    if (folderIndex === -1) return;

    const previousFolders = [...folders];
    const updatedFolders = [...folders];

    const items = [...updatedFolders[folderIndex].items.edges]
      .map((e) => e.node)
      .sort((a, b) => a.sequence - b.sequence);

    const originalSequences = new Map(
      items.map((item) => [item.id, item.sequence]),
    );

    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);

    const reorderedItems = items.map((item, index) => ({
      ...item,
      sequence: index + 1,
    }));

    updatedFolders[folderIndex] = {
      ...updatedFolders[folderIndex],
      items: {
        ...updatedFolders[folderIndex].items,
        edges: reorderedItems.map((item) => ({ node: item })),
      },
    };

    setFolders(updatedFolders);

    try {
      await Promise.all(
        reorderedItems
          .filter((item) => originalSequences.get(item.id) !== item.sequence)
          .map((item) =>
            updateAgendaItemSequence({
              variables: {
                input: {
                  id: item.id,
                  sequence: item.sequence,
                },
              },
            }),
          ),
      );

      NotificationToast.success(t('itemSequenceUpdateSuccessMsg'));
      refetchAgendaFolder();
    } catch (error) {
      setFolders(previousFolders);
      refetchAgendaFolder();
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Handles reordering of agenda folders.
   * Applies optimistic UI updates and synchronizes folder sequence
   * changes with the backend.
   */
  const handleFolderReorder = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.index === destination.index) return;

    const previousFolders = Array.from(folders);
    const updatedFolders = Array.from(folders);

    const [moved] = updatedFolders.splice(source.index, 1);
    updatedFolders.splice(destination.index, 0, moved);

    setFolders(updatedFolders);

    try {
      const updates = updatedFolders
        .map((folder, index) => ({ folder, index }))
        .filter(({ folder, index }) => folder.sequence !== index + 1)
        .map(({ folder, index }) =>
          updateAgendaFolder({
            variables: {
              input: {
                id: folder.id,
                sequence: index + 1,
              },
            },
          }),
        );

      await Promise.all(updates);

      NotificationToast.success(t('sectionSequenceUpdateSuccessMsg'));
      refetchAgendaFolder();
    } catch (error) {
      setFolders(previousFolders);
      refetchAgendaFolder();
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Unified drag handler
   * Drag events are serialized; optimistic updates with rollback prevent race conditions.
   */
  const handleDragEnd = async (result: DropResult): Promise<void> => {
    if (isMutatingRef.current) return;
    isMutatingRef.current = true;

    try {
      const { destination, source, type } = result;

      if (!destination) return;

      if (
        destination.index === source.index &&
        destination.droppableId === source.droppableId
      )
        return;

      if (type === 'ITEM') {
        await handleItemReorder(result);
        return;
      }

      if (type === 'FOLDER') {
        await handleFolderReorder(result);
        return;
      }
    } finally {
      isMutatingRef.current = false;
    }
  };

  const getDraggingClass = (isDragging: boolean): string =>
    isDragging ? styles.dragging : '';

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* FOLDERS */}
        <Droppable droppableId="agendaFolder" type="FOLDER">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.folderContainerAgendaDragAndDrop}
            >
              {folders.map((agendaFolder, index) => {
                const isDefault = agendaFolder.isDefaultFolder;

                return (
                  <Draggable
                    key={agendaFolder.id}
                    draggableId={agendaFolder.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${styles.agendaItemRow} ${getDraggingClass(
                          snapshot.isDragging,
                        )} ${styles.folderCardAgendaDragAndDrop}`}
                      >
                        {/* Folder header */}
                        <div className={styles.folderHeaderAgendaDragAndDrop}>
                          <div
                            className={
                              styles.folderDragHandleColumnAgendaDragAndDrop
                            }
                          >
                            <span
                              {...provided.dragHandleProps}
                              className={styles.dragHandleAgendaDragAndDrop}
                            >
                              ☰
                            </span>
                          </div>

                          <div
                            className={styles.folderNameColumnAgendaDragAndDrop}
                          >
                            <span className={styles.categoryChip}>
                              {agendaFolder.name}
                            </span>
                          </div>

                          <div
                            className={
                              styles.folderDescriptionColumnAgendaDragAndDrop
                            }
                          >
                            <span className={styles.categoryChip}>
                              {agendaFolder.description}
                            </span>
                          </div>

                          <div
                            className={
                              styles.folderActionsColumnAgendaDragAndDrop
                            }
                          >
                            <div
                              className={
                                styles.folderActionButtonsAgendaDragAndDrop
                              }
                            >
                              <Button
                                size="sm"
                                disabled={isDefault}
                                variant="outline-secondary"
                                onClick={() => onEditFolder(agendaFolder)}
                                aria-label={t('editFolder')}
                              ></Button>
                              <Button
                                size="sm"
                                disabled={isDefault}
                                variant="danger"
                                onClick={() => onDeleteFolder(agendaFolder)}
                                aria-label={t('deleteFolder')}
                              ></Button>
                            </div>
                          </div>
                        </div>

                        <div
                          className={
                            agendaFolderConnection === 'Event'
                              ? styles.folderSpacerEventAgendaDragAndDrop
                              : styles.folderSpacerDefaultAgendaDragAndDrop
                          }
                        />

                        {/* Table head */}
                        <div
                          className={`${styles.tableShellAgendaDragAndDrop} ${
                            agendaFolderConnection === 'Event'
                              ? styles.tableShellEventAgendaDragAndDrop
                              : styles.tableShellDefaultAgendaDragAndDrop
                          }`}
                        >
                          <div
                            className={`${styles.tableHeadAgendaItems} ${styles.tableHeadRowAgendaDragAndDrop}`}
                          >
                            <div
                              className={
                                styles.tableHeadSequenceAgendaDragAndDrop
                              }
                            >
                              {t('sequence')}
                            </div>
                            <div
                              className={styles.tableHeadTitleAgendaDragAndDrop}
                            >
                              {t('title')}
                            </div>
                            <div
                              className={
                                styles.tableHeadCategoryAgendaDragAndDrop
                              }
                            >
                              {t('category')}
                            </div>
                            <div
                              className={
                                styles.tableHeadDescriptionAgendaDragAndDrop
                              }
                            >
                              {t('description')}
                            </div>
                            <div
                              className={
                                styles.tableHeadDurationAgendaDragAndDrop
                              }
                            >
                              {t('duration')}
                            </div>
                            <div
                              className={
                                styles.tableHeadOptionsAgendaDragAndDrop
                              }
                            >
                              {t('options')}
                            </div>
                          </div>
                        </div>

                        {/* ITEMS */}
                        <Droppable
                          // i18n-ignore-next-line
                          droppableId={`agenda-items-${agendaFolder.id}`}
                          type="ITEM"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={styles.itemsContainerAgendaDragAndDrop}
                            >
                              {/* EMPTY STATE */}
                              {agendaFolder.items.edges.length === 0 && (
                                <div
                                  className={styles.emptyStateAgendaDragAndDrop}
                                >
                                  {t('noAgendaItems')}
                                </div>
                              )}

                              {[...agendaFolder.items.edges]
                                .map((edge) => edge.node)
                                .sort((a, b) => a.sequence - b.sequence)
                                .map((agendaItem, index) => (
                                  <Draggable
                                    key={agendaItem.id}
                                    draggableId={agendaItem.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`${styles.agendaItemRow} ${getDraggingClass(
                                          snapshot.isDragging,
                                        )}`}
                                      >
                                        <div
                                          className={
                                            styles.itemRowInnerAgendaDragAndDrop
                                          }
                                        >
                                          <div
                                            className={
                                              styles.itemDragHandleColumnAgendaDragAndDrop
                                            }
                                          >
                                            <span
                                              {...provided.dragHandleProps}
                                              className={
                                                styles.itemDragHandleAgendaDragAndDrop
                                              }
                                            >
                                              ☰
                                            </span>
                                          </div>

                                          <div
                                            className={
                                              styles.itemNameColumnAgendaDragAndDrop
                                            }
                                          >
                                            {agendaItem.name}
                                          </div>

                                          <div
                                            className={
                                              styles.itemCategoryColumnAgendaDragAndDrop
                                            }
                                          >
                                            {agendaItem.category?.name ??
                                              t('noCategory')}
                                          </div>

                                          <div
                                            className={
                                              styles.itemDescriptionColumnAgendaDragAndDrop
                                            }
                                          >
                                            {agendaItem.description}
                                          </div>

                                          <div
                                            className={
                                              styles.itemDurationColumnAgendaDragAndDrop
                                            }
                                          >
                                            {agendaItem.duration ?? '-'}
                                          </div>

                                          <div
                                            className={
                                              styles.itemActionsColumnAgendaDragAndDrop
                                            }
                                          >
                                            <Button
                                              size="sm"
                                              variant="outline-secondary"
                                              onClick={() =>
                                                onPreviewItem(agendaItem)
                                              }
                                              aria-label={t('previewItem')}
                                            >
                                              ℹ
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline-secondary"
                                              onClick={() =>
                                                onEditItem(agendaItem)
                                              }
                                              aria-label={t('editItem')}
                                            ></Button>
                                            <Button
                                              size="sm"
                                              variant="danger"
                                              onClick={() =>
                                                onDeleteItem(agendaItem)
                                              }
                                              aria-label={t('deleteItem')}
                                            ></Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}

                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ErrorBoundaryWrapper>
  );
}
