/**
 * @file Requests.tsx
 * @description This file contains the implementation of the Requests component, which displays
 *              a list of membership requests for an organization. It includes features like
 *              infinite scrolling, search functionality, and role-based access control.
 *
 * @module Requests
 *
 * @requires react
 * @requires @apollo/client
 * @requires react-bootstrap
 * @requires react-i18next
 * @requires react-toastify
 * @requires react-router-dom
 * @requires @mui/material
 * @requires GraphQl/Queries/Queries
 * @requires components/TableLoader/TableLoader
 * @requires components/RequestsTableItem/RequestsTableItem
 * @requires subComponents/SearchBar
 * @requires utils/interfaces
 * @requires utils/useLocalstorage
 * @requires style/app-fixed.module.css
 *
 *
 * @typedef {Object} InterfaceRequestsListItem
 * @property {string} _id - The unique identifier for the request.
 * @property {Object} user - The user details associated with the request.
 * @property {string} user.firstName - The first name of the user.
 * @property {string} user.lastName - The last name of the user.
 * @property {string} user.email - The email address of the user.
 *
 * @component
 * @name Requests
 * @description Displays a list of membership requests for an organization. Includes search,
 *              infinite scrolling, and role-based access control. Redirects unauthorized users
 *              to the organization list page.
 *
 * @returns {JSX.Element} The rendered Requests component.
 *
 * @example
 * <Requests />
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` for fetching data.
 * - Implements infinite scrolling using `react-infinite-scroll-component`.
 * - Displays a search bar for filtering requests by user name.
 * - Handles role-based access control for `ADMIN` and `SUPERADMIN` roles.
 * - Displays appropriate messages when no data is available.
 *
 */
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { MEMBERSHIP_REQUEST, ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import RequestsTableItem from 'components/RequestsTableItem/RequestsTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../../style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router';
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
  membershipRequestId: string;
  createdAt: string;
  status: string;
  user: {
    avatarURL?: string;
    id: string;
    name: string;
    emailAddress: string;
  };
}

const Requests = (): JSX.Element => {
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
  const userRole = getItem('role') as string;
  const { orgId = '' } = useParams();
  const organizationId = orgId;

  // Query to fetch membership requests
  const { data, loading, fetchMore, refetch } = useQuery(MEMBERSHIP_REQUEST, {
    variables: {
      input: {
        id: organizationId,
      },
      first: perPageResult,
      skip: 0,
      name_contains: '',
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data: orgsData } = useQuery(ORGANIZATION_LIST);
  const [displayedRequests, setDisplayedRequests] = useState<
    InterfaceRequestsListItem[]
  >([]);

  // Update displayed requests when data changes
  useEffect(() => {
    if (!data?.organization?.membershipRequests) {
      return;
    }

    const allRequests = data.organization.membershipRequests;
    const pendingRequests = allRequests.filter(
      (req: { status: string }) => req.status === 'pending',
    );
    setIsLoading(false);
    setIsLoadingMore(false);
    setDisplayedRequests(pendingRequests);

    // Update hasMore based on whether we have a full page of results
    if (allRequests.length < perPageResult) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [data, perPageResult]);

  // Clear search on unmount
  useEffect(() => {
    return () => {
      setSearchByName('');
    };
  }, []);

  // Check for organizations
  useEffect(() => {
    if (!orgsData) {
      return;
    }

    // Add null check before accessing organizations.length
    if (orgsData.organizations?.length === 0) {
      toast.warning(t('noOrgError') as string);
    }
  }, [orgsData, t]);

  // Check authorization
  useEffect(() => {
    const isSuperAdmin = getItem('SuperAdmin');
    const isAdmin = userRole?.toLowerCase() === 'administrator';
    if (!(isAdmin || isSuperAdmin)) {
      window.location.assign('/orglist');
    }
  }, [userRole]);

  // Manage loading state
  useEffect(() => {
    if (loading && !isLoadingMore) {
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
      input: {
        id: organizationId,
      },
      first: perPageResult,
      skip: 0,
      name_contains: value,
      // Later on we can add several search and filter options
    });
  };

  /**
   * Resets search and refetches the data.
   */
  const resetAndRefetch = (): void => {
    refetch({
      input: {
        id: organizationId,
      },
      first: perPageResult,
      skip: 0,
      name_contains: '',
    });
    setHasMore(true);
  };

  /**
   * Loads more requests when scrolling to the bottom of the page.
   */

  const loadMoreRequests = (): void => {
    setIsLoadingMore(true);

    const currentLength = data?.organization?.membershipRequests?.length ?? 0;

    fetchMore({
      variables: {
        input: { id: organizationId },
        first: perPageResult,
        skip: currentLength,
        name_contains: searchByName,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingMore(false);

        if (!fetchMoreResult?.organization?.membershipRequests) {
          setHasMore(false);
          return prev;
        }

        const newRequests = fetchMoreResult.organization.membershipRequests;

        // If we got fewer results than requested, we've reached the end
        if (newRequests.length < perPageResult) {
          setHasMore(false);
        }
        return {
          organization: {
            ...prev.organization,
            id: organizationId,
            membershipRequests: [
              ...prev.organization.membershipRequests,
              ...newRequests,
            ],
          },
        };
      },
    });
  };

  // Header titles for the table
  const headerTitles: string[] = [
    t('sl_no'),
    t('profile'),
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
        <div className={`${styles.input}`}>
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
              dataLength={displayedRequests.length}
              next={loadMoreRequests}
              loader={<TableLoader noOfCols={6} noOfRows={2} />}
              hasMore={hasMore}
              className={styles.listTable}
              data-testid="requests-list"
              scrollThreshold={0.9}
              style={{ overflow: 'visible' }}
              endMessage={
                displayedRequests.length > 0 ? (
                  <div className={'w-100 text-center my-4'}>
                    <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                  </div>
                ) : null
              }
            >
              <TableContainer
                component={Paper}
                className="mt-3"
                sx={{ borderRadius: '16px' }}
              >
                <Table aria-label={t('membershipRequestsTable')} role="grid">
                  <TableHead>
                    <TableRow>
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
                    {displayedRequests.map(
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
