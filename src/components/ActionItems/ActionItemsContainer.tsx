import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

import type {
  InterfaceActionItemInfo,
  InterfaceMemberInfo,
} from 'utils/interfaces';
import styles from './ActionItemsContainer.module.css';
import ActionItemUpdateModal from '../../screens/OrganizationActionItems/ActionItemUpdateModal';
import ActionItemPreviewModal from '../../screens/OrganizationActionItems/ActionItemPreviewModal';
import ActionItemDeleteModal from '../../screens/OrganizationActionItems/ActionItemDeleteModal';
import { Link } from 'react-router-dom';

/**
 * ActionItemsContainer component is responsible for displaying, managing, and updating action items
 * related to either an organization or an event. It provides a UI for previewing, updating, and deleting
 * action items, as well as changing their status.
 *
 * @param props - The component props
 * @param actionItemsConnection - Specifies the connection type (Organization or Event) to determine the context of the action items.
 * @param actionItemsData - Array of action item data to be displayed.
 * @param membersData - Array of member data for the organization.
 * @param actionItemsRefetch - Function to refetch the action items data.
 *
 * @example
 * ```tsx
 * <ActionItemsContainer
 *   actionItemsConnection="Organization"
 *   actionItemsData={actionItems}
 *   membersData={members}
 *   actionItemsRefetch={refetchActionItems}
 * />
 * ```
 * This example renders the `ActionItemsContainer` component with organization connection, providing the necessary action items and members data along with a refetch function.
 */
