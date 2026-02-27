/**
 * The `people` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users using cursor-based pagination via CursorPaginationManager.
 *
 * @returns The rendered People component.
 *
 * @remarks
 * This component:
 * - Uses CursorPaginationManager for cursor-based pagination with "Load More".
 * - Supports filtering between "All Members" and "Admins" via a dropdown menu.
 * - Provides a search bar to filter members by name/email (client-side).
 *
 * @param mode - The current filter mode (0 for "All Members", 1 for "Admins").
 * @param organizationId - The ID of the organization extracted from URL parameters.
 */
import React, { useMemo, useState } from 'react';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import Avatar from 'shared-components/Avatar/Avatar';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import type { InterfaceMemberNode } from 'types/PeopleTab/interface';

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  const { orgId: organizationId } = useParams();

  const modes = ['All Members', 'Admins'];

  const whereFilter = useMemo(() => {
    return mode === 1
      ? { role: { equal: 'administrator' as const } }
      : undefined;
  }, [mode]);

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
  };

  return (
    <>
      <div className={`${styles.mainContainer_people}`}>
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

        <div
          className={styles.people_content}
          role="table"
          aria-label={t('membersList')}
        >
          <div role="rowgroup">
            <div className={styles.people_card_header} role="row">
              <span
                className={`d-flex ${styles.people_card_header_col_1}`}
                role="columnheader"
              >
                <span>#</span>
              </span>
              <span
                className={styles.people_card_header_col_2}
                role="columnheader"
              >
                {t('name')}
              </span>
              <span
                className={styles.people_card_header_col_2}
                role="columnheader"
              >
                {t('email')}
              </span>
              <span
                className={styles.people_card_header_col_1}
                role="columnheader"
              >
                {t('role')}
              </span>
            </div>
          </div>

          <div className={styles.people_card_main_container} role="rowgroup">
            <CursorPaginationManager<
              unknown,
              InterfaceMemberNode,
              Record<string, unknown>
            >
              query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
              queryVariables={{
                orgId: organizationId,
                where: whereFilter,
              }}
              dataPath="organization.members"
              itemsPerPage={10}
              keyExtractor={(node: InterfaceMemberNode) => node.id}
              renderItem={(node: InterfaceMemberNode, index: number) => {
                if (searchTerm) {
                  const lower = searchTerm.toLowerCase();
                  const nameMatch = node.name?.toLowerCase().includes(lower);
                  const emailMatch = node.emailAddress
                    ?.toLowerCase()
                    .includes(lower);
                  if (!nameMatch && !emailMatch) return null;
                }

                const userType =
                  node.role === 'administrator' ? 'Admin' : 'Member';

                return (
                  <div
                    className={styles.peopleRow}
                    data-testid={`people-row-${node.id}`}
                    role="row"
                  >
                    <span
                      className={`d-flex ${styles.people_card_header_col_1}`}
                      role="cell"
                    >
                      <span>{index + 1}</span>
                      <span className={styles.avatarCell}>
                        {node.avatarURL ? (
                          <img
                            src={node.avatarURL}
                            alt={node.name}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <Avatar name={node.name} alt={node.name} size={40} />
                        )}
                      </span>
                    </span>
                    <span
                      className={styles.people_card_header_col_2}
                      role="cell"
                    >
                      {node.name}
                    </span>
                    <span
                      className={styles.people_card_header_col_2}
                      role="cell"
                    >
                      {node.emailAddress ?? t('emailNotAvailable')}
                    </span>
                    <span
                      className={styles.people_card_header_col_1}
                      role="cell"
                    >
                      {userType}
                    </span>
                  </div>
                );
              }}
              emptyStateComponent={<span>{t('nothingToShow')}</span>}
            />
          </div>
        </div>
      </div>
    </>
  );
}
