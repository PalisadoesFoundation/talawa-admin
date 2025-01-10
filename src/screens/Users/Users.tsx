import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Search } from '@mui/icons-material';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from '../../style/app.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import type { ApolloError } from '@apollo/client';
import SortingButton from 'subComponents/SortingButton';

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
 * - `ORGANIZATION_CONNECTION_LIST`: Fetches a list of organizations to verify organization existence.
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
 */
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
  const userType = getItem('SuperAdmin')
    ? 'SUPERADMIN'
    : getItem('AdminFor')
      ? 'ADMIN'
      : 'USER';
  const loggedInUserId = getItem('id');
  const [usersData, setUsersData] = useState<
    { users: InterfaceQueryUserListItem[] } | undefined
  >(undefined);

  const {
    data,
    loading: loading,
    fetchMore,
    refetch: refetchUsers,
  }: {
    data?: { users: InterfaceQueryUserListItem[] };
    loading: boolean;
    fetchMore: (options: {
      variables: Record<string, unknown>;
      updateQuery: (
        previousQueryResult: { users: InterfaceQueryUserListItem[] },
        options: {
          fetchMoreResult?: { users: InterfaceQueryUserListItem[] };
        },
      ) => { users: InterfaceQueryUserListItem[] };
    }) => void;
    refetch: (variables?: Record<string, unknown>) => void;
    error?: ApolloError;
  } = useQuery(USER_LIST, {
    variables: {
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
      lastName_contains: '',
      order: sortingOption === 'newest' ? 'createdAt_DESC' : 'createdAt_ASC',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data) {
      setUsersData(data);
    }
  }, [data, isLoading]);

  const { data: dataOrgs } = useQuery(ORGANIZATION_CONNECTION_LIST);
  const [displayedUsers, setDisplayedUsers] = useState(usersData?.users || []);

  // Manage loading more state
  useEffect(() => {
    if (!usersData) {
      return;
    }

    if (usersData.users.length < perPageResult) {
      setHasMore(false);
    }
    let newDisplayedUsers = sortUsers(usersData.users, sortingOption);
    newDisplayedUsers = filterUsers(newDisplayedUsers, filteringOption);
    setDisplayedUsers(newDisplayedUsers);
  }, [usersData, sortingOption, filteringOption]);

  // To clear the search when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  // Warn if there is no organization
  useEffect(() => {
    if (!dataOrgs) {
      return;
    }

    if (dataOrgs.organizationsConnection.length === 0) {
      toast.warning(t('noOrgError') as string);
    }
  }, [dataOrgs]);

  // Send to orgList page if user is not superadmin
  useEffect(() => {
    if (userType != 'SUPERADMIN') {
      window.location.assign('/orglist');
    }
  }, []);

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

  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.target as HTMLInputElement;
      handleSearch(value);
    }
  };

  const handleSearchByBtnClick = (): void => {
    const inputElement = document.getElementById(
      'searchUsers',
    ) as HTMLInputElement;
    const inputValue = inputElement?.value || '';
    handleSearch(inputValue);
  };
  /* istanbul ignore next */
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
  /* istanbul ignore next */
  const loadMoreUsers = (skipValue: number, limitVal: number): void => {
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        first: limitVal + perPageResult || perPageResult,
        skip: skipValue - perPageResult >= 0 ? skipValue - perPageResult : 0,
        filter: searchByName,
        order: sortingOption === 'newest' ? 'createdAt_DESC' : 'createdAt_ASC',
      },
      updateQuery: (
        prev: { users: InterfaceQueryUserListItem[] } | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: { users: InterfaceQueryUserListItem[] };
        },
      ) => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev || { users: [] };

        const mergedUsers = [...(prev?.users || []), ...fetchMoreResult.users];

        const uniqueUsers = Array.from(
          new Map(mergedUsers.map((user) => [user.user._id, user])).values(),
        );
        if (uniqueUsers.length < mergedUsers.length) {
          setLoadUnqUsers(mergedUsers.length - uniqueUsers.length);
        } else setLoadUnqUsers(0);

        // Load more users will always run after the initial request, hence prev is not going to be undefined
        if (prev?.users) {
          if (uniqueUsers.length - prev?.users.length < perPageResult) {
            setHasMore(false);
          }
        }

        return { users: uniqueUsers };
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
          new Date(b.user.createdAt).getTime() -
          new Date(a.user.createdAt).getTime(),
      );
      return sortedUsers;
    }
    sortedUsers.sort(
      (a, b) =>
        new Date(a.user.createdAt).getTime() -
        new Date(b.user.createdAt).getTime(),
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
    } else if (filteringOption === 'user') {
      const output = filteredUsers.filter((user) => {
        return user.appUserProfile.adminFor.length === 0;
      });
      return output;
    } else if (filteringOption === 'admin') {
      const output = filteredUsers.filter((user) => {
        return (
          user.appUserProfile.isSuperAdmin === false &&
          user.appUserProfile.adminFor.length !== 0
        );
      });
      return output;
    } else {
      const output = filteredUsers.filter((user) => {
        return user.appUserProfile.isSuperAdmin === true;
      });
      return output;
    }
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
        <div className={styles.inputContainer}>
          <div
            className={styles.input}
            style={{
              display: userType === 'SUPERADMIN' ? 'block' : 'none',
            }}
          >
            <Form.Control
              type="name"
              id="searchUsers"
              className="bg-white"
              placeholder={t('enterName')}
              data-testid="searchByName"
              autoComplete="off"
              required
              onKeyUp={handleSearchByEnter}
            />
            <Button
              tabIndex={-1}
              className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
              data-testid="searchButton"
              onClick={handleSearchByBtnClick}
            >
              <Search />
            </Button>
          </div>
        </div>
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
            dataLength={
              /* istanbul ignore next */
              displayedUsers.length ?? 0
            }
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
                          key={user.user._id}
                          index={index}
                          resetAndRefetch={resetAndRefetch}
                          user={user}
                          loggedInUserId={loggedInUserId ? loggedInUserId : ''}
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
