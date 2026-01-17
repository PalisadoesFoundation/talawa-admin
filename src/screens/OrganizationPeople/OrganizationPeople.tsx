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
 * - `react-toastify` for error notifications.
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
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import styles from 'style/app-fixed.module.css';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import Button from 'react-bootstrap/Button';
import { Row } from 'react-bootstrap';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import SearchBar from 'subComponents/SearchBar';
import SortingButton from 'subComponents/SortingButton';
import Avatar from 'components/Avatar/Avatar';
import AddMember from './addMember/AddMember';

const PAGE_SIZE = 10;
interface IProcessedRow {
  _id: string;
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
          _id: edge.node.id,
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
      toast.error(memberError.message);
    }
    if (userError) {
      toast.error(userError.message);
    }
  }, [memberError, userError]);

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

  // Column definitions
  const columns: GridColDef[] = [
    {
      field: 'rowNumber',
      headerName: tCommon('#'),
      flex: 1,
      minWidth: 50,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
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
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            {params.row?.image ? (
              <img
                src={params.row.image}
                alt="avatar"
                style={{
                  width: `${imageSize}px`,
                  height: `${imageSize}px`,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                style={{
                  width: `${imageSize}px`,
                  height: `${imageSize}px`,
                  fontSize: `${imageSize * 0.4}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                }}
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
            state={{ id: params.row._id }}
            style={{ fontSize: '15px' }}
            className={`${styles.membername} ${styles.subtleBlueGrey}`}
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
      headerName: tCommon('joined on'),
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
          onClick={() => toggleRemoveMemberModal(params.row._id)}
          aria-label="Remove member"
          data-testid="removeMemberModalBtn"
        >
          <Delete />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <SearchBar
              placeholder={t('searchFullName')}
              onSearch={(term: string) => setSearchTerm(term)}
              buttonTestId="searchbtn"
            />
            <div className={styles.btnsBlock}>
              <SortingButton
                className={styles.dropdown}
                title={tCommon('sort')}
                sortingOptions={[
                  { label: tCommon('members'), value: 'members' },
                  { label: tCommon('admin'), value: 'admin' },
                  { label: tCommon('users'), value: 'users' },
                ]}
                selectedOption={
                  state === 2
                    ? tCommon('users')
                    : state === 1
                      ? tCommon('admin')
                      : tCommon('members')
                }
                onSortChange={handleSortChange}
                dataTestIdPrefix="role"
              />
            </div>
            <div className={styles.btnsBlock}>
              <AddMember />
            </div>
          </div>
        </div>
      </Row>
      <div className="datatable">
        <DataGrid
          disableColumnMenu
          columnBufferPx={5}
          getRowId={(row) => row._id}
          rows={filteredRows}
          columns={columns}
          rowCount={
            paginationModel.page * PAGE_SIZE +
            currentRows.length +
            (paginationMeta.hasNextPage ? PAGE_SIZE : 0)
          }
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[PAGE_SIZE]}
          loading={memberLoading || userLoading}
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {t('notFound')}
              </Stack>
            ),
          }}
          sx={{
            borderRadius: 'var(--table-head-radius)',
            backgroundColor: 'var(--grey-bg-color)',
            '& .MuiDataGrid-row': {
              backgroundColor: 'var(--tablerow-bg-color)',
              '&:focus-within': {
                outline: '2px solid #000',
                outlineOffset: '-2px',
              },
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'var(--grey-bg-color)',
              boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-row.Mui-hovered': {
              backgroundColor: 'var(--grey-bg-color)',
              boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: '2px solid #000',
              outlineOffset: '-2px',
            },
          }}
          getRowClassName={() => `${styles.rowBackground}`}
          rowHeight={70}
          isRowSelectable={() => false}
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
