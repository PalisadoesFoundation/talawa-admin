<<<<<<< HEAD
import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
=======
import React from 'react';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
<<<<<<< HEAD
import PaginationList from 'components/PaginationList/PaginationList';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import React from 'react';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './Organizations.module.css';

const { getItem } = useLocalStorage();
=======
import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import styles from './Organizations.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
<<<<<<< HEAD
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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
}
export default function organizations(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

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

<<<<<<< HEAD
  const userId: string | null = getItem('userId');
=======
  const userId: string | null = localStorage.getItem('userId');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const {
    data,
    refetch,
    loading: loadingOrganizations,
  } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { filter: filterName },
  });

  const { data: data2 } = useQuery(USER_JOINED_ORGANIZATIONS, {
    variables: { id: userId },
  });

  const { data: data3 } = useQuery(USER_CREATED_ORGANIZATIONS, {
    variables: { id: userId },
  });

  /* istanbul ignore next */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
<<<<<<< HEAD
    newPage: number,
=======
    newPage: number
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
<<<<<<< HEAD
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
=======
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

<<<<<<< HEAD
  const handleSearch = (value: string): void => {
    setFilterName(value);

    refetch({
      filter: value,
    });
  };
  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };
  const handleSearchByBtnClick = (): void => {
    const value =
      (document.getElementById('searchUserOrgs') as HTMLInputElement)?.value ||
      '';
    handleSearch(value);
=======
  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newFilter = event.target.value;
    setFilterName(newFilter);

    const filter = {
      filter: newFilter,
    };

    refetch(filter);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  };

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setOrganizations(data.organizationsConnection);
    }
  }, [data]);

  /* istanbul ignore next */
  React.useEffect(() => {
    if (mode == 0) {
      if (data) {
        setOrganizations(data.organizationsConnection);
      }
    } else if (mode == 1) {
      if (data2) {
<<<<<<< HEAD
        setOrganizations(data2.users[0].user.joinedOrganizations);
      }
    } else if (mode == 2) {
      if (data3) {
        setOrganizations(data3.users[0].appUserProfile.createdOrganizations);
=======
        setOrganizations(data2.users[0].joinedOrganizations);
      }
    } else if (mode == 2) {
      if (data3) {
        setOrganizations(data3.users[0].createdOrganizations);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      }
    }
  }, [mode]);

  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <h3>{t('selectOrganization')}</h3>
          <div
            className={`d-flex flex-row justify-content-between pt-3 flex-wrap ${styles.gap}`}
          >
            <InputGroup className={styles.maxWidth}>
              <Form.Control
                placeholder={t('search')}
<<<<<<< HEAD
                id="searchUserOrgs"
                type="text"
                className={`${styles.borderNone} ${styles.backgroundWhite}`}
                onKeyUp={handleSearchByEnter}
=======
                type="text"
                className={`${styles.borderNone} ${styles.backgroundWhite}`}
                value={filterName}
                onChange={handleSearch}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                data-testid="searchInput"
              />
              <InputGroup.Text
                className={`${styles.colorPrimary} ${styles.borderNone}`}
<<<<<<< HEAD
                style={{ cursor: 'pointer' }}
                onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              >
                <SearchOutlined className={`${styles.colorWhite}`} />
              </InputGroup.Text>
            </InputGroup>
            <Dropdown drop="down-centered">
              <Dropdown.Toggle
                className={`${styles.colorPrimary} ${styles.borderNone}`}
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

          <div
            className={`d-flex flex-column justify-content-between ${styles.content}`}
          >
            <div
              className={`d-flex flex-column ${styles.gap} ${styles.paddingY}`}
            >
              {loadingOrganizations ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                <>
                  {' '}
                  {organizations && organizations.length > 0 ? (
                    (rowsPerPage > 0
                      ? organizations.slice(
                          page * rowsPerPage,
<<<<<<< HEAD
                          page * rowsPerPage + rowsPerPage,
=======
                          page * rowsPerPage + rowsPerPage
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                        )
                      : /* istanbul ignore next */
                        organizations
                    ).map((organization: any, index) => {
                      const cardProps: InterfaceOrganizationCardProps = {
                        name: organization.name,
                        image: organization.image,
                        id: organization._id,
                        description: organization.description,
<<<<<<< HEAD
                        admins: organization.admins,
                        members: organization.members,
                        address: organization.address,
                        membershipRequestStatus:
                          organization.membershipRequestStatus,
                        userRegistrationRequired:
                          organization.userRegistrationRequired,
                        membershipRequests: organization.membershipRequests,
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                      };
                      return <OrganizationCard key={index} {...cardProps} />;
                    })
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
                    count={
                      /* istanbul ignore next */
                      organizations ? organizations.length : 0
                    }
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
