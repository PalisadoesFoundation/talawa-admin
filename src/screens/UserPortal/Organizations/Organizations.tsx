import React from 'react';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import OrganizationCard from 'components/UserPortal/OrganizationCard/OrganizationCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import styles from './Organizations.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
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

  const userId: string | null = localStorage.getItem('userId');

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
    newPage: number
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newFilter = event.target.value;
    setFilterName(newFilter);

    const filter = {
      filter: newFilter,
    };

    refetch(filter);
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
        setOrganizations(data2.users[0].joinedOrganizations);
      }
    } else if (mode == 2) {
      if (data3) {
        setOrganizations(data3.users[0].createdOrganizations);
      }
    }
  }, [mode]);

  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <div
            className={`d-flex flex-row justify-content-between flex-wrap ${styles.gap}`}
          >
            <InputGroup className={styles.maxWidth}>
              <Form.Control
                placeholder={t('search')}
                type="text"
                className={styles.borderNone}
                value={filterName}
                onChange={handleSearch}
                data-testid="searchInput"
              />
              <InputGroup.Text
                className={`${styles.colorPrimary} ${styles.borderNone}`}
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
                          page * rowsPerPage + rowsPerPage
                        )
                      : /* istanbul ignore next */
                        organizations
                    ).map((organization: any, index) => {
                      const cardProps: InterfaceOrganizationCardProps = {
                        name: organization.name,
                        image: organization.image,
                        id: organization._id,
                        description: organization.description,
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
