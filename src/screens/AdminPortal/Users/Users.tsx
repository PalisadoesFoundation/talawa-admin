/**
 * The `Users` component is responsible for displaying a list of users in a paginated and sortable format.
 * It supports search functionality, filtering, and sorting of users. The component integrates with GraphQL
 * for fetching and managing user data and displays results with infinite scrolling.
 *
 * ## Features:
 * - **Search:** Allows users to search for users by their first name.
 * - **Sorting:** Provides options to sort users by creation date (newest or oldest).
 * - **Filtering:** Enables filtering users based on their roles (admin, user, etc.).
 * - **Pagination:** Utilizes infinite scrolling to load more users as the user scrolls down.
 *
 * ## GraphQL Queries:
 * - `USER_LIST`: Fetches a list of users with specified search, sorting, and pagination parameters.
 * - `ORGANIZATION_LIST`: Fetches a list of organizations to verify organization existence.
 *
 *
 * ## Component State:
 * - `isLoading`: Indicates whether the component is currently loading data.
 * - `hasMore`: Indicates if there are more users to load.
 * - `isLoadingMore`: Indicates if more users are currently being loaded.
 * - `searchByName`: The current search query for user names.
 * - `sortingOption`: The current sorting option (newest or oldest).
 * - `filteringOption`: The current filtering option (admin, user, cancel).
 * - `displayedUsers`: The list of users currently displayed, filtered and sorted.
 *
 * ## Event Handlers:
 * - `handleSearch`: Handles searching users by name and refetches the user list.
 * - `handleSearchByEnter`: Handles search input when the Enter key is pressed.
 * - `handleSearchByBtnClick`: Handles search input when the search button is clicked.
 * - `resetAndRefetch`: Resets search and refetches the user list with default parameters.
 * - `loadMoreUsers`: Loads more users when scrolling reaches the end of the list.
 * - `handleSorting`: Updates sorting option and refetches the user list.
 * - `handleFiltering`: Updates filtering option and refetches the user list.
 *
 * ## Rendering:
 * - Displays a search input and button for searching users.
 * - Provides dropdowns for sorting and filtering users.
 * - Renders a table of users with infinite scrolling support.
 * - Shows appropriate messages when no users are found or when search yields no results.
 *
 * @returns  The rendered `Users` component.
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
 * - `.btnsContainer`
 * - `.input`
 * - `.inputField`
 * - `.searchButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import {
  ORGANIZATION_LIST,
  USER_LIST_FOR_ADMIN,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import styles from './Users.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import type { ApolloError } from '@apollo/client';
import { PersonOff, WarningAmberRounded } from '@mui/icons-material';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { DataTable } from 'shared-components/DataTable/DataTable';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

type SortingOption = 'newest' | 'oldest';
type FilteringOption = 'admin' | 'user' | 'cancel';
import LoadingState from 'shared-components/LoadingState/LoadingState';

const Users = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const { getItem } = useLocalStorage();

  const perPageResult = 12;
  const tableLoaderRowLength = 4;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [sortingOption, setSortingOption] = useState<SortingOption>('newest');
  const [filteringOption, setFilteringOption] =
    useState<FilteringOption>('cancel');
  const loggedInUserId = getItem('id') as string;
  const [usersData, setUsersData] = useState<InterfaceQueryUserListItem[]>([]);

  const {
    data,
    loading,
    fetchMore,
    refetch: refetchUsers,
    error: UsersError,
  }: {
    data?: {
      allUsers: {
        pageInfo: {
          endCursor: string | null;
          hasNextPage: boolean;
          hasPreviousPage?: boolean;
          startCursor?: string;
        };
        edges: {
          cursor: string;
          node: InterfaceQueryUserListItem;
        }[];
      };
    };
    loading: boolean;
    fetchMore: (options: { variables: Record<string, unknown> }) => Promise<{
      data?: {
        allUsers: {
          pageInfo: {
            endCursor: string | null;
            hasNextPage: boolean;
          };
          edges: {
            cursor: string;
            node: InterfaceQueryUserListItem;
          }[];
        };
      };
    }>;
    refetch: (variables?: Record<string, unknown>) => void;
    error?: ApolloError;
  } = useQuery(USER_LIST_FOR_ADMIN, {
    variables: {
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: undefined,
    },
    notifyOnNetworkStatusChange: true,
  });

  type Edge = { cursor: string; node: InterfaceQueryUserListItem };
  // edges defaults to [] so .map() always returns an array (newUser is never undefined)
  const edges = (data?.allUsers?.edges ?? []) as Edge[];
  const pageInfo = data?.allUsers?.pageInfo;

  const [pageInfoState, setPageInfoState] = useState(pageInfo);

  useEffect(() => {
    if (data?.allUsers?.pageInfo) {
      setPageInfoState(data.allUsers.pageInfo);
    }
  }, [data]);

  useEffect(() => {
    const newUser = edges.map((edge) => edge.node);
    setUsersData(newUser);
    setHasMore(pageInfo?.hasNextPage ?? false);
  }, [data]);

  const { data: dataOrgs } = useQuery(ORGANIZATION_LIST);
  const [displayedUsers, setDisplayedUsers] = useState<
    InterfaceQueryUserListItem[]
  >([]);

  // Manage loading more state
  useEffect(() => {
    let newDisplayedUsers = [...usersData];
    if (newDisplayedUsers.length > 0) {
      newDisplayedUsers = sortUsers(newDisplayedUsers, sortingOption);
      newDisplayedUsers = filterUsers(newDisplayedUsers, filteringOption);
    }
    setDisplayedUsers(newDisplayedUsers);
  }, [usersData, sortingOption, filteringOption]);

  // Show a warning if there are no organizations
  useEffect(() => {
    if (!dataOrgs) {
      return;
    }
    // Add null check before accessing organizations.length
    if (dataOrgs.organizations?.length === 0) {
      NotificationToast.warning(t('noOrgError') as string);
    }
  }, [dataOrgs, t]);

  useEffect(() => {
    if (loading && isLoadingMore == false) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  const handleSearch = (value: string): void => {
    if (value === '') {
      setSearchByName('');
      if (searchByName !== '') {
        resetAndRefetch();
      }
      return;
    }

    if (value !== '' && value === searchByName) {
      return;
    }

    setSearchByName(value);
    setUsersData([]);
    refetchUsers({
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: { name: value },
    });
    setHasMore(true);
  };

  const resetAndRefetch = (): void => {
    setUsersData([]);
    setSearchByName('');
    refetchUsers({
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: undefined,
    });
    setHasMore(true);
  };

  const loadMoreUsers = async (): Promise<void> => {
    // Early return if already loading - InfiniteScroll's hasMore prop handles pagination end
    /* istanbul ignore next -- @preserve
       This defensive guard prevents concurrent API calls during rapid scrolling.
       The branch is difficult to test because InfiniteScroll has its own internal
       actionTriggered flag that prevents rapid calls, and jsdom doesn't properly
       simulate scroll events. The guard provides additional safety. */
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    // Preserve current search filter
    const currentWhere = searchByName ? { name: searchByName } : undefined;
    const { data: moreData } = await fetchMore({
      variables: {
        first: perPageResult,
        after: pageInfoState?.endCursor,
        orgFirst: 32,
        where: currentWhere,
      },
    });
    const moreEdges = (moreData?.allUsers?.edges ?? []) as Edge[];
    const newUsers = moreEdges.map((edge) => edge.node);

    setUsersData((prev) => [...prev, ...newUsers]);
    setPageInfoState(moreData?.allUsers?.pageInfo);
    setHasMore(moreData?.allUsers?.pageInfo?.hasNextPage ?? false);
    setIsLoadingMore(false);
  };

  const handleSorting = (option: string): void => {
    const sortOption = option as SortingOption;
    if (sortOption === sortingOption) {
      return;
    }
    setSortingOption(sortOption);
  };

  const sortUsers = (
    allUsers: InterfaceQueryUserListItem[],
    sortingOption: SortingOption,
  ): InterfaceQueryUserListItem[] => {
    const sortedUsers = [...allUsers];

    if (sortingOption === 'newest') {
      sortedUsers.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return sortedUsers;
    }
    sortedUsers.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return sortedUsers;
  };

  const handleFiltering = (option: string): void => {
    const filterOption = option as FilteringOption;
    if (filterOption !== filteringOption) setFilteringOption(filterOption);
  };

  const filterUsers = (
    allUsers: InterfaceQueryUserListItem[],
    filteringOption: FilteringOption,
  ): InterfaceQueryUserListItem[] => {
    if (filteringOption === 'user')
      return allUsers.filter((u) => u.role === 'regular');
    if (filteringOption === 'admin')
      return allUsers.filter((u) => u.role === 'administrator');
    // For 'cancel' or any other value, return all users (no filtering)
    return allUsers;
  };

  const usersQueryErrorPanel = UsersError ? (
    <div className={`${styles.container} bg-white rounded-4 my-3`}>
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.errorIcon} />
        <h6 className="fw-bold text-danger text-center">
          {t('errorLoadingUsers')}
          <br />
          {UsersError.message}
        </h6>
      </div>
    </div>
  ) : null;

  const headerTitles: string[] = [
    '#',
    tCommon('name'),
    tCommon('email'),
    t('joined_organizations'),
    t('blocked_organizations'),
  ];

  const tableColumns: IColumnDef<InterfaceQueryUserListItem>[] = [
    {
      id: 'index',
      header: headerTitles[0],
      accessor: 'id',
    },
    {
      id: 'name',
      header: headerTitles[1],
      accessor: 'name',
    },
    {
      id: 'email',
      header: headerTitles[2],
      accessor: 'emailAddress',
    },
    {
      id: 'joinedOrganizations',
      header: headerTitles[3],
      accessor: 'id',
    },
    {
      id: 'blockedOrganizations',
      header: headerTitles[4],
      accessor: 'id',
    },
  ];

  /**
   * Helper function to determine empty state message
   * @returns The appropriate empty state message
   */
  const getEmptyStateMessage = () => {
    if (searchByName.length > 0) {
      return tCommon('noResultsFoundFor', { query: searchByName });
    }
    return t('noUserFound');
  };

  return (
    <>
      {/* Buttons Container */}
      <div className={styles.btnsContainer} data-testid="testcomp">
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={t('enterName')}
          searchValue={searchByName}
          onSearchChange={handleSearch}
          searchInputTestId="searchByName"
          searchButtonTestId="searchButton"
          dropdowns={[
            {
              id: 'users-sort',
              label: t('sortBy'),
              type: 'sort',
              options: [
                { label: t('Newest'), value: 'newest' },
                { label: t('Oldest'), value: 'oldest' },
              ],
              selectedOption: sortingOption,
              onOptionChange: (value) => handleSorting(value.toString()),
              dataTestIdPrefix: 'sortUsers',
            },
            {
              id: 'users-filter',
              label: t('filterByRole'),
              type: 'filter',
              options: [
                { label: tCommon('admin'), value: 'admin' },
                { label: tCommon('user'), value: 'user' },
                { label: tCommon('cancel'), value: 'cancel' },
              ],
              selectedOption: filteringOption,
              onOptionChange: (value) => handleFiltering(value.toString()),
              dataTestIdPrefix: 'filterUsers',
            },
          ]}
        />
      </div>

      {/* Error Panel */}
      {usersQueryErrorPanel}

      <div className={styles.listBox}>
        <LoadingState
          isLoading={isLoading}
          variant="table"
          tableHeaderTitles={headerTitles}
          noOfRows={perPageResult}
          data-testid="TableLoader"
        >
          {displayedUsers.length === 0 ? (
            <EmptyState
              icon={<PersonOff />}
              message={getEmptyStateMessage()}
              description={
                searchByName.length > 0
                  ? tCommon('tryAdjustingFilters')
                  : undefined
              }
              dataTestId="users-empty-state"
            />
          ) : (
            <InfiniteScroll
              dataLength={displayedUsers.length}
              next={loadMoreUsers}
              loader={
                <TableLoader
                  noOfCols={headerTitles.length}
                  noOfRows={tableLoaderRowLength}
                />
              }
              hasMore={hasMore}
              className={styles.listBox}
              data-testid="users-list"
              endMessage={
                <div className={'w-100 text-center my-4'}>
                  <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                </div>
              }
            >
              <DataTable
                data={displayedUsers}
                columns={tableColumns}
                rowKey="id"
                tableClassName="mb-0"
                renderRow={(
                  user: (typeof displayedUsers)[number],
                  index: number,
                ) => (
                  <UsersTableItem
                    index={index}
                    resetAndRefetch={resetAndRefetch}
                    user={user}
                    loggedInUserId={loggedInUserId}
                  />
                )}
              />
            </InfiniteScroll>
          )}
        </LoadingState>
      </div>
    </>
  );
};
export default Users;
