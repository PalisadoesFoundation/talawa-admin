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
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import TableLoader from 'components/TableLoader/TableLoader';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'utils/debounce';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import styles from './Users.module.css';

const Users = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });

  document.title = t('title');

  const perPageResult = 12;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [sortingOption, setSortingOption] = useState('newest');

  const userType = localStorage.getItem('UserType');
  const loggedInUserId = localStorage.getItem('id');

  const {
    data: usersData,
    loading: loading,
    fetchMore,
    refetch: refetchUsers,
  }: {
    data?: { users: InterfaceQueryUserListItem[] };
    loading: boolean;
    fetchMore: any;
    refetch: any;
    error?: ApolloError;
  } = useQuery(USER_LIST, {
    variables: {
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
      lastName_contains: '',
    },
    notifyOnNetworkStatusChange: true,
  });

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
    if (usersData && usersData.users) {
      const newDisplayedUsers = sortUsers(usersData.users, sortingOption);
      setDisplayedUsers(newDisplayedUsers);
    }
  }, [usersData, sortingOption]);

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

  const handleSearchByName = (e: any): void => {
    const { value } = e.target;
    setSearchByName(value);
    /* istanbul ignore next */
    if (value.length === 0) {
      resetAndRefetch();
      return;
    }
    refetchUsers({
      firstName_contains: value,
      lastName_contains: '',
      // Later on we can add several search and filter options
    });
  };
  /* istanbul ignore next */
  const resetAndRefetch = (): void => {
    refetchUsers({
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
        skip: usersData?.users.length || 0,
        userType: 'ADMIN',
        filter: searchByName,
      },
      updateQuery: (
        prev: { users: InterfaceQueryUserListItem[] } | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult: { users: InterfaceQueryUserListItem[] } | undefined;
        }
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
  const debouncedHandleSearchByName = debounce(handleSearchByName);
  // console.log(usersData);

  const handleSorting = (option: string): void => {
    setSortingOption(option);
  };

  const sortUsers = (
    allUsers: InterfaceQueryUserListItem[],
    sortingOption: string
  ): InterfaceQueryUserListItem[] => {
    const sortedUsers = [...allUsers];

    if (sortingOption === 'newest') {
      sortedUsers.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortingOption === 'oldest') {
      sortedUsers.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return sortedUsers;
  };

  const headerTitles: string[] = [
    '#',
    t('name'),
    t('email'),
    t('roles_userType'),
    t('joined_organizations'),
    t('blocked_organizations'),
  ];

  return (
    <>
      <SuperAdminScreen title={t('users')} screenName="Users">
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.inputContainer}>
            <div
              className={styles.input}
              style={{
                display: userType === 'SUPERADMIN' ? 'block' : 'none',
              }}
            >
              <Form.Control
                type="name"
                className="bg-white"
                placeholder={t('enterName')}
                data-testid="searchByName"
                autoComplete="off"
                required
                onChange={debouncedHandleSearchByName}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
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
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortUsers"
                >
                  <SortIcon className={'me-1'} />
                  {t('sort')}
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
              <Dropdown aria-expanded="false" title="Filter organizations">
                <Dropdown.Toggle variant="outline-success">
                  <FilterListIcon className={'me-1'} />
                  {t('filter')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        {isLoading == false &&
        usersData &&
        displayedUsers.length === 0 &&
        searchByName.length > 0 ? (
          <div className={styles.notFound}>
            <h4>
              {t('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : isLoading == false && usersData && displayedUsers.length === 0 ? (
          // eslint-disable-next-line react/jsx-indent
          <div className={styles.notFound}>
            <h4>{t('noUserFound')}</h4>
          </div>
        ) : (
          <div className={styles.listBox}>
            {isLoading ? (
              <TableLoader
                headerTitles={headerTitles}
                noOfRows={perPageResult}
              />
            ) : (
              <InfiniteScroll
                dataLength={displayedUsers.length ?? 0}
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
                    {usersData &&
                      displayedUsers.map((user, index) => {
                        return (
                          <UsersTableItem
                            key={user._id}
                            index={index}
                            resetAndRefetch={resetAndRefetch}
                            user={user}
                            loggedInUserId={
                              loggedInUserId ? loggedInUserId : ''
                            }
                          />
                        );
                      })}
                  </tbody>
                </Table>
              </InfiniteScroll>
            )}
          </div>
        )}
      </SuperAdminScreen>
    </>
  );
};

export default Users;
