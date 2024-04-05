import React from 'react';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
<<<<<<< HEAD
=======
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_ADMINS_LIST,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
<<<<<<< HEAD
import { FilterAltOutlined, SearchOutlined } from '@mui/icons-material';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useParams } from 'react-router-dom';
=======
import { SearchOutlined } from '@mui/icons-material';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import getOrganizationId from 'utils/getOrganizationId';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
<<<<<<< HEAD
  role: string;
  sno: string;
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
}

export default function people(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userOrganizations',
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [members, setMembers] = React.useState([]);
<<<<<<< HEAD
  const [mode, setMode] = React.useState(0);

  const { orgId: organizationId } = useParams();
=======
  const [filterName, setFilterName] = React.useState('');
  const [mode, setMode] = React.useState(0);

  const organizationId = getOrganizationId(window.location.href);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const modes = ['All Members', 'Admins'];

  const { data, loading, refetch } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        firstName_contains: '',
      },
<<<<<<< HEAD
    },
=======
    }
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );

  const { data: data2 } = useQuery(ORGANIZATION_ADMINS_LIST, {
    variables: { id: organizationId },
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
  const handleSearch = (newFilter: string): void => {
    refetch({
      firstName_contains: newFilter,
    });
  };

  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };

  const handleSearchByBtnClick = (): void => {
    const inputValue =
      (document.getElementById('searchPeople') as HTMLInputElement)?.value ||
      '';
    handleSearch(inputValue);
  };

  React.useEffect(() => {
    if (data) {
      setMembers(data.organizationsMemberConnection.edges);
      console.log(data);
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
          <h1>People</h1>
          <div
            className={`mt-4 d-flex flex-row justify-content-between flex-wrap ${styles.gap}`}
          >
            <InputGroup className={`${styles.maxWidth} ${styles.shadow}`}>
              <Form.Control
                placeholder={t('search')}
                id="searchPeople"
                type="text"
                className={`${styles.borderBox} ${styles.backgroundWhite} ${styles.placeholderColor}`}
                onKeyUp={handleSearchByEnter}
                data-testid="searchInput"
              />
              <InputGroup.Text
                className={`${styles.colorPrimary} ${styles.borderRounded5}`}
                style={{ cursor: 'pointer' }}
                onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
=======
          <div
            className={`d-flex flex-row justify-content-between flex-wrap ${styles.gap}`}
          >
            <InputGroup className={styles.maxWidth}>
              <Form.Control
                placeholder={t('search')}
                type="text"
                className={`${styles.borderNone} ${styles.backgroundWhite}`}
                value={filterName}
                onChange={handleSearch}
                data-testid="searchInput"
              />
              <InputGroup.Text
                className={`${styles.colorPrimary} ${styles.borderNone}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              >
                <SearchOutlined className={`${styles.colorWhite}`} />
              </InputGroup.Text>
            </InputGroup>
            <Dropdown drop="down-centered">
              <Dropdown.Toggle
<<<<<<< HEAD
                className={`${styles.greenBorder} ${styles.backgroundWhite} ${styles.colorGreen} ${styles.semiBold} ${styles.shadow} ${styles.borderRounded8}`}
                id="dropdown-basic"
                data-testid={`modeChangeBtn`}
              >
                <FilterAltOutlined />
                {t('filter').toUpperCase()}
=======
                className={`${styles.colorPrimary} ${styles.borderNone}`}
                variant="success"
                id="dropdown-basic"
                data-testid={`modeChangeBtn`}
              >
                {modes[mode]}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
          <div className={`d-flex flex-column ${styles.content}`}>
            <div
              className={`d-flex border py-3 px-4 mt-4 bg-white ${styles.topRadius}`}
            >
              <span style={{ flex: '1' }} className="d-flex">
                <span style={{ flex: '1' }}>S.No</span>
                <span style={{ flex: '1' }}>Avatar</span>
              </span>
              {/* <span style={{ flex: '1' }}>Avatar</span> */}
              <span style={{ flex: '2' }}>Name</span>
              <span style={{ flex: '2' }}>Email</span>
              <span style={{ flex: '2' }}>Role</span>
            </div>

            <div
              className={`d-flex flex-column border px-4 p-3 mt-0 ${styles.gap} ${styles.bottomRadius} ${styles.backgroundWhite}`}
=======
          <div
            className={`d-flex flex-column justify-content-between ${styles.content}`}
          >
            <div
              className={`d-flex flex-column ${styles.gap} ${styles.paddingY}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                          page * rowsPerPage + rowsPerPage,
=======
                          page * rowsPerPage + rowsPerPage
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                        role: member.userType,
                        sno: (index + 1).toString(),
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
        {/* <OrganizationSidebar /> */}
=======
        <OrganizationSidebar />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </>
  );
}
