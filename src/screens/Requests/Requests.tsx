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
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import {
  MEMBERSHIP_REQUEST_PG,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'components/TableLoader/TableLoader';
import { GridCellParams } from '@mui/x-data-grid';
import type {
  ReportingTableColumn,
  ReportingTableGridProps,
  InfiniteScrollProps,
  ReportingRow,
} from '../../types/ReportingTable/interface';

import Avatar from 'components/Avatar/Avatar';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';
import styles from '../../style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router';
import { Stack } from '@mui/material';
import PageHeader from 'shared-components/Navbar/Navbar';
import {
  dataGridStyle,
  PAGE_SIZE,
  ROW_HEIGHT,
} from '../../types/ReportingTable/utils';

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
  useEffect(() => {
    document.title = t('title');
  }, [t]);

  // Hook for managing local storage
  const { getItem } = useLocalStorage();

  // Define constants and state variables
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState<string>('');
  const userRole = getItem('role') as string;
  const { orgId = '' } = useParams();
  const organizationId = orgId;

  // Query to fetch membership requests
  const { data, loading, fetchMore, refetch } = useQuery(
    MEMBERSHIP_REQUEST_PG,
    {
      variables: {
        input: {
          id: organizationId,
        },
        first: PAGE_SIZE,
        skip: 0,
        name_contains: '',
      },
      notifyOnNetworkStatusChange: true,
    },
  );

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
    if (allRequests.length < PAGE_SIZE) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [data]);

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
    const rawSuperAdmin = getItem('SuperAdmin');
    const isSuperAdmin =
      rawSuperAdmin === true ||
      rawSuperAdmin === 'true' ||
      rawSuperAdmin === 'True';
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
      first: PAGE_SIZE,
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
      first: PAGE_SIZE,
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
        first: PAGE_SIZE,
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
        if (newRequests.length < PAGE_SIZE) {
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

  // Columns for ReportingTable (DataGrid)
  const columns: ReportingTableColumn[] = [
    {
      field: 'sl_no',
      headerName: t('sl_no'),
      display: 'flex',
      flex: 0.5,
      minWidth: 50,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <span className={styles.requestsTableItemIndex}>
          {params.api.getRowIndexRelativeToVisibleRows(
            params.row.membershipRequestId,
          ) + 1}
          .
        </span>
      ),
    },
    {
      field: 'profile',
      headerName: t('profile'),
      display: 'flex',
      flex: 1,
      minWidth: 80,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => {
        const user = params.row.user || {};
        if (user.avatarURL && user.avatarURL !== 'null') {
          return (
            <img
              src={user.avatarURL}
              className={styles.userAvatar}
              alt={t('profilePictureAlt')}
              data-testid="display-img"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
            />
          );
        }
        return (
          <Avatar
            data-testid="display-img"
            size={45}
            avatarStyle={styles.avatarStyle}
            name={user.name || ''}
            alt={t('placeholderAvatarAlt')}
          />
        );
      },
    },
    {
      field: 'name',
      headerName: tCommon('name'),
      display: 'flex',
      flex: 2,
      minWidth: 150,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <span className={styles.requestsTableItemName}>
          {params.row.user?.name || ''}
        </span>
      ),
    },
    {
      field: 'email',
      headerName: tCommon('email'),
      display: 'flex',
      flex: 2,
      minWidth: 150,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <span className={styles.requestsTableItemEmail}>
          {params.row.user?.emailAddress || ''}
        </span>
      ),
    },
    {
      field: 'accept',
      headerName: t('accept'),
      display: 'flex',
      flex: 1,
      minWidth: 100,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <Stack alignItems="center" spacing={0.5}>
          <Button
            className={
              'btn ' +
              styles.requestsAcceptButton +
              ' ' +
              styles.hoverShadowOnly
            }
            data-testid={
              'acceptMembershipRequestBtn' +
              (params?.row?.membershipRequestId ?? '')
            }
            aria-label={t('accept')}
            onClick={async () => {
              if (params?.row?.membershipRequestId) {
                await handleAcceptUser(params.row.membershipRequestId);
              }
            }}
          >
            <GroupAddIcon />
          </Button>
          {t('accept')}
        </Stack>
      ),
    },
    {
      field: 'reject',
      headerName: t('reject'),
      display: 'flex',
      flex: 1,
      minWidth: 100,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <Stack alignItems="center" spacing={0.5}>
          <Button
            className={
              'btn ' +
              styles.requestsRejectButton +
              ' ' +
              styles.hoverShadowOnly
            }
            data-testid={
              'rejectMembershipRequestBtn' +
              (params?.row?.membershipRequestId ?? '')
            }
            aria-label={t('reject')}
            onClick={async () => {
              if (params?.row?.membershipRequestId) {
                await handleRejectUser(params.row.membershipRequestId);
              }
            }}
          >
            <DeleteIcon />
          </Button>
          {t('reject')}
        </Stack>
      ),
    },
  ];

  const gridProps: ReportingTableGridProps = {
    sx: { ...dataGridStyle },
    paginationMode: 'client',
    getRowId: (row: InterfaceRequestsListItem) => row.membershipRequestId,
    rowCount: displayedRequests.length,
    pageSizeOptions: [PAGE_SIZE],
    loading: isLoading || isLoadingMore,
    hideFooter: true,
    slots: {
      noRowsOverlay: () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {t('notFound')}
        </Stack>
      ),
    },
    getRowClassName: () => `${styles.rowBackground}`,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    rowHeight: ROW_HEIGHT,
    autoHeight: true,
    style: { overflow: 'visible' },
  };

  const infiniteProps: InfiniteScrollProps = {
    dataLength: displayedRequests.length,
    next: loadMoreRequests,
    hasMore,
  };

  // Mutations for accept/reject
  const [acceptUser] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectUser] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  const handleAcceptUser = async (membershipRequestId: string) => {
    try {
      const { data: acceptData } = await acceptUser({
        variables: { input: { membershipRequestId } },
      });
      if (acceptData) {
        toast.success(t('acceptedSuccessfully') as string);
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleRejectUser = async (membershipRequestId: string) => {
    try {
      const { data: rejectData } = await rejectUser({
        variables: { input: { membershipRequestId } },
      });
      if (rejectData) {
        toast.success(t('rejectedSuccessfully') as string);
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      {/* Buttons Container */}
      <div
        className={styles.btnsContainer + ' gap-4 flex-wrap'}
        data-testid="testComp"
      >
        <PageHeader
          search={{
            placeholder: t('searchRequests'),
            onSearch: handleSearch,
            inputTestId: 'searchByName',
            buttonTestId: 'searchButton',
          }}
        />
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
            <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
          ) : (
            <ReportingTable
              rows={
                displayedRequests.map((req) => ({ ...req })) as ReportingRow[]
              }
              columns={columns}
              gridProps={gridProps}
              infiniteProps={infiniteProps}
              listProps={{
                loader: <TableLoader noOfCols={6} noOfRows={2} />,
                className: styles.listTable,
                ['data-testid']: 'requests-list',
                scrollThreshold: 0.9,
                style: { overflow: 'visible' },
                endMessage:
                  displayedRequests.length > 0 ? (
                    <div className={'w-100 text-center my-4'}>
                      <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
                    </div>
                  ) : null,
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Requests;
