import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import styles from './AgendaCategoryContainer.module.css';

import AgendaCategoryDeleteModal from 'screens/OrganizationAgendaCategory/AgendaCategoryDeleteModal';
import AgendaCategoryPreviewModal from 'screens/OrganizationAgendaCategory/AgendaCategoryPreviewModal';
import AgendaCategoryUpdateModal from 'screens/OrganizationAgendaCategory/AgendaCategoryUpdateModal';

function agendaCategoryContainer({
  agendaCategoryConnection,
  agendaCategoryData,
  agendaCategoryRefetch,
}: {
  agendaCategoryConnection: 'Organization';
  agendaCategoryData: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaCategoryRefetch: () => void;
}): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaCategory',
  });
  const { t: tCommon } = useTranslation('common');
  const [
    agendaCategoryPreviewModalIsOpen,
    setAgendaCategoryPreviewModalIsOpen,
  ] = useState(false);
  const [agendaCategoryUpdateModalIsOpen, setAgendaCategoryUpdateModalIsOpen] =
    useState(false);
  const [agendaCategoryDeleteModalIsOpen, setAgendaCategoryDeleteModalIsOpen] =
    useState(false);

  const [agendaCategoryId, setAgendaCategoryId] = useState('');
  // const [creationDate, setcreationDate] = useState<Date | null>(new Date());

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    createdBy: '',
  });

  const showPreviewModal = (
    agendaItemCategory: InterfaceAgendaItemCategoryInfo,
  ): void => {
    setAgendaCategoryState(agendaItemCategory);
    setAgendaCategoryPreviewModalIsOpen(true);
  };

  const hidePreviewModal = (): void => {
    setAgendaCategoryPreviewModalIsOpen(false);
  };

  const showUpdateModal = (): void => {
    setAgendaCategoryUpdateModalIsOpen(!agendaCategoryUpdateModalIsOpen);
  };

  const hideUpdateModal = (): void => {
    setAgendaCategoryUpdateModalIsOpen(!agendaCategoryUpdateModalIsOpen);
  };

  const toggleDeleteModal = (): void => {
    setAgendaCategoryDeleteModalIsOpen(!agendaCategoryDeleteModalIsOpen);
  };

  const [updateAgendaCategory] = useMutation(
    UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  const updateAgendaCategoryHandler = async (
    event: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      await updateAgendaCategory({
        variables: {
          updateAgendaCategoryId: agendaCategoryId,
          input: {
            name: formState.name,
            description: formState.description,
          },
        },
      });
      toast.success('Agenda Category Updated Successfully');
      agendaCategoryRefetch();
      hideUpdateModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Agenda Category Update Failed ${error.message}`);
      }
    }
  };

  const [deleteAgendaCategory] = useMutation(
    DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  const deleteAgendaCategoryHandler = async (): Promise<void> => {
    try {
      await deleteAgendaCategory({
        variables: {
          deleteAgendaCategoryId: agendaCategoryId,
        },
      });
      agendaCategoryRefetch();
      toggleDeleteModal();
      toast.success('Agenda Category Deleted Successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Agenda Category Delete Failed, ${error.message}`);
      }
    }
  };

  const handleEditClick = (
    agendaItemCategory: InterfaceAgendaItemCategoryInfo,
  ): void => {
    setAgendaCategoryState(agendaItemCategory);
    showUpdateModal();
  };

  const setAgendaCategoryState = (
    agendaItemCategory: InterfaceAgendaItemCategoryInfo,
  ): void => {
    setFormState({
      ...formState,
      name: `${agendaItemCategory.name} `,
      description: `${agendaItemCategory.description}`,
      createdBy: `${agendaItemCategory.createdBy.firstName} ${agendaItemCategory.createdBy.lastName}`,
    });
    setAgendaCategoryId(agendaItemCategory._id);
  };

  return (
    <>
      <div
        className={`mx-1 ${agendaCategoryConnection === 'Organization' ? 'my-4' : 'my-0'}`}
      >
        <div
          className={`shadow-sm ${agendaCategoryConnection === 'Organization' ? 'rounded-top-4 mx-4' : 'rounded-top-2 mx-0'}`}
        >
          <Row
            className={`mx-0 border border-light-subtle py-3 ${agendaCategoryConnection === 'Organization' ? 'rounded-top-4' : 'rounded-top-2'}`}
          >
            <Col
              xs={7}
              sm={4}
              md={3}
              lg={2}
              className="align-self-center ps-3 fw-bold"
            >
              <div className="ms-3">{t('name')}</div>
            </Col>
            <Col
              className="align-self-center fw-bold d-none d-sm-block"
              sm={5}
              md={6}
              lg={2}
            >
              {t('description')}
            </Col>
            <Col
              className="d-none d-sm-block fw-bold align-self-center"
              md={4}
              lg={2}
            >
              <div className="ms-1">{t('createdBy')}</div>
            </Col>
            <Col xs={5} sm={3} lg={2} className="fw-bold align-self-center">
              <div className="ms-2">{t('options')}</div>
            </Col>
          </Row>
        </div>
        <div
          className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${agendaCategoryConnection === 'Organization' ? 'rounded-bottom-4 mx-4' : 'rounded-bottom-2 mb-2 mx-0'}`}
        >
          {agendaCategoryData?.map((agendaCategory, index) => (
            <div key={index}>
              <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2 `}>
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={2}
                  className="align-self-center text-body-secondary"
                >
                  {`${agendaCategory.name}`}
                </Col>
                <Col
                  sm={5}
                  md={6}
                  lg={2}
                  className="p-1 d-none d-sm-block align-self-center text-body-secondary"
                >
                  {agendaCategory.description}
                </Col>
                <Col
                  sm={5}
                  md={6}
                  lg={2}
                  className="p-1 d-none d-sm-block align-self-center text-body-secondary"
                >
                  {`${agendaCategory.createdBy.firstName} ${agendaCategory.createdBy.lastName}`}
                </Col>

                <Col xs={5} sm={3} lg={2} className="p-0 align-self-center">
                  <div className="d-flex align-items-center ms-4 gap-2">
                    <Button
                      data-testid="previewAgendaCategoryModalBtn"
                      className={`${styles.agendaCategoryOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => showPreviewModal(agendaCategory)}
                    >
                      <i className="fas fa-info fa-sm"></i>
                    </Button>
                    <Button
                      size="sm"
                      data-testid="editAgendCategoryModalBtn"
                      onClick={() => handleEditClick(agendaCategory)}
                      className={`${styles.agendaCategoryOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                    >
                      <i className="fas fa-edit fa-sm"></i>
                    </Button>
                  </div>
                </Col>
              </Row>

              {index !== agendaCategoryData.length - 1 && (
                <hr className="mx-3" />
              )}
            </div>
          ))}
          {agendaCategoryData?.length === 0 && (
            <div className="lh-lg text-center fw-semibold text-body-tertiary">
              {t('noAgendaCategories')}
            </div>
          )}
        </div>
      </div>

      {/* Preview model */}
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={agendaCategoryPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateModal={showUpdateModal}
        toggleDeleteModal={toggleDeleteModal}
        formState={formState}
        t={t}
      />
      {/* Update model */}
      <AgendaCategoryUpdateModal
        agendaCategoryUpdateModalIsOpen={agendaCategoryUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        formState={formState}
        setFormState={setFormState}
        updateAgendaCategoryHandler={updateAgendaCategoryHandler}
        t={t}
      />
      {/* Delete model */}
      <AgendaCategoryDeleteModal
        agendaCategoryDeleteModalIsOpen={agendaCategoryDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        deleteAgendaCategoryHandler={deleteAgendaCategoryHandler}
        t={t}
        tCommon={tCommon}
      />
    </>
  );
}

export default agendaCategoryContainer;
