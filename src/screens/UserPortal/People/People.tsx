import React, { useEffect, useState } from 'react';
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_ADMINS_LIST,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { FilterAltOutlined, SearchOutlined } from '@mui/icons-material';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useParams } from 'react-router-dom';

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

interface InterfaceMember {
  firstName: string;
  lastName: string;
  image: string;
  _id: string;
  email: string;
  userType: string;
}

/**
 * `People` component displays a list of people associated with an organization.
 * It allows users to filter between all members and admins, search for members by their first name,
 * and paginate through the list.
 */
export default function people(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'people',
  });

  const { t: tCommon } = useTranslation('common');

  const [page, setPage] = useState<number>(0);

  // State for managing the number of rows per page in pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [members, setMembers] = useState<InterfaceMember[]>([]);
  const [allMembers, setAllMembers] = useState<InterfaceMember[]>([]);
  const [admins, setAdmins] = useState<InterfaceMember[]>([]);
  const [mode, setMode] = useState<number>(0);

  // Extracting organization ID from URL parameters
  const { orgId: organizationId } = useParams();

  // Filter modes for dropdown selection
  const modes = ['All Members', 'Admins'];

  // Query to fetch list of members of the organization
  const { data, loading, refetch } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        firstName_contains: '',
      },
    },
  );
  // Query to fetch list of admins of the organization
  const { data: data2 } = useQuery(ORGANIZATION_ADMINS_LIST, {
    variables: { id: organizationId },
  });

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

  const handleSearch = (newFilter: string): void => {
    refetch({
      firstName_contains: newFilter,
    });
  };

  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
      handleSearch(value);
    }
  };

  const handleSearchByBtnClick = (): void => {
    const inputValue =
      (document.getElementById('searchPeople') as HTMLInputElement)?.value ||
      '';
    handleSearch(inputValue);
  };

  useEffect(() => {
    if (data2) {
      const admin = data2.organizations[0].admins[0];
      const updatedAdmin: InterfaceMember = {
        ...admin,
        userType: 'Admin',
      };
      setAdmins([updatedAdmin]);
    }
  }, [data2]);

  useEffect(() => {
    if (data) {
      const updatedAdmins = data.organizationsMemberConnection.edges.map(
        (memberData: InterfaceMember) => ({
          ...memberData, // Spread the existing properties
          userType: admins?.some((admin) => admin._id === memberData._id)
            ? 'Admin'
            : 'Member',
        }),
      );

      setAllMembers(updatedAdmins);
      setMembers(updatedAdmins);
    }
  }, [data, admins]);

  if (admins && admins.length > 0) {
    const adminIds = admins.map((adm) => adm._id);
    for (let i = 0; i < allMembers.length; i++) {
      if (adminIds.includes(allMembers[i]._id)) {
        allMembers[i].userType = 'Admin';
      } else {
        allMembers[i].userType = 'Member';
      }
    }
  }
  useEffect(() => {
    if (mode == 0) {
      if (data) {
        setMembers(allMembers);
      }
    } else if (mode == 1) {
      if (data2) {
        setMembers(admins);
      }
    }
  }, [mode]);

  return (
    <>
      <div className={`d-flex flex-row`}>
        <div className={`${styles.mainContainer}`}>
          <div
            className={`mt-4 d-flex flex-row justify-content-between flex-wrap ${styles.gap}`}
          >
            <InputGroup className={`${styles.maxWidth} ${styles.shadow}`}>
              <Form.Control
                placeholder={t('searchUsers')}
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
              >
                <SearchOutlined className={`${styles.colorWhite}`} />
              </InputGroup.Text>
            </InputGroup>
            <Dropdown drop="down-centered">
              <Dropdown.Toggle
                className={`${styles.greenBorder} ${styles.backgroundWhite} ${styles.colorGreen} ${styles.semiBold} ${styles.shadow} ${styles.borderRounded8}`}
                id="dropdown-basic"
                data-testid={`modeChangeBtn`}
              >
                <FilterAltOutlined />
                {tCommon('filter').toUpperCase()}
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
          <div className={`d-flex flex-column ${styles.content}`}>
            <div
              className={`d-flex border py-3 px-4 mt-4 bg-white ${styles.topRadius}`}
            >
              <span style={{ flex: '1' }} className="d-flex">
                <span style={{ flex: '1' }}>S.No</span>
                <span style={{ flex: '1' }}>Avatar</span>
              </span>
              <span style={{ flex: '2' }}>Name</span>
              <span style={{ flex: '2' }}>Email</span>
              <span style={{ flex: '2' }}>Role</span>
            </div>

            <div
              className={`d-flex flex-column border px-4 p-3 mt-0 ${styles.gap} ${styles.bottomRadius} ${styles.backgroundWhite}`}
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
                          page * rowsPerPage + rowsPerPage,
                        )
                      : /* istanbul ignore next */
                        members
                    ).map((member: InterfaceMember, index) => {
                      const name = `${member.firstName} ${member.lastName}`;

                      const cardProps: InterfaceOrganizationCardProps = {
                        name,
                        image: member.image,
                        id: member._id,
                        email: member.email,
                        role: member.userType,
                        sno: (index + 1).toString(),
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
        {/* <OrganizationSidebar /> */}
      </div>
    </>
  );
}
