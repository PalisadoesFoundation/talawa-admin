import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';

import { Circle, Search, Sort, WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';

import { useQuery } from '@apollo/client';

import type { InterfaceActionItemInfo } from 'utils/interfaces';
import styles from 'screens/OrganizationActionItems/OrganizationActionItems.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, Stack } from '@mui/material';
import ItemViewModal from 'screens/OrganizationActionItems/ItemViewModal';
import Avatar from 'components/Avatar/Avatar';
import ItemUpdateStatusModal from 'screens/OrganizationActionItems/ItemUpdateStatusModal';
import { ACTION_ITEMS_BY_USER } from 'GraphQl/Queries/ActionItemQueries';
import useLocalStorage from 'utils/useLocalstorage';

enum ModalState {
  VIEW = 'view',
  STATUS = 'status',
}

const dataGridStyle = {
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
  '& .MuiDataGrid-root': {
    borderRadius: '0.5rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.5rem',
  },
};

/**
 * Component for managing and displaying action items within an organization.
 *
 * This component allows users to view, filter, sort, and create action items. It also handles fetching and displaying related data such as action item categories and members.
 *
 * @returns The rendered component.
 */
function actions(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId } = useParams();
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  if (!orgId || !userId) {
    return <Navigate to={'/'} replace />;
  }

  const [actionItem, setActionItem] = useState<InterfaceActionItemInfo | null>(
    null,
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate_ASC' | 'dueDate_DESC' | null>(
    null,
  );
  const [searchBy, setSearchBy] = useState<'assignee' | 'category'>('assignee');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.VIEW]: false,
    [ModalState.STATUS]: false,
  });

  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleModalClick = useCallback(
    (actionItem: InterfaceActionItemInfo | null, modal: ModalState): void => {
      setActionItem(actionItem);
      openModal(modal);
    },
    [openModal],
  );

  /**
   * Query to fetch action items for the organization based on filters and sorting.
   */
  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  }: {
    data?: {
      actionItemsByUser: InterfaceActionItemInfo[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEMS_BY_USER, {
    variables: {
      userId,
      orderBy: sortBy,
      where: {
        assigneeName: searchBy === 'assignee' ? searchTerm : undefined,
        categoryName: searchBy === 'category' ? searchTerm : undefined,
      },
    },
  });

  const actionItems = useMemo(
    () => actionItemsData?.actionItemsByUser || [],
    [actionItemsData],
  );

  if (actionItemsLoading) {
    return <Loader size="xl" />;
  }

  if (actionItemsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Action Items' })}
          <br />
          {`${actionItemsError.message}`}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'assignee',
      headerName: 'Assignee',
      flex: 1,
      align: 'left',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { _id, firstName, lastName, image } =
          params.row.assignee?.user || {};

        return (
          <>
            {params.row.assigneeType === 'EventVolunteer' ? (
              <>
                <div
                  className="d-flex fw-bold align-items-center ms-2"
                  data-testid="assigneeName"
                >
                  {image ? (
                    <img
                      src={image}
                      alt="Assignee"
                      data-testid={`image${_id + 1}`}
                      className={styles.TableImage}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={_id + '1'}
                        containerStyle={styles.imageContainer}
                        avatarStyle={styles.TableImage}
                        name={firstName + ' ' + lastName}
                        alt={firstName + ' ' + lastName}
                      />
                    </div>
                  )}
                  {firstName + ' ' + lastName}
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-flex fw-bold align-items-center ms-2"
                  data-testid="assigneeName"
                >
                  <div className={styles.avatarContainer}>
                    <Avatar
                      key={_id + '1'}
                      containerStyle={styles.imageContainer}
                      avatarStyle={styles.TableImage}
                      name={params.row.assigneeGroup?.name ?? ''}
                      alt={params.row.assigneeGroup?.name ?? ''}
                    />
                  </div>
                  {params.row.assigneeGroup?.name ?? ''}
                </div>
              </>
            )}
          </>
        );
      },
    },
    {
      field: 'itemCategory',
      headerName: 'Item Category',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="categoryName"
          >
            {params.row.actionItemCategory?.name}
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Chip
            icon={<Circle className={styles.chipIcon} />}
            label={params.row.isCompleted ? 'Completed' : 'Pending'}
            variant="outlined"
            color="primary"
            className={`${styles.chip} ${params.row.isCompleted ? styles.active : styles.pending}`}
          />
        );
      },
    },
    {
      field: 'allotedHours',
      headerName: 'Alloted Hours',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="allotedHours">{params.row.allotedHours ?? '-'}</div>
        );
      },
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="createdOn">
            {dayjs(params.row.dueDate).format('DD/MM/YYYY')}
          </div>
        );
      },
    },
    {
      field: 'options',
      headerName: 'Options',
      align: 'center',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              style={{ minWidth: '32px' }}
              className="me-2 rounded"
              data-testid={`viewItemBtn${params.row.id}`}
              onClick={() => handleModalClick(params.row, ModalState.VIEW)}
            >
              <i className="fa fa-info" />
            </Button>
          </>
        );
      },
    },
    {
      field: 'completed',
      headerName: 'Completed',
      align: 'center',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex align-items-center justify-content-center mt-3">
            <Form.Check
              type="checkbox"
              data-testid={`statusCheckbox${params.row.id}`}
              checked={params.row.isCompleted}
              onChange={() => handleModalClick(params.row, ModalState.STATUS)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header with search, filter  and Create Button */}
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchBy', {
              item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
            })}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setSearchTerm(searchValue);
              } else if (e.key === 'Backspace' && searchValue === '') {
                setSearchTerm('');
              }
            }}
            data-testid="searchBy"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center`}
            onClick={() => setSearchTerm(searchValue)}
            style={{ marginBottom: '10px' }}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className="d-flex gap-3 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="searchByToggle"
              >
                <Sort className={'me-1'} />
                {tCommon('searchBy', { item: '' })}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSearchBy('assignee')}
                  data-testid="assignee"
                >
                  {t('assignee')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSearchBy('category')}
                  data-testid="category"
                >
                  {t('category')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="sort"
              >
                <Sort className={'me-1'} />
                {tCommon('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSortBy('dueDate_DESC')}
                  data-testid="dueDate_DESC"
                >
                  {t('latestDueDate')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('dueDate_ASC')}
                  data-testid="dueDate_ASC"
                >
                  {t('earliestDueDate')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Table with Action Items */}
      <DataGrid
        disableColumnMenu
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noActionItems')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={actionItems.map((actionItem, index) => ({
          id: index + 1,
          ...actionItem,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />

      <ItemUpdateStatusModal
        actionItem={actionItem}
        isOpen={modalState[ModalState.STATUS]}
        hide={() => closeModal(ModalState.STATUS)}
        actionItemsRefetch={actionItemsRefetch}
      />

      {/* View Modal */}
      {actionItem && (
        <ItemViewModal
          isOpen={modalState[ModalState.VIEW]}
          hide={() => closeModal(ModalState.VIEW)}
          item={actionItem}
        />
      )}
    </div>
  );
}

export default actions;
