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
import styles from '../../../style/app.module.css';
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
    if (data2?.organizations?.[0]?.admins) {
      const adminsList = data2.organizations[0].admins.map(
        (admin: InterfaceMember) => ({
          ...admin,
          userType: 'Admin',
        }),
      );
      setAdmins(adminsList);
    }
  }, [data2]);

  // Updated members effect
  useEffect(() => {
    if (data?.organizationsMemberConnection?.edges) {
      const membersList = data.organizationsMemberConnection.edges.map(
        (memberData: InterfaceMember) => ({
          ...memberData,
          userType: admins?.some((admin) => admin._id === memberData._id)
            ? 'Admin'
            : 'Member',
        }),
      );
      setAllMembers(membersList);
      setMembers(mode === 0 ? membersList : admins);
    }
  }, [data, admins, mode]);

  useEffect(() => {
    setMembers(mode === 0 ? allMembers : admins);
  }, [mode, allMembers, admins]);

  return (
    <>
      <div className={`d-flex flex-row`}>
        <div className={`${styles.mainContainerUserPeople}`}>
          <div className={`${styles.btnsContainer}`}>
            <InputGroup className={`${styles.input}`}>
              <Form.Control
                placeholder={t('searchUsers')}
                id="searchPeople"
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
            <div className={styles.btnsBlock}>
              <Dropdown drop="down-centered">
                <Dropdown.Toggle
                  className={`${styles.dropdown}`}
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
                      : members
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
                    count={members ? members.length : 0}
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
