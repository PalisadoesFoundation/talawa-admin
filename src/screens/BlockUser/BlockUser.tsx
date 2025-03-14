import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'react-bootstrap';
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
import styles from '../../style/app-fixed.module.css';
import { useParams } from 'react-router-dom';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

import type {
  InterfaceUserPg,
  InterfaceOrganizationPg,
} from 'utils/interfaces';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUserPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * Requests component displays and manages a list of users that can be blocked or unblocked.
 *
 * This component allows users to search for members by their first name or last name,
 * toggle between viewing blocked and all members, and perform block/unblock operations.
 *
 * @returns JSX.Element - The `Requests` component.
 *
 * @example
 * ```tsx
 * <Requests />
 * ```
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.head`
 * - `.btnsContainer`
 * - `.input`
 * - `.inputField`
 * - `.searchButton`
 * - `.btnsBlock`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
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
    refetch: blockedUserRefetch,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_BLOCKED_USERS_PG, {
    variables: { id: currentUrl, first: 32, after: null },
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
    refetch: memberRefetch,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_MEMBERS_PG, {
    variables: { id: currentUrl, first: 32, after: null },
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
          variables: {
            userId: user.id,
            organizationId: currentUrl,
          },
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
          variables: {
            userId: user.id,
            organizationId: currentUrl,
          },
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
            <SearchBar
              placeholder={t('searchByName')}
              onSearch={handleSearch}
              inputTestId="searchByName"
              buttonTestId="searchBtn"
              data-testid="searchByName"
            />
            <div
              className={styles.btnsBlock}
              data-testid="userFilterDropdownToggle"
            >
              <SortingButton
                title={t('sortOrganizations')}
                sortingOptions={[
                  { label: t('allMembers'), value: 'allMembers' },
                  { label: t('blockedUsers'), value: 'blockedUsers' },
                ]}
                selectedOption={
                  showBlockedMembers ? t('blockedUsers') : t('allMembers')
                }
                onSortChange={(value) =>
                  setShowBlockedMembers(value === 'blockedUsers')
                }
                dataTestIdPrefix="userFilter"
                className={`${styles.createButton} mt-2`}
              />
            </div>
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
