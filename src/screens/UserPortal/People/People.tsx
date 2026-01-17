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
import Button from 'react-bootstrap/Button';
import { Dropdown, Form } from 'react-bootstrap';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FilterAltOutlined } from '@mui/icons-material';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useParams } from 'react-router';

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

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  const [pageCursors, setPageCursors] = useState<string[]>(['']); // Keep track of cursors for each page
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { orgId: organizationId } = useParams();

  const modes = ['All Members', 'Admins'];

  // Query the current page of members
  const { data, loading, fetchMore, refetch } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        firstName_contains: searchTerm,
        first: rowsPerPage,
        after: pageCursors[currentPage] || undefined,
      },
      errorPolicy: 'ignore',
      notifyOnNetworkStatusChange: true,
    },
  );

  // Extract members for the current page and filter by role if needed
  const members: IMemberWithUserType[] = React.useMemo(() => {
    if (!data?.organization?.members?.edges) return [];
    let edges: IMemberEdge[] = data.organization.members.edges;
    let adminsList = edges
      .filter((m) => m.node.role === 'administrator')
      .map((admin) => ({ ...admin, userType: 'Admin' as const }));
    if (mode === 1) return adminsList;
    // For all members, assign userType based on role
    return edges.map((member) => ({
      ...member,
      userType: member.node.role === 'administrator' ? 'Admin' : 'Member',
    }));
  }, [data, mode]);

  // Pagination info from backend
  const pageInfo = data?.organization?.members?.pageInfo;

  // Handle page change: fetch next/prev page
  const handleChangePage = async (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    // If moving forward, fetch next page
    if (newPage > currentPage && pageInfo?.hasNextPage) {
      const afterCursor = pageInfo.endCursor;
      // fetchMore returns next page data
      await fetchMore({
        variables: {
          orgId: organizationId,
          firstName_contains: searchTerm,
          first: rowsPerPage,
          after: afterCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult,
      });
      setPageCursors((prev) => {
        const next = [...prev];
        next[newPage] = afterCursor;
        return next;
      });
      setCurrentPage(newPage);
    }
    // If moving backward, simply update page (cursors already tracked)
    else if (newPage < currentPage && pageCursors[newPage] !== undefined) {
      setCurrentPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPageCursors(['']); // Reset pagination
    setCurrentPage(0);
    refetch({
      orgId: organizationId,
      firstName_contains: searchTerm,
      first: newRowsPerPage,
      after: undefined,
    });
  };

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
    setPageCursors(['']);
    setCurrentPage(0);
    refetch({
      orgId: organizationId,
      firstName_contains: newFilter,
      first: rowsPerPage,
      after: undefined,
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
    // When mode changes, refetch from first page
    setPageCursors(['']);
    setCurrentPage(0);
    refetch({
      orgId: organizationId,
      firstName_contains: searchTerm,
      first: rowsPerPage,
      after: undefined,
    });
  }, [mode, organizationId, rowsPerPage]); // intentionally not including searchTerm (it's handled above)

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
                  members.map((member: IMemberWithUserType, index) => {
                    const name = `${member.node.name}`;
                    const cardProps: IOrganizationCardProps = {
                      name,
                      image: member.node.avatarURL ?? '',
                      id: member.node.id ?? '',
                      email:
                        member.node.emailAddress ?? '***********************',
                      role: member.userType ?? '',
                      sno: (index + 1 + currentPage * rowsPerPage).toString(),
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
            count={
              pageInfo?.hasNextPage
                ? (currentPage + 1) * rowsPerPage + 1
                : currentPage * rowsPerPage + members.length
            }
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
}
