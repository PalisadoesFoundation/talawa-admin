import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  ALL_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import styles from '../../../style/app-fixed.module.css';

/**
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.btnsContainer`
 * - `.input`
 * - `.inputField`
 * - `.searchButton`
 * - `.btnsBlock`
 * - `.dropdown`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
const { getItem } = useLocalStorage();

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  admins: [];
  members: [];
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
    _id: string;
    user: {
      _id: string;
    };
  }[];
  isJoined: boolean;
}

/**
 * Interface defining the structure of organization properties.
 */
interface InterfaceOrganization {
  isJoined: boolean;
  _id: string;
  name: string;
  image: string;
  description: string;
  admins: [];
  members: [];
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
    _id: string;
    user: {
      _id: string;
    };
  }[];
}

/**
 * Component for displaying and managing user organizations.
 *
 */
export default function organizations(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  /**
   * Handles window resize events to toggle drawer visibility.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [organizations, setOrganizations] = React.useState<
    InterfaceOrganization[]
  >([]);
  const [filterName, setFilterName] = React.useState('');
  const [mode, setMode] = React.useState(0);

  const modes = [
    t('allOrganizations'),
    t('joinedOrganizations'),
    t('createdOrganizations'),
  ];

  const userId: string | null = getItem('userId');

  /**
   * Queries for all 3 modes
   */
  const {
    data: allOrganizationsData,
    loading: loadingAll,
    refetch: refetchAll,
  } = useQuery(ALL_ORGANIZATIONS, {
    variables: { filter: filterName },
  });

  const {
    data: joinedOrganizationsData,
    loading: loadingJoined,
    refetch: refetchJoined,
  } = useQuery(USER_JOINED_ORGANIZATIONS, {
    variables: { id: userId, first: rowsPerPage, filter: filterName },
  });

  const {
    data: createdOrganizationsData,
    loading: loadingCreated,
    refetch: refetchCreated,
  } = useQuery(USER_CREATED_ORGANIZATIONS, {
    variables: { id: userId, filter: filterName },
  });

  /**
   * Re-fetch logic depending on mode
   */
  const handleSearch = (value: string): void => {
    setFilterName(value);

    if (mode === 0) {
      refetchAll({ filter: value });
    } else if (mode === 1) {
      refetchJoined({ filter: value });
    } else if (mode === 2) {
      refetchCreated({ filter: value });
    }
  };

  /**
   * Trigger search in real-time as user types
   */
  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    handleSearch(newValue);
  };

  /**
   * Pressing Enter also triggers search (optional)
   */
  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.target as HTMLInputElement;
      handleSearch(value);
    }
  };

  /**
   * Clicking the search button also triggers the same logic
   */
  const handleSearchByBtnClick = (): void => {
    const value =
      (document.getElementById('searchUserOrgs') as HTMLInputElement)?.value ||
      '';
    handleSearch(value);
  };

  /**
   * React to changes in mode or relevant query data
   */
  useEffect(() => {
    if (mode === 0) {
      // All organizations
      if (allOrganizationsData?.organizations) {
        const orgs = allOrganizationsData.organizations.map(
          (org: InterfaceOrganization) => ({
            ...org,
            membershipRequestStatus: '',
            isJoined: false,
          }),
        );
        setOrganizations(orgs);
      } else {
        setOrganizations([]);
      }
    } else if (mode === 1) {
      // Joined organizations
      if (joinedOrganizationsData?.user?.organizationsWhereMember?.edges) {
        const orgs =
          joinedOrganizationsData.user.organizationsWhereMember.edges.map(
            (edge: { node: InterfaceOrganization }) => {
              const organization = edge.node;
              let membershipRequestStatus = '';

              if (
                Array.isArray(organization.members) &&
                organization.members.some(
                  (member: { _id: string }) => member._id === userId,
                )
              ) {
                membershipRequestStatus = 'accepted';
              } else if (
                organization.membershipRequests?.some(
                  (request: { _id: string; user: { _id: string } }) =>
                    request.user._id === userId,
                )
              ) {
                membershipRequestStatus = 'pending';
              }

              return {
                ...organization,
                membershipRequestStatus,
                isJoined: true,
              };
            },
          );
        setOrganizations(orgs);
      } else {
        setOrganizations([]);
      }
    } else if (mode === 2) {
      // Created organizations
      if (createdOrganizationsData?.user?.createdOrganizations) {
        const orgs = createdOrganizationsData.user.createdOrganizations.map(
          (org: InterfaceOrganization) => ({
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
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = event.target.value;
    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  const isLoading = loadingAll || loadingJoined || loadingCreated;

  return (
    <>
      {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={() => setHideDrawer(!hideDrawer)}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={() => setHideDrawer(!hideDrawer)}
          data-testid="closeMenu"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )}
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`${styles.containerHeight} ${
          hideDrawer === null
            ? ''
            : hideDrawer
              ? styles.expandOrg
              : styles.contractOrg
        }`}
      >
        <div className={styles.mainContainerOrganization}>
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <h1>{t('selectOrganization')}</h1>
            </div>
          </div>

          <div className={styles.head}>
            <div className={styles.btnsContainer}>
              <div className={styles.input}>
                <InputGroup className={styles.maxWidth}>
                  <Form.Control
                    placeholder={t('searchOrganizations')}
                    id="searchUserOrgs"
                    type="text"
                    className={styles.inputField}
                    value={filterName}
                    onChange={handleChangeFilter}
                    onKeyUp={handleSearchByEnter}
                    data-testid="searchInput"
                  />
                  <InputGroup.Text
                    className={styles.searchButton}
                    style={{ cursor: 'pointer' }}
                    onClick={handleSearchByBtnClick}
                    data-testid="searchBtn"
                  >
                    <SearchOutlined className={styles.colorWhite} />
                  </InputGroup.Text>
                </InputGroup>
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
                <div className="d-flex flex-row justify-content-center">
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                <>
                  {organizations && organizations.length > 0 ? (
                    <div className="row">
                      {(rowsPerPage > 0
                        ? organizations.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                        : organizations
                      ).map((organization: InterfaceOrganization, index) => {
                        const cardProps: InterfaceOrganizationCardProps = {
                          name: organization.name,
                          image: organization.image,
                          id: organization._id,
                          description: organization.description,
                          admins: organization.admins,
                          members: organization.members,
                          address: organization.address,
                          membershipRequestStatus:
                            organization.membershipRequestStatus,
                          userRegistrationRequired:
                            organization.userRegistrationRequired,
                          membershipRequests: organization.membershipRequests,
                          isJoined: organization.isJoined,
                        };
                        return (
                          <div key={index} className="col-md-6 mb-4">
                            <OrganizationCard {...cardProps} />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span>{t('nothingToShow')}</span>
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
