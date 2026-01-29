/**
 * Requests screen for membership requests in an organization.
 *
 * Displays pending membership requests with infinite scroll, search, and role-based access
 * control. Shows empty states for no orgs, no results, and no pending requests.
 *
 * Features:
 * - Name search via SearchFilterBar.
 * - Accept/reject actions with toast feedback.
 *
 * Data:
 * - Uses `MEMBERSHIP_REQUEST_PG` and `ORGANIZATION_LIST` queries.
 * - Uses `ACCEPT_ORGANIZATION_REQUEST_MUTATION` and
 *   `REJECT_ORGANIZATION_REQUEST_MUTATION`.
 *
 * @remarks
 * Only administrators and superadmins can access this screen; others are redirected to
 * `/admin/orglist`.
 *
 * @returns The rendered Requests component.
 */
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
import {
  GridCellParams,
  GridColDef,
  DataGridWrapper,
} from 'shared-components/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './Requests.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { Group, Search } from '@mui/icons-material';

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

/**
 * Renders the Membership Requests screen.
 *
 * Responsibilities:
 * - Displays membership requests with infinite scroll support
 * - Supports search submission via SearchFilterBar
 * - Shows user avatars and request details
 * - Handles accept and reject request actions
 * - Shows empty state via DataGrid overlay when no requests exist
 *
 * Localization:
 * - Uses `common` and `requests` namespaces
 *
 * @returns JSX.Element
 */
const Requests = (): JSX.Element => {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');

  // Set the document title to the translated title for the requests page
  useEffect(() => {
    document.title = t('requests.title');
  }, [t]);

  // Hook for managing local storage
  const { getItem } = useLocalStorage();

  // Define constants and state variables
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState<string>('');
  const userRole = getItem('role') as string;
  const { orgId = '' } = useParams();
  const organizationId = orgId;

  // Query to fetch membership requests
  const { data, loading, refetch } = useQuery(MEMBERSHIP_REQUEST_PG, {
    variables: {
      input: {
        id: organizationId,
      },
      first: PAGE_SIZE,
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
      NotificationToast.warning(t('requests.noOrgError') as string);
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
      window.location.assign('/admin/orglist');
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
  };

  // Header titles for the table
  const headerTitles: string[] = [
    t('requests.sl_no'),
    t('requests.profile'),
    tCommon('name'),
    tCommon('email'),
    t('requests.accept'),
    t('requests.reject'),
  ];

  // Columns for ReportingTable (DataGrid)
  const columns: GridColDef[] = [
    {
      field: 'sl_no',
      headerName: t('requests.sl_no'),
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
      headerName: t('requests.profile'),
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
              alt={t('requests.profilePictureAlt')}
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
            alt={t('requests.placeholderAvatarAlt')}
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
      headerName: t('requests.accept'),
      display: 'flex',
      flex: 1,
      minWidth: 100,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <Button
          className={
            'btn ' + styles.requestsAcceptButton + ' ' + styles.hoverShadowOnly
          }
          data-testid={
            'acceptMembershipRequestBtn' +
            (params?.row?.membershipRequestId ?? '')
          }
          aria-label={t('requests.accept')}
          onClick={async () => {
            if (params?.row?.membershipRequestId) {
              await handleAcceptUser(params.row.membershipRequestId);
            }
          }}
        >
          <CheckCircleIcon />
        </Button>
      ),
    },
    {
      field: 'reject',
      headerName: t('requests.reject'),
      display: 'flex',
      flex: 1,
      minWidth: 100,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => (
        <Button
          className={
            'btn ' + styles.requestsRejectButton + ' ' + styles.hoverShadowOnly
          }
          data-testid={
            'rejectMembershipRequestBtn' +
            (params?.row?.membershipRequestId ?? '')
          }
          aria-label={t('requests.reject')}
          onClick={async () => {
            if (params?.row?.membershipRequestId) {
              await handleRejectUser(params.row.membershipRequestId);
            }
          }}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  // Mutations for accept/reject
  const [acceptUser] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectUser] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  const handleAcceptUser = async (membershipRequestId: string) => {
    try {
      const { data: acceptData } = await acceptUser({
        variables: { input: { membershipRequestId } },
      });
      if (acceptData) {
        NotificationToast.success(t('requests.acceptedSuccessfully') as string);
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
        NotificationToast.success(t('requests.rejectedSuccessfully') as string);
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <div data-testid="testComp">
      <SearchFilterBar
        searchPlaceholder={t('requests.searchRequests')}
        searchValue={searchByName}
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearch}
        searchInputTestId="searchByName"
        searchButtonTestId="searchButton"
        hasDropdowns={false}
      />

      {!isLoading && orgsData?.organizations?.length === 0 ? (
        <EmptyState
          icon={<Group />}
          message={t('requests.noOrgErrorTitle')}
          description={t('requests.noOrgErrorDescription')}
          dataTestId="requests-no-orgs-empty"
        />
      ) : !isLoading &&
        data &&
        displayedRequests.length === 0 &&
        searchByName.length > 0 ? (
        <EmptyState
          icon={<Search />}
          message={tCommon('noResultsFoundFor', {
            query: searchByName,
          })}
          description={tCommon('tryAdjustingFilters')}
          dataTestId="requests-search-empty"
        />
      ) : !isLoading && data && displayedRequests.length === 0 ? (
        <EmptyState
          icon={<Group />}
          message={t('requests.noRequestsFound')}
          description={t('requests.newMembersWillAppearHere')}
          dataTestId="requests-no-requests-empty"
        />
      ) : (
        <div className={styles.listBox}>
          {isLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
          ) : (
            <DataGridWrapper
              rows={displayedRequests.map((req) => {
                return { ...req, id: req.membershipRequestId };
              })}
              columns={columns}
              emptyStateMessage={t('requests.noRequestsFound')}
              paginationConfig={{
                enabled: true,
                defaultPageSize: PAGE_SIZE,
                pageSizeOptions: [10, 25, 50, 100],
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
