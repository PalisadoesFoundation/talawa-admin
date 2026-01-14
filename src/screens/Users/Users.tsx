/**
 * The `Users` component is responsible for displaying a list of users in a paginated and sortable format.
 * It supports search functionality, filtering, and sorting of users. The component integrates with GraphQL
 * for fetching and managing user data and displays results with infinite scrolling.
 *
 * ## Features:
 * - **Search:** Allows users to search for users by their first name.
 * - **Sorting:** Provides options to sort users by creation date (newest or oldest).
 * - **Filtering:** Enables filtering users based on their roles (admin, superadmin, user, etc.).
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
 * - `filteringOption`: The current filtering option (admin, superadmin, user, cancel).
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
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { ORGANIZATION_LIST, USER_LIST } from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import type { ApolloError } from '@apollo/client';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

const Users = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

  const { getItem } = useLocalStorage();

  const perPageResult = 12;
  const tableLoaderRowLength = 4;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [sortingOption, setSortingOption] = useState('newest');
  const [filteringOption, setFilteringOption] = useState('cancel');
  const [loadUnqUsers, setLoadUnqUsers] = useState(0);
  const loggedInUserId = getItem('id') as string;
  const [usersData, setUsersData] = useState<InterfaceQueryUserListItem[]>([]);

  const {
    data,
    loading,
    fetchMore,
    refetch: refetchUsers,
    error,
  }: {
    data?: { usersByIds: InterfaceQueryUserListItem[] };
    loading: boolean;
    fetchMore: (options: {
      variables: Record<string, unknown>;
      updateQuery: (
        previousQueryResult: { usersByIds: InterfaceQueryUserListItem[] },
        options: {
          fetchMoreResult?: { usersByIds: InterfaceQueryUserListItem[] };
        },
      ) => { usersByIds: InterfaceQueryUserListItem[] };
    }) => void;
    refetch: (variables?: Record<string, unknown>) => void;
    error?: ApolloError;
  } = useQuery(USER_LIST, {
    variables: {
      input: {
        ids: loggedInUserId,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  console.log('GraphQL Query Data:', data); // Log query results
  console.log('GraphQL Loading State:', loading); // Log loading state
  console.log('GraphQL Error:', error); // Log any errors

  useEffect(() => {
    if (data) {
      console.log('Setting usersData with:', data.usersByIds);
      setUsersData(data.usersByIds || []);
    }
  }, [data]);

  const { data: dataOrgs } = useQuery(ORGANIZATION_LIST);
  const [displayedUsers, setDisplayedUsers] = useState<
    InterfaceQueryUserListItem[]
  >([]);

  console.log('Current usersData:', usersData); // Log current usersData state
  console.log('Current displayedUsers:', displayedUsers); // Log current displayedUsers

  // Manage loading more state
  useEffect(() => {
    if (!usersData || usersData.length === 0) {
      console.log('No usersData available yet');
      return;
    }

    console.log('Managing loading state for:', usersData.length, 'users');

    if (usersData.length < perPageResult) {
      console.log('Setting hasMore to false');
      setHasMore(false);
    }
    let newDisplayedUsers = sortUsers(usersData, sortingOption);
    newDisplayedUsers = filterUsers(newDisplayedUsers, filteringOption);
    console.log('Setting displayedUsers:', newDisplayedUsers);
    setDisplayedUsers(newDisplayedUsers);
  }, [usersData, sortingOption, filteringOption]);

  // To clear the search when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  // Show a warning if there are no organizations
  useEffect(() => {
    if (!dataOrgs) {
      return;
    }

    // Add null check before accessing organizations.length
    if (dataOrgs.organizations?.length === 0) {
      toast.warning(t('noOrgError') as string);
    }
  }, [dataOrgs, t]);

  // Send to orgList page if user is not superadmin
  // useEffect(() => {
  //   if (userType != 'SUPERADMIN') {
  //     window.location.assign('/orglist');
  //   }
  // }, []);

  // Manage the loading state
  useEffect(() => {
    if (loading && isLoadingMore == false) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (loadUnqUsers > 0) {
      loadMoreUsers(displayedUsers.length, loadUnqUsers);
    }
  }, [displayedUsers]);

  const handleSearch = (value: string): void => {
    setSearchByName(value);
    if (value === '') {
      resetAndRefetch();
      return;
    }
    refetchUsers({
      firstName_contains: value,
      lastName_contains: '',
      // Later on we can add several search and filter options
    });
    setHasMore(true);
  };

  const resetAndRefetch = (): void => {
    refetchUsers({
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
      lastName_contains: '',
      order: sortingOption === 'newest' ? 'createdAt_DESC' : 'createdAt_ASC',
    });
    setHasMore(true);
  };
  const loadMoreUsers = (skipValue: number, limitVal: number): void => {
    console.log('Loading more users. Skip:', skipValue, 'Limit:', limitVal);
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        first: limitVal + perPageResult || perPageResult,
        skip: skipValue - perPageResult >= 0 ? skipValue - perPageResult : 0,
        filter: searchByName,
        order: sortingOption === 'newest' ? 'createdAt_DESC' : 'createdAt_ASC',
      },
      updateQuery: (
        prev: { usersByIds: InterfaceQueryUserListItem[] },
        {
          fetchMoreResult,
        }: { fetchMoreResult?: { usersByIds: InterfaceQueryUserListItem[] } },
      ) => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) {
          console.log('No fetchMoreResult available');
          return prev;
        }

        const mergedUsers = [
          ...(prev.usersByIds || []),
          ...fetchMoreResult.usersByIds,
        ];

        const uniqueUsers = Array.from(
          new Map(mergedUsers.map((user) => [user.id, user])).values(),
        );
        console.log('Merged users:', mergedUsers.length);
        console.log('Unique users:', uniqueUsers.length);

        if (uniqueUsers.length < mergedUsers.length) {
          const diff = mergedUsers.length - uniqueUsers.length;
          console.log('Duplicate users found:', diff);
          setLoadUnqUsers(diff);
        } else {
          console.log('No duplicate users found');
          setLoadUnqUsers(0);
        }

        if (prev.usersByIds) {
          if (uniqueUsers.length - prev.usersByIds.length < perPageResult) {
            console.log('No more users to load');
            setHasMore(false);
          }
        }

        return { usersByIds: uniqueUsers };
      },
    });
  };

  const handleSorting = (option: string): void => {
    if (option === sortingOption) {
      return;
    }
    setHasMore(true);
    setSortingOption(option);
  };

  const sortUsers = (
    allUsers: InterfaceQueryUserListItem[],
    sortingOption: string,
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
    if (option === filteringOption) {
      return;
    }
    setFilteringOption(option);
    setHasMore(true);
  };

  const filterUsers = (
    allUsers: InterfaceQueryUserListItem[],
    filteringOption: string,
  ): InterfaceQueryUserListItem[] => {
    const filteredUsers = [...allUsers];

    if (filteringOption === 'cancel') {
      return filteredUsers;
    }
    if (filteringOption === 'user') {
      return allUsers.filter((user) => user.role === 'regular');
    }
    if (filteringOption === 'admin') {
      return allUsers.filter((user) => user.role === 'administrator');
    }
    if (filteringOption === 'superAdmin') {
      return [];
    }

    return [];
  };

  const headerTitles: string[] = [
    '#',
    tCommon('name'),
    tCommon('email'),
    t('joined_organizations'),
    t('blocked_organizations'),
  ];

  return (
    <>
      {/* Buttons Container */}
      <div className={styles.btnsContainer} data-testid="testcomp">
        <SearchBar
          placeholder={t('enterName')}
          onSearch={handleSearch}
          inputTestId="searchByName"
          buttonTestId="searchButton"
        />
        <div className={styles.btnsBlock}>
          <div className="d-flex">
            <SortingButton
              sortingOptions={[
                { label: t('Newest'), value: 'newest' },
                { label: t('Oldest'), value: 'oldest' },
              ]}
              selectedOption={sortingOption}
              onSortChange={handleSorting}
              dataTestIdPrefix="sortUsers"
            />
            <SortingButton
              sortingOptions={[
                { label: tCommon('admin'), value: 'admin' },
                { label: tCommon('superAdmin'), value: 'superAdmin' },
                { label: tCommon('user'), value: 'user' },
                { label: tCommon('cancel'), value: 'cancel' },
              ]}
              selectedOption={filteringOption}
              onSortChange={handleFiltering}
              dataTestIdPrefix="filterUsers"
              buttonLabel={tCommon('filter')}
              type="filter"
              dropdownTestId="filter"
            />
          </div>
        </div>
      </div>
      {isLoading == false &&
      usersData &&
      displayedUsers.length === 0 &&
      searchByName.length > 0 ? (
        <section
          className={styles.notFound}
          role="alert"
          aria-label="No results found"
        >
          <h4>
            {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </section>
      ) : isLoading == false &&
        usersData === undefined &&
        displayedUsers.length === 0 ? (
        <div
          className={styles.notFound}
          role="alert"
          aria-label="No results found"
        >
          <h4>{t('noUserFound')}</h4>
        </div>
      ) : (
        <div className={styles.listBox}>
          {isLoading && (
            <TableLoader
              noOfCols={headerTitles.length}
              noOfRows={perPageResult}
            />
          )}
          <InfiniteScroll
            dataLength={displayedUsers.length}
            next={() => {
              loadMoreUsers(displayedUsers.length, perPageResult);
            }}
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
            <Table className="mb-0" responsive>
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
                {usersData &&
                  displayedUsers.map(
                    (user: InterfaceQueryUserListItem, index: number) => {
                      return (
                        <UsersTableItem
                          key={user.id}
                          index={index}
                          resetAndRefetch={resetAndRefetch}
                          user={user}
                          loggedInUserId={loggedInUserId}
                        />
                      );
                    },
                  )}
              </tbody>
            </Table>
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};
export default Users;
