import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { Col, Row } from 'react-bootstrap';
import Button from 'shared-components/Button';
import styles from './AgendaDragAndDrop.module.css';
import type { InterfaceAgendaDragAndDropProps } from 'types/AdminPortal/Agenda/interface';
import { useMutation } from '@apollo/client';
import {
  UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
  UPDATE_AGENDA_FOLDER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

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
  const [updateAgendaFolder] = useMutation(UPDATE_AGENDA_FOLDER_MUTATION);

  const onItemDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return;
    if (source.index === destination.index) return;

    const folderId = source.droppableId.replace('agenda-items-', '');
    const folderIndex = folders.findIndex((f) => f.id === folderId);
    if (folderIndex === -1) return;

    const previousFolders = folders;
    const updatedFolders = [...folders];

    const items = updatedFolders[folderIndex].items.edges.map((e) => e.node);

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
        reorderedItems.map((item) =>
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
    } catch (error) {
      setFolders(previousFolders);
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  const onFolderDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const previousFolders = Array.from(folders);
    const updatedFolders = Array.from(folders);
    const [moved] = updatedFolders.splice(result.source.index, 1);
    updatedFolders.splice(result.destination.index, 0, moved);
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
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Unified drag handler for both folder and item reordering.
   * Routes behavior based on droppable type.
   */
  const handleDragEnd = async (result: DropResult): Promise<void> => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    if (type === 'ITEM') {
      await onItemDragEnd(result);
      return;
    }

    if (type === 'FOLDER') {
      await onFolderDragEnd(result);
    }
  };

  const getRoundedBottomClass = (isEvent: boolean): string =>
    isEvent ? 'rounded-bottom-4 mx-4' : 'rounded-bottom-2 mx-0';

  const getRoundedTopClass = (isEvent: boolean): string =>
    isEvent ? 'rounded-top-4' : 'rounded-top-2';

  const getDraggingClass = (isDragging: boolean): string =>
    isDragging ? styles.dragging : '';

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* FOLDERS */}
      <Droppable droppableId="agendaFolder" type="FOLDER">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mx-4 bg-light p-3"
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
                      )} py-3 mb-4 px-4`}
                    >
                      {/* Folder header */}
                      <Row>
                        <Col
                          xs={6}
                          sm={4}
                          md={2}
                          lg={2}
                          className="text-center align-self-center"
                        >
                          <span
                            {...provided.dragHandleProps}
                            className="d-inline-flex align-items-center cursor-grab"
                          >
                            <i className="fas fa-bars fa-sm" />
                          </span>
                        </Col>

                        <Col
                          xs={6}
                          sm={4}
                          md={2}
                          lg={1}
                          className="text-center align-self-center"
                        >
                          <span className={styles.categoryChip}>
                            {agendaFolder.name}
                          </span>
                        </Col>

                        <Col
                          xs={12}
                          sm={4}
                          md={2}
                          lg={9}
                          className="d-flex justify-content-end align-self-center"
                        >
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              disabled={isDefault}
                              variant="outline-secondary"
                              onClick={() => onEditFolder(agendaFolder)}
                              aria-label={t('editFolder')}
                            >
                              <i className="fas fa-edit fa-sm" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={isDefault}
                              variant="danger"
                              onClick={() => onDeleteFolder(agendaFolder)}
                              aria-label={t('deleteFolder')}
                            >
                              <i className="fas fa-trash" />
                            </Button>
                          </div>
                        </Col>
                      </Row>

                      <div
                        className={`mx-1 ${
                          agendaFolderConnection === 'Event' ? 'my-4' : 'my-0'
                        }`}
                      />

                      {/* Table head */}
                      <div
                        className={`shadow-sm ${getRoundedTopClass(
                          agendaFolderConnection === 'Event',
                        )} ${agendaFolderConnection === 'Event' ? 'mx-4' : 'mx-0'}`}
                      >
                        <Row
                          className={`${styles.tableHeadAgendaItems} mx-0 border py-3 ${getRoundedTopClass(
                            agendaFolderConnection === 'Event',
                          )}`}
                        >
                          <Col lg={1} className="fw-bold text-center">
                            {t('sequence')}
                          </Col>
                          <Col lg={2} className="fw-bold text-center">
                            {t('title')}
                          </Col>
                          <Col
                            lg={2}
                            className="fw-bold text-center d-none d-md-block"
                          >
                            {t('category')}
                          </Col>
                          <Col
                            lg={3}
                            className="fw-bold text-center d-none d-md-block"
                          >
                            {t('description')}
                          </Col>
                          <Col
                            lg={2}
                            className="fw-bold text-center d-none d-md-block"
                          >
                            {t('duration')}
                          </Col>
                          <Col lg={2} className="fw-bold text-center">
                            {t('options')}
                          </Col>
                        </Row>
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
                            className={`bg-light-subtle border border-top-0 shadow-sm ${getRoundedBottomClass(
                              agendaFolderConnection === 'Event',
                            )}`}
                          >
                            {agendaFolder.items.edges.map((edge, index) => {
                              const agendaItem = edge.node;

                              return (
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
                                      )} py-2`}
                                    >
                                      <Row className="mx-3 my-3">
                                        <Col lg={1} className="text-center">
                                          <span
                                            {...provided.dragHandleProps}
                                            className="cursor-grab"
                                          >
                                            <i className="fas fa-bars fa-sm" />
                                          </span>
                                        </Col>

                                        <Col lg={2} className="text-center">
                                          {agendaItem.name}
                                        </Col>

                                        <Col
                                          lg={2}
                                          className="text-center d-none d-md-block"
                                        >
                                          {agendaItem.category?.name ??
                                            t('noCategory')}
                                        </Col>

                                        <Col
                                          lg={3}
                                          className="text-center d-none d-md-block"
                                        >
                                          {agendaItem.description}
                                        </Col>

                                        <Col
                                          lg={2}
                                          className="text-center d-none d-md-block"
                                        >
                                          {agendaItem.duration ?? '-'}
                                        </Col>

                                        <Col
                                          lg={2}
                                          className="d-flex justify-content-center gap-2"
                                        >
                                          <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() =>
                                              onPreviewItem(agendaItem)
                                            }
                                            aria-label={t('previewItem')}
                                          >
                                            <i className="fas fa-info fa-sm" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() =>
                                              onEditItem(agendaItem)
                                            }
                                            aria-label={t('editItem')}
                                          >
                                            <i className="fas fa-edit fa-sm" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                              onDeleteItem(agendaItem)
                                            }
                                            aria-label={t('deleteItem')}
                                          >
                                            <i className="fas fa-trash" />
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}

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
  );
}
