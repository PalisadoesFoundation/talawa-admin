import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';

import {
  DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';
import styles from './AgendaCategoryContainer.module.css';
import style from '../../style/app.module.css';
import AgendaCategoryDeleteModal from 'components/OrgSettings/AgendaItemCategories/AgendaCategoryDeleteModal';
import AgendaCategoryPreviewModal from 'components/OrgSettings/AgendaItemCategories/AgendaCategoryPreviewModal';
import AgendaCategoryUpdateModal from 'components/OrgSettings/AgendaItemCategories/AgendaCategoryUpdateModal';

/**
 * Component for displaying and managing agenda item categories.
 *
 * @param props - Contains agenda category data and functions for data management.
 * @returns A JSX element that renders agenda item categories with options to preview, edit, and delete.
 *
 * @example
 * ```tsx
 * <AgendaCategoryContainer
 *   agendaCategoryConnection="Organization"
 *   agendaCategoryData={data}
 *   agendaCategoryRefetch={refetch}
 * />
 * ```
 */
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

  // State management for modals and form data
  const [
    agendaCategoryPreviewModalIsOpen,
    setAgendaCategoryPreviewModalIsOpen,
  ] = useState(false);
  const [agendaCategoryUpdateModalIsOpen, setAgendaCategoryUpdateModalIsOpen] =
    useState(false);
  const [agendaCategoryDeleteModalIsOpen, setAgendaCategoryDeleteModalIsOpen] =
    useState(false);

  const [agendaCategoryId, setAgendaCategoryId] = useState('');

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    createdBy: '',
  });

  /**
   * Opens the preview modal and sets the state for the selected agenda category.
   *
   * @param agendaItemCategory - The agenda category to preview.
   */
  const showPreviewModal = (
    agendaItemCategory: InterfaceAgendaItemCategoryInfo,
  ): void => {
    setAgendaCategoryState(agendaItemCategory);
    setAgendaCategoryPreviewModalIsOpen(true);
  };

  /**
   * Closes the preview modal.
   */
  const hidePreviewModal = (): void => {
    setAgendaCategoryPreviewModalIsOpen(false);
  };

  /**
   * Toggles the visibility of the update modal.
   */
  const showUpdateModal = (): void => {
    setAgendaCategoryUpdateModalIsOpen(!agendaCategoryUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the update modal.
   */
  const hideUpdateModal = (): void => {
    setAgendaCategoryUpdateModalIsOpen(!agendaCategoryUpdateModalIsOpen);
  };

  /**
   * Toggles the visibility of the delete modal.
   */
  const toggleDeleteModal = (): void => {
    setAgendaCategoryDeleteModalIsOpen(!agendaCategoryDeleteModalIsOpen);
  };

  const [updateAgendaCategory] = useMutation(
    UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  /**
   * Handles the update of an agenda category.
   *
   * @param event - The form submit event.
   */
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

      agendaCategoryRefetch();
      hideUpdateModal();
      toast.success(t('agendaCategoryUpdated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Agenda Category Update Failed ${error.message}`);
      }
    }
  };

  const [deleteAgendaCategory] = useMutation(
    DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  /**
   * Handles the deletion of an agenda category.
   */
  const deleteAgendaCategoryHandler = async (): Promise<void> => {
    try {
      await deleteAgendaCategory({
        variables: {
          deleteAgendaCategoryId: agendaCategoryId,
        },
      });
      agendaCategoryRefetch();
      toggleDeleteModal();
      toast.success(t('agendaCategoryDeleted') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Agenda Category Delete Failed, ${error.message}`);
      }
    }
  };

  /**
   * Prepares the form state and shows the update modal for the selected agenda category.
   *
   * @param agendaItemCategory - The agenda category to edit.
   */
  const handleEditClick = (
    agendaItemCategory: InterfaceAgendaItemCategoryInfo,
  ): void => {
    setAgendaCategoryState(agendaItemCategory);
    showUpdateModal();
  };

  /**
   * Updates the form state with the selected agenda category's details.
   *
   * @param agendaItemCategory - The agenda category details.
   */
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
        className={`${style['mx-1']} ${agendaCategoryConnection === 'Organization' ? style['my-4'] : style['my-0']}`}
      >
        <div
          className={`${style['shadow-sm']} ${agendaCategoryConnection === 'Organization' ? style['rounded-top-4'] : style['rounded-top-2']} ${agendaCategoryConnection === 'Organization' ? style['mx-4'] : style['mx-0']}`}
        >
          <Row
            className={`${style.row} ${style['shadow-sm']} ${agendaCategoryConnection === 'Organization' ? style['rounded-top-4'] : style['rounded-top-2']} ${agendaCategoryConnection === 'Organization' ? style['mx-4'] : style['mx-0']}`}
          >
            <Col
              xs={7}
              sm={4}
              md={3}
              lg={2}
              className={`${style.rowChild} ${style['align-self-center']} ${style['ps-3']} ${style['fw-bold']}`}
            >
              <div className={`${style['ms-3']}`}>{t('name')}</div>
            </Col>
            <Col
              className={`${style.rowChild} ${style['align-self-center']} ${style['fw-bold']} ${style['d-none']} ${style['d-md-block']}`}
              md={6}
              lg={6}
            >
              {t('description')}
            </Col>
            <Col
              className={` ${style.rowChild} ${style['d-none']} ${style['d-lg-block']} ${style['fw-bold']} ${style['align-self-center']}`}
              lg={2}
            >
              <div className={`${style['ms-1']}`}>{t('createdBy')}</div>
            </Col>
            <Col
              xs={5}
              sm={3}
              lg={2}
              className={`${style.rowChild} ${style['fw-bold']} ${style['align-self-center']}`}
            >
              <div className={`${style['ms-2']}`}>{t('options')}</div>
            </Col>
          </Row>
        </div>
        <div
          className={`${style['bg-light-subtle']} ${style['border']} ${style['border-light-subtle']} ${style['border-top-0']} ${style['shadow-sm']} ${agendaCategoryConnection === 'Organization' ? style['rounded-bottom-4'] : style['rounded-bottom-2']} ${agendaCategoryConnection === 'Organization' ? style['mx-4'] : style['mx-0']} ${agendaCategoryConnection === 'Organization' ? style['mb-2'] : ''}`}
        >
          {agendaCategoryData?.map((agendaCategory, index) => (
            <div key={index}>
              <Row
                className={` ${style.row} ${index === 0 ? style['pt-3'] : ''} ${style['mb-3']} ${style['mx-2']}`}
              >
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={2}
                  className={`${style.rowChild} ${style['align-self-center']} ${style['text-body-secondary']}`}
                >
                  {`${agendaCategory.name}`}
                </Col>
                <Col
                  md={6}
                  lg={6}
                  className={`${style.rowChild} ${style['p-1']} ${style['d-none']} ${style['d-md-block']} ${style['align-self-center']} ${style['text-body-secondary']}`}
                >
                  {agendaCategory.description}
                </Col>
                <Col
                  lg={2}
                  className={`${style.rowChild} ${style['p-1']} ${style['d-none']} ${style['d-lg-block']} ${style['align-self-center']} ${style['text-body-secondary']}`}
                >
                  {`${agendaCategory.createdBy.firstName} ${agendaCategory.createdBy.lastName}`}
                </Col>

                <Col
                  xs={5}
                  sm={3}
                  lg={2}
                  className={`${style.rowChild} ${style['p-0']} ${style['align-self-center']}`}
                >
                  <div
                    className={`${style['d-flex']} ${style['align-items-center']} ${style['ms-4']} ${style['gap-2']}`}
                  >
                    <Button
                      data-testid="previewAgendaCategoryModalBtn"
                      className={`${styles.agendaCategoryOptionsButton} ${style['d-flex']} ${style['align-items-center']} ${style['justify-content-center']}`}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => showPreviewModal(agendaCategory)}
                    >
                      <i className="fas fa-info fa-sm" />
                    </Button>
                    <Button
                      size="sm"
                      data-testid="editAgendCategoryModalBtn"
                      onClick={() => handleEditClick(agendaCategory)}
                      className={`${styles.agendaCategoryOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                    >
                      <i className="fas fa-edit fa-sm" />
                    </Button>
                  </div>
                </Col>
              </Row>

              {index !== agendaCategoryData.length - 1 && (
                <hr className={`${style['mx-3']}`} />
              )}
            </div>
          ))}
          {agendaCategoryData?.length === 0 && (
            <div
              className={`${style['lh-lg']} ${style['text-center']} ${style['fw-semibold']} ${style['text-body-tertiary']}`}
            >
              {t('noAgendaCategories')}
            </div>
          )}
        </div>
      </div>

      {/* Preview modal */}
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={agendaCategoryPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateModal={showUpdateModal}
        toggleDeleteModal={toggleDeleteModal}
        formState={formState}
        t={t}
      />
      {/* Update modal */}
      <AgendaCategoryUpdateModal
        agendaCategoryUpdateModalIsOpen={agendaCategoryUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        formState={formState}
        setFormState={setFormState}
        updateAgendaCategoryHandler={updateAgendaCategoryHandler}
        t={t}
      />
      {/* Delete modal */}
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
