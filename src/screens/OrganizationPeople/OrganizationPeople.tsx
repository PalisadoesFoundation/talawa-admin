/**
 * OrganizationPeople Component
 *
 * This component renders a paginated and searchable table of organization members,
 * administrators, or users. It provides functionality for sorting, searching, and
 * managing members within an organization.
 *
 * @component
 *
 * @remarks
 * - Uses Apollo Client's `useLazyQuery` for fetching data.
 * - Implements server-side pagination with cursor-based navigation.
 * - Supports filtering by roles (members, administrators, users).
 * - Includes local search functionality for filtering rows by name or email.
 * - Displays a modal for removing members.
 *
 * @requires
 * - `react`, `react-router-dom` for routing and state management.
 * - `@apollo/client` for GraphQL queries.
 * - `@mui/x-data-grid` for table rendering.
 * - `NotificationToast` for notification messages (especially backend errors).
 * - `dayjs` for date formatting.
 * - Custom components: `SearchBar`, `SortingButton`, `Avatar`, `AddMember`, `OrgPeopleListCard`.
 *
 * @example
 * ```tsx
 * <OrganizationPeople />
 * ```
 *
 * @returns {JSX.Element} A JSX element rendering the organization people table.
 *
 * @state
 * - `state` (number): Current tab state (0: members, 1: administrators, 2: users).
 * - `searchTerm` (string): Search input for filtering rows.
 * - `paginationModel` (GridPaginationModel): Pagination state for the table.
 * - `currentRows` (ProcessedRow[]): Processed rows for the current page.
 * - `paginationMeta` (object): Metadata for pagination (hasNextPage, hasPreviousPage).
 * - `showRemoveModal` (boolean): Controls visibility of the remove member modal.
 * - `selectedMemId` (string | undefined): ID of the member selected for removal.
 *
 * @methods
 * - `handlePaginationModelChange`: Handles pagination changes and fetches data accordingly.
 * - `handleSortChange`: Updates the tab state based on sorting selection.
 * - `toggleRemoveModal`: Toggles the visibility of the remove member modal.
 * - `toggleRemoveMemberModal`: Sets the selected member ID and toggles the modal.
 *
 * @dependencies
 * - GraphQL Queries: `ORGANIZATIONS_MEMBER_CONNECTION_LIST`, `USER_LIST_FOR_TABLE`.
 * - Styles: `style/app-fixed.module.css`.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, Link } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import { GridCellParams } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import type {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from '../../types/ReportingTable/interface';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';
import {
  dataGridStyle,
  COLUMN_BUFFER_PX,
  PAGE_SIZE,
} from '../../types/ReportingTable/utils';
import dayjs from 'dayjs';

import styles from 'style/app-fixed.module.css';
import TableLoader from 'components/TableLoader/TableLoader';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { Button } from 'react-bootstrap';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import Avatar from 'components/Avatar/Avatar';
import AddMember from './addMember/AddMember';
import { errorHandler } from 'utils/errorHandler';
// Imports added for manual header construction
import SearchBar from 'shared-components/SearchBar/SearchBar';
import SortingButton from 'subComponents/SortingButton';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { PaginationControl } from 'shared-components/PaginationControl';
import orgPeopleStyles from './OrganizationPeople.module.css';

interface IProcessedRow {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  cursor: string;
  rowNumber: number;
}

interface IEdges {
  cursor: string;
  node: {
    id: string;
    name: string;
    role: string;
    avatarURL: string;
    emailAddress: string;
    createdAt: string;
  };
}

interface IQueryVariable {
  orgId?: string | undefined;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  where?: { role: { equal: 'administrator' | 'regular' } };
}

function OrganizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const role = location?.state;
  const { orgId: currentUrl } = useParams();

  // State
  const [state, setState] = useState(role?.role || 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMemId, setSelectedMemId] = useState<string>();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);

  // Store the current page's cursors from the GraphQL response
  // These are used for cursor-based pagination navigation
  const [cursors, setCursors] = useState<{
    startCursor: string | null;
    endCursor: string | null;
  }>({
    startCursor: null,
    endCursor: null,
  });

  const [currentRows, setCurrentRows] = useState<IProcessedRow[]>([]);
  const [data, setData] = useState<
    | {
        edges: IEdges[];
        pageInfo: {
          startCursor?: string;
          endCursor?: string;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }
    | undefined
  >();

  // Pagination metadata
  const [paginationMeta, setPaginationMeta] = useState<{
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({ hasNextPage: false, hasPreviousPage: false });

  // Query hooks
  const [fetchMembers, { loading: memberLoading, error: memberError }] =
    useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
      onCompleted: (data) => {
        setData(data?.organization?.members);
      },
    });

  const [fetchUsers, { loading: userLoading, error: userError }] = useLazyQuery(
    USER_LIST_FOR_TABLE,
    {
      onCompleted: (data) => {
        setData(data?.allUsers);
      },
    },
  );

  // Handle data changes
  useEffect(() => {
    if (data) {
      const { edges, pageInfo } = data;
      const baseIndex = (currentPage - 1) * pageSize;
      const processedRows = edges.map(
        (edge: IEdges, index: number): IProcessedRow => ({
          id: edge.node.id,
          name: edge.node.name,
          email: edge.node.emailAddress,
          image: edge.node.avatarURL,
          createdAt: edge.node.createdAt || new Date().toISOString(),
          cursor: edge.cursor,
          rowNumber: baseIndex + index + 1,
        }),
      );

      // Store both start and end cursors for the current page
      setCursors({
        startCursor: pageInfo.startCursor || null,
        endCursor: pageInfo.endCursor || null,
      });

      // Update pagination meta information
      setPaginationMeta({
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.hasPreviousPage,
      });

      // Estimate total items for pagination control
      if (pageInfo.hasNextPage) {
        setTotalItems((currentPage + 1) * pageSize);
      } else {
        setTotalItems(baseIndex + edges.length);
      }

      setCurrentRows(processedRows);
    }
  }, [data, currentPage, pageSize]);

  // Handle tab changes (members, admins, users)
  useEffect(() => {
    // Reset pagination when tab changes
    setCurrentPage(1);
    setCursors({ startCursor: null, endCursor: null });

    const variables: IQueryVariable = {
      first: pageSize,
      after: null,
      last: null,
      before: null,
      orgId: currentUrl,
    };

    if (state === 0) {
      // All members
      fetchMembers({ variables });
    } else if (state === 1) {
      // Administrators only
      fetchMembers({
        variables: {
          ...variables,
          where: { role: { equal: 'administrator' } },
        },
      });
    } else if (state === 2) {
      // Users
      fetchUsers({ variables });
    }
  }, [state, currentUrl, pageSize, fetchMembers, fetchUsers]);

  // Initial data fetch
  useEffect(() => {
    const variables: IQueryVariable = {
      orgId: currentUrl,
      first: pageSize,
      after: null,
      last: null,
      before: null,
    };

    if (state === 1) {
      variables.where = { role: { equal: 'administrator' } };
    }

    if (state === 2) {
      fetchUsers({ variables });
    } else {
      fetchMembers({ variables });
    }
  }, [currentUrl, fetchMembers, fetchUsers, pageSize, state]);

  // Handle pagination changes
  const handlePaginationChange = async (newPage: number): Promise<void> => {
    const isForwardNavigation = newPage > currentPage;

    // Check if navigation is allowed
    if (isForwardNavigation && !paginationMeta.hasNextPage) {
      return; // Prevent navigation if there's no next page
    }
    if (!isForwardNavigation && !paginationMeta.hasPreviousPage) {
      return; // Prevent navigation if there's no previous page
    }

    const variables: IQueryVariable = { orgId: currentUrl };

    if (isForwardNavigation) {
      // Forward navigation uses "after" with the endCursor of the current page
      variables.first = pageSize;
      variables.after = cursors.endCursor;
      variables.last = null;
      variables.before = null;
    } else {
      // Backward navigation uses "before" with the startCursor of the current page
      variables.last = pageSize;
      variables.before = cursors.startCursor;
      variables.first = null;
      variables.after = null;
    }

    // Add role filter if on admin tab
    if (state === 1) {
      variables.where = { role: { equal: 'administrator' } };
    }

    setCurrentPage(newPage);

    // Execute the appropriate query based on the current tab
    if (state === 2) {
      await fetchUsers({ variables });
    } else {
      await fetchMembers({ variables });
    }
  };

  const handlePageSizeChange = (newPageSize: number): void => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    setCursors({ startCursor: null, endCursor: null }); // Reset cursors when page size changes

    const variables: IQueryVariable = {
      orgId: currentUrl,
      first: newPageSize,
      after: null,
      last: null,
      before: null,
    };

    if (state === 1) {
      variables.where = { role: { equal: 'administrator' } };
    }

    if (state === 2) {
      fetchUsers({ variables });
    } else {
      fetchMembers({ variables });
    }
  };

  // Error handling
  useEffect(() => {
    if (memberError) {
      errorHandler(t, memberError);
    }
    if (userError) {
      errorHandler(t, userError);
    }
  }, [memberError, userError, t]);

  // Local search implementation
  const filteredRows = useMemo(() => {
    if (!searchTerm) return currentRows;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return currentRows.filter(
      (row) =>
        row.name.toLowerCase().includes(lowerSearchTerm) ||
        row.email.toLowerCase().includes(lowerSearchTerm),
    );
  }, [currentRows, searchTerm]);

  // Modal handlers
  const toggleRemoveModal = () => setShowRemoveModal((prev) => !prev);

  const toggleRemoveMemberModal = (id: string) => {
    setSelectedMemId(id);
    toggleRemoveModal();
  };

  const handleSortChange = (value: string): void => {
    setState(value === 'users' ? 2 : value === 'members' ? 0 : 1);
  };

  // Header titles for the table
  const headerTitles: string[] = [
    tCommon('sl_no'),
    tCommon('profile'),
    tCommon('name'),
    tCommon('email'),
    tCommon('joinedOn'),
    tCommon('action'),
  ];

  // Column definitions
  const columns: ReportingTableColumn[] = [
    {
      field: 'sl_no',
      headerName: tCommon('sl_no'),
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div className={orgPeopleStyles.cellContainer}>
            {params.row.rowNumber}
          </div>
        );
      },
    },
    {
      field: 'profile',
      headerName: tCommon('profile'),
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div className={orgPeopleStyles.profileCell}>
            {params.row?.image ? (
              <img
                src={params.row.image}
                alt={tCommon('avatar')}
                className={orgPeopleStyles.profileImage}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className={orgPeopleStyles.avatarPlaceholder}
                data-testid="avatar"
              >
                <Avatar name={params.row.name} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: 'name',
      headerName: tCommon('name'),
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            to={`/member/${currentUrl}`}
            state={{ id: params.row.id }}
            className={`${orgPeopleStyles.nameLink} ${styles.membername} ${styles.subtleBlueGrey}`}
          >
            {params.row.name}
          </Link>
        );
      },
    },
    {
      field: 'email',
      headerName: tCommon('email'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      sortable: false,
    },
    {
      field: 'joined',
      headerName: tCommon('joinedOn'),
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.row.createdAt).format('DD/MM/YYYY'),
    },
    {
      field: 'action',
      headerName: tCommon('action'),
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <Button
          className={`${styles.removeButton}`}
          variant="danger"
          disabled={state === 2}
          onClick={() => toggleRemoveMemberModal(params.row.id)}
          aria-label={tCommon('removeMember')}
          data-testid="removeMemberModalBtn"
        >
          <Delete />
        </Button>
      ),
    },
  ];

  const gridProps: ReportingTableGridProps = {
    disableColumnMenu: true,
    columnBufferPx: COLUMN_BUFFER_PX,
    getRowId: (row: IProcessedRow) => row.id,
    loading: memberLoading || userLoading,
    slots: {
      noRowsOverlay: () => (
        <EmptyState
          icon="groups"
          message={tCommon('notFound')}
          dataTestId="organization-people-empty-state"
        />
      ),
      loadingOverlay: () => (
        <TableLoader headerTitles={headerTitles} noOfRows={pageSize} />
      ),
    },
    sx: { ...dataGridStyle },
    getRowClassName: () => `${styles.rowBackground}`,
    rowHeight: 70,
    isRowSelectable: () => false,
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <>
      {/* --- FIX START: Standardized Header using manual structure --- */}
      {/* This structure uses the global 'calendar__header' and 'btnsBlock' which we fixed in CSS to ensure perfect alignment. */}
      <div className={styles.calendar__header}>
        <SearchBar
          placeholder={t('searchFullName')}
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          onSearch={(term) => setSearchTerm(term)}
          inputTestId="searchbtn"
          buttonAriaLabel={tCommon('search')}
          // Standard Props for consistency
          showSearchButton={true}
          showLeadingIcon={true}
          showClearButton={true}
        />

        <div className={styles.btnsBlock}>
          <SortingButton
            title={tCommon('sort')}
            sortingOptions={[
              { label: tCommon('members'), value: 'members' },
              { label: tCommon('admin'), value: 'admin' },
              { label: tCommon('users'), value: 'users' },
            ]}
            selectedOption={
              state === 2 ? 'users' : state === 1 ? 'admin' : 'members'
            }
            onSortChange={(value) => handleSortChange(value.toString())}
            dataTestIdPrefix="sort"
          />
          {/* AddMember placed directly in the flex container for correct alignment */}
          <AddMember />
        </div>
      </div>
      {/* --- FIX END --- */}

      <ReportingTable
        rows={filteredRows.map((req) => ({ ...req })) as ReportingRow[]}
        columns={columns}
        gridProps={{ ...gridProps }}
      />

      <div className={orgPeopleStyles.paginationWrapper}>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
          disabled={memberLoading || userLoading}
        />
      </div>

      {showRemoveModal && selectedMemId && (
        <OrgPeopleListCard
          id={selectedMemId}
          toggleRemoveModal={toggleRemoveModal}
        />
      )}
    </>
  );
}

export default OrganizationPeople;
