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
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, Link } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import { GridCellParams, GridPaginationModel } from '@mui/x-data-grid';
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
import AdminSearchFilterBar from 'components/AdminSearchFilterBar/AdminSearchFilterBar';

import EmptyState from 'shared-components/EmptyState/EmptyState';
import { errorHandler } from 'utils/errorHandler';

// Helper mapping for state to option conversion
const STATE_TO_OPTION: Record<number, string> = {
  0: 'members',
  1: 'admin',
  2: 'users',
};

const OPTION_TO_STATE: Record<string, number> = {
  members: 0,
  admin: 1,
  users: 2,
};

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
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  // Cursor management - properly capturing startCursor and endCursor
  const pageCursors = useRef<{
    [page: number]: { startCursor: string; endCursor: string };
  }>({});
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
      const baseIndex = paginationModel.page * PAGE_SIZE;
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
      if (pageInfo.startCursor && pageInfo.endCursor) {
        pageCursors.current[paginationModel.page] = {
          startCursor: pageInfo.startCursor,
          endCursor: pageInfo.endCursor,
        };
      }

      // Update pagination meta information
      setPaginationMeta({
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.hasPreviousPage,
      });

      setCurrentRows(processedRows);
    }
  }, [data, paginationModel.page]);

  // Handle tab changes (members, admins, users)
  useEffect(() => {
    // Reset pagination when tab changes
    setPaginationModel({ page: 0, pageSize: PAGE_SIZE });
    pageCursors.current = {};

    const variables: IQueryVariable = {
      first: PAGE_SIZE,
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
  }, [state, currentUrl, fetchMembers, fetchUsers]);

  // Initial data fetch
  useEffect(() => {
    fetchMembers({
      variables: {
        orgId: currentUrl,
        first: PAGE_SIZE,
        after: null,
        last: null,
        before: null,
      },
    });
  }, [currentUrl, fetchMembers]);

  // Handle pagination changes
  const handlePaginationModelChange = async (
    newPaginationModel: GridPaginationModel,
  ) => {
    const isForwardNavigation = newPaginationModel.page > paginationModel.page;

    // Check if navigation is allowed
    if (isForwardNavigation && !paginationMeta.hasNextPage) {
      return; // Prevent navigation if there's no next page
    }
    if (!isForwardNavigation && !paginationMeta.hasPreviousPage) {
      return; // Prevent navigation if there's no previous page
    }

    const currentPage = paginationModel.page;
    const currentPageCursors = pageCursors.current[currentPage];

    const variables: IQueryVariable = { orgId: currentUrl };

    if (isForwardNavigation) {
      // Forward navigation uses "after" with the endCursor of the current page
      variables.first = PAGE_SIZE;
      variables.after = currentPageCursors?.endCursor;
      variables.last = null;
      variables.before = null;
    } else {
      // Backward navigation uses "before" with the startCursor of the current page
      variables.last = PAGE_SIZE;
      variables.before = currentPageCursors?.startCursor;
      variables.first = null;
      variables.after = null;
    }

    // Add role filter if on admin tab
    if (state === 1) {
      variables.where = { role: { equal: 'administrator' } };
    }

    setPaginationModel(newPaginationModel);

    // Execute the appropriate query based on the current tab
    if (state === 2) {
      await fetchUsers({ variables });
    } else {
      await fetchMembers({ variables });
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
    setState(OPTION_TO_STATE[value] ?? 0);
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
          <div className={`${styles.flexCenter} ${styles.fullWidthHeight}`}>
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
        const columnWidth = params.colDef.computedWidth || 150;
        const imageSize = Math.min(columnWidth * 0.4, 40);
        // Construct CSS value to avoid i18n linting errors
        const avatarSizeValue = String(imageSize) + 'px';
        return (
          <div
            className={`${styles.flexCenter} ${styles.flexColumn} ${styles.fullWidthHeight}`}
          >
            {params.row?.image ? (
              <img
                src={params.row.image}
                alt={tCommon('avatar')}
                className={styles.avatarImage}
                style={
                  { '--avatar-size': avatarSizeValue } as React.CSSProperties
                }
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className={`${styles.flexCenter} ${styles.avatarPlaceholder} ${styles.avatarPlaceholderSize}`}
                style={
                  { '--avatar-size': avatarSizeValue } as React.CSSProperties
                }
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
            className={`${styles.membername} ${styles.subtleBlueGrey} ${styles.memberNameFontSize}`}
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
    rowCount:
      paginationModel.page * PAGE_SIZE +
      currentRows.length +
      (paginationMeta.hasNextPage ? PAGE_SIZE : 0),
    paginationMode: 'server',
    pagination: true,
    paginationModel,
    onPaginationModelChange: handlePaginationModelChange,
    pageSizeOptions: [PAGE_SIZE],
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
        <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
      ),
    },
    sx: { ...dataGridStyle },
    getRowClassName: () => `${styles.rowBackground}`,
    rowHeight: 70,
    isRowSelectable: () => false,
  };

  return (
    <>
      <AdminSearchFilterBar
        hasDropdowns={true}
        searchPlaceholder={t('searchFullName')}
        searchValue={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        searchInputTestId="searchbtn"
        searchButtonTestId="searchBtn"
        containerClassName={styles.calendar__header}
        dropdowns={[
          {
            id: 'organization-people-sort',
            label: tCommon('sort'),
            type: 'sort',
            options: [
              { label: tCommon('members'), value: 'members' },
              { label: tCommon('admin'), value: 'admin' },
              { label: tCommon('users'), value: 'users' },
            ],
            selectedOption: STATE_TO_OPTION[state] ?? 'members',
            onOptionChange: (value) => handleSortChange(value.toString()),
            dataTestIdPrefix: 'sort',
          },
        ]}
        additionalButtons={<AddMember />}
      />

      <ReportingTable
        rows={filteredRows.map((req) => ({ ...req })) as ReportingRow[]}
        columns={columns}
        gridProps={{ ...gridProps }}
      />
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
