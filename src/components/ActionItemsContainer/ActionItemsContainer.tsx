import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type {
  InterfaceActionItemInfo,
  InterfaceActionItemList,
} from 'utils/interfaces';
import { toast } from 'react-toastify';
import {
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import ActionItemUpdateModal from '../../screens/OrganizationActionItems/ActionItemUpdateModal';
import ActionItemPreviewModal from '../../screens/OrganizationActionItems/ActionItemPreviewModal';
import ActionItemDeleteModal from '../../screens/OrganizationActionItems/ActionItemDeleteModal';

function actionItemsContainer({
  actionItemsData,
  membersData,
  actionItemsRefetch,
}: {
  actionItemsData: InterfaceActionItemInfo[] | undefined;
  membersData: any;
  actionItemsRefetch: any;
}): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [actionItemPreviewModalIsOpen, setActionItemPreviewModalIsOpen] =
    useState(false);
  const [actionItemUpdateModalIsOpen, setActionItemUpdateModalIsOpen] =
    useState(false);
  const [actionItemDeleteModalIsOpen, setActionItemDeleteModalIsOpen] =
    useState(false);

  const [assignmentDate, setAssignmentDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [completionDate, setCompletionDate] = useState<Date | null>(new Date());
  const [actionItemId, setActionItemId] = useState('');

  const [formState, setFormState] = useState({
    assignee: '',
    assigner: '',
    assigneeId: '',
    preCompletionNotes: '',
    postCompletionNotes: '',
    isCompleted: false,
  });

  const showPreviewModal = (actionItem: InterfaceActionItemInfo): void => {
    setFormState({
      ...formState,
      assignee: `${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`,
      assigner: `${actionItem.assigner.firstName} ${actionItem.assigner.lastName}`,
      assigneeId: actionItem.assignee._id,
      preCompletionNotes: actionItem.preCompletionNotes,
      postCompletionNotes: actionItem.postCompletionNotes,
      isCompleted: actionItem.isCompleted,
    });
    setActionItemId(actionItem._id);
    setAssignmentDate(actionItem.assignmentDate);
    setDueDate(actionItem.dueDate);
    setCompletionDate(actionItem.completionDate);
    setActionItemPreviewModalIsOpen(true);
  };

  const showUpdateModal = (): void => {
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };

  const hidePreviewModal = (): void => {
    setActionItemPreviewModalIsOpen(false);
  };

  const hideUpdateModal = (): void => {
    setActionItemId('');
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };

  const toggleDeleteModal = (): void => {
    setActionItemDeleteModalIsOpen(!actionItemDeleteModalIsOpen);
  };

  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  const updateActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await updateActionItem({
        variables: {
          actionItemId,
          assigneeId: formState.assigneeId,
          preCompletionNotes: formState.preCompletionNotes,
          postCompletionNotes: formState.postCompletionNotes,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
          completionDate: dayjs(completionDate).format('YYYY-MM-DD'),
          isCompleted: formState.isCompleted,
        },
      });

      actionItemsRefetch();
      hideUpdateModal();
      toast.success(t('successfulUpdation'));
    } catch (error: any) {
      toast.success(error.message);
      console.log(error);
    }
  };

  const [removeActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION);
  const deleteActionItemHandler = async (): Promise<void> => {
    try {
      await removeActionItem({
        variables: {
          actionItemId,
        },
      });

      actionItemsRefetch();
      toggleDeleteModal();
      toast.success(t('successfulDeletion'));
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEditClick = (actionItem: InterfaceActionItemInfo): void => {
    setFormState({
      ...formState,
      assignee: `${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`,
      assigneeId: actionItem.assignee._id,
      preCompletionNotes: actionItem.preCompletionNotes,
      postCompletionNotes: actionItem.postCompletionNotes,
      isCompleted: actionItem.isCompleted,
    });
    setActionItemId(actionItem._id);
    setDueDate(actionItem.dueDate);
    setCompletionDate(actionItem.completionDate);
    showUpdateModal();
  };

  return (
    <>
      <div className="mx-1 my-4">
        <div className="mx-4 shadow-sm rounded-top-4">
          <Row className="mx-0 border border-light-subtle rounded-top-4 py-3">
            <Col xs={7} sm={4} md={3} lg={3} className="ps-3 fs-5 fw-bold">
              <div className="ms-2">Assignee</div>
            </Col>
            <Col
              className="fs-5 fw-bold d-none d-sm-block"
              sm={5}
              md={6}
              lg={4}
            >
              Action Item Category
            </Col>
            <Col className="d-none d-lg-block fs-5 fw-bold" md={4} lg={3}>
              <div className="ms-3">Status</div>
            </Col>
            <Col xs={5} sm={3} lg={2} className="fs-5 fw-bold">
              Options
            </Col>
          </Row>
        </div>

        <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
          {actionItemsData?.map((actionItem, index) => (
            <div key={index}>
              <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2`}>
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={3}
                  className="align-self-center fw-semibold text-body-secondary"
                >
                  {`${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`}
                </Col>
                <Col
                  sm={5}
                  md={6}
                  lg={4}
                  className="d-none d-sm-block align-self-center fw-semibold text-body-secondary"
                >
                  {actionItem.actionItemCategory.name}
                </Col>
                <Col
                  className="d-none d-lg-block align-self-center fw-semibold text-body-secondary"
                  md={4}
                  lg={3}
                >
                  <div
                    className={`lh-base w-50 badge rounded-pill ${
                      actionItem.isCompleted
                        ? 'text-bg-success text-white'
                        : 'text-bg-warning'
                    }`}
                  >
                    {actionItem.isCompleted ? 'Completed' : 'Active'}
                  </div>
                </Col>
                <Col xs={5} sm={3} lg={2} className="p-0">
                  <Button
                    className="btn btn-sm me-2"
                    variant="outline-secondary"
                    onClick={() => showPreviewModal(actionItem)}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    data-testid="editActionItemModalBtn"
                    onClick={() => handleEditClick(actionItem)}
                    className="me-2 d-none d-xl-inline"
                    variant="success"
                  >
                    {' '}
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    size="sm"
                    data-testid="deleteActionItemModalBtn"
                    variant="danger"
                    onClick={() => {
                      setActionItemId(actionItem._id);
                      toggleDeleteModal();
                    }}
                  >
                    {' '}
                    <i className="fa fa-trash"></i>
                  </Button>
                </Col>
              </Row>

              {index !== actionItemsData.length - 1 && <hr className="mx-3" />}
            </div>
          ))}

          {actionItemsData?.length === 0 && (
            <div className="lh-lg text-center fw-semibold text-body-tertiary">
              No Action Items
            </div>
          )}
        </div>
      </div>

      {/* preview modal */}
      <ActionItemPreviewModal
        actionItemPreviewModalIsOpen={actionItemPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateModal={showUpdateModal}
        toggleDeleteModal={toggleDeleteModal}
        formState={formState}
        t={t}
        dueDate={dueDate}
        completionDate={completionDate}
        assignmentDate={assignmentDate}
      />

      {/* Update Modal */}
      <ActionItemUpdateModal
        actionItemUpdateModalIsOpen={actionItemUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        formState={formState}
        setFormState={setFormState}
        updateActionItemHandler={updateActionItemHandler}
        t={t}
        membersData={membersData}
        dueDate={dueDate}
        setDueDate={setDueDate}
        completionDate={completionDate}
        setCompletionDate={setCompletionDate}
      />

      {/* Delete Modal */}
      <ActionItemDeleteModal
        actionItemDeleteModalIsOpen={actionItemDeleteModalIsOpen}
        deleteActionItemHandler={deleteActionItemHandler}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
      />
    </>
  );
}

export default actionItemsContainer;
