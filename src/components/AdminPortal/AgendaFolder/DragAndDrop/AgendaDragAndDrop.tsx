import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Col, Row } from 'react-bootstrap';
import Button from 'shared-components/Button';
import styles from 'style/app-fixed.module.css';
import type { InterfaceAgendaDragAndDropProps } from 'types/AdminPortal/Agenda/interface';

// translation-check-keyPrefix: agendaSection
export default function AgendaDragAndDrop({
  folders,
  agendaFolderConnection,
  t,
  onFolderDragEnd,
  onItemDragEnd,
  onEditFolder,
  onDeleteFolder,
  onPreviewItem,
  onEditItem,
  onDeleteItem,
}: InterfaceAgendaDragAndDropProps) {
  return (
    <DragDropContext onDragEnd={onFolderDragEnd}>
      <Droppable droppableId="agendaFolder">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
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
                      className={`${styles.agendaItemRow} ${
                        snapshot.isDragging ? styles.dragging : ''
                      } py-3 mb-4 px-4`}
                    >
                      {/* Folder header */}
                      <Row>
                        <Col
                          xs={6}
                          sm={4}
                          md={2}
                          lg={2}
                          className="align-self-center text-body-secondary text-center"
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
                              onClick={() => onEditFolder(agendaFolder)}
                            >
                              <i className="fas fa-edit fa-sm" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={isDefault}
                              variant="danger"
                              onClick={() => onDeleteFolder(agendaFolder)}
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
                        className={`shadow-sm ${
                          agendaFolderConnection === 'Event'
                            ? 'rounded-top-4 mx-4'
                            : 'rounded-top-2 mx-0'
                        }`}
                      >
                        <Row
                          className={`${styles.tableHeadAgendaItems} mx-0 border border-light-subtle py-3 ${
                            agendaFolderConnection === 'Event'
                              ? 'rounded-top-4'
                              : 'rounded-top-2'
                          }`}
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

                      {/* Items */}
                      <DragDropContext onDragEnd={onItemDragEnd}>
                        <Droppable
                          droppableId={`agenda-items-${agendaFolder.id}`}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${
                                agendaFolderConnection === 'Event'
                                  ? 'rounded-bottom-4 mx-4'
                                  : 'rounded-bottom-2 mx-0'
                              }`}
                            >
                              {[...agendaFolder.items.edges]
                                .sort(
                                  (a, b) => a.node.sequence - b.node.sequence,
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
                                          } py-2`}
                                        >
                                          <Row className="mx-3 my-3">
                                            <Col lg={1} className="text-center">
                                              <span
                                                {...provided.dragHandleProps}
                                                className="d-inline-flex align-items-center cursor-grab"
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
                                              {agendaItem.duration || '-'}
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
                                              >
                                                <i className="fas fa-info fa-sm" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() =>
                                                  onEditItem(agendaItem)
                                                }
                                              >
                                                <i className="fas fa-edit fa-sm" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                  onDeleteItem(agendaItem)
                                                }
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
                      </DragDropContext>
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
