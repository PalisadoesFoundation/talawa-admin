/**
 * Component: OrganizationActionItems
 *
 * This component renders a table of action items for a specific organization and event.
 * It provides functionality to search, filter, sort, and manage action items.
 *
 * Features:
 * - Fetches action items using GraphQL query based on filters and sorting.
 * - Displays action items in a data grid with columns for assignee, category, status, allotted hours, and due date.
 * - Allows users to create, edit, view, delete, and update the status of action items via modals.
 * - Includes search functionality with debounce for optimized performance.
 * - Provides sorting and filtering options for better data management.
 *
 * Props:
 * - None (Relies on URL parameters for organization and event IDs).
 *
 * State:
 * - `actionItem`: Stores the currently selected action item for modal operations.
 * - `modalMode`: Determines whether the modal is in 'create' or 'edit' mode.
 * - `searchTerm`: Stores the search input value.
 * - `sortBy`: Stores the sorting criteria for due dates.
 * - `status`: Filters action items by their status (Pending, Completed, or Late).
 * - `searchBy`: Determines whether to search by 'assignee' or 'category'.
 * - `modalState`: Tracks the visibility of different modals (Create/Edit, View, Delete, Status Update).
 *
 * Dependencies:
 * - React, React Router, Apollo Client, Material-UI, Bootstrap, Day.js, and custom components.
 *
 * GraphQL:
 * - Query: `ACTION_ITEM_LIST` - Fetches action items based on organization ID, event ID, filters, and sorting.
 *
 * Modals:
 * - `ItemModal`: For creating or editing action items.
 * - `ItemViewModal`: For viewing action item details.
 * - `ItemDeleteModal`: For confirming and deleting action items.
 * - `ItemUpdateStatusModal`: For updating the status of an action item.
 *
 * Error Handling:
 * - Displays an error message if the GraphQL query fails.
 *
 * Loading State:
 * - Displays a loader while fetching data.
 *
 * @returns JSX.Element - The rendered OrganizationActionItems component.
 */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import {
  GET_USERS_BY_IDS,
  GET_EVENTS_BY_IDS,
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';
import { Circle, WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { ACTION_ITEM_FOR_ORGANIZATION } from 'GraphQl/Queries/ActionItemQueries';
import styles from '../../style/app-fixed.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, debounce } from '@mui/material';
import ItemViewModal from './itemViewModal/ItemViewModal';
import ItemModal from './itemModal/ItemModal';
import ItemDeleteModal from './itemDeleteModal/ItemDeleteModal';
import Avatar from 'components/Avatar/Avatar';
import ItemUpdateStatusModal from './itemUpdateModal/ItemUpdateStatusModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';
import type { InterfaceActionItem } from 'utils/interfaces';

type EventType = {
  id: string;
  name: string;
};

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

type User = {
  id: string;
  name: string;
  emailAddress: string;
};
/**
 * Component for managing and displaying action items within an organization.
 * This component allows users to view, filter, sort, and create action items. It also handles fetching and displaying related data such as action item categories and members.
 * @returns The rendered component.
 */

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

  const [actionItem, setActionItem] = useState<InterfaceActionItem | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate_ASC' | 'dueDate_DESC' | null>(
    null,
  );
  const [status, setStatus] = useState<ItemStatus | null>(null);
  const [searchBy, setSearchBy] = useState<'assignee' | 'category'>('assignee');
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
    (actionItem: InterfaceActionItem | null, modal: ModalState): void => {
      if (modal === ModalState.SAME) {
        setModalMode(actionItem ? 'edit' : 'create');
      }
      setActionItem(actionItem);
      openModal(modal);
    },
    [openModal],
  );

  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  } = useQuery<{ actionItemsByOrganization: InterfaceActionItem[] }>(
    ACTION_ITEM_FOR_ORGANIZATION,
    {
      variables: { organizationId: orgId },
    },
  );

  const assigneeIds =
    actionItemsData?.actionItemsByOrganization
      .map((item) => item.assigneeId)
      .filter((id): id is string => id !== null) || [];

  const { data: usersData } = useQuery(GET_USERS_BY_IDS, {
    skip: assigneeIds.length === 0,
    variables: { input: { ids: assigneeIds } },
  });

  if (actionItemsData) {
    console.log('Fetched Action Items Data:', actionItemsData);
  } else {
    console.log('No Action Items Data', actionItemsError);
  }

  // useEffect(() => {
  //   if (userLoading) {
  //     // console.log("Loading users ...");
  //   }

  //   if (userError) {
  //     // console.error("Error fetching users:", userError.message);
  //   }
  // }, [userLoading, userError]);

  const getAssigneeName = (assigneeId: string | null): string => {
    if (!assigneeId) return 'Unassigned';

    if (!usersData?.usersByIds) {
      return 'Unknown User';
    }

    const user = usersData.usersByIds.find(
      (user: User) => user.id === assigneeId,
    );

    if (user) {
      // console.log("Found user:", user);
      return user.name;
    } else {
      return 'Unknown User';
    }
  };

  const categoryIds = Array.from(
    new Set(
      actionItemsData?.actionItemsByOrganization
        .map((item) => item.categoryId)
        .filter((id): id is string => id != null),
    ),
  );

  const { data: categoriesData } = useQuery(GET_CATEGORIES_BY_IDS, {
    variables: { ids: categoryIds },
    skip: !categoryIds.length,
  });

  const enrichedActionItems = useMemo(() => {
    if (!actionItemsData?.actionItemsByOrganization) return [];
    return actionItemsData.actionItemsByOrganization.map((item) => {
      return {
        ...item,
        assigneeId: item.assignee?.id ?? null,
        categoryId: item.category?.id ?? null,
        eventId: item.event?.id ?? null,
        creatorId: item.creator?.id ?? null,
        updaterId: item.updater?.id ?? null,
        organizationId: item.organization?.id ?? null,
        categoryName: item.category?.name ?? 'No Category',
        assigneeName: item.assignee?.name ?? 'Unassigned',
      };
    });
  }, [actionItemsData]);

  const eventIds =
    actionItemsData?.actionItemsByOrganization
      .map((item) => item.eventId)
      .filter((id): id is string => id !== null) || [];

  const { data: eventsData } = useQuery(GET_EVENTS_BY_IDS, {
    skip: eventIds.length === 0,
    variables: { ids: eventIds },
  });

  const filteredAndSortedActionItems = useMemo(() => {
    if (!enrichedActionItems.length) return [];

    let items = [...enrichedActionItems];

    // Apply search filtering
    if (searchTerm) {
      items = items.filter((item) =>
        searchBy === 'assignee'
          ? getAssigneeName(item.assigneeId)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : (item.categoryName || 'No Category')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
      );
    }

    if (status !== null) {
      items = items.filter((item) =>
        status === ItemStatus.Pending ? !item.isCompleted : item.isCompleted,
      );
    }

    // Apply sorting
    if (sortBy) {
      items.sort((a, b) => {
        const dateA = a.completionAt ? new Date(a.completionAt).getTime() : 0;
        const dateB = b.completionAt ? new Date(b.completionAt).getTime() : 0;
        return sortBy === 'dueDate_DESC' ? dateB - dateA : dateA - dateB;
      });
    }

    return items;
  }, [
    enrichedActionItems,
    searchTerm,
    searchBy,
    status,
    sortBy,
    getAssigneeName,
  ]);
  const getEventDetails = (eventId: string | null): string => {
    if (!eventId) return 'No Event Assigned';

    const event = eventsData?.eventsByIds?.find(
      (evt: EventType) => evt.id === eventId,
    );
    return event ? `${event.name}` : 'Unknown Event';
  };

  // Logging data to ensure correctness
  useEffect(() => {
    if (eventsData) {
      // console.log("Fetched Events Data:", eventsData);
    }
  }, [eventsData]);

  useEffect(() => {
    if (actionItemsLoading) {
      // console.log('⏳ Loading action items...');
    }

    // if (actionItemsData) {
    //   console.log(
    //     ' Action Items Data:',
    //     JSON.stringify(actionItemsData, null, 2),
    //   );
    // }

    if (actionItemsError) {
    }
  }, [actionItemsLoading, actionItemsData, actionItemsError]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );
  // console.log(searchTerm);
  useEffect(() => {
    actionItemsRefetch();
  }, [sortBy, status, actionItemsRefetch]);

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
        const name = params.row.assignee?.name || 'Unassigned';

        return (
          <div
            className="d-flex fw-bold align-items-center ms-2"
            data-testid="assigneeName"
          >
            <div className={styles.TableImage}>
              <Avatar
                key={params.row.id}
                containerStyle={styles.imageContainer}
                avatarStyle={styles.TableImage}
                name={name}
                alt={name}
              />
            </div>
            {name}
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
      renderCell: (params: GridCellParams) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="categoryName"
        >
          {params.row.category?.name || 'No Category'}
        </div>
      ),
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
      field: 'allottedHours',
      headerName: 'Allotted Hours',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => (
        <div className="d-flex justify-content-center fw-bold">
          {params.row.allottedHours ?? 'N/A'}
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date of Creation',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const createdDate = params.row.createdAt;
        return (
          <div data-testid="createdDate">
            {createdDate
              ? dayjs(createdDate).format('DD/MM/YYYY')
              : 'No Created Date'}
          </div>
        );
      },
    },
    {
      field: 'completionAt',
      headerName: 'Completion Date',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const completionDate = params.row.completionAt;
        return (
          <div data-testid="completionDate">
            {completionDate
              ? dayjs(completionDate).format('DD/MM/YYYY')
              : 'No Completion Date'}
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
      {/* Header with search, filter  and Create Button */}
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
              // { label: t('category'), value: 'category' },
            ]}
            selectedOption={t(searchBy)}
            onSortChange={(value) =>
              setSearchBy(
                value as 'assignee',
                // 'category'
              )
            }
            dataTestIdPrefix="searchByToggle"
            buttonLabel={tCommon('searchBy', { item: '' })}
            className={styles.dropdown} // Pass a custom class name if needed
          />
          <SortingButton
            title={tCommon('sort')}
            sortingOptions={[
              { label: t('latestDueDate'), value: 'dueDate_DESC' },
              { label: t('earliestDueDate'), value: 'dueDate_ASC' },
            ]}
            selectedOption={t(
              sortBy === 'dueDate_DESC' ? 'latestDueDate' : 'earliestDueDate',
            )}
            onSortChange={(value) =>
              setSortBy(value as 'dueDate_DESC' | 'dueDate_ASC')
            }
            dataTestIdPrefix="sort"
            buttonLabel={tCommon('sort')}
            className={styles.dropdown} // Pass a custom class name if needed
          />
          <SortingButton
            title={t('status')}
            sortingOptions={[
              { label: tCommon('all'), value: 'all' },
              { label: tCommon('pending'), value: ItemStatus.Pending },
              { label: tCommon('completed'), value: ItemStatus.Completed },
            ]}
            selectedOption={t(
              status === null
                ? 'all'
                : status === ItemStatus.Pending
                  ? 'pending'
                  : 'completed',
            )}
            onSortChange={(value) =>
              setStatus(value === 'all' ? null : (value as ItemStatus))
            }
            dataTestIdPrefix="filter"
            buttonLabel={t('status')}
            className={styles.dropdown} // Pass a custom class name if needed
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

      <DataGrid
        disableColumnMenu
        disableColumnResize
        columnBufferPx={7}
        hideFooter
        getRowId={(row) => row.id}
        autoHeight
        rowHeight={65}
        rows={
          filteredAndSortedActionItems.map((actionItem) => ({
            ...actionItem,
            assigneeName: getAssigneeName(actionItem.assigneeId), // Still need this for assignee name
            status: actionItem.isCompleted ? 'Completed' : 'Pending',
          })) || []
        }
        columns={columns}
        isRowSelectable={() => false}
      />

      <ItemModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
        orgId={orgId}
        eventId={eventId}
        actionItemsRefetch={actionItemsRefetch}
        actionItem={actionItem}
        editMode={modalMode === 'edit'}
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
