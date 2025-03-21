import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { MEMBERSHIP_REQUEST, ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import RequestsTableItem from 'components/RequestsTableItem/RequestsTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { InterfaceQueryMembershipRequestsListItem } from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router-dom';
import SearchBar from 'subComponents/SearchBar';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface InterfaceRequestsListItem {
  membershipRequestId: string; // Changed from id
  createdAt: string;
  status: string;
  user: {
    id: string;
    name: string; // Changed from firstName/lastName
    email: string;
  };
}

/**
 * The `Requests` component fetches and displays a paginated list of membership requests
 * for an organization, with functionality for searching, filtering, and infinite scrolling.
 *
 */
const Requests = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });
  const { t: tCommon } = useTranslation('common');

  // Set the document title to the translated title for the requests page
  document.title = t('title');

  // Hook for managing local storage
  const { getItem } = useLocalStorage();

  // Define constants and state variables
  const perPageResult = 8;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState<string>('');
  const userRole = getItem('SuperAdmin')
    ? 'SUPERADMIN'
    : getItem('AdminFor')
      ? 'ADMIN'
      : 'USER';
  const { orgId = '' } = useParams();
  const organizationId = orgId;
  console.log(organizationId);

  // Query to fetch membership requests
  const { data, loading, fetchMore, refetch } = useQuery(MEMBERSHIP_REQUEST, {
    variables: {
      input: {
      id: organizationId
      },
      first:perPageResult,
      skip: 0,
      firstName_contains: '',
    },
    notifyOnNetworkStatusChange: true,
  });
  console.log(data);
  // Query to fetch the list of organizations
  const { data: orgsData } = useQuery(ORGANIZATION_LIST);
  const [displayedRequests, setDisplayedRequests] = useState<
    InterfaceRequestsListItem[]
  >([]);

  // Manage loading more state
  useEffect(() => {
    if (!data) {
      return;
    }
  
    const allRequests = data.organization?.membershipRequests || [];
    // Filter to only show pending requests
    const pendingRequests = allRequests.filter((req: { status: string; }) => req.status === 'pending');
  
    if (pendingRequests.length < perPageResult) {
      setHasMore(false);
    }
  
    setDisplayedRequests(pendingRequests);
  }, [data]);

  // Clear the search field when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  // Show a warning if there are no organizations
  useEffect(() => {
    if (!orgsData) {
      return;
    }

    // Add null check before accessing organizations.length
    if (orgsData.organizations?.length === 0) {
      toast.warning(t('noOrgError') as string);
    }
  }, [orgsData, t]);

  // Redirect to orgList page if the user is not an admin
  // useEffect(() => {
  //   if (userRole != 'ADMIN' && userRole != 'SUPERADMIN') {
  //     window.location.assign('/orglist');
  //   }
  // }, [userRole]);

  // Manage the loading state
  useEffect(() => {
    if (loading && isLoadingMore == false) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading, isLoadingMore]);

  /**
   * Handles the search input change and refetches the data based on the search value.
   *
   * @param value - The search term entered by the user.
   */
  const handleSearch = (value: string): void => {
    setSearchByName(value);
    if (value === '') {
      resetAndRefetch();
      return;
    }
    refetch({
      id: organizationId,
      firstName_contains: value,
      // Later on we can add several search and filter options
    });
  };

  /**
   * Resets search and refetches the data.
   */
  const resetAndRefetch = (): void => {
    refetch({
      first: perPageResult,
      skip: 0,
      firstName_contains: '',
    });
    setHasMore(true);
  };

  /**
   * Loads more requests when scrolling to the bottom of the page.
   */

  const loadMoreRequests = (): void => {
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        id: organizationId,
        skip: data?.organizations?.[0]?.membershipRequests?.length || 0,
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
          fetchMoreResult.organizations?.[0]?.membershipRequests || [];
        if (newMembershipRequests.length < perPageResult) {
          setHasMore(false);
        }
        return {
          organizations: [
            {
              id: organizationId,
              membershipRequests: [
                ...(prev?.organizations?.[0]?.membershipRequests || []),
                ...newMembershipRequests,
              ],
            },
          ],
        };
      },
    });
  };

  // Header titles for the table
  const headerTitles: string[] = [
    t('sl_no'),
    tCommon('name'),
    tCommon('email'),
    t('accept'),
    t('reject'),
  ];

  return (
    <>
      {/* Buttons Container */}
      <div
        className={`${styles.btnsContainer} gap-4 flex-wrap`}
        data-testid="testComp"
      >
        <div
          className={`${styles.input}`}
          style={{
            display:
              userRole === 'ADMIN' || userRole === 'SUPERADMIN'
                ? 'block'
                : 'none',
          }}
        >
          <SearchBar
            placeholder={t('searchRequests')}
            onSearch={handleSearch}
            inputTestId="searchByName"
            buttonTestId="searchButton"
            className=""
          />
        </div>
      </div>

      {!isLoading && orgsData?.organizations?.length === 0 ? (
        <div className={styles.notFound}>
          <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
          <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
        </div>
      ) : !isLoading &&
        data &&
        displayedRequests.length === 0 &&
        searchByName.length > 0 ? (
        <div className={styles.notFound}>
          <h4 className="m-0">
            {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : !isLoading && data && displayedRequests.length === 0 ? (
        <div className={styles.notFound}>
          <h4>{t('noRequestsFound')}</h4>
        </div>
      ) : (
        <div className={styles.listBox}>
          {isLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={perPageResult} />
          ) : (
            <InfiniteScroll
              dataLength={displayedRequests.length ?? 0}
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
                  <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                </div>
              }
            >
              <TableContainer
                component={Paper}
                className="mt-3"
                sx={{ borderRadius: '16px' }}
              >
                <Table aria-label={t('membershipRequestsTable')} role="grid">
                  <TableHead>
                    <TableRow role="row">
                      {headerTitles.map((title: string, index: number) => {
                        return (
                          <TableCell
                            key={index}
                            data-testid="table-header-serial"
                            role="columnheader"
                            aria-sort="none"
                            className={styles.customcell}
                            scope="col"
                          >
                            {title}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      displayedRequests.map(
                        (request: InterfaceRequestsListItem, index: number) => {
                          return (
                            <RequestsTableItem
                              key={request?.membershipRequestId}
                              index={index}
                              resetAndRefetch={resetAndRefetch}
                              request={request}
                            />
                          );
                        },
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </InfiniteScroll>
          )}
        </div>
      )}
    </>
  );
};

export default Requests;
