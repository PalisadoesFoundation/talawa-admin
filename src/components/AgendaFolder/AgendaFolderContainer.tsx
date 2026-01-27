/* global HTMLFormElement */
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
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, JSX } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useMutation } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import {
  DELETE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_FOLDER_MUTATION,
  UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaItemCategoryInfo,
  InterfaceAgendaFolderInfo,
} from 'types/Agenda/interface';
import styles from 'style/app-fixed.module.css';

import AgendaItemsPreviewModal from 'components/AgendaItems/Preview/AgendaItemsPreviewModal';
import AgendaItemsDeleteModal from 'components/AgendaItems/Delete/AgendaItemsDeleteModal';
import AgendaItemsUpdateModal from 'components/AgendaItems/Update/AgendaItemsUpdateModal';
import { DELETE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/AgendaFolderMutations';
import AgendaFolderDeleteModal from 'components/AgendaFolder/Delete/AgendaFolderDeleteModal';
import AgendaFolderUpdateModal from './Update/AgendaFolderUpdateModal';
import Button from 'shared-components/Button';

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
  const { t: tCommon } = useTranslation('common');

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
  const [agendaFolderDeleteModalIsOpen, SetagendaFolderDeleteModalIsOpen] =
    useState<boolean>(false);
  const [agendaFolderUpdateModalIsOpen, SetAgendaFolderUpdateModalIsOpen] =
    useState<boolean>(false);
  useEffect(() => {
    if (agendaFolderData) {
      setFolder([...agendaFolderData].sort((a, b) => a.sequence - b.sequence));
    }
  }, [agendaFolderData]);
  const getSortedItems = (agendaFolder: InterfaceAgendaFolderInfo) =>
    [...agendaFolder.items.edges]
      .map((e) => e.node)
      .sort((a, b) => a.sequence - b.sequence);
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
    attachments: string[];
  }>({
    id: '',
    name: '',
    description: '',
    duration: '',
    url: [''],
    category: '',
    folder: '',
    attachments: [''],
  });
  const [formState, setFormState] = useState<{
    id: string;
    name: string;
    description: string;
    duration: string;
    attachment?: string[];
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
    attachment: [''],
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
  const showPreviewModal = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaItemState(agendaItem);
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
    SetAgendaFolderUpdateModalIsOpen(!agendaFolderUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the update modal.
   */
  const hideUpdateModal = (): void => {
    SetAgendaFolderUpdateModalIsOpen(!agendaFolderUpdateModalIsOpen);
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
    SetagendaFolderDeleteModalIsOpen(!agendaFolderDeleteModalIsOpen);
  };

  /**
   * Toggles the visibility of the delete modal of agenda items.
   */
  const toggleDeleteItemModal = (): void => {
    setAgendaItemDeleteModalIsOpen(!agendaItemDeleteModalIsOpen);
  };

  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);
  const [updateAgendaItemSequence] = useMutation(
    UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
  );
  const [updateAgendaFolder] = useMutation(UPDATE_AGENDA_FOLDER_MUTATION);
  const [deleteAgendaFolder] = useMutation(DELETE_AGENDA_FOLDER_MUTATION);

  /**
   * Handles updating an agenda item.
   * @param e - The form submission event.
   */
  const updateAgendaItemHandler = async (
    e: FormEvent<HTMLFormElement>,
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
            folderId: itemFormState.folder ? itemFormState.folder : undefined,
            // attachments: formState.attachments,
            url:
              itemFormState.url?.length > 0
                ? itemFormState.url.map((u) => ({
                    url: u,
                  }))
                : undefined,
          },
        },
      });
      refetchAgendaFolder();
      hideUpdateItemModal();
      NotificationToast.success(t('agendaItemUpdated') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(`${error.message}`);
      }
    }
  };

  const [deleteAgendaItem] = useMutation(DELETE_AGENDA_ITEM_MUTATION);

  /**
   * Handles deleting an agenda item.
   */
  const deleteAgendaItemHandler = async (): Promise<void> => {
    try {
      await deleteAgendaItem({
        variables: { input: { id: agendaItemId } },
      });
      refetchAgendaFolder();
      toggleDeleteItemModal();
      NotificationToast.success(t('agendaItemDeleted') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(`${error.message}`);
      }
    }
  };

  /**
   * Handles the update of an agenda category.
   *
   * @param event - The form submit event.
   */
  const updateAgendaFolderHandler = async (
    event: ChangeEvent<HTMLFormElement>,
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
      hideUpdateModal();
      NotificationToast.success(t('agendaFolderUpdated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(
          t('agendaFolderUpdateFailed', { error: error.message }) as string,
        );
      }
    }
  };

  /**
   * Handles deleting an agenda folder.
   */
  const deleteAgendaFolderHandler = async (): Promise<void> => {
    try {
      await deleteAgendaFolder({
        variables: { input: { id: agendaFolderId } },
      });
      refetchAgendaFolder();
      toggleDeleteModal();
      NotificationToast.success(t('agendaFolderDeleted') as string);
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(`${error.message}`);
      }
    }
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
  const handleItemsEditClick = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaUpdateItemState(agendaItem);
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
  const setAgendaUpdateItemState = (
    agendaItem: InterfaceAgendaItemInfo,
  ): void => {
    setItemFormState({
      ...itemFormState,
      name: agendaItem.name,
      description: agendaItem.description,
      duration: agendaItem.duration,
      //attachments: agendaItem.attachments,
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
  const setAgendaItemState = (agendaItem: InterfaceAgendaItemInfo): void => {
    setFormState({
      ...formState,
      name: agendaItem.name,
      description: agendaItem.description,
      duration: agendaItem.duration,
      //attachments: agendaItem.attachments,
      category: {
        id: agendaItem.category.id,
        name: agendaItem.category.name,
        description: agendaItem.category.description,
      },
      url: agendaItem.url.map((u) => u.url) ?? [],
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
      NotificationToast.success(t('itemSequenceUpdateSuccessMsg'));
      refetchAgendaFolder();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
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

    try {
      await Promise.all(
        updatedFolders.map(async (item, index) => {
          if (item.sequence !== index + 1) {
            // Only update if the sequence has changed
            await updateAgendaFolder({
              variables: {
                input: {
                  id: item.id,
                  sequence: index + 1, // Update sequence based on new index
                },
              },
            });
          }
        }),
      );
      NotificationToast.success(t('sectionSequenceUpdateSuccessMsg'));
      // After updating all items, refetch data and notify success
      refetchAgendaFolder();
    } catch (error) {
      if (error instanceof Error) {
        NotificationToast.error(`${error.message}`);
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onFolderDragEnd}>
        <Droppable droppableId="agendaFolder">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`mx-4 bg-light p-3`}
            >
              {folder &&
                folder.map((agendaFolder, index) => {
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
                          className={`${styles.agendaItemRow} ${
                            snapshot.isDragging ? styles.dragging : ''
                          } py-3 mb-4 px-4`}
                        >
                          <Row className={`${index === 0 ? 'pt-3' : ''}`}>
                            <Col
                              xs={6}
                              sm={4}
                              md={2}
                              lg={2}
                              className="align-self-center text-body-secondary text-center"
                              {...provided.dragHandleProps}
                            >
                              <i className="fas fa-bars fa-sm" />
                            </Col>
                            <Col
                              xs={6}
                              sm={4}
                              md={2}
                              lg={1}
                              className="align-self-center text-body-secondary text-center"
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
                              className="p-0 align-self-center d-flex justify-content-end"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <Button
                                  size="sm"
                                  disabled={isDefault}
                                  variant="outline-secondary"
                                  onClick={() =>
                                    handleEditFolderClick(agendaFolder)
                                  }
                                  aria-label={t('editFolder')}
                                >
                                  <i className="fas fa-edit fa-sm" />
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={isDefault}
                                  onClick={() => {
                                    setAgendaFolderState(agendaFolder);
                                    toggleDeleteModal();
                                  }}
                                  className={styles.icon}
                                  data-testid="previewAgendaItemModalDeleteBtn"
                                  variant="danger"
                                  aria-label={t('deleteFolder')}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          <div
                            className={`mx-1 ${agendaFolderConnection == 'Event' ? 'my-4' : 'my-0'}`}
                          ></div>
                          <div
                            className={` shadow-sm ${agendaFolderConnection === 'Event' ? 'rounded-top-4 mx-4' : 'rounded-top-2 mx-0'}`}
                          >
                            <Row
                              className={`${styles.tableHeadAgendaItems} mx-0 border border-light-subtle py-3 ${agendaFolderConnection === 'Event' ? 'rounded-top-4' : 'rounded-top-2'}`}
                            >
                              <Col
                                xs={6}
                                sm={4}
                                md={2}
                                lg={1}
                                className="align-self-center ps-3 fw-bold"
                              >
                                <div>{t('sequence')}</div>
                              </Col>
                              <Col
                                xs={6}
                                sm={4}
                                md={2}
                                lg={2}
                                className="align-self-center fw-bold text-center"
                              >
                                {t('title')}
                              </Col>
                              <Col
                                className="fw-bold align-self-center d-none d-md-block text-center"
                                md={3}
                                lg={2}
                              >
                                {t('category')}
                              </Col>
                              <Col
                                className="fw-bold align-self-center d-none d-md-block text-center"
                                md={3}
                                lg={3}
                              >
                                {t('description')}
                              </Col>
                              <Col
                                xs={6}
                                sm={4}
                                md={2}
                                lg={2}
                                className="align-self-center fw-bold text-center"
                              >
                                {t('duration')}
                              </Col>
                              <Col
                                xs={12}
                                sm={4}
                                md={2}
                                lg={2}
                                className="fw-bold align-self-center text-center"
                              >
                                <div>{t('options')}</div>
                              </Col>
                            </Row>
                          </div>
                          <DragDropContext onDragEnd={onItemDragEnd}>
                            <Droppable
                              droppableId={`agenda-items-${agendaFolder.id}`}
                            >
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${
                                    agendaFolderConnection === 'Event'
                                      ? 'rounded-bottom-4 mx-4'
                                      : 'rounded-bottom-2 mb-2 mx-0'
                                  }`}
                                >
                                  {[...agendaFolder.items.edges]
                                    .sort(
                                      (a, b) =>
                                        a.node.sequence - b.node.sequence,
                                    )
                                    .map((edge, index) => {
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
                                              className={`${styles.agendaItemRow} ${
                                                snapshot.isDragging
                                                  ? styles.dragging
                                                  : ''
                                              }`}
                                            >
                                              <Row
                                                className={`${index === 0 ? 'pt-3' : ''} mb-2 mt-2 mx-3`}
                                              >
                                                <Col
                                                  xs={6}
                                                  sm={4}
                                                  md={2}
                                                  lg={1}
                                                  className="align-self-center text-body-secondary text-center"
                                                  {...provided.dragHandleProps}
                                                >
                                                  <i className="fas fa-bars fa-sm" />
                                                </Col>

                                                <Col
                                                  xs={6}
                                                  sm={4}
                                                  md={2}
                                                  lg={2}
                                                  className="p-1 align-self-center text-body-secondary text-center"
                                                >
                                                  {agendaItem.name}
                                                </Col>

                                                <Col
                                                  md={3}
                                                  lg={2}
                                                  className="p-1 d-none d-md-block align-self-center text-body-secondary text-center"
                                                >
                                                  <div
                                                    className={
                                                      styles.categoryContainer
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.categoryChip
                                                      }
                                                    >
                                                      {agendaItem.category
                                                        ?.name ?? 'No Category'}
                                                    </span>
                                                  </div>
                                                </Col>

                                                <Col
                                                  md={3}
                                                  lg={3}
                                                  className="p-1 d-none d-md-block align-self-center text-body-secondary text-center"
                                                >
                                                  {agendaItem.description}
                                                </Col>

                                                <Col
                                                  md={3}
                                                  lg={2}
                                                  className="p-1 d-none d-md-block align-self-center text-body-secondary text-center"
                                                >
                                                  {agendaItem.duration || '-'}
                                                </Col>

                                                <Col
                                                  xs={12}
                                                  sm={4}
                                                  md={2}
                                                  lg={2}
                                                  className="p-0 align-self-center d-flex justify-content-center"
                                                >
                                                  <div className="d-flex align-items-center gap-2">
                                                    <Button
                                                      size="sm"
                                                      variant="outline-secondary"
                                                      onClick={() =>
                                                        showPreviewModal(
                                                          agendaItem,
                                                        )
                                                      }
                                                      aria-label={t(
                                                        'itemPreview',
                                                      )}
                                                    >
                                                      <i className="fas fa-info fa-sm" />
                                                    </Button>

                                                    <Button
                                                      size="sm"
                                                      variant="outline-secondary"
                                                      onClick={() =>
                                                        handleItemsEditClick(
                                                          agendaItem,
                                                        )
                                                      }
                                                      aria-label={t('editItem')}
                                                    >
                                                      <i className="fas fa-edit fa-sm" />
                                                    </Button>
                                                    <Button
                                                      size="sm"
                                                      onClick={() => {
                                                        handleDeleteItemsClick(
                                                          agendaItem,
                                                        );
                                                      }}
                                                      aria-label={t(
                                                        'deleteItem',
                                                      )}
                                                      className={styles.icon}
                                                      data-testid="previewAgendaItemModalDeleteBtn"
                                                      variant="danger"
                                                    >
                                                      <i className="fas fa-trash"></i>
                                                    </Button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </div>
                                          )}
                                        </Draggable>
                                      );
                                    })}

                                  {agendaFolder.items.edges.length === 0 && (
                                    <div className="lh-lg text-center fw-semibold text-body-tertiary py-1">
                                      {t('noAgendaItems')}
                                    </div>
                                  )}

                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {agendaFolderData?.length === 0 && (
                <div className="lh-lg text-center fw-semibold text-body-tertiary">
                  {t('noAgendaItems')}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/*Agenda Folder Delete modal */}
      <AgendaFolderDeleteModal
        agendaFolderDeleteModalIsOpen={agendaFolderDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        deleteAgendaFolderHandler={deleteAgendaFolderHandler}
        t={t}
        tCommon={tCommon}
      />
      {/*Agenda Folder Update modal */}
      <AgendaFolderUpdateModal
        agendaFolderUpdateModalIsOpen={agendaFolderUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        folderFormState={folderFormState}
        setFolderFormState={setFolderFormState}
        updateAgendaFolderHandler={updateAgendaFolderHandler}
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
        updateAgendaItemHandler={updateAgendaItemHandler}
        t={t}
        agendaItemCategories={agendaItemCategories}
        agendaFolderData={agendaFolderData}
      />
      {/*Agenda Item Delete modal */}
      <AgendaItemsDeleteModal
        agendaItemDeleteModalIsOpen={agendaItemDeleteModalIsOpen}
        toggleDeleteItemModal={toggleDeleteItemModal}
        deleteAgendaItemHandler={deleteAgendaItemHandler}
        t={t}
        tCommon={tCommon}
      />
    </>
  );
}

export default AgendaFolderContainer;
