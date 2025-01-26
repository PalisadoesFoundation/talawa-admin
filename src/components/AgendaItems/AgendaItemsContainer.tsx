import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';

import {
  DELETE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaItemCategoryInfo,
} from 'utils/interfaces';
import styles from '../../style/app.module.css';

import AgendaItemsPreviewModal from 'components/AgendaItems/AgendaItemsPreviewModal';
import AgendaItemsDeleteModal from 'components/AgendaItems/AgendaItemsDeleteModal';
import AgendaItemsUpdateModal from 'components/AgendaItems/AgendaItemsUpdateModal';

/**
 * Component for displaying and managing agenda items.
 * Supports drag-and-drop functionality, and includes modals for previewing,
 * updating, and deleting agenda items.
 *
 * @param props - The props for the component.
 * @returns JSX.Element
 */
function AgendaItemsContainer({
  agendaItemConnection,
  agendaItemData,
  agendaItemRefetch,
  agendaItemCategories,
}: {
  agendaItemConnection: 'Event';
  agendaItemData: InterfaceAgendaItemInfo[] | undefined;
  agendaItemRefetch: () => void;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
}): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'agendaItems',
  });
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

  const [formState, setFormState] = useState<{
    agendaItemCategoryIds: string[];
    agendaItemCategoryNames: string[];
    title: string;
    description: string;
    duration: string;
    attachments: string[];
    urls: string[];
    createdBy: {
      firstName: string;
      lastName: string;
    };
  }>({
    agendaItemCategoryIds: [],
    agendaItemCategoryNames: [],
    title: '',
    description: '',
    duration: '',
    attachments: [],
    urls: [],
    createdBy: {
      firstName: '',
      lastName: '',
    },
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
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the update modal.
   */
  const hideUpdateModal = (): void => {
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the delete modal.
   */
  const toggleDeleteModal = (): void => {
    setAgendaItemDeleteModalIsOpen(!agendaItemDeleteModalIsOpen);
  };

  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);

  /**
   * Handles updating an agenda item.
   * @param e - The form submission event.
   */
  const updateAgendaItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await updateAgendaItem({
        variables: {
          updateAgendaItemId: agendaItemId,
          input: {
            title: formState.title,
            description: formState.description,
            duration: formState.duration,
            categories: formState.agendaItemCategoryIds,
            attachments: formState.attachments,
            urls: formState.urls,
          },
        },
      });
      agendaItemRefetch();
      hideUpdateModal();
      toast.success(t('agendaItemUpdated') as string);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
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
        variables: {
          removeAgendaItemId: agendaItemId,
        },
      });
      agendaItemRefetch();
      toggleDeleteModal();
      toast.success(t('agendaItemDeleted') as string);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      }
    }
  };

  /**
   * Handles click event to show the update modal for the selected agenda item.
   * @param agendaItem - The agenda item to update.
   */
  const handleEditClick = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaItemState(agendaItem);
    showUpdateModal();
  };

  /**
   * Sets the state for the selected agenda item.
   * @param agendaItem - The agenda item to set in the state.
   */
  const setAgendaItemState = (agendaItem: InterfaceAgendaItemInfo): void => {
    setFormState({
      ...formState,
      agendaItemCategoryIds: agendaItem.categories.map(
        (category) => category._id,
      ),
      agendaItemCategoryNames: agendaItem.categories.map(
        (category) => category.name,
      ),
      title: agendaItem.title,
      description: agendaItem.description,
      duration: agendaItem.duration,
      attachments: agendaItem.attachments,
      urls: agendaItem.urls,
      createdBy: {
        firstName: agendaItem.createdBy.firstName,
        lastName: agendaItem.createdBy.lastName,
      },
    });
    setAgendaItemId(agendaItem._id);
  };

  /**
   * Handles the end of a drag-and-drop operation.
   * @param result - The result of the drag-and-drop operation.
   */
  const onDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination || !agendaItemData) {
      return;
    }

    const reorderedAgendaItems = Array.from(agendaItemData);
    const [removed] = reorderedAgendaItems.splice(result.source.index, 1);
    reorderedAgendaItems.splice(result.destination.index, 0, removed);

    try {
      await Promise.all(
        reorderedAgendaItems.map(async (item, index) => {
          if (item.sequence !== index + 1) {
            // Only update if the sequence has changed
            await updateAgendaItem({
              variables: {
                updateAgendaItemId: item._id,
                input: {
                  sequence: index + 1, // Update sequence based on new index
                },
              },
            });
          }
        }),
      );

      // After updating all items, refetch data and notify success
      agendaItemRefetch();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      }
    }
  };

  return (
    <>
      <div
        className={`mx-1 ${agendaItemConnection == 'Event' ? 'my-4' : 'my-0'}`}
      >
        <div
          className={` shadow-sm ${agendaItemConnection === 'Event' ? 'rounded-top-4 mx-4' : 'rounded-top-2 mx-0'}`}
        >
          <Row
            className={`${styles.tableHeadAgendaItems} mx-0 border border-light-subtle py-3 ${agendaItemConnection === 'Event' ? 'rounded-top-4' : 'rounded-top-2'}`}
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
              lg={3}
              className="align-self-center fw-bold text-center"
            >
              {t('title')}
            </Col>
            <Col
              className="fw-bold align-self-center d-none d-md-block text-center"
              md={3}
              lg={3}
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="agendaItems">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${agendaItemConnection === 'Event' ? 'rounded-bottom-4 mx-4' : 'rounded-bottom-2 mb-2 mx-0'}`}
              >
                {agendaItemData &&
                  agendaItemData.map((agendaItem, index) => (
                    <Draggable
                      key={agendaItem._id}
                      draggableId={agendaItem._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.agendaItemRow} ${
                            snapshot.isDragging ? styles.dragging : ''
                          }`}
                        >
                          <Row
                            className={`${index === 0 ? 'pt-3' : ''} mb-2 mt-2 mx-3 `}
                          >
                            <Col
                              xs={6}
                              sm={4}
                              md={2}
                              lg={1}
                              className="align-self-center text-body-secondary text-center"
                            >
                              <i className="fas fa-bars fa-sm" />
                            </Col>
                            <Col
                              xs={6}
                              sm={4}
                              md={2}
                              lg={3}
                              className="p-1 align-self-center text-body-secondary text-center"
                            >
                              {agendaItem.title}
                            </Col>
                            <Col
                              md={3}
                              lg={3}
                              className="p-1 d-none d-md-block align-self-center text-body-secondary text-center"
                            >
                              <div className={styles.categoryContainer}>
                                {agendaItem.categories.length > 0 ? (
                                  agendaItem.categories.map((category, idx) => (
                                    <span
                                      key={category._id}
                                      className={styles.categoryChip}
                                    >
                                      {category.name}
                                      {idx < agendaItem.categories.length - 1 &&
                                        ', '}
                                    </span>
                                  ))
                                ) : (
                                  <span className={styles.categoryChip}>
                                    No Category
                                  </span>
                                )}
                              </div>
                            </Col>{' '}
                            <Col
                              md={3}
                              lg={3}
                              className="p-1 d-none d-md-block align-self-center text-body-secondary text-center"
                            >
                              {agendaItem.description}
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
                                  data-testid="previewAgendaItemModalBtn"
                                  className={`${styles.agendaCategoryOptionsButton} d-flex align-items-center justify-content-center`}
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => showPreviewModal(agendaItem)}
                                >
                                  <i className="fas fa-info fa-sm" />
                                </Button>
                                <Button
                                  size="sm"
                                  data-testid="editAgendaItemModalBtn"
                                  onClick={() => handleEditClick(agendaItem)}
                                  className={`${styles.agendaItemsOptionsButton} d-flex align-items-center justify-content-center`}
                                  variant="outline-secondary"
                                >
                                  <i className="fas fa-edit fa-sm" />
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {agendaItemData?.length === 0 && (
                  <div className="lh-lg text-center fw-semibold text-body-tertiary">
                    {t('noAgendaItems')}
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* Preview modal */}
      <AgendaItemsPreviewModal
        agendaItemPreviewModalIsOpen={agendaItemPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateModal={showUpdateModal}
        toggleDeleteModal={toggleDeleteModal}
        formState={formState}
        t={t}
      />
      {/* Delete modal */}
      <AgendaItemsDeleteModal
        agendaItemDeleteModalIsOpen={agendaItemDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        deleteAgendaItemHandler={deleteAgendaItemHandler}
        t={t}
        tCommon={tCommon}
      />
      {/* Update modal */}
      <AgendaItemsUpdateModal
        agendaItemUpdateModalIsOpen={agendaItemUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        formState={formState}
        setFormState={setFormState}
        updateAgendaItemHandler={updateAgendaItemHandler}
        t={t}
        agendaItemCategories={agendaItemCategories}
      />
    </>
  );
}

export default AgendaItemsContainer;
