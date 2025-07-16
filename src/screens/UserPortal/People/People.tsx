/* global HTMLButtonElement, HTMLTextAreaElement */
/**
 * The `people` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users. The component uses GraphQL queries to fetch data and
 * displays it in a structured format with user details such as name, email, role, etc.
 *
 * @returns The rendered People component.
 *
 * @remarks
 * This component:
 * - Uses Apollo Client's `useQuery` hook to fetch data from GraphQL endpoints.
 * - Supports filtering between "All Members" and "Admins" via a dropdown menu.
 * - Implements pagination to display users in manageable chunks.
 * - Provides a search bar to find members by first name.
 *
 * **Dependencies**
 * - Core libraries:
 *   - `react`
 *   - `react-bootstrap`
 *   - `@apollo/client`
 *   - `@mui/icons-material`
 * - Custom components:
 *   - `components/UserPortal/PeopleCard/PeopleCard`
 *   - `components/Pagination/PaginationList/PaginationList`
 * - GraphQL queries:
 *   - `GraphQl/Queries/Queries`
 * - Styles:
 *   - `style/app-fixed.module.css`
 * - Types:
 *   - `types/User/interface`
 *
 * **Internal Event Handlers**
 * - `handleChangePage` – Handles pagination page changes.
 * - `handleChangeRowsPerPage` – Handles changes to rows per page.
 * - `handleSearch` – Refetches the member list based on search input.
 * - `handleSearchByEnter` – Triggers a search when the Enter key is pressed.
 * - `handleSearchByBtnClick` – Triggers a search when the search button is clicked.
 *
 * @param page - The current page number for pagination.
 * @param rowsPerPage - The number of rows displayed per page.
 * @param members - The list of members to display.
 * @param allMembers - The complete list of members fetched.
 * @param admins - The list of admins fetched.
 * @param mode - The current filter mode (0 for "All Members", 1 for "Admins").
 * @param organizationId - The ID of the organization extracted from URL parameters.
 */
import React, { useEffect, useState } from 'react';
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import { Dropdown, Form, Button } from 'react-bootstrap';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FilterAltOutlined } from '@mui/icons-material';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useParams } from 'react-router';

// GraphQL response interfaces
interface IMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  createdAt: string;
  emailAddress?: string;
}

interface IMemberEdge {
  cursor: string;
  node: IMemberNode;
}

interface IMemberWithUserType extends IMemberEdge {
  userType: string;
}

interface IOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

export default function people(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });

  const { t: tCommon } = useTranslation('common');

  const [page, setPage] = useState<number>(0);

  // State for managing the number of rows per page in pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [members, setMembers] = useState<IMemberWithUserType[]>([]);
  const [allMembers, setAllMembers] = useState<IMemberWithUserType[]>([]);
  const [admins, setAdmins] = useState<IMemberWithUserType[]>([]);
  const [mode, setMode] = useState<number>(0);

  // Extracting organization ID from URL parameters
  const { orgId: organizationId } = useParams();

  // Filter modes for dropdown selection
  const modes = ['All Members', 'Admins'];

  // Query to fetch list of members of the organization
  const { data, loading, fetchMore } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: { orgId: organizationId, firstName_contains: '', first: 32 },
      errorPolicy: 'ignore',
    },
  );

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
    // Client-side filtering logic
    const sourceList = mode === 0 ? allMembers : admins;
    if (!newFilter.trim()) {
      setMembers(sourceList);
      return;
    }
    const filtered = sourceList.filter((member) =>
      member.node.name.toLowerCase().includes(newFilter.trim().toLowerCase()),
    );
    setMembers(filtered);
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
    if (!data?.organization?.members) return;

    const fetchAll = async () => {
      let allEdges = [...data.organization.members.edges];
      let pageInfo = data.organization.members.pageInfo;

      while (pageInfo.hasNextPage) {
        const more = await fetchMore({
          variables: {
            orgId: organizationId,
            first: 32,
            after: pageInfo.endCursor,
          },
        });

        const newEdges = more.data.organization.members.edges;
        pageInfo = more.data.organization.members.pageInfo;
        allEdges = [...allEdges, ...newEdges];
      }

      // Set Admins
      const adminsList = allEdges
        .filter((member: IMemberEdge) => member.node.role === 'administrator')
        .map((admin: IMemberEdge) => ({
          ...admin,
          userType: 'Admin' as const,
        }));

      setAdmins(adminsList);

      // Set All Members with userType
      const allMembersList = allEdges.map((member: IMemberEdge) => ({
        ...member,
        userType: adminsList.some((admin) => admin.node.id === member.node.id)
          ? ('Admin' as const)
          : ('Member' as const),
      }));

      setAllMembers(allMembersList);
      setMembers(mode === 0 ? allMembersList : adminsList);
    };

    fetchAll();
  }, [data, fetchMore, mode, organizationId]);

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
                  ).map((member: IMemberWithUserType, index) => {
                    const name = `${member.node.name}`;
                    const cardProps: IOrganizationCardProps = {
                      name,
                      image: member.node.avatarURL ?? '',
                      id: member.node.id ?? '',
                      email: member.node.emailAddress ?? 'Not available',
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
