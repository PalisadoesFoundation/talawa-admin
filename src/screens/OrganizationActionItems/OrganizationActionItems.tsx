/**
 * OrganizationActionItems component for managing action items within an organization.
 *
 * This component provides functionality to:
 * - Display action items in a data grid with filtering and sorting
 * - Create, edit, view, and delete action items
 * - Update action item status (complete/incomplete)
 * - Filter by assignee, category, and completion status
 * - Sort by assignment date
 *
 * @returns  The rendered component
 *
 * @example
 * ```tsx
 * // Component is typically used in a route with orgId parameter
 * <Route path="/organization/:orgId/action-items" component={OrganizationActionItems} />
 * ```
 */
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  type JSX,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';

import { Circle, WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';

import { useQuery } from '@apollo/client';
import { ACTION_ITEM_LIST } from 'GraphQl/Queries/Queries';

import type { IActionItemInfo, IActionItemList } from 'types/Actions/interface';

import styles from '../../style/app-fixed.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, debounce, Stack } from '@mui/material';
import ItemViewModal from './ActionItemViewModal/ActionItemViewModal';
import ItemModal from './ActionItemModal/ActionItemModal';
import ItemDeleteModal from './ActionItemDeleteModal/ActionItemDeleteModal';
import Avatar from 'components/Avatar/Avatar';
import ItemUpdateStatusModal from './ActionItemUpdateModal/ActionItemUpdateStatusModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

/**
 * Enumeration for action item status types
 */
enum ItemStatus {
  Pending = 'pending',
  Completed = 'completed',
  Late = 'late',
}

/**
 * Enumeration for modal states used in the component
 */
enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
  VIEW = 'view',
  STATUS = 'status',
}

function organizationActionItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  /** Currently selected action item for modal operations */
  const [actionItem, setActionItem] = useState<IActionItemInfo | null>(null);

  /** Modal mode for create/edit operations */
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  /** Search term for filtering action items */
  const [searchTerm, setSearchTerm] = useState<string>('');

  /** Sort order for action items by assignment date */
  const [sortBy, setSortBy] = useState<
    'assignedAt_ASC' | 'assignedAt_DESC' | null
  >(null);

  /** Filter by completion status */
  const [status, setStatus] = useState<ItemStatus | null>(null);

  /** Search field selector (assignee or category) */
  const [searchBy, setSearchBy] = useState<'assignee' | 'category'>('assignee');

  /** Processed and filtered action items */
  const [actionItems, setActionItems] = useState<IActionItemInfo[]>([]);

  /** Modal visibility state for different modal types */
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
    [ModalState.VIEW]: false,
    [ModalState.STATUS]: false,
  });

  /**
   * Opens a specific modal by setting its state to true
   * @param modal - The modal type to open
   */
  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  /**
   * Closes a specific modal by setting its state to false
   * @param modal - The modal type to close
   */
  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  /**
   * Handles modal opening with action item context
   * @param actionItem - The action item to operate on (null for create operations)
   * @param modal - The modal type to open
   */
  const handleModalClick = useCallback(
    (actionItem: IActionItemInfo | null, modal: ModalState): void => {
      if (modal === ModalState.SAME) {
        setModalMode(actionItem ? 'edit' : 'create');
      }
      setActionItem(actionItem);
      openModal(modal);
    },
    [openModal],
  );

  /**
   * Query to fetch action items for the organization.
   * Only accepts organizationId as input - all filtering/sorting done client-side
   */
  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  }: {
    data: IActionItemList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_LIST, {
    variables: {
      input: {
        organizationId: orgId,
      },
    },
  });

  /**
   * Debounced search function to avoid excessive filtering during typing
   */
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  /**
   * Apply client-side filtering and sorting like the category component
   */
  useEffect(() => {
    if (actionItemsData && actionItemsData.actionItemsByOrganization) {
      let filteredItems = actionItemsData.actionItemsByOrganization;

      // Filter by completion status
      if (status !== null) {
        const isCompleted = status === ItemStatus.Completed;
        filteredItems = filteredItems.filter(
          (item) => item.isCompleted === isCompleted,
        );
      }

      // Search filter
      if (searchTerm) {
        filteredItems = filteredItems.filter((item) => {
          if (searchBy === 'assignee') {
            const assigneeName = item.assignee?.name || '';
            return assigneeName
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          } else {
            const categoryName = item.category?.name || '';
            return categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
        });
      }

      // Date sorting
      if (sortBy) {
        filteredItems = [...filteredItems].sort((a, b) => {
          const dateA = new Date(a.assignedAt);
          const dateB = new Date(b.assignedAt);

          if (sortBy === 'assignedAt_DESC') {
            return dateB.getTime() - dateA.getTime();
          } else {
            return dateA.getTime() - dateB.getTime();
          }
        });
      }

      setActionItems(filteredItems);
    }
  }, [actionItemsData, eventId, status, searchTerm, searchBy, sortBy]);

  if (actionItemsLoading) {
    return <Loader size="xl" />;
  }

  if (actionItemsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Action Items' })}
        </h6>
      </div>
    );
  }

  /**
   * Column definitions for the DataGrid component
   */
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
        const assignee = params.row.assignee;
        const displayName = assignee?.name || 'No assignee';
        return (
          <div
            className="d-flex fw-bold align-items-center ms-2"
            data-testid="assigneeName"
            style={{
              height: '100%',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              className={styles.TableImage}
              style={{ flexShrink: 0, marginRight: '8px' }}
            >
              {assignee?.avatarURL ? (
                <img
                  src={assignee.avatarURL}
                  crossOrigin="anonymous"
                  className={styles.TableImage}
                />
              ) : (
                <Avatar
                  key={assignee?.id || 'no-assignee'}
                  name={displayName}
                  alt={displayName}
                />
              )}
            </div>
            <span
              className={!assignee ? 'text-muted' : ''}
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </span>
          </div>
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
            {params.row.category?.name || 'No category'}
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
      field: 'assignedDate',
      headerName: 'Assigned Date',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="assignedDate">
            {dayjs(params.row.assignedAt).format('DD/MM/YYYY')}
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
              size="sm"
              style={{ minWidth: '32px' }}
              className={styles.infoButton}
              data-testid={`viewItemBtn${params.row.id}`}
              onClick={() => handleModalClick(params.row, ModalState.VIEW)}
            >
              <i className="fa fa-info" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className={styles.infoButton}
              data-testid={`editItemBtn${params.row.id}`}
              onClick={() => handleModalClick(params.row, ModalState.SAME)}
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className={styles.actionItemDeleteButton}
              data-testid={`deleteItemBtn${params.row.id}`}
              onClick={() => handleModalClick(params.row, ModalState.DELETE)}
            >
              <i className="fa fa-trash" />
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
              className={styles.checkboxButton}
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
      {/* Header with search, filter and Create Button */}
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <SearchBar
          placeholder={tCommon('searchBy', {
            item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
          })}
          onSearch={(value) => {
            debouncedSearch(value);
          }}
          inputTestId="searchBy"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-3">
          <SortingButton
            title={tCommon('searchBy')}
            sortingOptions={[
              { label: t('assignee'), value: 'assignee' },
              { label: t('category'), value: 'category' },
            ]}
            selectedOption={t(searchBy)}
            onSortChange={(value) =>
              setSearchBy(value as 'assignee' | 'category')
            }
            dataTestIdPrefix="searchByToggle"
            buttonLabel={tCommon('searchBy', { item: '' })}
            className={styles.dropdown}
          />
          <SortingButton
            title={tCommon('sort')}
            sortingOptions={[
              { label: t('latestAssigned'), value: 'assignedAt_DESC' },
              { label: t('earliestAssigned'), value: 'assignedAt_ASC' },
            ]}
            selectedOption={
              sortBy === 'assignedAt_DESC'
                ? t('latestAssigned')
                : sortBy === 'assignedAt_ASC'
                  ? t('earliestAssigned')
                  : tCommon('sort')
            }
            onSortChange={(value) =>
              setSortBy(value as 'assignedAt_DESC' | 'assignedAt_ASC')
            }
            dataTestIdPrefix="sort"
            buttonLabel={tCommon('sort')}
            className={styles.dropdown}
          />
          <SortingButton
            title={t('status')}
            sortingOptions={[
              { label: tCommon('all'), value: 'all' },
              { label: tCommon('pending'), value: ItemStatus.Pending },
              { label: tCommon('completed'), value: ItemStatus.Completed },
            ]}
            selectedOption={
              status === null
                ? tCommon('all')
                : status === ItemStatus.Pending
                  ? tCommon('pending')
                  : tCommon('completed')
            }
            onSortChange={(value) =>
              setStatus(value === 'all' ? null : (value as ItemStatus))
            }
            dataTestIdPrefix="filter"
            buttonLabel={t('status')}
            className={styles.dropdown}
          />
          <Button
            variant="success"
            onClick={() => handleModalClick(null, ModalState.SAME)}
            className={styles.createButton}
            data-testid="createActionItemBtn"
          >
            <i className={'fa fa-plus me-2'} />
            {tCommon('create')}
          </Button>
        </div>
      </div>

      {/* Table with Action Items */}
      <DataGrid
        disableColumnMenu
        disableColumnResize
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row.id}
        sx={{
          backgroundColor: 'white',
          borderRadius: '16px',
          '& .MuiDataGrid-columnHeaders': { border: 'none' },
          '& .MuiDataGrid-cell': { border: 'none' },
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
        }}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noActionItems')}
            </Stack>
          ),
        }}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={actionItems.map((actionItem, index) => ({
          index: index + 1,
          ...actionItem,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />

      {/* Item Modal (Create/Edit) */}
      <ItemModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
        orgId={orgId}
        eventId={eventId}
        actionItemsRefetch={actionItemsRefetch}
        actionItem={actionItem}
        editMode={modalMode === 'edit'}
      />

      {/* View Modal */}
      {actionItem && (
        <>
          <ItemViewModal
            isOpen={modalState[ModalState.VIEW]}
            hide={() => closeModal(ModalState.VIEW)}
            item={actionItem}
          />

          <ItemUpdateStatusModal
            actionItem={actionItem}
            isOpen={modalState[ModalState.STATUS]}
            hide={() => closeModal(ModalState.STATUS)}
            actionItemsRefetch={actionItemsRefetch}
          />

          <ItemDeleteModal
            isOpen={modalState[ModalState.DELETE]}
            hide={() => closeModal(ModalState.DELETE)}
            actionItem={actionItem}
            actionItemsRefetch={actionItemsRefetch}
          />
        </>
      )}
    </div>
  );
}

export default organizationActionItems;
