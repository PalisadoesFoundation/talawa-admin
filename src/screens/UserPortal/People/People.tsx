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
import { useQuery } from '@apollo/client';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Stack } from '@mui/material';
import type { GridPaginationModel } from '@mui/x-data-grid';
import PageHeader from 'shared-components/Navbar/Navbar';
import type {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from '../../../types/ReportingTable/interface';
import {
  dataGridStyle,
  ROW_HEIGHT,
  COLUMN_BUFFER_PX,
  PAGE_SIZE,
} from '../../../types/ReportingTable/utils';
import TableLoader from 'components/TableLoader/TableLoader';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';

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

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins

  const { orgId: organizationId } = useParams();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const handlePaginationModelChange = (newModel: GridPaginationModel): void => {
    setPaginationModel(newModel);
  };

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  // Query members
  const { data, loading } = useQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      orgId: organizationId,
      first: PAGE_SIZE,
      after: null,
      ...(mode === 1 && {
        where: {
          role: {
            equal: 'administrator',
          },
        },
      }),
    },
    skip: !organizationId,
    notifyOnNetworkStatusChange: true,
  });

  // Extract and filter members
  const allMembers = useMemo(() => {
    if (!data?.organization?.members?.edges) return [];
    return data.organization.members.edges;
  }, [data]);

  // Filter by search term
  const members = useMemo(() => {
    if (!searchTerm) return allMembers;
    const lowerSearch = searchTerm.toLowerCase();
    return allMembers.filter(
      (edge: IMemberEdge) =>
        edge.node.name?.toLowerCase().includes(lowerSearch) ||
        edge.node.emailAddress?.toLowerCase().includes(lowerSearch),
    );
  }, [allMembers, searchTerm]);

  const handleSearch = (value: string): void => {
    setSearchTerm(value);
  };

  const handleSortChange = (value: string | number): void => {
    setMode(String(value) === 'admins' ? 1 : 0);
  };

  // Prepare table rows
  const tableRows = useMemo(() => {
    return members.map((member: IMemberEdge, index: number) => ({
      id: member.node.id,
      rowNumber: index + 1,
      name: member.node.name,
      email: member.node.emailAddress || '***********************',
      role: member.node.role === 'administrator' ? 'Admin' : 'Member',
      avatarURL: member.node.avatarURL,
    }));
  }, [members]);

  const headerTitles: string[] = [
    tCommon('sl_no'),
    tCommon('name'),
    tCommon('email'),
    t('role'),
  ];

  // Define columns
  const columns: ReportingTableColumn[] = [
    {
      field: 'sl_no',
      headerName: tCommon('sl_no'),
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      flex: 1,
    },
    {
      field: 'name',
      headerName: tCommon('name'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      flex: 2,
    },
    {
      field: 'email',
      headerName: tCommon('email'),
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      flex: 2,
    },
    {
      field: 'role',
      headerName: t('role'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      flex: 1,
    },
  ];

  // Configure DataGrid props
  const gridProps: ReportingTableGridProps = {
    columnBufferPx: COLUMN_BUFFER_PX,
    paginationMode: 'client',
    pagination: true,
    paginationModel,
    onPaginationModelChange: handlePaginationModelChange,
    rowCount: tableRows.length,
    pageSizeOptions: [PAGE_SIZE],
    hideFooterSelectedRowCount: true,
    getRowId: (row: IMemberNode) => row.id,
    slots: {
      noRowsOverlay: () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {t('nothingToShow')}
        </Stack>
      ),
      loadingOverlay: () => (
        <TableLoader
          headerTitles={headerTitles}
          noOfRows={PAGE_SIZE}
          data-testid="table-loader"
        />
      ),
    },
    loading,
    sx: { ...dataGridStyle },
    getRowClassName: () => `${styles.rowBackgrounds}`,
    rowHeight: ROW_HEIGHT,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    style: { overflow: 'visible' },
  };

  return (
    <>
      <div className={`${styles.mainContainer_people}`}>
        <div className={styles.people__header}>
          <div className={styles.input}>
            <PageHeader
              search={{
                placeholder: t('searchUsers'),
                onSearch: handleSearch,
                inputTestId: 'searchInput',
                buttonTestId: 'searchBtn',
              }}
              sorting={[
                {
                  title: t('sortMembers'),
                  options: [
                    { label: t('allMembers'), value: 'allMembers' },
                    { label: t('admins'), value: 'admins' },
                  ],
                  selected: mode === 1 ? 'admins' : 'allMembers',
                  onChange: handleSortChange,
                  testIdPrefix: 'sortMembers',
                },
              ]}
            />
          </div>
        </div>
        <div
          className={
            styles.btnsContainer +
            ' gap-3 flex-column flex-lg-row align-items-stretch'
          }
        >
          <ReportingTable
            rows={tableRows as ReportingRow[]}
            columns={columns}
            gridProps={gridProps}
          />
        </div>
      </div>
    </>
  );
}
