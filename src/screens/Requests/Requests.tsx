import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Dropdown, Form, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Search } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import {
  ACCEPT_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST_REQUEST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import TableLoader from 'components/TableLoader/TableLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'utils/debounce';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceOrgConnectionType,
  InterfaceQueryRequestListItem,
  InterfaceUserType,
} from 'utils/interfaces';
import styles from './Requests.module.css';

const Requests = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });

  document.title = t('title');

  const perPageResult = 12;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, sethasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');

  const [acceptAdminFunc] = useMutation(ACCEPT_ADMIN_MUTATION);
  const [rejectAdminFunc] = useMutation(REJECT_ADMIN_MUTATION);
  const {
    data: currentUserData,
  }: {
    data: InterfaceUserType | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const {
    data: usersData,
    loading: loading,
    fetchMore,
    refetch: refetchUsers,
  }: {
    data: { users: InterfaceQueryRequestListItem[] } | undefined;
    loading: boolean;
    fetchMore: any;
    refetch: any;
  } = useQuery(USER_LIST_REQUEST, {
    variables: {
      first: perPageResult,
      skip: 0,
      userType: 'ADMIN',
      adminApproved: false,
      filter: searchByName,
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: dataOrgs,
  }: {
    data: InterfaceOrgConnectionType | undefined;
  } = useQuery(ORGANIZATION_CONNECTION_LIST);

  // To clear the search when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  useEffect(() => {
    if (!usersData) {
      return;
    }
    if (usersData.users.length < perPageResult) {
      sethasMore(false);
    }
  }, [usersData]);

  // If the user is not Superadmin, redirect to Organizations screen
  useEffect(() => {
    const userType = localStorage.getItem('UserType');
    if (userType != 'SUPERADMIN') {
      window.location.assign('/orglist');
    }
  }, []);

  // Check if there are no organizations then show a warning
  useEffect(() => {
    if (!dataOrgs) {
      return;
    }
    if (dataOrgs.organizationsConnection.length === 0) {
      toast.warning(t('noOrgError'));
    }
  }, [dataOrgs]);

  // Manage the loading state
  useEffect(() => {
    if (loading && isLoadingMore == false) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  const resetAndRefetch = (): void => {
    refetchUsers({
      first: perPageResult,
      skip: 0,
      userType: 'ADMIN',
      adminApproved: false,
      filter: '',
    });
    sethasMore(true);
  };

  const loadMoreRequests = (): void => {
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        skip: usersData?.users.length || 0,
        userType: 'ADMIN',
        adminApproved: false,
        filter: searchByName,
      },
      updateQuery: (
        prev: { users: InterfaceQueryRequestListItem[] } | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult:
            | { users: InterfaceQueryRequestListItem[] }
            | undefined;
        }
      ): { users: InterfaceQueryRequestListItem[] } | undefined => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.users.length < perPageResult) {
          sethasMore(false);
        }
        return {
          users: [...(prev?.users || []), ...(fetchMoreResult.users || [])],
        };
      },
    });
  };

  const acceptAdmin = async (userId: any): Promise<void> => {
    try {
      const { data } = await acceptAdminFunc({
        variables: {
          id: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('userApproved'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const rejectAdmin = async (userId: any): Promise<void> => {
    try {
      const { data } = await rejectAdminFunc({
        variables: {
          id: userId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('userRejected'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleSearchByName = async (e: any): Promise<void> => {
    const { value } = e.target;
    setSearchByName(value);
    if (value === '') {
      resetAndRefetch();
      return;
    }
    await refetchUsers({
      firstName_contains: value,
      lastName_contains: '',
      // Later on we can add several search and filter options
    });
  };

  const debouncedHandleSearchByName = debounce(handleSearchByName);

  const headerTitles: string[] = [
    '#',
    t('name'),
    t('email'),
    t('accept'),
    t('reject'),
  ];

  return (
    <>
      <SuperAdminScreen title={t('requests')} screenName="Requests">
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.inputContainer}>
            <div
              className={styles.input}
              style={{
                display:
                  currentUserData &&
                  currentUserData.user.userType === 'SUPERADMIN'
                    ? 'block'
                    : 'none',
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
              <Dropdown aria-expanded="false" title="Sort organizations">
                <Dropdown.Toggle variant="outline-success">
                  <SortIcon className={'me-1'} />
                  {t('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
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
        usersData?.users.length === 0 &&
        searchByName.length > 0 ? (
          <div className={styles.notFound}>
            <h4>
              {t('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : isLoading == false && usersData?.users.length === 0 ? (
          <div className={styles.notFound}>
            <h4>{t('noRequestFound')}</h4>
          </div>
        ) : isLoading ? (
          <TableLoader headerTitles={headerTitles} noOfRows={perPageResult} />
        ) : (
          <InfiniteScroll
            dataLength={usersData?.users.length ?? 0}
            next={loadMoreRequests}
            loader={<TableLoader noOfCols={5} noOfRows={perPageResult} />}
            hasMore={hasMore}
            className={styles.listBox}
            data-testid="organizations-list"
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
                {usersData?.users &&
                  usersData.users.map((user, index) => {
                    return (
                      <tr key={user._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button
                            className="btn btn-success btn-sm"
                            onClick={async (): Promise<void> => {
                              await acceptAdmin(user._id);
                            }}
                            data-testid={`acceptUser${user._id}`}
                          >
                            {t('accept')}
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn btn-danger btn-sm"
                            onClick={async (): Promise<void> => {
                              await rejectAdmin(user._id);
                            }}
                            data-testid={`rejectUser${user._id}`}
                          >
                            {t('reject')}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </InfiniteScroll>
        )}
      </SuperAdminScreen>
    </>
  );
};

export default Requests;
