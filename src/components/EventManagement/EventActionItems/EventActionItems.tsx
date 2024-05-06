import { useMutation, useQuery } from '@apollo/client';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './EventActionItems.module.css';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Modal from 'react-bootstrap/Modal';
import {
  CREATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import type {
  InterfaceActionItemCategoryList,
  InterfaceMembersList,
} from 'utils/interfaces';
import { DatePicker } from '@mui/x-date-pickers';
import {
  ACTION_ITEM_CATEGORY_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import { ACTION_ITEM_LIST_BY_EVENTS } from 'GraphQl/Queries/ActionItemQueries';

function eventActionItems(props: { eventId: string }): JSX.Element {
  const { eventId } = props;
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventActionItems',
  });

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
      toast.success(t('successfulCreation'));
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
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const [removeActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION);
  const deleteActionItemHandler = async (): Promise<void> => {
    await removeActionItem({
      variables: {
        actionItemId,
      },
    });
    actionItemsRefetch();
    toggleDeleteModal();
    hideUpdateModal();
    toast.success(t('successfulDeletion'));
  };
  const columns: GridColDef[] = [
    {
      field: 'serialNo',
      headerName: '#',
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row?.index;
      },
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            to={`/member/${eventId}`}
            state={{ id: params.row._id }}
            className={styles.membername}
          >
            {params.row?.assignee.firstName +
              ' ' +
              params.row?.assignee.lastName}
          </Link>
        );
      },
    },
    {
      field: 'actionItemCategory',
      headerName: 'Action Item Category',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row.actionItemCategory.name;
      },
    },
    {
      field: 'notes',
      headerName: 'Notes',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row.preCompletionNotes;
      },
    },
    {
      field: 'completionNotes',
      headerName: 'Completion Notes',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return params.row.postCompletionNotes;
      },
    },
    {
      field: 'options',
      headerName: 'Options',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            onClick={() => {
              showUpdateModal();
              setActionItemId(params.row._id);
            }}
            data-testid="updateAdminModalBtn"
          >
            Manage Actions
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <Button
        type="submit"
        className={styles.greenregbtn}
        value="createEventActionItem"
        data-testid="createEventActionItemBtn"
        onClick={showCreateModal}
      >
        {t('createActionItem')}
      </Button>
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
              <Form.Label>Assignee</Form.Label>
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
                defaultValue={formState.assignee}
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
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
            <label htmlFor="actionItemPostCompletionNotes">
              {t('postCompletionNotes')}
            </label>
            <Form.Control
              type="actionItemPostCompletionNotes"
              id="actionItemPostCompletionNotes"
              placeholder={t('postCompletionNotes')}
              autoComplete="off"
              value={formState.postCompletionNotes || ''}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  postCompletionNotes: e.target.value,
                });
              }}
              className="mb-2"
            />
            <br></br>
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
                onChange={(date: Dayjs | null): void => {
                  if (date) {
                    setCompletionDate(date?.toDate());
                  }
                }}
              />
            </div>
            <br></br>
            <div className={styles.editDelBtns}>
              <Button
                type="submit"
                value="editActionItem"
                data-testid="updateActionItemFormSubmitBtn"
              >
                {t('save')}
              </Button>

              <Button
                value="deleteActionItem"
                data-testid="deleteActionItemBtn"
                className="btn btn-danger"
                onClick={toggleDeleteModal}
              >
                {t('deleteActionItem')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* delete modal */}
      <Modal
        size="sm"
        id={`deleteActionItemModal`}
        show={actionItemDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
        className={styles.actionItemModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`deleteActionItem`}>
            {t('deleteActionItem')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('deleteActionItemMsg')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="actionItemDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteActionItemHandler}
            data-testid="deleteActionItemBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
      {actionItemsData && (
        <div className="datatable">
          <DataGrid
            disableColumnMenu
            columnBuffer={6}
            hideFooter={true}
            className={`${styles.datagrid}`}
            getRowId={(row) => row._id}
            components={{
              NoRowsOverlay: () => (
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
            }}
            getRowClassName={() => `${styles.rowBackground}`}
            autoHeight
            rowHeight={70}
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
