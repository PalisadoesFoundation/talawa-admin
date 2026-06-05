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
  t,
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
              style={{
                margin: '0 1.5rem',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '1rem',
              }}
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
                        )}`}
                        style={{
                          padding: '1rem 1.5rem',
                          marginBottom: '1.5rem',
                          borderRadius: '1rem',
                        }}
                      >
                        {/* Folder header */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              textAlign: 'center',
                              alignSelf: 'center',
                              flex: '0 0 auto',
                              width: '8%',
                            }}
                          >
                            <span
                              {...provided.dragHandleProps}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'grab',
                              }}
                            >
                              ☰
                            </span>
                          </div>

                          <div
                            style={{
                              textAlign: 'start',
                              alignSelf: 'center',
                              flex: '1 1 auto',
                            }}
                          >
                            <span className={styles.categoryChip}>
                              {agendaFolder.name}
                            </span>
                          </div>

                          <div
                            style={{
                              textAlign: 'start',
                              alignSelf: 'center',
                              flex: '2 1 auto',
                            }}
                          >
                            <span className={styles.categoryChip}>
                              {agendaFolder.description}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignSelf: 'center',
                              flex: '1 1 auto',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                          style={{
                            margin: `${agendaFolderConnection === 'Event' ? '1.5rem' : '0'} 0.25rem`,
                          }}
                        />

                        {/* Table head */}
                        <div
                          style={{
                            boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
                            margin:
                              agendaFolderConnection === 'Event'
                                ? '0 1.5rem'
                                : '0',
                          }}
                        >
                          <div
                            className={styles.tableHeadAgendaItems}
                            style={{
                              display: 'flex',
                              margin: '0',
                              border: '1px solid #dee2e6',
                              padding: '1rem 0',
                            }}
                          >
                            <div
                              style={{
                                flex: '0 0 8.33%',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              {t('sequence')}
                            </div>
                            <div
                              style={{
                                flex: '0 0 16.67%',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              {t('title')}
                            </div>
                            <div
                              style={{
                                flex: '0 0 16.67%',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              {t('category')}
                            </div>
                            <div
                              style={{
                                flex: '0 0 25%',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              {t('description')}
                            </div>
                            <div
                              style={{
                                flex: '0 0 16.67%',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              {t('duration')}
                            </div>
                            <div
                              style={{
                                flex: '0 0 16.67%',
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
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
                              style={{
                                backgroundColor: '#fcfcfd',
                                border: '1px solid #dee2e6',
                                borderTop: 'none',
                                boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
                                margin: '0 1.5rem',
                              }}
                            >
                              {/* EMPTY STATE */}
                              {agendaFolder.items.edges.length === 0 && (
                                <div
                                  style={{
                                    padding: '1rem 0',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    color: '#adb5bd',
                                  }}
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
                                        style={{ padding: '0.5rem 0' }}
                                      >
                                        <div
                                          style={{
                                            display: 'flex',
                                            margin: '1rem',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <div
                                            style={{
                                              flex: '0 0 8.33%',
                                              textAlign: 'center',
                                            }}
                                          >
                                            <span
                                              {...provided.dragHandleProps}
                                              style={{ cursor: 'grab' }}
                                            >
                                              ☰
                                            </span>
                                          </div>

                                          <div
                                            style={{
                                              flex: '0 0 16.67%',
                                              textAlign: 'center',
                                            }}
                                          >
                                            {agendaItem.name}
                                          </div>

                                          <div
                                            style={{
                                              flex: '0 0 16.67%',
                                              textAlign: 'center',
                                            }}
                                          >
                                            {agendaItem.category?.name ??
                                              t('noCategory')}
                                          </div>

                                          <div
                                            style={{
                                              flex: '0 0 25%',
                                              textAlign: 'center',
                                            }}
                                          >
                                            {agendaItem.description}
                                          </div>

                                          <div
                                            style={{
                                              flex: '0 0 16.67%',
                                              textAlign: 'center',
                                            }}
                                          >
                                            {agendaItem.duration ?? '-'}
                                          </div>

                                          <div
                                            style={{
                                              flex: '0 0 16.67%',
                                              display: 'flex',
                                              justifyContent: 'center',
                                              gap: '0.5rem',
                                            }}
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
