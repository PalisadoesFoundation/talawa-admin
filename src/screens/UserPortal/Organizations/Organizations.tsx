import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import PaginationList from 'components/PaginationList/PaginationList';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import styles from '../../../style/app.module.css';

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
  const [organizations, setOrganizations] = React.useState([]);
  const [filterName, setFilterName] = React.useState('');
  const [mode, setMode] = React.useState(0);

  const modes = [
    t('allOrganizations'),
    t('joinedOrganizations'),
    t('createdOrganizations'),
  ];

  const userId: string | null = getItem('userId');

  const {
    data,
    refetch,
    loading: loadingOrganizations,
  } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { filter: filterName },
  });

  const { data: joinedOrganizationsData } = useQuery(
    USER_JOINED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  const { data: createdOrganizationsData } = useQuery(
    USER_CREATED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  /**
   * Handles page change in pagination.
   *
   * @param _event - The event triggering the page change.
   * @param  newPage - The new page number.
   */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  /**
   * Handles change in the number of rows per page.
   *
   * @param  event - The event triggering the change.
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  /**
   * Searches organizations based on the provided filter value.
   *
   * @param  value - The search filter value.
   */
  const handleSearch = (value: string): void => {
    setFilterName(value);

    refetch({
      filter: value,
    });
  };

  /**
   * Handles search input submission by pressing the Enter key.
   *
   * @param  e - The keyboard event.
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
   * Handles search button click to search organizations.
   */
  const handleSearchByBtnClick = (): void => {
    const value =
      (document.getElementById('searchUserOrgs') as HTMLInputElement)?.value ||
      '';
    handleSearch(value);
  };

  /**
   * Updates the list of organizations based on query results and selected mode.
   */
  useEffect(() => {
    if (data) {
      const organizations = data.organizationsConnection.map(
        (organization: InterfaceOrganization) => {
          let membershipRequestStatus = '';
          if (
            organization.members.find(
              (member: { _id: string }) => member._id === userId,
            )
          )
            membershipRequestStatus = 'accepted';
          else if (
            organization.membershipRequests.find(
              (request: { user: { _id: string } }) =>
                request.user._id === userId,
            )
          )
            membershipRequestStatus = 'pending';
          return { ...organization, membershipRequestStatus };
        },
      );
      setOrganizations(organizations);
    }
  }, [data]);

  /**
   * Updates the list of organizations based on the selected mode and query results.
   */
  useEffect(() => {
    if (mode === 0) {
      if (data) {
        const organizations = data.organizationsConnection.map(
          (organization: InterfaceOrganization) => {
            let membershipRequestStatus = '';
            if (
              organization.members.find(
                (member: { _id: string }) => member._id === userId,
              )
            )
              membershipRequestStatus = 'accepted';
            else if (
              organization.membershipRequests.find(
                (request: { user: { _id: string } }) =>
                  request.user._id === userId,
              )
            )
              membershipRequestStatus = 'pending';
            return {
              ...organization,
              membershipRequestStatus,
              isJoined: false,
            };
          },
        );
        setOrganizations(organizations);
      }
    } else if (mode === 1) {
      if (joinedOrganizationsData && joinedOrganizationsData.users.length > 0) {
        const organizations =
          joinedOrganizationsData.users[0]?.user?.joinedOrganizations.map(
            (org: InterfaceOrganization) => ({
              ...org,
              membershipRequestStatus: 'accepted',
              isJoined: true,
            }),
          ) || [];
        setOrganizations(organizations);
      }
    } else if (mode === 2) {
      if (
        createdOrganizationsData &&
        createdOrganizationsData.users.length > 0
      ) {
        const organizations =
          createdOrganizationsData.users[0]?.appUserProfile?.createdOrganizations.map(
            (org: InterfaceOrganization) => ({
              ...org,
              membershipRequestStatus: 'accepted',
              isJoined: true,
            }),
          ) || [];
        setOrganizations(organizations);
      }
    }
  }, [mode, data, joinedOrganizationsData, createdOrganizationsData, userId]);

  return (
    <>
      {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
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
        <div className={`${styles.mainContainerOrganization}`}>
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
                    id="searchOrganizations"
                    type="text"
                    className={`${styles.inputField}`}
                    onKeyUp={handleSearchByEnter}
                    data-testid="searchInput"
                  />
                  <InputGroup.Text
                    className={`${styles.searchButton}`}
                    style={{ cursor: 'pointer' }}
                    onClick={handleSearchByBtnClick}
                    data-testid="searchBtn"
                  >
                    <SearchOutlined className={`${styles.colorWhite}`} />
                  </InputGroup.Text>
                </InputGroup>
              </div>
              <div className={styles.btnsBlock}>
                <Dropdown drop="down-centered">
                  <Dropdown.Toggle
                    className={`${styles.dropdown}`}
                    variant="success"
                    id="dropdown-basic"
                    data-testid={`modeChangeBtn`}
                  >
                    {modes[mode]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {modes.map((value, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          data-testid={`modeBtn${index}`}
                          onClick={(): void => setMode(index)}
                        >
                          {value}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <div
            className={`d-flex flex-column justify-content-between ${styles.content}`}
          >
            <div
              className={`d-flex flex-column  ${styles.gap} ${styles.paddingY}`}
            >
              {loadingOrganizations ? (
                <div className={`d-flex flex-row justify-content-center`}>
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
