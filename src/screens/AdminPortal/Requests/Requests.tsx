/**
 * Requests screen for membership requests in an organization.
 *
 * Displays pending membership requests with search and role-based access
 * control. Shows empty states for no orgs, no results, and no pending requests.
 *
 * Features:
 * - Name search via SearchFilterBar.
 * - Accept/reject actions with toast feedback.
 *
 * Data:
 * - Uses `MEMBERSHIP_REQUEST_PG` query.
 * - Uses `ACCEPT_ORGANIZATION_REQUEST_MUTATION` and
 *   `REJECT_ORGANIZATION_REQUEST_MUTATION`.
 *
 * @remarks
 * Only administrators and superusers can access this screen; others are redirected to
 * `/admin/orglist`.
 *
 * @returns The rendered Requests component.
 */
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSimpleTableData } from 'shared-components/DataTable/hooks/useSimpleTableData';
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
import TableLoader from 'shared-components/TableLoader/TableLoader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import Group from '@mui/icons-material/Group';
import Search from '@mui/icons-material/Search';
import ErrorPanel from 'shared-components/ErrorPanel';

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

interface InterfaceMembershipRequestsQueryData {
  organization?: {
    membershipRequests?: InterfaceRequestsListItem[];
  } | null;
}

/**
 * Renders the Membership Requests screen.
 *
 * Responsibilities:
 * - Displays pending membership requests
 * - Supports search submission via SearchFilterBar
 * - Shows user avatars and request details
 * - Handles accept and reject request actions
 * - Shows empty state when no requests exist
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
  const [searchByName, setSearchByName] = useState<string>('');
  const { orgId = '' } = useParams();
  const organizationId = orgId;

  // Query to fetch membership requests
  const membershipRequestsQuery =
    useQuery<InterfaceMembershipRequestsQueryData>(MEMBERSHIP_REQUEST_PG, {
      variables: {
        input: {
          id: organizationId,
        },
        first: PAGE_SIZE,
        skip: 0,
        name_contains: searchByName,
      },
      notifyOnNetworkStatusChange: true,
    });

  // Memoized path function for useSimpleTableData (stable reference required)
  const extractRequests = useCallback(
    (data: InterfaceMembershipRequestsQueryData) =>
      data?.organization?.membershipRequests ?? [],
    [],
  );

  const {
    rows: allRequests,
    loading,
    error,
    refetch,
  } = useSimpleTableData<
    InterfaceRequestsListItem,
    InterfaceMembershipRequestsQueryData
  >(membershipRequestsQuery, {
    path: extractRequests,
  });

  const { data: orgsData } = useQuery(ORGANIZATION_LIST);

  // Filter to show only pending requests
  const displayedRequests = useMemo(() => {
    return allRequests.filter(
      (req: InterfaceRequestsListItem) => req.status === 'pending',
    );
  }, [allRequests]);

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
    const normalizedRole = (
      (getItem('role') as string | null) ?? ''
    ).toLowerCase();
    const isAdmin =
      normalizedRole === 'administrator' || normalizedRole === 'superuser';
    if (!isAdmin) {
      window.location.assign('/admin/orglist');
    }
  }, []);

  /**
   * Handles the search input change and updates the search term.
   *
   * @param value - The search term entered by the user.
   */
  const handleSearch = (value: string): void => {
    setSearchByName(value);
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

  // Mutations for accept/reject
  const [acceptUser] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectUser] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  const handleAcceptUser = async (membershipRequestId: string) => {
    try {
      const { data: acceptData } = await acceptUser({
        variables: { input: { membershipRequestId } },
      });
      if (acceptData?.acceptMembershipRequest?.success) {
        NotificationToast.success(t('requests.acceptedSuccessfully') as string);
        refetch();
      } else {
        const errorMessage =
          acceptData?.acceptMembershipRequest?.message ||
          (t('users.errorOccurred') as string);
        NotificationToast.error(errorMessage);
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
      if (rejectData?.rejectMembershipRequest?.success) {
        NotificationToast.success(t('requests.rejectedSuccessfully') as string);
        refetch();
      } else {
        const errorMessage =
          rejectData?.rejectMembershipRequest?.message ||
          (t('users.errorOccurred') as string);
        NotificationToast.error(errorMessage);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  /**
   * Helper: get initials from a name string.
   */
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] ?? '').toUpperCase();
  };

  return (
    <div data-testid="testComp">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {t('requests.title')}{' '}
            <span className="badge badge-orange request-badge">
              {displayedRequests.length} {t('requests.pending')}
            </span>
          </h1>
          <p className="page-subtitle">{t('requests.reviewAndManage')}</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="search-bar"
          placeholder={t('requests.searchRequests')}
          value={searchByName}
          onChange={(e) => handleSearch(e.target.value)}
          data-testid="searchByName"
        />
      </div>

      {error ? (
        <ErrorPanel
          message={t('requests.errorLoadingRequests')}
          error={error}
          onRetry={refetch}
          testId="errorRequests"
        />
      ) : !loading && orgsData?.organizations?.length === 0 ? (
        <EmptyState
          icon={<Group />}
          message={t('requests.noOrgErrorTitle')}
          description={t('requests.noOrgErrorDescription')}
          dataTestId="requests-no-orgs-empty"
        />
      ) : !loading &&
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
      ) : !loading && displayedRequests.length === 0 ? (
        <EmptyState
          icon={<Group />}
          message={t('requests.noRequestsFound')}
          description={t('requests.newMembersWillAppearHere')}
          dataTestId="requests-no-requests-empty"
        />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            {loading ? (
              <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">{tCommon('name')}</th>
                    <th scope="col">{t('requests.requested')}</th>
                    <th scope="col">{t('requests.message')}</th>
                    <th scope="col">{t('requests.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map((req) => {
                    const user =
                      req.user || ({} as InterfaceRequestsListItem['user']);
                    const initials = getInitials(user.name || '');
                    const requestedDate = (() => {
                      try {
                        return new Date(req.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        );
                      } catch {
                        return '';
                      }
                    })();
                    return (
                      <tr key={req.membershipRequestId}>
                        <td>
                          <div className="user-cell">
                            <div className="user-cell-avatar">{initials}</div>
                            <div>
                              <div className="user-cell-name">{user.name}</div>
                              <div className="user-cell-email">
                                {user.emailAddress}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{requestedDate}</td>
                        <td>
                          <div className="message-snippet">{''}</div>
                        </td>
                        <td>
                          <div className="request-actions">
                            <button
                              className="btn btn-primary btn-sm"
                              data-testid={`acceptMembershipRequestBtn${req.membershipRequestId}`}
                              onClick={async () => {
                                await handleAcceptUser(req.membershipRequestId);
                              }}
                            >
                              {t('requests.accept')}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              data-testid={`rejectMembershipRequestBtn${req.membershipRequestId}`}
                              onClick={async () => {
                                await handleRejectUser(req.membershipRequestId);
                              }}
                            >
                              {t('requests.reject')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
