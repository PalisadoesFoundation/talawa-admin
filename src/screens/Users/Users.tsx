import type { ApolloError } from '@apollo/client';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Search } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from './Users.module.css';
import useLocalStorage from 'utils/useLocalstorage';

const Users = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });

  document.title = t('title');

  const { getItem } = useLocalStorage();

  const perPageResult = 12;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [sortingOption, setSortingOption] = useState('newest');
  const [filteringOption, setFilteringOption] = useState('cancel');
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
      ? 'ADMIN'
      : 'USER';

  const loggedInUserId = getItem('id');

  const { data, loading, fetchMore, refetch } = useQuery(USER_LIST, {
    variables: {
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
      lastName_contains: '',
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data: dataOrgs } = useQuery(ORGANIZATION_CONNECTION_LIST);
  const [displayedUsers, setDisplayedUsers] = useState(data?.users || []);

  // Manage loading more state
  useEffect(() => {
    if (!data) {
      return;
    }
    if (data.users.length < perPageResult) {
      setHasMore(false);
    }
    if (data && data.users) {
      let newDisplayedUsers = sortUsers(data.users, sortingOption);
      newDisplayedUsers = filterUsers(newDisplayedUsers, filteringOption);
      setDisplayedUsers(newDisplayedUsers);
    }
  }, [data, sortingOption, filteringOption]);

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
      toast.warning(t('noOrgError'));
    }
  }, [dataOrgs]);

  // Send to orgList page if user is not superadmin
  useEffect(() => {
    if (userRole != 'SUPERADMIN') {
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

  const handleSearch = (value: string): void => {
    setSearchByName(value);
    if (value === '') {
      resetAndRefetch();
      return;
    }
    refetch({
      firstName_contains: value,
      lastName_contains: '',
      // Later on we can add several search and filter options
    });
  };

  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
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
    refetch({
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
      lastName_contains: '',
    });
    setHasMore(true);
  };
  /* istanbul ignore next */
  const loadMoreUsers = (): void => {
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        skip: data?.users.length || 0,
        filter: searchByName,
      },
      updateQuery: (
        prev: { users: InterfaceQueryUserListItem[] } | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult: { users: InterfaceQueryUserListItem[] } | undefined;
        },
      ): { users: InterfaceQueryUserListItem[] } | undefined => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.users.length < perPageResult) {
          setHasMore(false);
        }
        return {
          users: [...(prev?.users || []), ...(fetchMoreResult.users || [])],
        };
      },
    });
  };

  const handleSorting = (option: string): void => {
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
    } else {
      sortedUsers.sort(
        (a, b) =>
          new Date(a.user.createdAt).getTime() -
          new Date(b.user.createdAt).getTime(),
      );
      return sortedUsers;
    }
  };

  const handleFiltering = (option: string): void => {
    setFilteringOption(option);
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
    t('name'),
    t('email'),
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
              display: userRole === 'SUPERADMIN' ? 'block' : 'none',
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
            <Dropdown
              aria-expanded="false"
              title="Sort Users"
              data-testid="sort"
            >
              <Dropdown.Toggle variant="success" data-testid="sortUsers">
                <SortIcon className={'me-1'} />
                {sortingOption === 'newest' ? t('Newest') : t('Oldest')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={(): void => handleSorting('newest')}
                  data-testid="newest"
                >
                  {t('Newest')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(): void => handleSorting('oldest')}
                  data-testid="oldest"
                >
                  {t('Oldest')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              aria-expanded="false"
              title="Filter organizations"
              data-testid="filter"
            >
              <Dropdown.Toggle
                variant="outline-success"
                data-testid="filterUsers"
              >
                <FilterListIcon className={'me-1'} />
                {t('filter')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  data-testid="admin"
                  onClick={(): void => handleFiltering('admin')}
                >
                  {t('admin')}
                </Dropdown.Item>
                <Dropdown.Item
                  data-testid="superAdmin"
                  onClick={(): void => handleFiltering('superAdmin')}
                >
                  {t('superAdmin')}
                </Dropdown.Item>

                <Dropdown.Item
                  data-testid="user"
                  onClick={(): void => handleFiltering('user')}
                >
                  {t('user')}
                </Dropdown.Item>
                <Dropdown.Item
                  data-testid="cancel"
                  onClick={(): void => handleFiltering('cancel')}
                >
                  {t('cancel')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      {isLoading == false &&
      data &&
      displayedUsers.length === 0 &&
      searchByName.length > 0 ? (
        <div className={styles.notFound}>
          <h4>
            {t('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : isLoading == false && data && displayedUsers.length === 0 ? (
        <div className={styles.notFound}>
          <h4>{t('noUserFound')}</h4>
        </div>
      ) : (
        <div className={styles.listBox}>
          {isLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={perPageResult} />
          ) : (
            <InfiniteScroll
              dataLength={
                /* istanbul ignore next */
                displayedUsers.length ?? 0
              }
              next={loadMoreUsers}
              loader={
                <TableLoader
                  noOfCols={headerTitles.length}
                  noOfRows={perPageResult}
                />
              }
              hasMore={hasMore}
              className={styles.listBox}
              data-testid="users-list"
              endMessage={
                <div className={'w-100 text-center my-4'}>
                  <h5 className="m-0 ">{t('endOfResults')}</h5>
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
                  {data &&
                    displayedUsers.map(
                      (user: InterfaceQueryUserListItem, index: number) => {
                        return (
                          <UsersTableItem
                            key={user.user._id}
                            index={index}
                            resetAndRefetch={resetAndRefetch}
                            user={user}
                            loggedInUserId={
                              loggedInUserId ? loggedInUserId : ''
                            }
                          />
                        );
                      },
                    )}
                </tbody>
              </Table>
            </InfiniteScroll>
          )}
        </div>
      )}
    </>
  );
};

export default Users;