function actionItemsContainer({
  actionItemsConnection,
  actionItemsData,
  membersData,
  actionItemsRefetch,
}: {
  actionItemsConnection: 'Organization' | 'Event';
  actionItemsData: InterfaceActionItemInfo[] | undefined;
  membersData: InterfaceMemberInfo[] | undefined;
  actionItemsRefetch: () => void;
}): JSX.Element {
  // Translation hooks for localized text
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  // State hooks for controlling modals and action item properties
  const [actionItemPreviewModalIsOpen, setActionItemPreviewModalIsOpen] =
    useState(false);
  const [actionItemUpdateModalIsOpen, setActionItemUpdateModalIsOpen] =
    useState(false);
  const [actionItemDeleteModalIsOpen, setActionItemDeleteModalIsOpen] =
    useState(false);
  const [actionItemStatusModal, setActionItemStatusModal] = useState(false);
  const [isActionItemCompleted, setIsActionItemCompleted] = useState(false);

  const [assignmentDate, setAssignmentDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [completionDate, setCompletionDate] = useState<Date | null>(new Date());
  const [actionItemId, setActionItemId] = useState('');
  const [actionItemNotes, setActionItemNotes] = useState('');

  const [formState, setFormState] = useState({
    assignee: '',
    assigner: '',
    assigneeId: '',
    preCompletionNotes: '',
    postCompletionNotes: '',
    isCompleted: false,
  });

  /**
   * Opens the preview modal for the selected action item.
   *
   * @param actionItem - The action item to be previewed.
   */
  const showPreviewModal = (actionItem: InterfaceActionItemInfo): void => {
    setActionItemState(actionItem);
    setActionItemPreviewModalIsOpen(true);
  };

  /**
   * Toggles the update modal visibility.
   */
  const showUpdateModal = (): void => {
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };

  /**
   * Hides the preview modal.
   */
  const hidePreviewModal = (): void => {
    setActionItemPreviewModalIsOpen(false);
  };

  /**
   * Hides the update modal and resets the action item ID.
   */
  const hideUpdateModal = (): void => {
    setActionItemId('');
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };

  /**
   * Toggles the delete modal visibility.
   */
  const toggleDeleteModal = (): void => {
    setActionItemDeleteModalIsOpen(!actionItemDeleteModalIsOpen);
  };

  // Apollo Client mutations for updating and deleting action items
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  /**
   * Handles the form submission for updating an action item.
   *
   * @param  e - The form submission event.
   */
  const updateActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
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
      toast.success(t('successfulUpdation') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const [removeActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION);

  /**
   * Handles the action item deletion.
   */
  const deleteActionItemHandler = async (): Promise<void> => {
    try {
      await removeActionItem({
        variables: {
          actionItemId,
        },
      });

      actionItemsRefetch();
      toggleDeleteModal();
      toast.success(t('successfulDeletion') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  /**
   * Handles the edit button click and opens the update modal with the action item data.
   *
   * @param actionItem - The action item to be edited.
   */
  const handleEditClick = (actionItem: InterfaceActionItemInfo): void => {
    setActionItemState(actionItem);
    showUpdateModal();
  };

  /**
   * Handles the action item status change and updates the state accordingly.
   *
   * @param actionItem - The action item whose status is being changed.
   */
  const handleActionItemStatusChange = (
    actionItem: InterfaceActionItemInfo,
  ): void => {
    actionItem = { ...actionItem, isCompleted: !actionItem.isCompleted };
    setIsActionItemCompleted(!actionItem.isCompleted);
    setActionItemState(actionItem);
    setActionItemStatusModal(true);
  };

  /**
   * Hides the action item status modal.
   */
  const hideActionItemStatusModal = (): void => {
    setActionItemStatusModal(false);
  };

  /**
   * Sets the state with the action item data.
   *
   * @param actionItem - The action item data.
   */
  const setActionItemState = (actionItem: InterfaceActionItemInfo): void => {
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
    setDueDate(actionItem.dueDate);
    setAssignmentDate(actionItem.assignmentDate);
    setCompletionDate(actionItem.completionDate);
  };

  const popover = (
    <Popover
      id={`popover-${actionItemId}`}
      data-testid={`popover-${actionItemId}`}
    >
      <Popover.Body>{actionItemNotes}</Popover.Body>
    </Popover>
  );

  return (
    <>
      <div
        className={`mx-1 ${actionItemsConnection === 'Organization' ? 'my-4' : 'my-0'}`}
      >
        <div
          className={`shadow-sm ${actionItemsConnection === 'Organization' ? 'rounded-top-4 mx-4' : 'rounded-top-2 mx-0'}`}
        >
          <Row
            className={`mx-0 border border-light-subtle py-3 ${actionItemsConnection === 'Organization' ? 'rounded-top-4' : 'rounded-top-2'}`}
            data-testid="actionItemsHeader"
          >
            <Col
              xs={7}
              sm={4}
              md={3}
              lg={1}
              className="d-flex align-items-center justify-content-center ps-3 fw-bold"
            >
              <div className="ms-2">{'#'}</div>
            </Col>
            <Col
              xs={7}
              sm={4}
              md={3}
              lg={2}
              className="d-flex align-items-center justify-content-center ps-3 fw-bold"
            >
              <div className="ms-2">{t('assignee')}</div>
            </Col>
            <Col
              className="d-flex align-items-center justify-content-center fw-bold d-none d-sm-flex"
              sm={5}
              md={6}
              lg={2}
            >
              {t('actionItemCategory')}
            </Col>
            <Col
              className="d-none d-lg-flex fw-bold d-flex align-items-center justify-content-center "
              md={4}
              lg={2}
            >
              <div className="ms-1">{t('preCompletionNotes')}</div>
            </Col>
            <Col
              className="d-none d-lg-flex fw-bold d-flex align-items-center justify-content-center "
              md={4}
              lg={2}
            >
              <div className="ms-3">{t('postCompletionNotes')}</div>
            </Col>
            <Col
              xs={5}
              sm={3}
              lg={2}
              className="fw-bold d-flex align-items-center justify-content-center "
            >
              <div className="ms-3">{t('options')}</div>
            </Col>
          </Row>
        </div>

        <div
          className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${actionItemsConnection === 'Organization' ? 'rounded-bottom-4 mx-4' : 'rounded-bottom-2 mb-2 mx-0'}`}
        >
          {actionItemsData?.map((actionItem, index) => (
            <div key={index}>
              <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2`}>
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={1}
                  className="d-flex align-items-center justify-content-center text-body-secondary"
                >
                  {index + 1}
                </Col>
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={2}
                  className="d-flex align-items-center justify-content-center text-body-secondary"
                >
                  <Link
                    to={`/member/${actionItem?.event?._id}`}
                    state={{ id: index }}
                    className={styles.membername}
                  >
                    {`${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`}
                  </Link>
                </Col>
                <Col
                  sm={5}
                  md={6}
                  lg={2}
                  className="p-1 d-none d-sm-flex d-flex align-items-center justify-content-center text-body-secondary"
                >
                  {actionItem.actionItemCategory.name}
                </Col>
                <Col
                  className="p-0 d-none d-lg-flex d-flex align-items-center justify-content-center text-body-secondary"
                  md={4}
                  lg={2}
                >
                  <div className="ms-2">
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="right"
                      overlay={popover}
                    >
                      <span
                        data-testid="actionItemPreCompletionNotesOverlay"
                        onMouseEnter={() => {
                          setActionItemId(actionItem._id);
                          setActionItemNotes(actionItem.preCompletionNotes);
                        }}
                      >
                        {actionItem.preCompletionNotes.length > 25
                          ? `${actionItem.preCompletionNotes.substring(0, 25)}...`
                          : actionItem.preCompletionNotes}
                      </span>
                    </OverlayTrigger>
                  </div>
                </Col>
                <Col
                  className="p-0 d-none d-lg-flex d-flex align-items-center justify-content-center text-body-secondary"
                  md={4}
                  lg={2}
                >
                  <div className="ms-3">
                    {actionItem.isCompleted ? (
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="right"
                        overlay={popover}
                      >
                        <span
                          data-testid="actionItemPostCompletionNotesOverlay"
                          onMouseEnter={() => {
                            setActionItemId(actionItem._id);
                            setActionItemNotes(actionItem.postCompletionNotes);
                          }}
                          className="ms-3 "
                        >
                          {actionItem.postCompletionNotes?.length > 25
                            ? `${actionItem.postCompletionNotes.substring(0, 25)}...`
                            : actionItem.postCompletionNotes}
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <span className="text-body-tertiary ms-3 fst-italic">
                        {t('actionItemActive')}
                      </span>
                    )}
                  </div>
                </Col>
                <Col
                  xs={5}
                  sm={3}
                  lg={2}
                  className="p-0 d-flex align-items-center justify-content-center"
                >
                  <div className="d-flex align-items-center ms-4 gap-2">
                    <input
                      type="checkbox"
                      id="actionItemStatusChangeCheckbox"
                      data-testid="actionItemStatusChangeCheckbox"
                      className="form-check-input d-inline mt-0 me-1"
                      checked={actionItem.isCompleted}
                      onChange={() => handleActionItemStatusChange(actionItem)}
                    />
                    <Button
                      data-testid="previewActionItemModalBtn"
                      className={`${styles.actionItemsOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => showPreviewModal(actionItem)}
                    >
                      <i className="fas fa-info fa-sm"></i>
                    </Button>
                    <Button
                      size="sm"
                      data-testid="editActionItemModalBtn"
                      onClick={() => handleEditClick(actionItem)}
                      className={`${styles.actionItemsOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                    >
                      {' '}
                      <i className="fas fa-edit fa-sm"></i>
                    </Button>
                  </div>
                </Col>
              </Row>

              {index !== actionItemsData.length - 1 && <hr className="mx-3" />}
            </div>
          ))}

          {actionItemsData?.length === 0 && (
            <div className="lh-lg text-center fw-semibold text-body-tertiary">
              {t('noActionItems')}
            </div>
          )}
        </div>
      </div>

      {/* action item status change modal */}
      <Modal
        className={styles.createModal}
        show={actionItemStatusModal}
        onHide={hideActionItemStatusModal}
      >
        <Modal.Header>
          <p className={`${styles.titlemodal}`}>{t('actionItemStatus')}</p>
          <Button
            variant="danger"
            onClick={hideActionItemStatusModal}
            data-testid="actionItemStatusChangeModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateActionItemHandler}>
            <Form.Label
              className="ms-1 fs-6 mt-2 mb-0"
              htmlFor="actionItemCategoryName"
            >
              {isActionItemCompleted
                ? t('preCompletionNotes')
                : t('postCompletionNotes')}
            </Form.Label>
            <Form.Control
              type="title"
              id="actionItemsStatusChangeNotes"
              data-testid="actionItemsStatusChangeNotes"
              placeholder={t('actionItemCompleted')}
              autoComplete="off"
              required
              value={
                isActionItemCompleted
                  ? formState.preCompletionNotes
                  : formState.postCompletionNotes ?? ''
              }
              onChange={(e): void => {
                if (isActionItemCompleted) {
                  setFormState({
                    ...formState,
                    preCompletionNotes: e.target.value,
                  });
                } else {
                  setFormState({
                    ...formState,
                    postCompletionNotes: e.target.value,
                  });
                }
              }}
            />
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="actionItemStatusChange"
              data-testid="actionItemStatusChangeSubmitBtn"
            >
              {isActionItemCompleted ? t('makeActive') : t('markCompletion')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
        tCommon={tCommon}
      />
    </>
  );
}

export default actionItemsContainer;
