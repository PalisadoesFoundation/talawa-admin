/**
 * @file EventActionItems.tsx
 * @summary This component renders a comprehensive management interface for action items associated with a specific event.
 *
 * @description
 * The EventActionItems component is responsible for fetching, displaying, and managing all action items linked to a given event ID.
 * It provides a user interface that includes:
 * - A data grid to display the list of action items with details like assignee, category, status, and assigned date.
 * - Functionality to create, view, edit, and delete action items through various modal windows.
 * - Controls for searching by assignee or category, sorting by assignment date, and filtering by completion status.
 * - Logic to differentiate between recurring and non-recurring events to handle template action items and instance-specific exceptions correctly.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.eventId - The unique identifier for the event whose action items are to be displayed.
 * @param {Function} [props.orgActionItemsRefetch] - An optional callback function to trigger a refetch of action items at the organization level, ensuring data consistency across different views.
 *
 * @returns {JSX.Element} A React component that renders the event action items management view.
 */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';

import { Circle, WarningAmberRounded, Group } from '@mui/icons-material';
import dayjs from 'dayjs';

import { useQuery } from '@apollo/client';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';

import type { IActionItemInfo } from 'types/ActionItems/interface';

import styles from 'style/app-fixed.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, Stack } from '@mui/material';
import { debounce } from 'utils/performance';
import ItemViewModal from 'screens/OrganizationActionItems/ActionItemViewModal/ActionItemViewModal';
import ItemModal from 'screens/OrganizationActionItems/ActionItemModal/ActionItemModal';
import ItemDeleteModal from 'screens/OrganizationActionItems/ActionItemDeleteModal/ActionItemDeleteModal';
import Avatar from 'components/Avatar/Avatar';
import ItemUpdateStatusModal from 'screens/OrganizationActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';

enum ItemStatus {
  Pending = 'pending',
  Completed = 'completed',
  Late = 'late',
}

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
  VIEW = 'view',
  STATUS = 'status',
}

interface InterfaceEventActionItemsProps {
  eventId: string;
  orgActionItemsRefetch?: () => void;
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

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

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
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
    [ModalState.VIEW]: false,
    [ModalState.STATUS]: false,
  });

  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

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
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

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

  // Force refetch when eventId changes to ensure exception logic is applied
  // This fixes the caching issue where template data is shown instead of exception data
  useEffect(() => {
    eventActionItemsRefetch();
  }, [eventId, eventActionItemsRefetch]);

  if (eventInfoLoading) {
    return <Loader size="xl" />;
  }

  if (eventInfoError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Action Items' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'assignee',
      headerName: 'Assigned To',
      flex: 1,
      align: 'left',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const volunteer = params.row.volunteer;
        const volunteerGroup = params.row.volunteerGroup;

        let displayName = 'No assignment';
        let avatarKey = 'no-assignment';
        let isAssigned = false;
        let isGroup = false;

        if (volunteer?.user) {
          displayName = volunteer.user.name || 'Unknown Volunteer';
          avatarKey = volunteer.id;
          isAssigned = true;
        } else if (volunteerGroup) {
          displayName = volunteerGroup.name;
          avatarKey = volunteerGroup.id;
          isAssigned = true;
          isGroup = true;
        }

        return (
          <div
            className="d-flex fw-bold align-items-center ms-2"
            data-testid="assigneeName"
            style={{ height: '100%' }}
          >
            <div className={styles.TableImage}>
              <Avatar key={avatarKey} name={displayName} alt={displayName} />
            </div>
            <span className={!isAssigned ? 'text-muted' : ''}>
              {displayName}
            </span>
            {isGroup && (
              <Group
                fontSize="small"
                className="ms-1"
                style={{ color: '#6c757d' }}
                data-testid="groupIcon"
              />
            )}
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
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <SearchBar
          placeholder={tCommon('searchBy', {
            item:
              searchBy === 'assignee'
                ? 'Assigned To'
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
            onClick={() => handleModalClick(null, ModalState.SAME)}
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

      <ItemModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
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
            isOpen={modalState[ModalState.VIEW]}
            hide={() => closeModal(ModalState.VIEW)}
            item={actionItem}
          />

          <ItemUpdateStatusModal
            actionItem={actionItem}
            isOpen={modalState[ModalState.STATUS]}
            hide={() => closeModal(ModalState.STATUS)}
            actionItemsRefetch={eventActionItemsRefetch}
            isRecurring={isRecurring}
            eventId={eventId}
          />

          <ItemDeleteModal
            isOpen={modalState[ModalState.DELETE]}
            hide={() => closeModal(ModalState.DELETE)}
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
