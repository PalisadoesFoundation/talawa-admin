import React from 'react';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_ADMINS_LIST,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import getOrganizationId from 'utils/getOrganizationId';

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
}

export default function people(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [members, setMembers] = React.useState([]);
  const [filterName, setFilterName] = React.useState('');
  const [mode, setMode] = React.useState(0);

  const organizationId = getOrganizationId(window.location.href);

  const modes = ['All Members', 'Admins'];

  const { data, loading, refetch } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        firstName_contains: '',
      },
    }
  );

  const { data: data2 } = useQuery(ORGANIZATION_ADMINS_LIST, {
    variables: { id: organizationId },
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
      firstName_contains: newFilter,
    };

    refetch(filter);
  };

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setMembers(data.organizationsMemberConnection.edges);
    }
  }, [data]);

  /* istanbul ignore next */
  React.useEffect(() => {
    if (mode == 0) {
      if (data) {
        setMembers(data.organizationsMemberConnection.edges);
      }
    } else if (mode == 1) {
      if (data2) {
        setMembers(data2.organizations[0].admins);
      }
    }
  }, [mode]);

  const navbarProps = {
    currentPage: 'people',
  };

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
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
              {loading ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                <>
                  {members && members.length > 0 ? (
                    (rowsPerPage > 0
                      ? members.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : /* istanbul ignore next */
                        members
                    ).map((member: any, index) => {
                      const name = `${member.firstName} ${member.lastName}`;

                      const cardProps: InterfaceOrganizationCardProps = {
                        name,
                        image: member.image,
                        id: member._id,
                        email: member.email,
                      };
                      return <PeopleCard key={index} {...cardProps} />;
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
                      members ? members.length : 0
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
        <OrganizationSidebar />
      </div>
    </>
  );
}
