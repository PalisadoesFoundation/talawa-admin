import React from 'react';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
import styles from './Organizations.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import useLocalStorage from 'utils/useLocalstorage';

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

  const userId: string | null = getItem('userId');

  const {
    data: organizationsData,
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

  /* istanbul ignore next */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

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
  };

  /* istanbul ignore next */
  React.useEffect(() => {
    if (organizationsData) {
      const organizations = organizationsData.organizationsConnection.map(
        (organization: any) => {
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
  }, [organizationsData]);

  /* istanbul ignore next */
  React.useEffect(() => {
    if (mode == 0) {
      if (organizationsData) {
        const organizations = organizationsData.organizationsConnection.map(
          (organization: any) => {
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
    } else if (mode == 1) {
      console.log(joinedOrganizationsData, 'joined', userId);
      if (joinedOrganizationsData) {
        const membershipRequestStatus = 'accepted';
        const organizations =
          joinedOrganizationsData?.users[0].joinedOrganizations.map(
            (organization: any) => {
              return { ...organization, membershipRequestStatus };
            },
          );
        setOrganizations(organizations);
      }
    } else if (mode == 2) {
      const membershipRequestStatus = 'accepted';
      const organizations =
        createdOrganizationsData?.users[0].createdOrganizations.map(
          (organization: any) => {
            return { ...organization, membershipRequestStatus };
          },
        );
      setOrganizations(organizations);
    }
  }, [mode]);

  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <h3>{t('organizations')}</h3>
          <div
            className={`d-flex flex-row justify-content-between pt-3 ${styles.btnsContainer}`}
          >
            <InputGroup className={styles.maxWidth}>
              <div className={styles.input}>
                <Form.Control
                  type="name"
                  id="searchOrgname"
                  className="bg-white"
                  placeholder={t('searchByName')}
                  data-testid="searchInput"
                  autoComplete="off"
                  required
                  onKeyUp={handleSearchByEnter}
                />
                <Button
                  tabIndex={-1}
                  className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                  onClick={handleSearchByBtnClick}
                  data-testid="searchBtn"
                >
                  <Search />
                </Button>
              </div>
            </InputGroup>
            <Dropdown drop="down-centered">
              <Dropdown.Toggle
                className={``}
                variant="outline-success"
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
          <div className={`d-flex flex-wrap ${styles.gap} ${styles.paddingY}`}>
            {loadingOrganizations ? (
              <div className={`d-flex flex-row justify-content-center`}>
                <HourglassBottomIcon /> <span>Loading...</span>
              </div>
            ) : (
              <>
                {' '}
                {organizations && organizations?.length > 0 ? (
                  (rowsPerPage > 0
                    ? organizations.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                    : /* istanbul ignore next */
                      organizations
                  ).map((organization: any, index) => {
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
                    organizations ? organizations?.length : 0
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
    </>
  );
}
