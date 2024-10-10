import { useMutation, useQuery } from '@apollo/client';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from './EventActionItems.module.css';
import { DataGrid } from '@mui/x-data-grid';
// import type { GridCellParams } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Modal from 'react-bootstrap/Modal';
import {
  CREATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import type {
  InterfaceActionItemCategoryList,
  InterfaceActionItemInfo,
  InterfaceMembersList,
} from 'utils/interfaces';
import { DatePicker } from '@mui/x-date-pickers';
import {
  ACTION_ITEM_CATEGORY_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import { ACTION_ITEM_LIST_BY_EVENTS } from 'GraphQl/Queries/ActionItemQueries';
import { useEventActionColumnConfig } from './useEventActionColumnConfig';
import ActionItemPreviewModal from 'screens/OrganizationActionItems/ActionItemPreviewModal';
import ActionItemDeleteModal from 'screens/OrganizationActionItems/ActionItemDeleteModal';

function eventActionItems(props: { eventId: string }): JSX.Element {
  const { eventId } = props;
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const [actionItemPreviewModalIsOpen, setActionItemPreviewModalIsOpen] =
    useState(false);
  const [actionItemStatusModal, setActionItemStatusModal] = useState(false);
  const [isActionItemCompleted, setIsActionItemCompleted] = useState(false);
  const [assignmentDate, setAssignmentDate] = useState<Date | null>(new Date());
  const [actionItemCreateModalIsOpen, setActionItemCreateModalIsOpen] =
    useState(false);
  const [actionItemUpdateModalIsOpen, setActionItemUpdateModalIsOpen] =
    useState(false);
  const [actionItemDeleteModalIsOpen, setActionItemDeleteModalIsOpen] =
    useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [completionDate, setCompletionDate] = useState<Date | null>(new Date());
  const [actionItemId, setActionItemId] = useState('');
  document.title = t('title');
  const url: string = window.location.href;
  const startIdx: number = url.indexOf('/event/') + '/event/'.length;
  const orgId: string = url.slice(startIdx, url.indexOf('/', startIdx));
  const [formState, setFormState] = useState({
    actionItemCategoryId: '',
    assignee: '',
    assigner: '',
    assigneeId: '',
    preCompletionNotes: '',
    postCompletionNotes: '',
    isCompleted: false,
  });
  const showCreateModal = (): void => {
    const newState = !actionItemCreateModalIsOpen;
    setActionItemCreateModalIsOpen(newState);
  };
  const hideCreateModal = (): void => {
    setActionItemCreateModalIsOpen(!actionItemCreateModalIsOpen);
  };
  const showUpdateModal = (): void => {
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };
  const hideUpdateModal = (): void => {
    setActionItemId('');
    setActionItemUpdateModalIsOpen(!actionItemUpdateModalIsOpen);
  };
  const toggleDeleteModal = (): void => {
    setActionItemDeleteModalIsOpen(!actionItemDeleteModalIsOpen);
  };
  const setActionItemState = (actionItem: InterfaceActionItemInfo): void => {
    setFormState((prevState) => ({
      ...prevState,
      assignee: `${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`,
      assigner: `${actionItem.assigner.firstName} ${actionItem.assigner.lastName}`,
      assigneeId: actionItem.assignee._id,
      preCompletionNotes: actionItem.preCompletionNotes,
      postCompletionNotes: actionItem.postCompletionNotes,
      isCompleted: actionItem.isCompleted,
    }));
    setActionItemId(actionItem._id);
    setDueDate(actionItem.dueDate);
    setAssignmentDate(actionItem.assignmentDate);
    setCompletionDate(actionItem.completionDate);
  };
  const {
    data: actionItemCategoriesData,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: orgId,
    },
  });
  const actionItemCategories =
    actionItemCategoriesData?.actionItemCategoriesByOrganization.filter(
      (category) => !category.isDisabled,
    );
  const { data: actionItemsData, refetch: actionItemsRefetch } = useQuery(
    ACTION_ITEM_LIST_BY_EVENTS,
    {
      variables: {
        eventId,
      },
    },
  );
  const {
    data: membersData,
  }: {
    data: InterfaceMembersList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });
  const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);
  const createActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItem({
        variables: {
          assigneeId: formState.assigneeId,
          actionItemCategoryId: formState.actionItemCategoryId,
          eventId,
          preCompletionNotes: formState.preCompletionNotes,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
        },
      });
      setFormState({
        actionItemCategoryId: '',
        assignee: '',
        assigner: '',
        assigneeId: '',
        preCompletionNotes: '',
        postCompletionNotes: '',
        isCompleted: false,
      });
      setDueDate(new Date());
      actionItemsRefetch();
      hideCreateModal();
      toast.success(t('successfulCreation') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    actionItemsRefetch({
      eventId,
    });
  }, []);
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);
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
      hideActionItemStatusModal();
      toast.success(t('successfulUpdation') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
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
      hidePreviewModal();
      toast.success(t('successfulDeletion') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const handleActionItemStatusChange = (
    actionItem: InterfaceActionItemInfo,
  ): void => {
    actionItem = { ...actionItem, isCompleted: !actionItem.isCompleted };
    setIsActionItemCompleted(!actionItem.isCompleted);
    setActionItemState(actionItem);
    setActionItemStatusModal(true);
  };

  const showPreviewModal = (actionItem: InterfaceActionItemInfo): void => {
    setActionItemState(actionItem);
    setActionItemPreviewModalIsOpen(true);
  };

  const handleEditClick = (actionItem: InterfaceActionItemInfo): void => {
    setActionItemId(actionItem._id);
    setActionItemState(actionItem);
    showUpdateModal();
  };

  const hidePreviewModal = (): void => {
    setActionItemPreviewModalIsOpen(false);
  };

  const hideActionItemStatusModal = (): void => {
    setActionItemStatusModal(false);
    setActionItemUpdateModalIsOpen(false);
  };

  const { columns } = useEventActionColumnConfig({
    eventId,
    handleActionItemStatusChange,
    showPreviewModal,
    handleEditClick,
  });

  return (
    <>
      <Button
        type="submit"
        className={styles.greenregbtn}
        value="createEventActionItem"
        data-testid="createEventActionItemBtn"
        onClick={showCreateModal}
      >
        <i className={'fa fa-plus me-2'} />
        {tCommon('create')}
      </Button>
      <hr />
      {/* create action item modal */}
      <Modal
        className={styles.actionItemModal}
        show={actionItemCreateModalIsOpen}
        onHide={hideCreateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideCreateModal}
            data-testid="createActionItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createActionItemHandler}>
            <Form.Group className="mb-3">
              <Form.Label>{t('actionItemCategory')}</Form.Label>
              <Form.Select
                data-testid="formSelectActionItemCategory"
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    actionItemCategoryId: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  {t('selectActionItemCategory')}
                </option>
                {actionItemCategories?.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('assignee')}</Form.Label>
              <Form.Select
                data-testid="formSelectAssignee"
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {t('selectAssignee')}
                </option>
                {membersData?.organizations[0].members?.map((member, index) => (
                  <option key={index} value={member._id}>
                    {`${member.firstName} ${member.lastName}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <label htmlFor="actionItemPreCompletionNotes">{t('notes')}</label>
            <Form.Control
              type="actionItemPreCompletionNotes"
              id="actionItemPreCompletionNotes"
              placeholder={t('notes')}
              autoComplete="off"
              value={formState.preCompletionNotes}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
            />
            <div>
              <DatePicker
                label={t('dueDate')}
                className="mb-3 w-100"
                value={dayjs(dueDate)}
                onChange={(date: Dayjs | null): void => {
                  if (date) {
                    setDueDate(date?.toDate());
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              value="createActionItem"
              data-testid="createActionItemFormSubmitBtn"
            >
              {t('createActionItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* update action items modal */}
      <Modal
        className={styles.actionItemModal}
        show={actionItemUpdateModalIsOpen}
        onHide={hideUpdateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideUpdateModal}
            data-testid="updateActionItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateActionItemHandler}>
            <Form.Group className="mb-2">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                data-testid="formUpdateAssignee"
                defaultValue={formState.assigneeId}
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value={formState.assigneeId} disabled>
                  {formState.assignee}
                </option>
                {membersData?.organizations[0].members.map((member, index) => {
                  const currMemberName = `${member.firstName} ${member.lastName}`;
                  if (currMemberName !== formState.assignee) {
                    return (
                      <option key={index} value={member._id}>
                        {`${member.firstName} ${member.lastName}`}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>
            <label htmlFor="actionItemPreCompletionNotes">{t('notes')}</label>
            <Form.Control
              type="actionItemPreCompletionNotes"
              id="actionItemPreCompletionNotes"
              placeholder={t('notes')}
              autoComplete="off"
              value={formState.preCompletionNotes}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
            />
            <div className={styles.datediv}>
              <DatePicker
                className={styles.datebox}
                label={t('dueDate')}
                value={dayjs(dueDate)}
                onChange={(date: Dayjs | null): void => {
                  if (date) {
                    setDueDate(date?.toDate());
                  }
                }}
              />
              &nbsp;
              <DatePicker
                className={styles.datebox}
                value={dayjs(completionDate)}
                label={t('completionDate')}
                onChange={
                  /* istanbul ignore next */ (date: Dayjs | null): void => {
                    /* istanbul ignore next */
                    if (date) {
                      setCompletionDate(date?.toDate());
                    }
                  }
                }
              />
            </div>
            <div>
              <Button
                type="submit"
                value="editActionItem"
                data-testid="updateActionItemFormSubmitBtn"
                className={styles.editDelBtns}
              >
                {t('editActionItem')}
              </Button>
            </div>
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

      {/* Delete Modal */}
      <ActionItemDeleteModal
        actionItemDeleteModalIsOpen={actionItemDeleteModalIsOpen}
        deleteActionItemHandler={deleteActionItemHandler}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
        tCommon={tCommon}
      />

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
              className={styles.editDelBtns}
              value="actionItemStatusChange"
              data-testid="actionItemStatusChangeSubmitBtn"
            >
              {isActionItemCompleted ? t('makeActive') : t('markCompletion')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {actionItemsData && (
        <div className="datatable">
          <DataGrid
            disableColumnMenu
            columnBufferPx={6}
            hideFooter={true}
            className={`${styles.datagrid}`}
            getRowId={(row) => row._id}
            slots={{
              noRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  Nothing Found !!
                </Stack>
              ),
            }}
            sx={{
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
              '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-row.Mui-hovered': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
              },
            }}
            getRowClassName={() => `${styles.rowBackground}`}
            autoHeight
            rowHeight={50}
            columnHeaderHeight={40}
            rows={actionItemsData?.actionItemsByEvent?.map(
              (item: object, index: number) => ({
                ...item,
                index: index + 1,
              }),
            )}
            columns={columns}
            isRowSelectable={() => false}
          />
        </div>
      )}
    </>
  );
}
export default eventActionItems;
