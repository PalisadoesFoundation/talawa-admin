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

import { useQuery } from '@apollo/client';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  USER_CREATED_ORGANIZATIONS,
  ORGANIZATION_FILTER_LIST,
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
} from 'GraphQl/Queries/Queries';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import useDebounce from 'utils/useDebounce';
import styles from '../../../style/app-fixed.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import OrganizationCard from 'shared-components/OrganizationCard/OrganizationCard';
import type { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';

// useDebounce hook moved to src/utils/useDebounce

type IOrganizationCardProps = InterfaceOrganizationCardProps;

/**
 * Interface defining the structure of organization properties.
 */

interface InterfaceMemberNode {
  id: string;
  // add other fields if needed
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
  avatarURL?: string; // <-- add this
  addressLine1?: string; // <-- add this
  description: string;
  adminsCount?: number;
  membersCount?: number;
  admins: [];
  members?: InterfaceMembersConnection; // <-- update this
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

/**
 * Component for displaying and managing user organizations.
 */
export default function Organizations(): React.JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

  const { getItem, setItem } = useLocalStorage();
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  /**
   * Handles window resize events to toggle drawer visibility.
   */
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
  const [typedValue, setTypedValue] = React.useState('');
  const [filterName, setFilterName] = React.useState('');
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
  /**
   * 2) doSearch sets the filterName (triggering refetch)
   */
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

  const { debouncedCallback: debouncedSearch } = useDebounce(doSearch, 300);

  const handleChangeFilter = (newVal: string): void => {
    setTypedValue(newVal);
    debouncedSearch(newVal);
  };

  /**
   * React to changes in mode or relevant query data
   */
  useEffect(() => {
    if (mode === 0) {
      if (allOrganizationsData?.organizations) {
        const orgs = allOrganizationsData.organizations.map((org: IOrgData) => {
          // Check if current user is a member
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
            isJoined: isMember, // Set based on membership check
          };
        });
        setOrganizations(orgs);
      }
    } else if (mode === 1) {
      // Joined
      if (joinedOrganizationsData?.user?.organizationsWhereMember?.edges) {
        const orgs =
          joinedOrganizationsData.user.organizationsWhereMember.edges.map(
            (edge: { node: IOrganization }) => {
              const organization = edge.node;
              return {
                ...organization,
                membershipRequestStatus: 'accepted', // Always set to 'accepted' for joined orgs
                isJoined: true,
              };
            },
          );
        setOrganizations(orgs);
      } else {
        setOrganizations([]);
      }
    } else if (mode === 2) {
      // Created
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

  /**
   * pagination
   */
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

  /** We are treating the viewer for this screen as an User always*/
  const role = 'user';
  return (
    <>
      {/* {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={() => setHideDrawer(!hideDrawer)}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" />
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={() => setHideDrawer(!hideDrawer)}
          data-testid="closeMenu"
        >
          <i className="fa fa-angle-double-left" />
        </Button>
      )} */}
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`${hideDrawer ? styles.expand : styles.contract}`}
        style={{
          marginLeft: hideDrawer ? '40px' : '20px',
          paddingTop: '20px',
        }}
        data-testid="organizations-container"
      >
        <div
          className={styles.mainContainerOrganization}
          style={{ overflowX: 'hidden' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <h1>{t('selectOrganization')}</h1>
            </div>
          </div>

          <div className={styles.head}>
            <div className={styles.btnsContainer}>
              <div className={styles.input}>
                <SearchBar
                  className={styles.maxWidth}
                  placeholder={t('searchOrganizations')}
                  value={typedValue}
                  onChange={(val) => handleChangeFilter(val)}
                  onSearch={(val) => doSearch(val)}
                  inputTestId="searchInput"
                  buttonTestId="searchBtn"
                />
              </div>
              <div className={styles.btnsBlock}>
                <Dropdown drop="down-centered">
                  <Dropdown.Toggle
                    className={styles.dropdown}
                    variant="success"
                    id="dropdown-basic"
                    data-testid="modeChangeBtn"
                  >
                    {modes[mode]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {modes.map((value, index) => (
                      <Dropdown.Item
                        key={index}
                        data-testid={`modeBtn${index}`}
                        onClick={() => setMode(index)}
                      >
                        {value}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
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
                  <span aria-live="polite">Loading...</span>
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
                            {/* Add a hidden span with organization name for testing purposes */}
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
                    count={organizations ? organizations.length : 0}
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
