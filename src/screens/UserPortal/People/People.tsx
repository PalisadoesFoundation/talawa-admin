/**
 * The `people` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users. The component uses CursorPaginationManager to handle
 * pagination automatically with a "Load More" pattern.
 *
 * @returns The rendered People component.
 *
 * @remarks
 * This component:
 * - Uses CursorPaginationManager for cursor-based pagination with "Load More" functionality.
 * - Supports filtering between "All Members" and "Admins" via a dropdown menu.
 * - Provides a search bar to find members by first name.
 *
 * **Dependencies**
 * - Core libraries:
 *   - `react`
 *   - `react-bootstrap`
 * - Custom components:
 *   - `components/UserPortal/PeopleCard/PeopleCard`
 *   - `components/CursorPaginationManager/CursorPaginationManager`
 * - GraphQL queries:
 *   - `GraphQl/Queries/Queries`
 * - Styles:
 *   - `./People.module.css`
 *
 * **Internal Event Handlers**
 * - `handleSearch` – Updates search term which triggers refetch via CursorPaginationManager.
 *
 * @param mode - The current filter mode (0 for "All Members", 1 for "Admins").
 * @param organizationId - The ID of the organization extracted from URL parameters.
 */
import React, { useEffect, useState, useMemo } from 'react';
import PeopleCard from 'components/UserPortal/PeopleCard/PeopleCard';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import LoadingState from 'shared-components/LoadingState/LoadingState';

interface IMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  createdAt: string;
  emailAddress?: string;
}

const ITEMS_PER_PAGE = 10;

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const { orgId: organizationId } = useParams();

  const modes = ['All Members', 'Admins'];

  // Trigger refetch when mode or search term changes
  useEffect(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, [mode, searchTerm]);

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
  };

  // Build query variables based on current mode and search term
  const queryVariables = useMemo(() => {
    const vars: Record<string, unknown> = {
      orgId: organizationId,
      firstName_contains: searchTerm,
    };
    // Add admin filter when in admin mode
    if (mode === 1) {
      vars.where = { role: { equal: 'administrator' } };
    }
    return vars;
  }, [organizationId, searchTerm, mode]);

  return (
    <>
      <div className={`${styles.mainContainer_people}`}>
        {/* Header with Search and Filter */}
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

        <div className={styles.people_content}>
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
            <CursorPaginationManager<
              unknown,
              IMemberNode,
              Record<string, unknown>
            >
              query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
              queryVariables={queryVariables}
              dataPath="organization.members"
              itemsPerPage={ITEMS_PER_PAGE}
              refetchTrigger={refetchTrigger}
              renderItem={(member: IMemberNode, index: number) => {
                const userType =
                  member.role === 'administrator' ? 'Admin' : 'Member';
                return (
                  <PeopleCard
                    key={member.id}
                    name={member.name}
                    image={member.avatarURL ?? ''}
                    id={member.id}
                    email={member.emailAddress ?? t('emailNotAvailable')}
                    role={userType}
                    sno={(index + 1).toString()}
                  />
                );
              }}
              keyExtractor={(member) => member.id}
              loadingComponent={
                <LoadingState
                  isLoading={true}
                  variant="skeleton"
                  skeletonRows={ITEMS_PER_PAGE}
                  skeletonCols={4}
                >
                  <div />
                </LoadingState>
              }
              emptyStateComponent={<span>{t('nothingToShow')}</span>}
            />
          </div>
        </div>
      </div>
    </>
  );
}
