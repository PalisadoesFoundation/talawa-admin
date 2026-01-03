/**
 * AgendaCategoryContainer component is responsible for rendering and managing
 * the agenda categories for an organization. It provides functionalities to
 * preview, update, and delete agenda categories using modals and GraphQL mutations.
 *
 * @param props - Component props.
 * @param agendaCategoryConnection - Specifies the connection type, e.g., 'Organization'.
 * @param agendaCategoryData - Array of agenda category data to display.
 * @param agendaCategoryRefetch - Function to refetch agenda category data after updates.
 *
 * @returns A JSX element that displays a list of agenda categories with options
 *          to preview, edit, and delete each category.
 *
 * @remarks
 * - Uses `useState` for managing modal visibility and form state.
 * - Integrates `useMutation` from Apollo Client for GraphQL operations.
 * - Displays success and error messages using `react-toastify`.
 * - Includes three modals: Preview, Update, and Delete.
 *
 * @example
 * ```tsx
 * <AgendaCategoryContainer
 *   agendaCategoryConnection="Organization"
 *   agendaCategoryData={agendaCategories}
 *   agendaCategoryRefetch={refetchAgendaCategories}
 * />
 * ```
 *
 */

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
import styles from '../../style/app-fixed.module.css';

import AgendaCategoryDeleteModal from 'components/AdminPortal/OrgSettings/AgendaItemCategories/Delete/AgendaCategoryDeleteModal';
import AgendaCategoryPreviewModal from 'components/AdminPortal/OrgSettings/AgendaItemCategories/Preview/AgendaCategoryPreviewModal';
import AgendaCategoryUpdateModal from 'components/AdminPortal/OrgSettings/AgendaItemCategories/Update/AgendaCategoryUpdateModal';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

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
  const { t: tErrors } = useTranslation('errors');

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
          input: { name: formState.name, description: formState.description },
        },
      });

      agendaCategoryRefetch();
      hideUpdateModal();
      toast.success(t('agendaCategoryUpdated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          t('agendaCategoryUpdateFailed', { errorMessage: error.message }),
        );
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
        variables: { deleteAgendaCategoryId: agendaCategoryId },
      });
      agendaCategoryRefetch();
      toggleDeleteModal();
      toast.success(t('agendaCategoryDeleted') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          t('agendaCategoryDeleteFailed', { errorMessage: error.message }),
        );
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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={agendaCategoryRefetch}
    >
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
              className={`  align-self-center  fw-bold d-none d-md-block`}
              md={6}
              lg={6}
            >
              {t('description')}
            </Col>
            <Col className="d-none d-lg-block fw-bold align-self-center" lg={2}>
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
                  md={6}
                  lg={6}
                  className="p-1 d-none d-md-block align-self-center text-body-secondary"
                >
                  {agendaCategory.description}
                </Col>
                <Col
                  lg={2}
                  className="p-1 d-none d-lg-block align-self-center text-body-secondary"
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
    </ErrorBoundaryWrapper>
  );
}

export default agendaCategoryContainer;
