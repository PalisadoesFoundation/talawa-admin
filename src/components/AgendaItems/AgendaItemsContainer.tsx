import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';

import {
  DELETE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type {
  InterfaceAgendaItemInfo,
  InterfaceAgendaItemCategoryInfo,
} from 'utils/interfaces';
import styles from './AgendaItemsContainer.module.css';

import AgendaItemsPreviewModal from 'components/AgendaItems/AgendaItemsPreviewModal';
import AgendaItemsDeleteModal from 'components/AgendaItems/AgendaItemsDeleteModal';
import AgendaItemsUpdateModal from 'components/AgendaItems/AgendaItemsUpdateModal';

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

  const [agendaItemPreviewModalIsOpen, setAgendaItemPreviewModalIsOpen] =
    useState(false);
  const [agendaItemUpdateModalIsOpen, setAgendaItemUpdateModalIsOpen] =
    useState(false);
  const [agendaItemDeleteModalIsOpen, setAgendaItemDeleteModalIsOpen] =
    useState(false);

  const [agendaItemId, setAgendaItemId] = useState('');

  const [formState, setFormState] = useState<{
    agendaItemCategoryIds: string[];
    agendaItemCategoryNames: string[];
    title: string;
    description: string;
    sequence: number;
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
    sequence: 0,
    duration: '',
    attachments: [],
    urls: [],
    createdBy: {
      firstName: '',
      lastName: '',
    },
  });

  const showPreviewModal = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaItemState(agendaItem);
    setAgendaItemPreviewModalIsOpen(true);
  };

  const hidePreviewModal = (): void => {
    setAgendaItemPreviewModalIsOpen(false);
  };

  const showUpdateModal = (): void => {
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  const hideUpdateModal = (): void => {
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  const toggleDeleteModal = (): void => {
    setAgendaItemDeleteModalIsOpen(!agendaItemDeleteModalIsOpen);
  };

  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);

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
            sequence: formState.sequence,
            duration: formState.duration,
            categories: formState.agendaItemCategoryIds,
            attachments: formState.attachments,
            urls: formState.urls,
          },
        },
      });
      agendaItemRefetch();
      hideUpdateModal();
      toast.success(t('agendaItemUpdated'));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      }
    }
  };

  const [deleteAgendaItem] = useMutation(DELETE_AGENDA_ITEM_MUTATION);

  const deleteAgendaItemHandler = async (): Promise<void> => {
    try {
      await deleteAgendaItem({
        variables: {
          removeAgendaItemId: agendaItemId,
        },
      });
      agendaItemRefetch();
      toggleDeleteModal();
      toast.success(t('agendaItemDeleted'));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      }
    }
  };

  const handleEditClick = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaItemState(agendaItem);
    showUpdateModal();
  };

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
      sequence: agendaItem.sequence,
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

  return (
    <>
      <div
        className={`mx-1 ${agendaItemConnection == 'Event' ? 'my-4' : 'my-0'}`}
      >
        <div
          className={` shadow-sm ${agendaItemConnection === 'Event' ? 'rounded-top-4 mx-4' : 'rounded-top-2 mx-0'}`}
        >
          <Row
            className={` mx-0 border border-light-subtle py-3 ${agendaItemConnection === 'Event' ? 'rounded-top-4' : 'rounded-top-2'}`}
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
        <div
          className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${agendaItemConnection === 'Event' ? 'rounded-bottom-4 mx-4' : 'rounded-bottom-2 mb-2 mx-0'}`}
        >
          {agendaItemData?.map((agendaItem, index) => (
            <div key={index}>
              <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2 `}>
                <Col
                  xs={6}
                  sm={4}
                  md={2}
                  lg={1}
                  className="align-self-center text-body-secondary text-center"
                >
                  {agendaItem.sequence}
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
                    {agendaItem.categories.map((category, idx) => (
                      <span key={category._id} className={styles.categoryChip}>
                        {category.name}
                        {idx < agendaItem.categories.length - 1 && ', '}
                      </span>
                    ))}
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
                      data-testid="editAgendItemModalBtn"
                      onClick={() => handleEditClick(agendaItem)}
                      className={`${styles.agendaItemsOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                    >
                      <i className="fas fa-edit fa-sm" />
                    </Button>
                  </div>
                </Col>
              </Row>
              {index !== agendaItemData.length - 1 && <hr className="mx-3" />}
            </div>
          ))}
          {agendaItemData?.length === 0 && (
            <div className="lh-lg text-center fw-semibold text-body-tertiary">
              {t('noAgendaItems')}
            </div>
          )}
        </div>
      </div>
      {/* Preview model */}
      <AgendaItemsPreviewModal
        agendaItemPreviewModalIsOpen={agendaItemPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateModal={showUpdateModal}
        toggleDeleteModal={toggleDeleteModal}
        formState={formState}
        t={t}
      />
      {/* Delete model */}
      <AgendaItemsDeleteModal
        agendaItemDeleteModalIsOpen={agendaItemDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        deleteAgendaItemHandler={deleteAgendaItemHandler}
        t={t}
        tCommon={tCommon}
      />
      {/* Update model */}
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
