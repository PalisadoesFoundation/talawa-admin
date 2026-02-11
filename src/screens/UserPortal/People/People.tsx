/**
 * The `People` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users. The component uses CursorPaginationManager to handle
 * pagination automatically with a "Load More" pattern.
 *
 * @returns The rendered People component.
 *
 * @remarks
 * This component:
 * - Uses CursorPaginationManager for cursor-based pagination with "Load More" functionality.
 * - Uses DataTable for consistent table rendering with loading/empty states.
 * - Supports filtering between "All Members" and "Admins" via a dropdown menu.
 * - Provides a search bar to find members by first name.
 * - Uses internal `mode` state (0 for "All Members", 1 for "Admins") to filter results.
 * - Extracts `organizationId` from URL parameters via `useParams`.
 *
 * **Dependencies**
 * - Custom components:
 *   - `shared-components/DataTable/DataTable`
 *   - `components/CursorPaginationManager/CursorPaginationManager`
 * - GraphQL queries:
 *   - `GraphQl/Queries/Queries`
 * - Styles:
 *   - `./People.module.css`
 *
 * **Internal Event Handlers**
 * - `handleSearch` – Updates search term which triggers refetch via CursorPaginationManager.
 */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import Avatar from 'shared-components/Avatar/Avatar';

interface IMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  createdAt?: string | null;
  emailAddress?: string;
}

interface IPeopleTableRow {
  id: string;
  sno: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

const ITEMS_PER_PAGE = 10;

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  // Bridge state: data from CursorPaginationManager → DataTable
  const [members, setMembers] = useState<IMemberNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { orgId: organizationId } = useParams();

  const modes = [t('allMembers'), t('admins')];

  // Reset rows on filter change; CursorPaginationManager refetches via variables
  useEffect(() => {
    setMembers([]);
    setIsLoading(true);
  }, [mode]);

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
  };

  // Callback to receive data from CursorPaginationManager
  const handleDataChange = useCallback((nodes: IMemberNode[]) => {
    setMembers(nodes);
    setIsLoading(false);
  }, []);

  // Build query variables based on current mode
  const queryVariables = useMemo(() => {
    const vars: Record<string, unknown> = {
      orgId: organizationId,
    };
    // Add admin filter when in admin mode
    if (mode === 1) {
      vars.where = {
        role: {
          equal: 'administrator',
        },
      };
    }
    return vars;
  }, [organizationId, mode]);

  // Transform members data for DataTable (with client-side name filtering)
  const tableData: IPeopleTableRow[] = useMemo(() => {
    const filtered = searchTerm
      ? members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : members;
    return filtered.map((member, index) => ({
      id: member.id,
      name: member.name,
      email: member.emailAddress ?? t('emailNotAvailable'),
      image: member.avatarURL ?? '',
      role: member.role === 'administrator' ? 'Admin' : 'Member',
      sno: index + 1,
    }));
  }, [members, t, searchTerm]);

  // Column definitions for DataTable
  const columns: IColumnDef<IPeopleTableRow>[] = [
    {
      id: 'sno',
      header: t('sNo'),
      accessor: 'sno',
      meta: { width: 'var(--space-11)' },
    },
    {
      id: 'avatar',
      header: t('avatar'),
      accessor: 'image',
      meta: { width: 'var(--space-12)' },
      render: (value, row) => (
        <div className={styles.avatarCell}>
          {value ? (
            <img
              src={value as string}
              alt={row.name}
              className={styles.avatarImage}
            />
          ) : (
            <Avatar name={row.name} alt={row.name} size={40} />
          )}
        </div>
      ),
    },
    {
      id: 'name',
      header: t('name'),
      accessor: 'name',
    },
    {
      id: 'email',
      header: t('email'),
      accessor: 'email',
    },
    {
      id: 'role',
      header: t('role'),
      accessor: 'role',
    },
  ];

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
                onOptionChange: (value) => setMode(Number(value)),
                dataTestIdPrefix: 'modeChangeBtn',
              },
            ]}
          />
        </div>

        <div className={styles.peopleTable}>
          <DataTable<IPeopleTableRow>
            data={tableData}
            columns={columns}
            loading={isLoading}
            emptyMessage={t('nothingToShow')}
          />
        </div>

        <CursorPaginationManager<unknown, IMemberNode, Record<string, unknown>>
          query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
          queryVariables={queryVariables}
          dataPath="organization.members"
          itemsPerPage={ITEMS_PER_PAGE}
          onDataChange={handleDataChange}
          renderItem={() => null}
          loadingComponent={<></>}
          emptyStateComponent={<></>}
        />
      </div>
    </>
  );
}
