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
import React, { useEffect, useState, useMemo } from 'react';
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import CursorPaginationManager from 'components/CursorPaginationManager/CursorPaginationManager';
import type { IMemberNode } from 'types/UserPortal/People/interface';
import type { InterfacePeopleCardProps } from 'types/UserPortal/PeopleCard/interface';

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const { orgId: organizationId } = useParams();

  const modes = [t('allMembers'), tCommon('admin')];

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
    // No refetch needed - filtering is client-side
  };

  useEffect(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, [mode, organizationId]);

  // Client-side filter function for name/email search
  const clientFilterFunction = useMemo(() => {
    if (!searchTerm) return undefined;

    return (member: IMemberNode): boolean => {
      const lowerSearch = searchTerm.toLowerCase();
      return !!(
        member.name?.toLowerCase().includes(lowerSearch) ||
        member.emailAddress?.toLowerCase().includes(lowerSearch)
      );
    };
  }, [searchTerm]);

  // Only role filter for server-side (no name filtering in schema)
  const whereFilter = useMemo(() => {
    return mode === 1 ? { role: { equal: 'administrator' } } : undefined;
  }, [mode]);

  if (!organizationId) {
    return (
      <div
        className={`${styles.mainContainer_people}`}
        data-testid="people-main-container"
      >
        <span>{t('nothingToShow')}</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${styles.mainContainer_people}`}
        data-testid="people-main-container"
      >
        {/* Refactored Header Structure */}
        <div className={styles.calendar__header}>
          <SearchFilterBar
            searchPlaceholder={t('searchUsers')}
            searchValue={searchTerm}
            onSearchChange={handleSearch}
            searchInputTestId="searchInput"
            searchButtonTestId="searchBtn"
            hasDropdowns={true}
            dropdowns={[
              {
                id: 'people-filter',
                label: tCommon('filter'),
                type: 'filter',
                options: modes.map((value, index) => ({
                  label: value,
                  value: index,
                })),
                selectedOption: mode,
                onOptionChange: (value) => setMode(value as number),
                dataTestIdPrefix: 'modeChangeBtn',
              },
            ]}
          />
        </div>

        <section
          className={styles.people_content}
          aria-label={t('peopleTable')}
        >
          <div className={styles.people_card_header}>
            {/* Nested span groups sNo and avatar in a flex container for horizontal alignment */}
            <span className={`d-flex ${styles.people_card_header_col_1}`}>
              <span className={styles.people_card_header_col_1}>
                {t('sNo')}
              </span>
              <span className={styles.people_card_header_col_1}>
                {t('avatar')}
              </span>
            </span>
            <span className={styles.people_card_header_col_2}>{t('name')}</span>
            <span className={styles.people_card_header_col_2}>
              {t('email')}
            </span>
            <span className={styles.people_card_header_col_2}>{t('role')}</span>
          </div>

          <div className={styles.people_card_main_container}>
            <CursorPaginationManager
              query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
              queryVariables={{
                orgId: organizationId,
                where: whereFilter,
              }}
              dataPath="organization.members"
              itemsPerPage={10}
              clientSideFilter={clientFilterFunction}
              renderItem={(node: IMemberNode, index: number) => {
                const isAdmin = node.role === 'administrator';
                const userType = isAdmin ? tCommon('admin') : tCommon('member');
                const cardProps: InterfacePeopleCardProps = {
                  name: node.name,
                  image: node.avatarURL ?? '',
                  id: node.id,
                  email: node.emailAddress ?? t('emailNotAvailable'),
                  role: userType,
                  sno: (index + 1).toString(),
                };
                return <PeopleCard key={node.id} {...cardProps} />;
              }}
              keyExtractor={(node: IMemberNode) => node.id}
              refetchTrigger={refetchTrigger}
              emptyStateComponent={<span>{t('nothingToShow')}</span>}
            />
          </div>
        </section>
      </div>
    </>
  );
}
