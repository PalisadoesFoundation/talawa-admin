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
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';
import {
  Circle,
  WarningAmberRounded,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { ACTION_ITEM_FOR_ORGANIZATION } from 'GraphQl/Queries/ActionItemQueries';
import styles from '../../style/app-fixed.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
  GridPagination,
} from '@mui/x-data-grid';
import { Chip, debounce, IconButton } from '@mui/material';
import ItemViewModal from './itemViewModal/ItemViewModal';
import ItemModal from './itemModal/ItemModal';
import ItemDeleteModal from './itemDeleteModal/ItemDeleteModal';
import Avatar from 'components/Avatar/Avatar';
import ItemUpdateStatusModal from './itemUpdateModal/ItemUpdateStatusModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';
import type { InterfaceActionItem } from 'utils/interfaces';

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

type PaginatedActionItems = {
  actionItemsByOrganization: {
    edges: Array<{
      node: InterfaceActionItem;
    }>;
    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
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

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

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
    [],
  );

  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  } = useQuery<PaginatedActionItems>(ACTION_ITEM_FOR_ORGANIZATION, {
    variables: {
      organizationId: orgId,
      first: before ? null : paginationModel.pageSize, // Only use first when not using before
      last: before ? paginationModel.pageSize : null, // Only use last when using before
      after: after,
      before: before,
    },
  });

  const flattenedActionItems = useMemo(() => {
    if (!actionItemsData?.actionItemsByOrganization?.edges) return [];
    return actionItemsData.actionItemsByOrganization.edges.map(
      (edge) => edge.node,
    );
  }, [actionItemsData]);

  const assigneeIds =
    flattenedActionItems
      .map((item) => item.assignee?.id)
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

  const getAssigneeName = (assigneeId: string | null): string => {
    if (!assigneeId) return 'Unassigned';

    if (!usersData?.usersByIds) {
      return 'Unknown User';
    }

    const user = usersData.usersByIds.find(
      (user: User) => user.id === assigneeId,
    );

    if (user) {
      return user.name;
    } else {
      return 'Unknown User';
    }
  };

  const categoryIds = Array.from(
    new Set(
      flattenedActionItems
        .map((item) => item.category?.id)
        .filter((id): id is string => id != null),
    ),
  );

  const { data: categoriesData } = useQuery(GET_CATEGORIES_BY_IDS, {
    variables: { ids: categoryIds },
    skip: !categoryIds.length,
  });

  const enrichedActionItems = useMemo(() => {
    if (!flattenedActionItems.length) return [];
    return flattenedActionItems.map((item) => {
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
  }, [flattenedActionItems]);

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

  const handlePageChange = (newPage: number) => {
    const pageInfo = actionItemsData?.actionItemsByOrganization.pageInfo;

    if (newPage > paginationModel.page) {
      // Going forward - use endCursor
      if (pageInfo?.hasNextPage) {
        setAfter(pageInfo.endCursor);
        setBefore(null);
        setPaginationModel({
          ...paginationModel,
          page: newPage,
        });
      }
    } else if (newPage < paginationModel.page) {
      // Going backward - use startCursor
      if (pageInfo?.hasPreviousPage) {
        // When going backward, use last instead of first, and before instead of after
        setBefore(pageInfo.startCursor);
        setAfter(null);
        setPaginationModel({
          ...paginationModel,
          page: newPage,
        });

        // Make sure refetch uses 'last' parameter instead of 'first' when going backward
        actionItemsRefetch({
          organizationId: orgId,
          last: paginationModel.pageSize, // Use 'last' instead of 'first'
          before: pageInfo.startCursor,
          after: null,
          where:
            status !== null
              ? { isCompleted: status === ItemStatus.Completed }
              : undefined,
        });
        return; // Return to prevent the default refetch below
      }
    }

    // Default refetch (for forward navigation)
    actionItemsRefetch({
      organizationId: orgId,
      first: paginationModel.pageSize,
      after: pageInfo?.endCursor || null,
      before: null,
      where:
        status !== null
          ? { isCompleted: status === ItemStatus.Completed }
          : undefined,
    });
  };

  useEffect(() => {
    if (actionItemsLoading) {
      // console.log('⏳ Loading action items...');
    }

    if (actionItemsError) {
      // Handle error
    }
  }, [actionItemsLoading, actionItemsData, actionItemsError]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  useEffect(() => {
    // Reset pagination when filters change
    setAfter(null);
    setBefore(null);
    setPaginationModel({
      ...paginationModel,
      page: 0,
    });

    actionItemsRefetch({
      organizationId: orgId,
      first: paginationModel.pageSize,
      after: null,
      before: null,
      where:
        status !== null
          ? { isCompleted: status === ItemStatus.Completed }
          : undefined,
    });
  }, [sortBy, status, actionItemsRefetch, orgId, paginationModel.pageSize]);

  if (actionItemsLoading && !flattenedActionItems.length) {
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
          <div className="d-flex fw-bold align-items-center ms-2">
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

  // Calculate total count for pagination
  const pageInfo = actionItemsData?.actionItemsByOrganization.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage || false;
  const hasPreviousPage = pageInfo?.hasPreviousPage || false;

  // We don't have exact total count from the API, so we estimate based on current page
  const rowCount = hasNextPage
    ? (paginationModel.page + 2) * paginationModel.pageSize
    : (paginationModel.page + 1) * paginationModel.pageSize;

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
            className={styles.dropdown}
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
            className={styles.dropdown}
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

      {actionItemsLoading && filteredAndSortedActionItems.length === 0 ? (
        <div className="text-center p-4">
          <Loader size="lg" />
        </div>
      ) : (
        <DataGrid
          disableColumnMenu
          disableColumnResize
          columnBufferPx={7}
          autoHeight
          rowHeight={65}
          rows={
            filteredAndSortedActionItems.map((actionItem) => ({
              ...actionItem,
              status: actionItem.isCompleted ? 'Completed' : 'Pending',
            })) || []
          }
          columns={columns}
          disableRowSelectionOnClick
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => {
            handlePageChange(newModel.page);
          }}
          rowCount={rowCount}
          pageSizeOptions={[10]}
          paginationMode="server"
          loading={actionItemsLoading}
          pagination
          slots={{
            pagination: GridPagination,
          }}
          slotProps={{
            pagination: {
              showFirstButton: true,
              showLastButton: true,
              getItemAriaLabel: (type) => {
                return type === 'next'
                  ? 'Go to next page'
                  : 'Go to previous page';
              },
              nextIconButtonProps: {
                disabled: !hasNextPage,
              },
              backIconButtonProps: {
                disabled: !hasPreviousPage,
              },
            },
          }}
        />
      )}

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
