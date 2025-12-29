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
import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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

import type {
  InterfaceUserPg,
  InterfaceOrganizationPg,
} from 'utils/interfaces';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import PageHeader from 'shared-components/Navbar/Navbar';

const BlockUser = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'blockUnblockUser',
  });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title'); // Set document title
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
  const {
    data: blockedUsersData,
    loading: loadingBlockedUsers,
    error: errorBlockedUsers,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_BLOCKED_USERS_PG, {
    variables: { id: currentUrl, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (errorBlockedUsers) {
      NotificationToast.error(errorBlockedUsers.message);
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
    variables: { id: currentUrl, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (errorMembers) {
      NotificationToast.error(errorMembers.message);
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
          NotificationToast.success(t('blockedSuccessfully') as string);
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
          NotificationToast.success(t('Un-BlockedSuccessfully') as string);
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

  // Header titles for the table
  const headerTitles: string[] = [
    '#',
    tCommon('name'),
    tCommon('email'),
    t('block_unblock'),
  ];

  if (loadingMembers || loadingBlockedUsers) {
    return (
      <TableLoader
        data-testid="TableLoader"
        headerTitles={headerTitles}
        noOfRows={10}
      />
    );
  }

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
        <div className={styles.listBox}>
          <Table
            responsive
            data-testid="userList"
            className={styles.custom_table}
          >
            <thead>
              <tr>
                {headerTitles.map((title: string, index: number) => (
                  <th key={index} scope="col">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!showBlockedMembers ? (
                filteredAllMembers.length > 0 ? (
                  filteredAllMembers.map((user, index: number) => (
                    <tr key={user.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.name}</td>
                      <td>{user.emailAddress}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className={styles.removeButton}
                          onClick={async (): Promise<void> => {
                            await handleBlockUser(user);
                          }}
                          data-testid={`blockUser${user.id}`}
                        >
                          <FontAwesomeIcon
                            icon={faBan}
                            className={styles.banIcon}
                          />
                          {t('block')}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={headerTitles.length}
                      className={styles.noDataMessage}
                    >
                      <div className={styles.notFound}>
                        <h4>
                          {searchTerm.length === 0
                            ? t('noUsersFound')
                            : `${tCommon('noResultsFoundFor')} "${searchTerm}"`}
                        </h4>
                      </div>
                    </td>
                  </tr>
                )
              ) : filteredBlockedUsers.length > 0 ? (
                filteredBlockedUsers.map((user, index: number) => (
                  <tr key={user.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.emailAddress}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className={styles.unblockButton}
                        onClick={async (): Promise<void> => {
                          await handleUnBlockUser(user);
                        }}
                        data-testid={`blockUser${user.id}`}
                      >
                        <FontAwesomeIcon
                          icon={faUserPlus}
                          className={styles.unbanIcon}
                        />
                        {t('unblock')}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={headerTitles.length}
                    className={styles.noDataMessage}
                  >
                    <div className={styles.notFound}>
                      <h4>
                        {searchTerm.length === 0
                          ? t('noSpammerFound')
                          : `${tCommon('noResultsFoundFor')} "${searchTerm}"`}
                      </h4>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default BlockUser;
