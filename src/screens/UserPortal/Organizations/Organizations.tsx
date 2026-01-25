/* global HTMLButtonElement, HTMLTextAreaElement */
/**
 * Organizations.tsx
 *
 * This file contains the `organizations` component, which is responsible for displaying
 * and managing the organizations associated with a user. It provides functionality to view all
 * organizations, joined organizations, and created organizations, along with search and pagination features.
 *
 * The component uses GraphQL queries to fetch data for organizations and manages the state for
 * filtering, pagination, and UI responsiveness. It also includes a debounced search mechanism
 * to optimize performance when filtering organizations.
 *
 * @remarks
 * - The component dynamically adjusts its layout based on the screen size, toggling a sidebar for smaller screens.
 * - It supports three modes: viewing all organizations, joined organizations, and created organizations.
 * - The search functionality is debounced to reduce unnecessary GraphQL query calls.
 * - Pagination is implemented to handle large datasets efficiently.
 *
 * ### Dependencies
 * - `@apollo/client` for GraphQL queries.
 * - `@mui/icons-material` for icons.
 * - `react-bootstrap` for UI components.
 * - `react-i18next` for internationalization.
 * - Custom components like `PaginationList`, `OrganizationCard`, and `UserSidebar`.
 *
 * @returns The Organizations component.
 *
 * @example
 * ```tsx
 * <Organizations />
 * ```
 *
 */

import { useQuery, useMutation } from '@apollo/client';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  USER_CREATED_ORGANIZATIONS,
  ORGANIZATION_FILTER_LIST,
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
  CURRENT_USER,
} from 'GraphQl/Queries/Queries';
import { RESEND_VERIFICATION_EMAIL_MUTATION } from 'GraphQl/Mutations/mutations';
import PaginationList from 'shared-components/PaginationList/PaginationList';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './Organizations.module.css';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import OrganizationCard from 'shared-components/OrganizationCard/OrganizationCard';
import type { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';
import { Alert } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';

type IOrganizationCardProps = InterfaceOrganizationCardProps;

interface InterfaceMemberNode {
  id: string;
}
interface InterfaceMemberEdge {
  node: InterfaceMemberNode;
}
interface InterfaceMembersConnection {
  edges: InterfaceMemberEdge[];
  pageInfo?: {
    hasNextPage: boolean;
  };
}
interface IOrganization {
  isJoined: boolean;
  id: string;
  name: string;
  avatarURL?: string;
  addressLine1?: string;
  description: string;
  adminsCount?: number;
  membersCount?: number;
  admins: [];
  members?: InterfaceMembersConnection;
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    id: string;
    user: {
      id: string;
    };
  }[];
}

interface IOrgData {
  isMember: boolean;
  addressLine1: string;
  avatarURL: string | null;
  id: string;
  membersCount: number;
  members: {
    edges: [
      {
        node: {
          id: string;
          __typename: string;
        };
        __typename: string;
      },
    ];
  };
  description: string;
  __typename: string;
  name: string;
}

