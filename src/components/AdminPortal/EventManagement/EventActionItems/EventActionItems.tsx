/**
 * Renders a management interface for action items associated with a specific event.
 *
 * This component is responsible for fetching, displaying, and managing all action
 * items linked to a given event ID.
 *
 * @remarks
 * The interface provides:
 * - A data grid displaying action item details such as assignee, category, status,
 *   and assigned date.
 * - Modals for creating, viewing, editing, and deleting action items.
 * - Search by assignee or category, sorting by assignment date, and filtering
 *   by completion status.
 * - Logic to correctly handle recurring and non-recurring events, including
 *   template action items and instance-specific exceptions.
 *
 * @param props - Component props with the following properties:
 *   - eventId: Unique identifier of the event whose action items are displayed.
 *   - orgActionItemsRefetch: Optional callback to refetch organization-level
 *     action items for data consistency.
 *
 * @returns A React element that renders the event action items management view.
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import { Navigate, useParams } from 'react-router';

import { WarningAmberRounded, Group } from '@mui/icons-material';
import dayjs from 'dayjs';

import { useQuery } from '@apollo/client';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';

import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';

import styles from './EventActionItems.module.css';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import {
  DataGrid,
  type GridCellParams,
  type TokenAwareGridColDef,
  convertTokenColumns,
} from 'shared-components/DataGridWrapper';
import { debounceInput } from 'utils/performance';
import { Stack } from '@mui/material';
import ItemViewModal from 'shared-components/ActionItems/ActionItemViewModal/ActionItemViewModal';
import ItemModal from 'shared-components/ActionItems/ActionItemModal/ActionItemModal';
import ItemDeleteModal from 'shared-components/ActionItems/ActionItemDeleteModal/ActionItemDeleteModal';
import Avatar from 'shared-components/Avatar/Avatar';
import ItemUpdateStatusModal from 'shared-components/ActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import type { InterfaceEventActionItemsProps } from 'types/AdminPortal/EventManagement/EventActionItems/interface';

enum ItemStatus {
  Pending = 'pending',
  Completed = 'completed',
  Late = 'late',
}

const EventActionItems: React.FC<InterfaceEventActionItemsProps> = ({
  eventId,
  orgActionItemsRefetch,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId } = useParams();

  const [actionItem, setActionItem] = useState<IActionItemInfo | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'assignedAt_ASC' | 'assignedAt_DESC' | null
  >(null);
  const [status, setStatus] = useState<ItemStatus | null>(null);
  const [searchBy, setSearchBy] = useState<'assignee' | 'category'>('assignee');
  const [actionItems, setActionItems] = useState<IActionItemInfo[]>([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [baseEvent, setBaseEvent] = useState<{ id: string } | null>(null);

  const itemModal = useModalState();
  const deleteModal = useModalState();
  const viewModal = useModalState();
  const statusModal = useModalState();

  const handleOpenItemModal = useCallback(
    (item: IActionItemInfo | null): void => {
      setModalMode(item ? 'edit' : 'create');
      setActionItem(item);
      itemModal.open();
    },
    [],
  );

  const handleOpenViewModal = useCallback((item: IActionItemInfo): void => {
    setActionItem(item);
    viewModal.open();
  }, []);

  const handleOpenDeleteModal = useCallback((item: IActionItemInfo): void => {
    setActionItem(item);
    deleteModal.open();
  }, []);

  const handleOpenStatusModal = useCallback((item: IActionItemInfo): void => {
    setActionItem(item);
    statusModal.open();
  }, []);

  const {
    data: eventData,
    loading: eventInfoLoading,
    error: eventInfoError,
    refetch: eventActionItemsRefetch,
  } = useQuery(GET_EVENT_ACTION_ITEMS, {
    variables: {
      input: {
        id: eventId,
      },
    },
    // Use cache-first but ensure fresh data for recurring event instances
    // This prevents cached action items from showing template data instead of instance exception data
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    // Force refetch when eventId changes to ensure exception logic is applied
    nextFetchPolicy: 'cache-and-network',
  });

  const debouncedSearch = useMemo(
    () => debounceInput((value: string) => setSearchTerm(value), 300),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (eventData && eventData.event) {
      const items = eventData.event.actionItems.edges.map(
        (edge: { node: IActionItemInfo }) => edge.node,
      );
      let filteredItems = items;

      if (status !== null) {
        const isCompleted = status === ItemStatus.Completed;
        filteredItems = filteredItems.filter(
          (item: IActionItemInfo) => item.isCompleted === isCompleted,
        );
      }

      if (searchTerm) {
        filteredItems = filteredItems.filter((item: IActionItemInfo) => {
          if (searchBy === 'assignee') {
            // Search in volunteer user name or volunteer group name
            const volunteerName = item.volunteer?.user?.name || '';
            const volunteerGroupName = item.volunteerGroup?.name || '';
            const searchLower = searchTerm.toLowerCase();

            return (
              volunteerName.toLowerCase().includes(searchLower) ||
              volunteerGroupName.toLowerCase().includes(searchLower)
            );
          } else {
            const categoryName = item.category?.name || '';
            return categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
        });
      }

      if (sortBy) {
        filteredItems = [...filteredItems].sort(
          (a: IActionItemInfo, b: IActionItemInfo) => {
            const dateA = new Date(a.assignedAt);
            const dateB = new Date(b.assignedAt);

            if (sortBy === 'assignedAt_DESC') {
              return dateB.getTime() - dateA.getTime();
            } else {
              return dateA.getTime() - dateB.getTime();
            }
          },
        );
      }

      setActionItems(filteredItems);
      setIsRecurring(!!eventData.event.recurrenceRule);
      setBaseEvent(eventData.event.baseEvent);
    }
  }, [eventData, status, searchTerm, searchBy, sortBy]);

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  if (eventInfoLoading) {
    return (
      <LoadingState isLoading={eventInfoLoading} variant="spinner">
        <div />
      </LoadingState>
    );
  }

  if (eventInfoError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={`${styles.icon} ${styles.iconLarge}`} />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Action Items' })}
        </h6>
      </div>
    );
  }

  const columns: TokenAwareGridColDef[] = [
    {
      field: 'assignee',
      headerName: t('assignedTo'),
      flex: 1,
      align: 'left',
      minWidth: 'space-13',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const volunteer = params.row.volunteer;
        const volunteerGroup = params.row.volunteerGroup;

        let displayName = t('noAssignment');
        let isAssigned = false;
        let isGroup = false;

        if (volunteer?.user) {
          displayName = volunteer.user.name || t('unknownVolunteer');
          isAssigned = true;
        } else if (volunteerGroup) {
          displayName = volunteerGroup.name;
          isAssigned = true;
          isGroup = true;
        }

        return (
          <div
            className={`d-flex fw-bold align-items-center ms-2 ${styles.assigneeCellContainer}`}
            data-testid="assigneeName"
          >
            <div className={styles.TableImage}>
              <Avatar name={displayName} alt={displayName} />
            </div>
            <span className={!isAssigned ? 'text-muted' : ''}>
              {displayName}
            </span>
            {isGroup && (
              <Group
                fontSize="small"
                className={`ms-1 ${styles.groupIconSecondary}`}
                data-testid="groupIcon"
              />
            )}
          </div>
        );
      },
    },
    {
      field: 'itemCategory',
      headerName: t('itemCategory'),
      flex: 1,
      align: 'center',
      minWidth: 'space-13',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="categoryName"
          >
            {params.row.category?.name || t('noCategory')}
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <StatusBadge
            variant={params.row.isCompleted ? 'completed' : 'pending'}
            size="sm"
            dataTestId="statusChip"
          />
        );
      },
    },
    {
      field: 'assignedDate',
      headerName: t('assignedDate'),
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
      headerName: t('options'),
      align: 'center',
      flex: 1,
      minWidth: 'space-13',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              size="sm"
              className={styles.infoButton}
              data-testid={`viewItemBtn${params.row.id}`}
              onClick={() => handleOpenViewModal(params.row)}
              aria-label={t('details')}
            >
              <i className="fa fa-info" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className={styles.infoButton}
              data-testid={`editItemBtn${params.row.id}`}
              onClick={() => handleOpenItemModal(params.row)}
              aria-label={t('editActionItem')}
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className={styles.actionItemDeleteButton}
              data-testid={`deleteItemBtn${params.row.id}`}
              onClick={() => handleOpenDeleteModal(params.row)}
              aria-label={t('deleteActionItem')}
            >
              <i className="fa fa-trash" />
            </Button>
          </>
        );
      },
    },
    {
      field: 'completed',
      headerName: t('completed'),
      align: 'center',
      flex: 1,
      minWidth: 'space-13',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex align-items-center justify-content-center mt-3">
            <input
              type="checkbox"
              data-testid={`statusCheckbox${params.row.id}`}
              className={styles.checkboxButton}
              checked={params.row.isCompleted}
              onChange={() => handleOpenStatusModal(params.row)}
              aria-label={
                params.row.isCompleted
                  ? t('actionItemCompleted')
                  : t('markCompletion')
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <SearchBar
          placeholder={tCommon('searchBy', {
            item:
              searchBy === 'assignee'
                ? tCommon('assignedTo')
                : searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
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
              { label: t('assignedTo'), value: 'assignee' },
              { label: t('category'), value: 'category' },
            ]}
            selectedOption={
              searchBy === 'assignee' ? t('assignedTo') : t('category')
            }
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
            onClick={() => handleOpenItemModal(null)}
            className={styles.createButton}
            data-testid="createActionItemBtn"
            data-cy="createActionItemBtn"
          >
            <i className={'fa fa-plus me-2'} />
            {tCommon('create')}
          </Button>
        </div>
      </div>

      <DataGrid
        disableColumnMenu
        disableColumnResize
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row.id}
        sx={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-xl)',
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
        columns={convertTokenColumns(columns)}
        isRowSelectable={() => false}
      />

      <ItemModal
        isOpen={itemModal.isOpen}
        hide={itemModal.close}
        orgId={orgId}
        eventId={eventId}
        actionItemsRefetch={eventActionItemsRefetch}
        orgActionItemsRefetch={orgActionItemsRefetch}
        actionItem={actionItem}
        editMode={modalMode === 'edit'}
        isRecurring={isRecurring}
        baseEvent={baseEvent}
      />

      {actionItem && (
        <>
          <ItemViewModal
            isOpen={viewModal.isOpen}
            hide={viewModal.close}
            item={actionItem}
          />

          <ItemUpdateStatusModal
            actionItem={actionItem}
            isOpen={statusModal.isOpen}
            hide={statusModal.close}
            actionItemsRefetch={eventActionItemsRefetch}
            isRecurring={isRecurring}
            eventId={eventId}
          />

          <ItemDeleteModal
            isOpen={deleteModal.isOpen}
            hide={deleteModal.close}
            actionItem={actionItem}
            actionItemsRefetch={eventActionItemsRefetch}
            eventId={eventId}
            isRecurring={isRecurring}
          />
        </>
      )}
    </div>
  );
};

export default EventActionItems;
