import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Search } from '@mui/icons-material';
import {
  MEMBERSHIP_REQUEST,
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import RequestsTableItem from 'components/RequestsTableItem/RequestsTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type {
  InterfaceQueryMembershipRequestsListItem,
  InterfaceUserType,
} from 'utils/interfaces';
import styles from './Requests.module.css';
import useLocalStorage from 'utils/useLocalstorage';

const Requests = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });

  document.title = t('title');

  const { getItem } = useLocalStorage();

  const perPageResult = 8;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<string>('');
  const userType = getItem('UserType');

  const {
    data: userData,
    error: errorUser,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: getItem('id') },
    context: {
      headers: { authorization: `Bearer ${getItem('token')}` },
    },
  });

  useEffect(() => {
    if (!userData) {
      return;
    }

    const adminFor = userData.user.adminFor;
    if (adminFor && adminFor.length == 1) {
      setOrganizationId(adminFor[0]._id);
    }
  }, [userData]);

  useEffect(() => {
    if (errorUser) {
      window.location.assign('/orglist');
    }
  }, [errorUser]);

  const {
    data: requestsData,
    loading,
    fetchMore,
    refetch: refetchRequests,
  }: {
    data: InterfaceQueryMembershipRequestsListItem | undefined;
    loading: boolean;
    fetchMore: any;
    refetch: any;
    error?: Error | undefined;
  } = useQuery(MEMBERSHIP_REQUEST, {
    variables: {
      first: perPageResult,
      skip: 0,
      id: organizationId,
      firstName_contains: '',
    },
    skip: !organizationId,
    notifyOnNetworkStatusChange: true,
  });

  const { data: orgsData } = useQuery(ORGANIZATION_CONNECTION_LIST);
  const [displayedRequests, setDisplayedRequests] = useState(
    requestsData?.organizations[0]?.membershipRequests || [],
  );

  // Manage loading more state
  useEffect(() => {
    if (!requestsData) {
      return;
    }

    if (!requestsData.organizations || !requestsData.organizations[0]) {
      return;
    }

    const membershipRequests = requestsData.organizations[0].membershipRequests;

    if (membershipRequests.length < perPageResult) {
      setHasMore(false);
    }

    setDisplayedRequests(membershipRequests);
  }, [requestsData]);

  // To clear the search when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  // Warn if there is no organization
  useEffect(() => {
    if (!orgsData) {
      return;
    }

    if (orgsData.organizationsConnection.length === 0) {
      toast.warning(t('noOrgError'));
    }
  }, [orgsData]);

  // Send to orgList page if user is not admin
  useEffect(() => {
    if (userType != 'ADMIN') {
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
    refetchRequests({
      id: organizationId,
      firstName_contains: value,
      // Later on we can add several search and filter options
    });
  };

  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };

  const handleSearchByBtnClick = (): void => {
    const inputElement = document.getElementById(
      'searchRequests',
    ) as HTMLInputElement;
    const inputValue = inputElement?.value || '';
    handleSearch(inputValue);
  };
  /* istanbul ignore next */
  const resetAndRefetch = (): void => {
    refetchRequests({
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
    });
    setHasMore(true);
  };
  /* istanbul ignore next */
  const loadMoreRequests = (): void => {
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        id: organizationId,
        skip: requestsData?.organizations?.[0]?.membershipRequests?.length || 0,
        firstName_contains: searchByName,
      },
      updateQuery: (
        prev: InterfaceQueryMembershipRequestsListItem | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult: InterfaceQueryMembershipRequestsListItem | undefined;
        },
      ): InterfaceQueryMembershipRequestsListItem | undefined => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        const newMembershipRequests =
          fetchMoreResult.organizations[0].membershipRequests || [];
        if (newMembershipRequests.length < perPageResult) {
          setHasMore(false);
        }
        return {
          organizations: [
            {
              _id: organizationId,
              membershipRequests: [
                ...(prev?.organizations[0].membershipRequests || []),
                ...newMembershipRequests,
              ],
            },
          ],
        };
      },
    });
  };

  const headerTitles: string[] = [
    t('sl_no'),
    t('name'),
    t('email'),
    t('accept'),
    t('reject'),
  ];

  return (
    <>
      {/* Buttons Container */}
      <div className={styles.btnsContainer} data-testid="testComp">
        <div className={styles.inputContainer}>
          <div
            className={styles.input}
            style={{
              display: userType === 'ADMIN' ? 'block' : 'none',
            }}
          >
            <Form.Control
              type="name"
              id="searchRequests"
              className="bg-white"
              placeholder={t('searchRequests')}
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
      </div>
      {!isLoading &&
      (orgsData?.organizationsConnection.length === 0 ||
        (userData &&
          userData.user.userType === 'ADMIN' &&
          userData.user.adminFor.length === 0)) ? (
        <div className={styles.notFound}>
          <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
          <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
        </div>
      ) : !isLoading &&
        requestsData &&
        displayedRequests.length === 0 &&
        searchByName.length > 0 ? (
        <div className={styles.notFound}>
          <h4 className="m-0">
            {t('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : !isLoading && requestsData && displayedRequests.length === 0 ? (
        <div className={styles.notFound}>
          <h4>{t('noRequestsFound')}</h4>
        </div>
      ) : (
        <div className={styles.listBox}>
          {isLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={perPageResult} />
          ) : (
            <InfiniteScroll
              dataLength={
                /* istanbul ignore next */
                displayedRequests.length ?? 0
              }
              next={loadMoreRequests}
              loader={
                <TableLoader
                  noOfCols={headerTitles.length}
                  noOfRows={perPageResult}
                />
              }
              hasMore={hasMore}
              className={styles.listTable}
              data-testid="requests-list"
              endMessage={
                <div className={'w-100 text-center my-4'}>
                  <h5 className="m-0 ">{t('endOfResults')}</h5>
                </div>
              }
            >
              <Table className={styles.requestsTable} responsive borderless>
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
                  {requestsData &&
                    displayedRequests.map((request, index) => {
                      return (
                        <RequestsTableItem
                          key={request._id}
                          index={index}
                          resetAndRefetch={resetAndRefetch}
                          request={request}
                        />
                      );
                    })}
                </tbody>
              </Table>
            </InfiniteScroll>
          )}
        </div>
      )}
    </>
  );
};

export default Requests;
