/**
 * The `people` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users. The component uses GraphQL queries to fetch data and
 * displays it in a structured format with user details such as name, email, role, etc.
 *
 * @component
 * @returns {JSX.Element} The rendered People component.
 *
 * @remarks
 * - This component uses Apollo Client's `useQuery` hook to fetch data from GraphQL endpoints.
 * - It supports filtering between "All Members" and "Admins" using a dropdown menu.
 * - Pagination is implemented to manage the display of users in chunks.
 * - Users can search for members by their first name using the search bar.
 *
 * @requires `react`, `react-bootstrap`, `@apollo/client`, `@mui/icons-material`
 * @requires `components/UserPortal/PeopleCard/PeopleCard`
 * @requires `components/Pagination/PaginationList/PaginationList`
 * @requires `GraphQl/Queries/Queries`
 * @requires `style/app-fixed.module.css`
 * @requires `types/User/interface`
 *
 * @param {number} page - The current page number for pagination.
 * @param {number} rowsPerPage - The number of rows displayed per page.
 * @param {Partial<InterfaceUser>[]} members - The list of members to display.
 * @param {Partial<InterfaceUser>[]} allMembers - The complete list of members fetched.
 * @param {Partial<InterfaceUser>[]} admins - The list of admins fetched.
 * @param {number} mode - The current filter mode (0 for "All Members", 1 for "Admins").
 * @param {string} organizationId - The ID of the organization extracted from URL parameters.
 *
 * @function handleChangePage - Handles the change of the current page in pagination.
 * @function handleChangeRowsPerPage - Handles the change in the number of rows per page.
 * @function handleSearch - Refetches the members list based on the search input.
 * @function handleSearchByEnter - Triggers search when the Enter key is pressed.
 * @function handleSearchByBtnClick - Triggers search when the search button is clicked.
 */
import React, { useEffect, useState } from 'react';
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import { Dropdown, Form, Button } from 'react-bootstrap';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_ADMINS_LIST,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FilterAltOutlined } from '@mui/icons-material';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useParams } from 'react-router';
import { InterfaceUser } from 'types/User/interface';
interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

export default function people(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });

  const { t: tCommon } = useTranslation('common');

  const [page, setPage] = useState<number>(0);

  // State for managing the number of rows per page in pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [members, setMembers] = useState<Partial<InterfaceUser>[]>([]);
  const [allMembers, setAllMembers] = useState<Partial<InterfaceUser>[]>([]);
  const [admins, setAdmins] = useState<Partial<InterfaceUser>[]>([]);
  const [mode, setMode] = useState<number>(0);

  // Extracting organization ID from URL parameters
  const { orgId: organizationId } = useParams();

  // Filter modes for dropdown selection
  const modes = ['All Members', 'Admins'];

  // Query to fetch list of members of the organization
  const { data, loading, refetch } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    { variables: { orgId: organizationId, firstName_contains: '' } },
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
    refetch({ firstName_contains: newFilter });
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
        (admin: Partial<InterfaceUser>) => ({ ...admin, userType: 'Admin' }),
      );
      setAdmins(adminsList);
    }
  }, [data2]);

  // Updated members effect
  useEffect(() => {
    if (data?.organizationsMemberConnection?.edges) {
      const membersList = data.organizationsMemberConnection.edges.map(
        (memberData: Partial<InterfaceUser>) => ({
          ...memberData,
          userType: admins?.some((admin) => admin.id === memberData.id)
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
      <div className={`${styles.mainContainer_people}`}>
        <div className={styles.people__header}>
          <div className={styles.input}>
            <Form.Control
              placeholder={t('searchUsers')}
              id="searchPeople"
              type="text"
              className={styles.inputField}
              onKeyUp={handleSearchByEnter}
              data-testid="searchInput"
            />

            <Button
              className={styles.searchButton}
              data-testid="searchBtn"
              style={{ cursor: 'pointer' }}
              onClick={handleSearchByBtnClick}
            >
              <SearchOutlinedIcon />
            </Button>
          </div>

          <Dropdown drop="down-centered">
            <Dropdown.Toggle
              className={styles.dropdown}
              id="dropdown-basic"
              data-testid={`modeChangeBtn`}
            >
              <FilterAltOutlined
                sx={{
                  fontSize: '25px',
                  marginBottom: '2px',
                  marginRight: '2px',
                }}
              />
              {tCommon('filter')}
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
        <div className={styles.people_content}>
          <div className={styles.people_card_header}>
            <span style={{ flex: '1' }} className={styles.display_flex}>
              <span style={{ flex: '1' }}>S.No</span>
              <span style={{ flex: '1' }}>Avatar</span>
            </span>
            <span style={{ flex: '2' }}>Name</span>
            <span style={{ flex: '2' }}>Email</span>
            <span style={{ flex: '2' }}>Role</span>
          </div>

          <div className={styles.people_card_main_container}>
            {loading ? (
              <div className={styles.custom_row_center}>
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
                  ).map((member: Partial<InterfaceUser>, index) => {
                    const name = `${member.firstName} ${member.lastName}`;

                    const cardProps: InterfaceOrganizationCardProps = {
                      name,
                      image: member.image ?? '',
                      id: member.id ?? '',
                      email: member.email ?? '',
                      role: member.userType ?? '',
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
          <PaginationList
            count={members ? members.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
}
