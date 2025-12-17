/* global HTMLButtonElement, HTMLTextAreaElement */
/**
 * The `people` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users. The component uses GraphQL queries to fetch data and
 * displays it in a structured format with user details such as name, email, role, etc.
 *
 * @returns The rendered People component.
 *
 * @remarks
 * This component:
 * - Uses Apollo Client's `useQuery` hook to fetch data from GraphQL endpoints.
 * - Supports filtering between "All Members" and "Admins" via a dropdown menu.
 * - Implements pagination to display users in manageable chunks.
 * - Provides a search bar to find members by first name.
 *
 * **Dependencies**
 * - Core libraries:
 *   - `react`
 *   - `react-bootstrap`
 *   - `@apollo/client`
 *   - `@mui/icons-material`
 * - Custom components:
 *   - `components/UserPortal/PeopleCard/PeopleCard`
 *   - `components/Pagination/PaginationList/PaginationList`
 * - GraphQL queries:
 *   - `GraphQl/Queries/Queries`
 * - Styles:
 *   - `style/app-fixed.module.css`
 * - Types:
 *   - `types/User/interface`
 *
 * **Internal Event Handlers**
 * - `handleChangePage` – Handles pagination page changes.
 * - `handleChangeRowsPerPage` – Handles changes to rows per page.
 * - `handleSearch` – Refetches the member list based on search input.
 * - `handleSearchByEnter` – Triggers a search when the Enter key is pressed.
 * - `handleSearchByBtnClick` – Triggers a search when the search button is clicked.
 *
 * @param page - The current page number for pagination.
 * @param rowsPerPage - The number of rows displayed per page.
 * @param members - The list of members to display.
 * @param allMembers - The complete list of members fetched.
 * @param admins - The list of admins fetched.
 * @param mode - The current filter mode (0 for "All Members", 1 for "Admins").
 * @param organizationId - The ID of the organization extracted from URL parameters.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { FilterAltOutlined } from '@mui/icons-material';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import PeopleTable from 'shared-components/PeopleTable/PeopleTable';
import {
  GridColDef,
  GridPaginationModel,
  GridCellParams,
} from '@mui/x-data-grid';
import { PeopleAvatarImage } from './PeopleAvatarImage';

interface IMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  createdAt: string;
  emailAddress?: string;
}

interface IMemberEdge {
  cursor: string;
  node: IMemberNode;
}

interface IMemberWithUserType extends IMemberEdge {
  userType: string;
}

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  const [pageCursors, setPageCursors] = useState<string[]>(['']); // Keep track of cursors for each page
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { orgId: organizationId } = useParams();

  const modes = ['All Members', 'Admins'];

  // Query the current page of members
  const { data, loading, refetch } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        firstName_contains: searchTerm,
        first: rowsPerPage,
        after: pageCursors[currentPage] || undefined,
      },
      errorPolicy: 'ignore',
      notifyOnNetworkStatusChange: true,
    },
  );

  // Extract members for the current page and filter by role if needed
  const members: IMemberWithUserType[] = React.useMemo(() => {
    if (!data?.organization?.members?.edges) return [];
    let edges: IMemberEdge[] = data.organization.members.edges;
    let adminsList = edges
      .filter((m) => m.node.role === 'administrator')
      .map((admin) => ({ ...admin, userType: 'Admin' as const }));
    if (mode === 1) return adminsList;
    // For all members, assign userType based on role
    return edges.map((member) => ({
      ...member,
      userType: member.node.role === 'administrator' ? 'Admin' : 'Member',
    }));
  }, [data, mode]);

  // Pagination info from backend
  const pageInfo = data?.organization?.members?.pageInfo;

  // Handle page change: fetch next/prev page
  const handleChangePage = async (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    // If moving forward, fetch next page
    if (newPage > currentPage && pageInfo?.hasNextPage) {
      const afterCursor = pageInfo.endCursor;
      setPageCursors((prev) => {
        const next = [...prev];
        next[newPage] = afterCursor;
        return next;
      });
      setCurrentPage(newPage);
    }
    // If moving backward, simply update page (cursors already tracked)
    else if (newPage < currentPage && pageCursors[newPage] !== undefined) {
      setCurrentPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    eventOrValue:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | number,
  ): void => {
    const newRowsPerPage =
      typeof eventOrValue === 'number'
        ? eventOrValue
        : parseInt(eventOrValue.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPageCursors(['']); // Reset pagination
    setCurrentPage(0);
    refetch({
      orgId: organizationId,
      firstName_contains: searchTerm,
      first: newRowsPerPage,
      after: undefined,
    });
  };

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
    setPageCursors(['']);
    setCurrentPage(0);
    refetch({
      orgId: organizationId,
      firstName_contains: newFilter,
      first: rowsPerPage,
      after: undefined,
    });
  };

  useEffect(() => {
    // When mode changes, refetch from first page
    setPageCursors(['']);
    setCurrentPage(0);
    refetch({
      orgId: organizationId,
      firstName_contains: searchTerm,
      first: rowsPerPage,
      after: undefined,
    });
  }, [mode, organizationId, rowsPerPage]); // intentionally not including searchTerm (it's handled above)

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'sno',
        headerName: tCommon('sNo'),
        width: 70,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'image',
        headerName: tCommon('avatar'),
        width: 100,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridCellParams) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <PeopleAvatarImage
              src={(params.value as string | null | undefined) ?? null}
              name={params.row.name}
              alt={params.row.name}
            />
          </div>
        ),
      },
      {
        field: 'name',
        headerName: tCommon('name'),
        flex: 1,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'email',
        headerName: tCommon('email'),
        flex: 1,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'role',
        headerName: tCommon('role'),
        flex: 1,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridCellParams) => (
          <div className={styles.people_role}>
            <span>{params.value as string}</span>
          </div>
        ),
      },
    ],
    [tCommon],
  );

  const rows = useMemo(
    () =>
      members.map((member, index) => ({
        id: member.node.id,
        sno: currentPage * rowsPerPage + index + 1,
        image: member.node.avatarURL,
        name: member.node.name,
        email: member.node.emailAddress ?? '***********************',
        role: member.userType,
      })),
    [members, currentPage, rowsPerPage],
  );

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.pageSize !== rowsPerPage) {
      handleChangeRowsPerPage(model.pageSize);
    } else if (model.page !== currentPage) {
      handleChangePage(null, model.page);
    }
  };

  return (
    <>
      <div className={`${styles.mainContainer_people}`}>
        <div className={styles.people__header}>
          <div className={styles.input}>
            <SearchBar
              placeholder={t('searchUsers')}
              onSearch={handleSearch}
              onClear={() => handleSearch('')}
              inputTestId="searchInput"
              buttonTestId="searchBtn"
            />
          </div>

          <Dropdown drop="down-centered">
            <Dropdown.Toggle
              className={styles.dropdown}
              id="dropdown-basic"
              data-testid={`modeChangeBtn`}
            >
              <FilterAltOutlined
                sx={{
                  fontSize: '25px',
                  marginBottom: '2px',
                  marginRight: '2px',
                }}
              />
              {tCommon('filter')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {modes.map((value, index) => {
                return (
                  <Dropdown.Item
                    key={index}
                    data-testid={`modeBtn${index}`}
                    onClick={(): void => setMode(index)}
                  >
                    {value}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className={styles.people_content}>
          <PeopleTable
            rows={rows}
            columns={columns}
            loading={loading}
            rowCount={-1}
            paginationMeta={{ hasNextPage: Boolean(pageInfo?.hasNextPage) }}
            paginationModel={{ page: currentPage, pageSize: rowsPerPage }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[5, 10, 25]}
          />
        </div>
      </div>
    </>
  );
}
