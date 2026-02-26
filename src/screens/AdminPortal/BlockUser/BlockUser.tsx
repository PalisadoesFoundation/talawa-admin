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
 * - `useState`: Manages component state for search term and view toggle.
 * - `useEffect`: Syncs derived state with query results.
 * - `useCallback`: Optimizes event handlers for blocking/unblocking users and searching.
 *
 * Dependencies:
 * - `react-bootstrap`: Provides UI components like `Button`.
 * - `react-toastify`: Displays toast notifications for success and error messages.
 * - `react-i18next`: Handles internationalization and translations.
 * - `@apollo/client`: Manages GraphQL queries and mutations.
 *
 * Props:
 * - None
 *
 * State Variables:
 * - `showBlockedMembers`: Toggles between viewing blocked and unblocked members.
 * - `searchTerm`: Stores the current search input value.
 *
 * Returns:
 * - JSX.Element: A table displaying members or blocked users with options to block/unblock.
 */
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState, useCallback } from 'react';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  BLOCK_USER_MUTATION_PG,
  UNBLOCK_USER_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './BlockUser.module.css';
import { useParams } from 'react-router';

import type {
  InterfaceUserPg,
  InterfaceOrganizationPg,
} from 'utils/interfaces';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { DataTable } from 'shared-components/DataTable/DataTable';
import Button from 'shared-components/Button';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import ErrorPanel from 'shared-components/ErrorPanel';
import { OrganizationMembershipRole } from 'types/AdminPortal/OrganizationMembershipRole/interface';

type BlockUserRow = {
  user: InterfaceUserPg;
  index: number;
};