export default function Organizations(): React.JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });
  const { t: tLogin } = useTranslation('translation', {
    keyPrefix: 'loginPage',
  });
  const { t: tCommon } = useTranslation('common');

  const { getItem, setItem, removeItem } = useLocalStorage();

  // Email verification warning state
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Fetch current user status to sync verification state
  const { data: currentUserData } = useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only', // Ensure fresh data
  });

  const [resendVerificationEmail, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL_MUTATION,
  );

  // Check for email verification status on component mount and sync with backend
  useEffect(() => {
    if (hasDismissed) return;

    // Priority: API data > LocalStorage
    if (currentUserData?.currentUser) {
      if (currentUserData.currentUser.isEmailAddressVerified) {
        setShowEmailWarning(false);
        // Clean up legacy flags
        removeItem('emailNotVerified');
        removeItem('unverifiedEmail');
      } else {
        setShowEmailWarning(true);
        // Only store boolean flag, not PII
        setItem('emailNotVerified', 'true');
      }
    } else {
      // Fallback to local storage if API data not yet available
      const emailNotVerified = getItem('emailNotVerified');
      if (emailNotVerified === 'true') {
        setShowEmailWarning(true);
      }
    }
  }, [currentUserData, getItem, removeItem, setItem, hasDismissed]);

  const handleDismissWarning = (): void => {
    setShowEmailWarning(false);
    setHasDismissed(true);
    removeItem('emailNotVerified');
    removeItem('unverifiedEmail');
  };

  const handleResendVerification = async (): Promise<void> => {
    try {
      const { data } = await resendVerificationEmail();
      if (data?.sendVerificationEmail?.success) {
        NotificationToast.success(tLogin('emailResent'));
      } else {
        NotificationToast.info(tLogin('resendFailed'));
      }
    } catch (error) {
      errorHandler(tCommon, error);
    }
  };

  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  useEffect(() => {
    setItem('sidebar', hideDrawer.toString());
  }, [hideDrawer, setItem]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [organizations, setOrganizations] = React.useState<IOrganization[]>([]);
  const [filterName, setFilterName] = React.useState('');
  const [searchText, setSearchText] = useState('');
  const [mode, setMode] = React.useState(0);

  const modes = [
    t('allOrganizations'),
    t('joinedOrganizations'),
    t('createdOrganizations'),
  ];

  const userId: string | null = getItem('userId');

  const {
    data: allOrganizationsData,
    loading: loadingAll,
    refetch: refetchAll,
  } = useQuery(ORGANIZATION_FILTER_LIST, {
    variables: { filter: filterName },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    skip: mode !== 0,
    notifyOnNetworkStatusChange: true,
    onError: (error) => console.error('All orgs error:', error),
  });

  const {
    data: joinedOrganizationsData,
    loading: loadingJoined,
    refetch: refetchJoined,
  } = useQuery(USER_JOINED_ORGANIZATIONS_NO_MEMBERS, {
    variables: { id: userId, first: rowsPerPage, filter: filterName },
    skip: mode !== 1,
  });

  const {
    data: createdOrganizationsData,
    loading: loadingCreated,
    refetch: refetchCreated,
  } = useQuery(USER_CREATED_ORGANIZATIONS, {
    variables: { id: userId, filter: filterName },
    skip: mode !== 2,
  });

  function doSearch(value: string) {
    setFilterName(value);
    if (mode === 0) {
      refetchAll({ filter: value });
    } else if (mode === 1) {
      refetchJoined({ id: userId, first: rowsPerPage, filter: value });
    } else {
      refetchCreated({ id: userId, filter: value });
    }
  }

  useEffect(() => {
    if (mode === 0) {
      if (allOrganizationsData?.organizations) {
        const orgs = allOrganizationsData.organizations.map((org: IOrgData) => {
          const isMember = org.isMember;
          return {
            id: org.id,
            name: org.name,
            avatarURL: org.avatarURL || '',
            description: org.description || '',
            addressLine1: org.addressLine1 || '',
            membersCount: org.membersCount || 0,
            admins: [],
            membershipRequestStatus: isMember ? 'accepted' : '',
            userRegistrationRequired: false,
            membershipRequests: [],
            isJoined: isMember,
          };
        });
        setOrganizations(orgs);
      }
    } else if (mode === 1) {
      if (joinedOrganizationsData?.user?.organizationsWhereMember?.edges) {
        const orgs =
          joinedOrganizationsData.user.organizationsWhereMember.edges.map(
            (edge: { node: IOrganization }) => {
              const organization = edge.node;
              return {
                ...organization,
                membershipRequestStatus: 'accepted',
                isJoined: true,
              };
            },
          );
        setOrganizations(orgs);
      } else {
        setOrganizations([]);
      }
    } else if (mode === 2) {
      if (createdOrganizationsData?.user?.createdOrganizations) {
        const orgs = createdOrganizationsData.user.createdOrganizations.map(
          (org: IOrganization) => ({
            ...org,
            membershipRequestStatus: 'created',
            isJoined: true,
          }),
        );
        setOrganizations(orgs);
      } else {
        setOrganizations([]);
      }
    }
  }, [
    mode,
    allOrganizationsData,
    joinedOrganizationsData,
    createdOrganizationsData,
    userId,
  ]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newVal = event.target.value;
    setRowsPerPage(parseInt(newVal, 10));
    setPage(0);
  };

  const isLoading = loadingAll || loadingJoined || loadingCreated;
  const role = 'user';

  return (
    <>
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`${styles.organizationsContainer} ${
          hideDrawer ? styles.marginLeft80 : styles.marginLeft260
        } ${hideDrawer ? styles.expand : styles.contract}`}
        data-testid="organizations-container"
      >
        <div
          className={`${styles.mainContainerOrganization} ${styles.organizationsMainContainer}`}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className={styles.organizationsFlexContainer}>
              <h1>{t('selectOrganization')}</h1>
            </div>
          </div>

          {/* Email Verification Warning Banner */}
          {showEmailWarning && (
            <Alert
              variant="warning"
              dismissible
              onClose={handleDismissWarning}
              className="mb-3"
              data-testid="email-verification-warning"
              aria-live="polite"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{tLogin('emailNotVerified')}</strong>
                </div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  data-testid="resend-verification-btn"
                >
                  {resendLoading
                    ? tCommon('loading')
                    : tLogin('resendVerification')}
                </Button>
              </div>
            </Alert>
          )}

          {/* Refactored Header Structure */}
          <div className={styles.calendar__header}>
            <SearchFilterBar
              hasDropdowns={true}
              dropdowns={[
                {
                  id: 'filter',
                  label: t('filter'),
                  type: 'filter',
                  options: modes.map((value, index) => ({
                    label: value,
                    value: index,
                  })),
                  selectedOption: mode,
                  onOptionChange: (value) => setMode(Number(value)),
                  dataTestIdPrefix: 'modeChangeBtn',
                },
              ]}
              searchValue={searchText}
              onSearchChange={setSearchText}
              onSearchSubmit={() => doSearch(searchText)}
              searchPlaceholder={t('searchOrganizations')}
              searchInputTestId="searchInput"
              searchButtonTestId="searchBtn"
            />
          </div>

          <div
            className={`d-flex flex-column justify-content-between ${styles.content}`}
          >
            <div
              className={`d-flex flex-column ${styles.gap} ${styles.paddingY}`}
            >
              {isLoading ? (
                <div
                  className="d-flex flex-row justify-content-center"
                  data-testid="loading-spinner"
                  role="status"
                >
                  <HourglassBottomIcon />{' '}
                  <span aria-live="polite">{t('loading')}</span>
                </div>
              ) : (
                <>
                  {organizations && organizations.length > 0 ? (
                    <div className="row" data-testid="organizations-list">
                      {(rowsPerPage > 0
                        ? organizations.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                        : organizations
                      ).map((organization: IOrganization, index) => {
                        const cardProps: IOrganizationCardProps = {
                          name: organization.name,
                          id: organization.id,
                          description: organization.description,
                          avatarURL: organization.avatarURL || '',
                          addressLine1: organization.addressLine1 || '',
                          admins: organization.admins,
                          membershipRequestStatus:
                            organization.membershipRequestStatus,
                          userRegistrationRequired:
                            organization.userRegistrationRequired,
                          membershipRequests: organization.membershipRequests,
                          isJoined: organization.isJoined,
                          membersCount: organization.membersCount || 0,
                          adminsCount: organization.adminsCount || 0,
                          role: role,
                        };
                        return (
                          <div
                            key={index}
                            className="col-md-6 mb-4"
                            data-testid="organization-card"
                            data-organization-name={organization.name}
                            data-membership-status={
                              organization.membershipRequestStatus
                            }
                            data-cy="orgCard"
                          >
                            <div
                              data-testid={`membership-status-${organization.name}`}
                              data-status={organization.membershipRequestStatus}
                              className="visually-hidden"
                            ></div>

                            <OrganizationCard data={cardProps} />
                            <span
                              data-testid={`org-name-${organization.name}`}
                              className="visually-hidden"
                            >
                              {organization.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span data-testid="no-organizations-message">
                      {t('nothingToShow')}
                    </span>
                  )}
                </>
              )}
            </div>
            <table>
              <tbody>
                <tr>
                  <PaginationList
                    count={Math.max(
                      organizations ? organizations.length : 0,
                      rowsPerPage + 1,
                    )}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
