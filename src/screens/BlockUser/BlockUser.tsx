import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  InterfaceOrganizationMembersConnectionEdgePg,
  InterfaceOrganizationPg,
  InterfaceOrganizationBlockedUsersConnectionEdgePg,
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
  const [blockedUsersLoaded, setBlockedUsersLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredAllMembers, setFilteredAllMembers] = useState<
    InterfaceUserPg[]
  >([]);
  const [filteredBlockedUsers, setFilteredBlockedUsers] = useState<
    InterfaceUserPg[]
  >([]);
  const hasFetchedAllMembers = useRef(false);
  const hasFetchedBlockedUsers = useRef(false);

  // Helper function to filter out blocked users from members list
  const filterBlockedUsersFromMembers = useCallback(
    (members: InterfaceUserPg[], blockedUsersList: InterfaceUserPg[]): InterfaceUserPg[] => {
      return members.filter(
        (member) => !blockedUsersList.some((blockedUser) => blockedUser.id === member.id)
      );
    },
    []
  );

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
    if (blockedUsersData && !hasFetchedBlockedUsers.current) {
      const edges = blockedUsersData.organization?.blockedUsers?.edges || [];
      setBlockedUsers((prevBlockedUsers) => [
        ...prevBlockedUsers,
        ...edges.map(
          (blockedUser: InterfaceOrganizationBlockedUsersConnectionEdgePg) =>
            blockedUser.node,
        ),
      ]);

      if (blockedUsersData.organization?.blockedUsers?.pageInfo?.hasNextPage) {
        blockedUserRefetch({
          variables: {
            id: currentUrl,
            first: 32,
            after:
              blockedUsersData.organization?.blockedUsers?.pageInfo?.endCursor,
          },
        });
      } else {
        hasFetchedBlockedUsers.current = true;
        setBlockedUsersLoaded(true);
      }
    }
  }, [blockedUsersData, blockedUserRefetch, currentUrl]);

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
    if (memberData && !hasFetchedAllMembers.current && blockedUsersLoaded) {
      const edges = memberData.organization?.members?.edges || [];
      const newMembers = edges.map(
        (member: InterfaceOrganizationMembersConnectionEdgePg) => member.node,
      );

      const filteredMembers = filterBlockedUsersFromMembers(newMembers, blockedUsers);
      setAllMembers((prevMembers) => [...prevMembers, ...filteredMembers]);

      if (memberData.organization?.members?.pageInfo?.hasNextPage) {
        memberRefetch({
          variables: {
            id: currentUrl,
            first: 32,
            after: memberData.organization.members.pageInfo.endCursor,
          },
        });
      } else {
        hasFetchedAllMembers.current = true;
      }
    }
  }, [memberData, memberRefetch, currentUrl, blockedUsers, blockedUsersLoaded, filterBlockedUsersFromMembers]);

  // Update the effect that handles filtering after blocked users change
  useEffect(() => {
    if (blockedUsersLoaded && hasFetchedAllMembers.current) {
      const filteredMembers = filterBlockedUsersFromMembers(allMembers, blockedUsers);
      if (filteredMembers.length !== allMembers.length) {
        setAllMembers(filteredMembers);
      }
    }
  }, [blockedUsers, blockedUsersLoaded, allMembers, filterBlockedUsersFromMembers]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAllMembers(allMembers);
      setFilteredBlockedUsers(blockedUsers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();

      const matchedMembers = allMembers.filter((member) =>
        member.name?.toLowerCase().includes(lowercaseSearch),
      );
      setFilteredAllMembers(matchedMembers);

      const matchedBlockedUsers = blockedUsers.filter((blockedUser) =>
        blockedUser.name?.toLowerCase().includes(lowercaseSearch),
      );
      setFilteredBlockedUsers(matchedBlockedUsers);
    }
  }, [searchTerm, allMembers, blockedUsers]);

  const [blockUser] = useMutation(BLOCK_USER_MUTATION_PG);
  const [unBlockUser] = useMutation(UNBLOCK_USER_MUTATION_PG);

  const handleBlockUser = useCallback(
    async (user: InterfaceUserPg): Promise<void> => {
      try {
        const userId = user.id;
        const { data } = await blockUser({
          variables: {
            userId,
            organizationId: currentUrl,
          },
        });
        if (data?.blockUser) {
          toast.success(t('blockedSuccessfully') as string);
          memberRefetch();

          setAllMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== user.id),
          );
          blockedUserRefetch();
          setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, user]);
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [blockUser, currentUrl, memberRefetch, blockedUserRefetch, t],
  );

  const handleUnBlockUser = useCallback(
    async (user: InterfaceUserPg): Promise<void> => {
      const userId = user.id;
      try {
        const { data } = await unBlockUser({
          variables: {
            userId,
            organizationId: currentUrl,
          },
        });
        if (data) {
          toast.success(t('Un-BlockedSuccessfully') as string);
          memberRefetch();
          blockedUserRefetch();
          setBlockedUsers((prevBlockedUsers) =>
            prevBlockedUsers.filter(
              (prevBlockedUsers) => prevBlockedUsers.id !== user.id,
            ),
          );
          setAllMembers((prevMembers) => [...prevMembers, user]);
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [unBlockUser, currentUrl, memberRefetch, t],
  );

  useEffect(() => {
    if (errorMembers) {
      toast.error(errorMembers.message);
    }
  }, [errorMembers]);

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
    return <TableLoader headerTitles={headerTitles} noOfRows={10} />;
  }

  return (
    <>
      <div>
        {/* Buttons Container */}
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
        {/* Table */}
        {(loadingMembers || loadingBlockedUsers) ? (
          <TableLoader headerTitles={headerTitles} noOfRows={10} />
        ) : (allMembers.length === 0 && !showBlockedMembers) || (blockedUsers.length === 0 && showBlockedMembers) ? (
          <div className={styles.notFound}>
            <h4>
              {showBlockedMembers ? t('noSpammerFound') : tCommon('noResultsFoundFor')} &quot;{}&quot;
            </h4>
          </div>
        ) : (
          <div className={styles.listBox}>
            {loadingMembers ? (
              <TableLoader headerTitles={headerTitles} noOfRows={10} />
            ) : (
              <Table
                responsive
                data-testid="userList"
                className={styles.custom_table}
              >
                <thead>
                  <tr>
                    {headerTitles.map((title: string, index: number) => {
                      return (
                        <th key={index} scope="col">
                          {title}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {!showBlockedMembers === true ? (
                    filteredAllMembers.length > 0 ? (
                      filteredAllMembers.map((user, index: number) => {
                        return (
                          <tr key={user.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{`${user.name}`}</td>
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
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={headerTitles.length}
                          className={styles.noDataMessage}
                        >
                          {searchTerm.length === 0 ? (
                            <div className={styles.notFound}>
                              <h4>{t('noUsersFound')}</h4>
                            </div>
                          ) : (
                            <div className={styles.notFound}>
                              <h4>
                                {tCommon('noResultsFoundFor')} &quot;
                                {searchTerm}
                                &quot;
                              </h4>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  ) : filteredBlockedUsers.length > 0 ? (
                    filteredBlockedUsers.map((user, index: number) => {
                      return (
                        <tr key={user.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{`${user.name}`}</td>
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
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={headerTitles.length}
                        className={styles.noDataMessage}
                      >
                        {searchTerm.length === 0 ? (
                          <div className={styles.notFound}>
                            <h4>{t('noSpammerFound')}</h4>
                          </div>
                        ) : (
                          <div className={styles.notFound}>
                            <h4>
                              {tCommon('noResultsFoundFor')} &quot;{searchTerm}
                              &quot;
                            </h4>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlockUser;
