/**
 * BlockUser Component
 *
 * This component provides functionality to manage the blocking and unblocking
 * of users within an organization. It allows administrators to view all members,
 * search for specific users, block/unblock users, and toggle between viewing
 * blocked and unblocked members.
 *
 * Features:
 * - Fetches and displays organization members and blocked users using GraphQL queries.
 * - Allows blocking and unblocking of users via GraphQL mutations.
 * - Provides search functionality to filter users by name or email.
 * - Supports toggling between viewing all members and blocked users.
 * - Displays loading states and error messages using `react-toastify`.
 *
 * Hooks:
 * - `useQuery`: Fetches members and blocked users data.
 * - `useMutation`: Executes block and unblock user mutations.
 * - `useState`: Manages component state for members, blocked users, search term, etc.
 * - `useEffect`: Handles side effects such as data updates and error handling.
 * - `useCallback`: Optimizes event handlers for blocking/unblocking users and searching.
 *
 * Dependencies:
 * - `react-bootstrap`: Provides UI components like `Table` and `Button`.
 * - `react-toastify`: Displays toast notifications for success and error messages.
 * - `react-i18next`: Handles internationalization and translations.
 * - `@apollo/client`: Manages GraphQL queries and mutations.
 *
 * Props:
 * - None
 *
 * State Variables:
 * - `showBlockedMembers`: Toggles between viewing blocked and unblocked members.
 * - `allMembers`: Stores the list of all organization members.
 * - `blockedUsers`: Stores the list of blocked users.
 * - `searchTerm`: Stores the current search input value.
 * - `filteredAllMembers`: Stores the filtered list of unblocked members.
 * - `filteredBlockedUsers`: Stores the filtered list of blocked users.
 *
 * Returns:
 * - JSX.Element: A table displaying members or blocked users with options to block/unblock.
 */
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import {
  BLOCK_USER_MUTATION_PG,
  UNBLOCK_USER_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import { useParams } from 'react-router';

import { Stack } from '@mui/material';
import type { GridCellParams, GridPaginationModel } from '@mui/x-data-grid';
import type {
  InterfaceUserPg,
  InterfaceOrganizationPg,
} from 'utils/interfaces';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import PageHeader from 'shared-components/Navbar/Navbar';
import type {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from '../../types/ReportingTable/interface';
import {
  dataGridStyle,
  ROW_HEIGHT,
  COLUMN_BUFFER_PX,
  PAGE_SIZE,
} from '../../types/ReportingTable/utils';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';

const BlockUser = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'blockUnblockUser',
  });
  const { t: tCommon } = useTranslation('common');

  const { orgId: currentUrl } = useParams(); // Get current organization ID from URL

  // State hooks
  const [showBlockedMembers, setShowBlockedMembers] = useState<boolean>(false);
  const [allMembers, setAllMembers] = useState<InterfaceUserPg[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<InterfaceUserPg[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredAllMembers, setFilteredAllMembers] = useState<
    InterfaceUserPg[]
  >([]);
  const [filteredBlockedUsers, setFilteredBlockedUsers] = useState<
    InterfaceUserPg[]
  >([]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const handlePaginationModelChange = (newModel: GridPaginationModel): void => {
    setPaginationModel(newModel);
  };

  // Query to fetch blocked users list
  const {
    data: blockedUsersData,
    loading: loadingBlockedUsers,
    error: errorBlockedUsers,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_BLOCKED_USERS_PG, {
    variables: { id: currentUrl, first: PAGE_SIZE, after: null },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (errorBlockedUsers) {
      toast.error(errorBlockedUsers.message);
    }
  }, [errorBlockedUsers]);

  useEffect(() => {
    if (blockedUsersData) {
      const edges = blockedUsersData.organization?.blockedUsers?.edges || [];
      const newBlockedUsers = edges.map((edge) => edge.node);
      setBlockedUsers(newBlockedUsers);
      setFilteredBlockedUsers(newBlockedUsers);
    }
  }, [blockedUsersData]);

  // Query to fetch members list
  const {
    data: memberData,
    loading: loadingMembers,
    error: errorMembers,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_MEMBERS_PG, {
    variables: { id: currentUrl, first: PAGE_SIZE, after: null },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (errorMembers) {
      toast.error(errorMembers.message);
    }
  }, [errorMembers]);

  useEffect(() => {
    if (memberData) {
      const edges = memberData.organization?.members?.edges || [];
      const newMembers = edges.map((edge) => edge.node);

      // Filter out blocked users
      const filteredMembers = newMembers.filter(
        (member) =>
          !blockedUsers.some((blockedUser) => blockedUser.id === member.id),
      );

      setAllMembers(filteredMembers);
      setFilteredAllMembers(filteredMembers);
    }
  }, [memberData, blockedUsers]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAllMembers(allMembers);
      setFilteredBlockedUsers(blockedUsers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();

      const matchedMembers = allMembers.filter(
        (member) =>
          member.name?.toLowerCase().includes(lowercaseSearch) ||
          member.emailAddress?.toLowerCase().includes(lowercaseSearch),
      );
      setFilteredAllMembers(matchedMembers);

      const matchedBlockedUsers = blockedUsers.filter(
        (blockedUser) =>
          blockedUser.name?.toLowerCase().includes(lowercaseSearch) ||
          blockedUser.emailAddress?.toLowerCase().includes(lowercaseSearch),
      );
      setFilteredBlockedUsers(matchedBlockedUsers);
    }
  }, [searchTerm, allMembers, blockedUsers]);

  const [blockUser] = useMutation(BLOCK_USER_MUTATION_PG);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION_PG);

  const handleBlockUser = useCallback(
    async (user: InterfaceUserPg): Promise<void> => {
      try {
        const { data } = await blockUser({
          variables: { userId: user.id, organizationId: currentUrl },
        });
        if (data?.blockUser) {
          toast.success(t('blockedSuccessfully') as string);
          setAllMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== user.id),
          );
          setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, user]);
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [blockUser, currentUrl, t],
  );

  const handleUnBlockUser = useCallback(
    async (user: InterfaceUserPg): Promise<void> => {
      try {
        const { data } = await unBlockUser({
          variables: { userId: user.id, organizationId: currentUrl },
        });
        if (data) {
          toast.success(t('Un-BlockedSuccessfully') as string);
          setBlockedUsers((prevBlockedUsers) =>
            prevBlockedUsers.filter(
              (blockedUser) => blockedUser.id !== user.id,
            ),
          );
          setAllMembers((prevMembers) => [...prevMembers, user]);
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [unBlockUser, currentUrl, t],
  );

  const handleSearch = useCallback((value: string): void => {
    setSearchTerm(value);
  }, []);

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  // Prepare rows with IDs for DataGrid
  const tableRows = useMemo(() => {
    const users = showBlockedMembers
      ? filteredBlockedUsers
      : filteredAllMembers;
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.emailAddress,
      user: user,
    }));
  }, [showBlockedMembers, filteredBlockedUsers, filteredAllMembers]);

  const headerTitles: string[] = [
    tCommon('sl_no'),
    tCommon('name'),
    tCommon('email'),
    t('block_unblock'),
  ];

  // Define columns for DataGrid
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
      renderCell: (params: GridCellParams) => {
        return (
          <div>
            {params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1}
          </div>
        );
      },
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
      field: 'action',
      headerName: t('block_unblock'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const user = params.row.user as InterfaceUserPg;
        return showBlockedMembers ? (
          <Button
            variant="success"
            size="sm"
            className={styles.unblockButton}
            onClick={async () => {
              await handleUnBlockUser(user as InterfaceUserPg);
            }}
            data-testid={`blockUser${user.id}`}
            aria-label={t('unblock')}
          >
            <FontAwesomeIcon icon={faUserPlus} className={styles.unbanIcon} />
            {t('unblock')}
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            className={styles.removeButton}
            onClick={async () => {
              await handleBlockUser(user as InterfaceUserPg);
            }}
            data-testid={`blockUser${user.id}`}
            aria-label={t('block')}
          >
            <FontAwesomeIcon icon={faBan} className={styles.banIcon} />
            {t('block')}
          </Button>
        );
      },
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
    getRowId: (row: InterfaceUserPg) => row.id,
    slots: {
      noRowsOverlay: () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {searchTerm.length === 0
            ? showBlockedMembers
              ? t('noSpammerFound')
              : t('noUsersFound')
            : `${tCommon('noResultsFoundFor')} "${searchTerm}"`}
        </Stack>
      ),
      loadingOverlay: () => (
        <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
      ),
    },
    loading: loadingMembers || loadingBlockedUsers,
    sx: { ...dataGridStyle },
    getRowClassName: () => `${styles.rowBackgrounds}`,
    rowHeight: ROW_HEIGHT,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    style: { overflow: 'visible' },
  };

  return (
    <>
      <div>
        <div className={styles.head}>
          <div className={styles.btnsContainer}>
            <PageHeader
              search={{
                placeholder: t('searchByName'),
                onSearch: handleSearch,
                inputTestId: 'searchByName',
                buttonTestId: 'searchBtn',
              }}
              sorting={[
                {
                  title: t('sortOrganizations'),
                  options: [
                    { label: t('allMembers'), value: 'allMembers' },
                    { label: t('blockedUsers'), value: 'blockedUsers' },
                  ],
                  selected: showBlockedMembers
                    ? 'Blocked Users'
                    : 'All Members',
                  onChange: (value) =>
                    setShowBlockedMembers(value === 'blockedUsers'),
                  testIdPrefix: 'sortOrganizations',
                },
              ]}
            />
          </div>
        </div>
        <ReportingTable
          rows={tableRows as ReportingRow[]}
          columns={columns}
          gridProps={gridProps}
        />
      </div>
    </>
  );
};

export default BlockUser;