const BlockUser = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'blockUnblockUser',
  });
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    document.title = t('title');
  }, [t]);

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

  // Query to fetch blocked users list
  const blockedUsersResult = useQuery<InterfaceOrganizationPg>(
    GET_ORGANIZATION_BLOCKED_USERS_PG,
    {
      variables: {
        id: currentUrl,
        first: 32,
        after: null,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const {
    rows: blockedUsersRows,
    loading: loadingBlockedUsers,
    error: errorBlockedUsers,
    refetch: refetchBlockedUsers,
  } = useTableData<InterfaceUserPg, InterfaceUserPg, InterfaceOrganizationPg>(
    blockedUsersResult,
    {
      path: ['organization', 'blockedUsers'],
    },
  );

  useEffect(() => {
    setBlockedUsers(blockedUsersRows);
    setFilteredBlockedUsers(blockedUsersRows);
  }, [blockedUsersRows]);

  // Query to fetch members list
  const membersResult = useQuery<InterfaceOrganizationPg>(
    GET_ORGANIZATION_MEMBERS_PG,
    {
      variables: {
        id: currentUrl,
        first: 32,
        after: null,
        where: {
          role: {
            notEqual: OrganizationMembershipRole.ADMIN,
          },
        },
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const {
    rows: membersRows,
    loading: loadingMembers,
    error: errorMembers,
    refetch: refetchMembers,
  } = useTableData<InterfaceUserPg, InterfaceUserPg, InterfaceOrganizationPg>(
    membersResult,
    {
      path: ['organization', 'members'],
    },
  );

  useEffect(() => {
    // Filter out blocked users
    const filteredMembers = membersRows.filter(
      (member) =>
        !blockedUsers.some((blockedUser) => blockedUser.id === member.id),
    );

    setAllMembers(filteredMembers);
    setFilteredAllMembers(filteredMembers);
  }, [membersRows, blockedUsers]);

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

  // Mutations
  const [blockUser] = useMutation(BLOCK_USER_MUTATION_PG);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION_PG);

  // Handle block user
  const handleBlockUser = useCallback(
    async (user: InterfaceUserPg): Promise<void> => {
      try {
        const { data } = await blockUser({
          variables: { userId: user.id, organizationId: currentUrl },
        });
        if (data?.blockUser) {
          NotificationToast.success(t('blockedSuccessfully') as string);
          await refetchMembers();
          await refetchBlockedUsers();
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [blockUser, currentUrl, t, refetchMembers, refetchBlockedUsers],
  );

  // Handle unblock user
  const handleUnBlockUser = useCallback(
    async (user: InterfaceUserPg): Promise<void> => {
      try {
        const { data } = await unBlockUser({
          variables: { userId: user.id, organizationId: currentUrl },
        });
        if (data?.unblockUser) {
          NotificationToast.success(t('Un-BlockedSuccessfully') as string);
          await refetchMembers();
          await refetchBlockedUsers();
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [unBlockUser, currentUrl, t, refetchMembers, refetchBlockedUsers],
  );

  // Handle search
  const handleSearch = useCallback((value: string): void => {
    setSearchTerm(value);
  }, []);

  // Header titles for the table
  const headerTitles: string[] = [
    '#',
    tCommon('name'),
    tCommon('email'),
    t('block_unblock'),
  ];

  const displayedUsers = showBlockedMembers
    ? filteredBlockedUsers
    : filteredAllMembers;

  const tableRows: BlockUserRow[] = displayedUsers.map((user, index) => ({
    user,
    index,
  }));

  const tableColumns: IColumnDef<BlockUserRow>[] = [
    {
      id: 'index',
      header: headerTitles[0],
      accessor: 'index',
      render: (_value: unknown, row: BlockUserRow) => row.index + 1,
    },
    {
      id: 'name',
      header: headerTitles[1],
      accessor: (row: BlockUserRow) => row.user.name,
    },
    {
      id: 'email',
      header: headerTitles[2],
      accessor: (row: BlockUserRow) => row.user.emailAddress,
    },
    {
      id: 'action',
      header: headerTitles[3],
      accessor: (row: BlockUserRow) => row.user.id,
      render: (_: unknown, row: BlockUserRow) => {
        const user = row.user;
        return showBlockedMembers ? (
          <Button
            variant="success"
            size="sm"
            className={styles.unblockButton}
            onClick={async (): Promise<void> => {
              await handleUnBlockUser(user);
            }}
            data-testid={`unblockUserBtn-${user.id}`}
            aria-label={t('unblock') + ': ' + user.name}
          >
            <FontAwesomeIcon icon={faUserPlus} className={styles.unbanIcon} />
            {t('unblock')}
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            className={styles.removeButton}
            onClick={async (): Promise<void> => {
              await handleBlockUser(user);
            }}
            data-testid={`blockUserBtn-${user.id}`}
            aria-label={t('block') + ': ' + user.name}
          >
            <FontAwesomeIcon icon={faBan} className={styles.banIcon} />
            {t('block')}
          </Button>
        );
      },
    },
  ];

  const searchFilterBar = (
    <div className={styles.btnsContainer} data-testid="testcomp">
      <SearchFilterBar
        hasDropdowns={true}
        searchPlaceholder={t('searchByName')}
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchInputTestId="searchByName"
        searchButtonTestId="searchBtn"
        dropdowns={[
          {
            id: 'block-user-view',
            label: t('view'),
            type: 'filter',
            options: [
              { label: t('allMembers'), value: 'allMembers' },
              { label: t('blockedUsers'), value: 'blockedUsers' },
            ],
            selectedOption: showBlockedMembers
              ? t('blockedUsers')
              : t('allMembers'),
            onOptionChange: (value) =>
              setShowBlockedMembers(value === 'blockedUsers'),
            dataTestIdPrefix: 'blockUserView',
          },
        ]}
      />
    </div>
  );

  const renderContent = (): JSX.Element => {
    if (loadingMembers || loadingBlockedUsers) {
      return (
        <TableLoader
          data-testid="TableLoader"
          headerTitles={[
            '#',
            tCommon('name'),
            tCommon('email'),
            t('block_unblock'),
          ]}
          noOfRows={10}
        />
      );
    }

    if (errorBlockedUsers) {
      return (
        <ErrorPanel
          message={t('errorLoadingBlockedUsers')}
          error={errorBlockedUsers}
          onRetry={refetchBlockedUsers}
          testId="errorBlockedUsers"
        />
      );
    }

    if (errorMembers) {
      return (
        <ErrorPanel
          message={t('errorLoadingMembers')}
          error={errorMembers}
          onRetry={refetchMembers}
          testId="errorMembers"
        />
      );
    }

    return (
      <div className={styles.listBox}>
        {(!showBlockedMembers && filteredAllMembers.length > 0) ||
        (showBlockedMembers && filteredBlockedUsers.length > 0) ? (
          <div data-testid="userList">
            <DataTable<BlockUserRow>
              data={tableRows}
              columns={tableColumns}
              rowKey={(row: BlockUserRow) => row.user.id}
              tableClassName={styles.custom_table}
            />
          </div>
        ) : (
          <EmptyState
            icon="person_off"
            message={
              searchTerm.length === 0
                ? !showBlockedMembers
                  ? t('noUsersFound')
                  : t('noSpammerFound')
                : tCommon('noResultsFoundFor', { query: searchTerm })
            }
            dataTestId="block-user-empty-state"
          />
        )}
      </div>
    );
  };

  return (
    <>
      {searchFilterBar}
      {renderContent()}
    </>
  );
};

export default BlockUser;
