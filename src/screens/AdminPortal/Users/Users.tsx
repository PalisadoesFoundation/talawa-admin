import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  ORGANIZATION_LIST,
  USER_LIST_FOR_ADMIN,
} from 'GraphQl/Queries/Queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import type {
  InterfaceQueryUserListItem,
  InterfaceUserListQueryResponse,
} from 'utils/interfaces';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import styles from './Users.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { PersonOff, WarningAmberRounded } from '@mui/icons-material';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { DataTable } from 'shared-components/DataTable/DataTable';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import TableLoader from 'components/TableLoader/TableLoader';

type SortingOption = 'newest' | 'oldest';
type FilteringOption = 'admin' | 'user' | 'cancel';

// User role constants
const USER_ROLES = {
  REGULAR: 'regular',
  ADMINISTRATOR: 'administrator',
} as const;

// Validation helpers
/**
 * Type guard that validates if a value is a valid SortingOption.
 *
 * @param option - The value to validate against the SortingOption union type.
 * @returns True if option is a valid SortingOption ('newest' or 'oldest').
 */
export const isValidSortingOption = (
  option: unknown,
): option is SortingOption => {
  return option === 'newest' || option === 'oldest';
};

/**
 * Type guard that validates if a value is a valid FilteringOption.
 *
 * @param option - The value to validate against the FilteringOption union type.
 * @returns True if option is a valid FilteringOption ('admin', 'user', or 'cancel').
 */
export const isValidFilteringOption = (
  option: unknown,
): option is FilteringOption => {
  return option === 'admin' || option === 'user' || option === 'cancel';
};

/**
 * The Users component displays a list of users with search, filter, sort, and infinite scroll capabilities.
 *
 * Migration (Phase 5 - Issue #5819): Migrated to use DataTable with useTableData hook for GraphQL integration,
 * simplified state management using useTableData for data fetching, preserved custom row rendering via UsersTableItem
 * for complex organization management, and maintained backward compatibility with existing search, filter, and sort functionality.
 *
 * @remarks
 * This component uses the DataTable component for rendering user lists with pagination support.
 * Search, filtering by role, and sorting by creation date are fully supported.
 *
 * @returns The rendered Users component
 */
const Users = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const { getItem } = useLocalStorage();
  const storedId = getItem('id');
  const loggedInUserId = typeof storedId === 'string' ? storedId : '';

  const perPageResult = 12;
  const tableLoaderRowLength = 4;

  // State for search, filter, sort
  const [searchByName, setSearchByName] = useState('');
  const [sortingOption, setSortingOption] = useState<SortingOption>('newest');
  const [filteringOption, setFilteringOption] =
    useState<FilteringOption>('cancel');

  // Use GraphQL query with useTableData hook
  const queryResult = useQuery(USER_LIST_FOR_ADMIN, {
    variables: {
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: undefined,
    },
    notifyOnNetworkStatusChange: true,
  });

  const { rows, loading, pageInfo, error, fetchMore, refetch } = useTableData<
    InterfaceQueryUserListItem,
    InterfaceQueryUserListItem
  >(queryResult, {
    path: (data: unknown) => {
      if (!data || typeof data !== 'object') {
        return undefined;
      }

      const candidate = data as Record<string, unknown>;
      const allUsers = candidate.allUsers;
      if (!allUsers || typeof allUsers !== 'object') {
        return undefined;
      }

      return allUsers as InterfaceUserListQueryResponse['allUsers'];
    },
  });

  // Show warning if there are no organizations
  const { data: dataOrgs } = useQuery(ORGANIZATION_LIST);
  useEffect(() => {
    if (dataOrgs?.organizations?.length === 0) {
      NotificationToast.warning(t('noOrgError') as string);
    }
  }, [dataOrgs, t]);

  // Apply sorting and filtering to rows
  const displayedUsers = React.useMemo(() => {
    let filtered = [...rows];

    // Apply filter
    if (filteringOption === 'user') {
      filtered = filtered.filter((u) => u.role === USER_ROLES.REGULAR);
    } else if (filteringOption === 'admin') {
      filtered = filtered.filter((u) => u.role === USER_ROLES.ADMINISTRATOR);
    }

    // Apply sort
    if (sortingOption === 'newest') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return filtered;
  }, [rows, sortingOption, filteringOption]);

  // Precompute user index map for O(1) serial number lookup
  const userIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    displayedUsers.forEach((user, index) => {
      map.set(user.id, index + 1);
    });
    return map;
  }, [displayedUsers]);

  const handleSearch = (value: string): void => {
    setSearchByName(value);
    refetch({
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: value ? { name: value } : undefined,
    });
  };

  const resetAndRefetch = (): void => {
    refetch({
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: undefined,
    });
    setSearchByName('');
  };

  const handleSorting = (option: string): void => {
    if (isValidSortingOption(option)) {
      setSortingOption(option);
    }
  };

  const handleFiltering = (option: string): void => {
    if (isValidFilteringOption(option)) {
      setFilteringOption(option);
    }
  };

  const loadMoreUsers = async (): Promise<void> => {
    if (!pageInfo?.hasNextPage) return;
    if (!pageInfo?.endCursor) return;

    await fetchMore({
      variables: {
        first: perPageResult,
        after: pageInfo.endCursor,
        orgFirst: 32,
        where: searchByName ? { name: searchByName } : undefined,
      },
    });
  };

  const getEmptyStateMessage = () => {
    if (searchByName.length > 0) {
      return tCommon('noResultsFoundFor', { query: searchByName });
    }
    return t('noUserFound');
  };

  const headerTitles = React.useMemo(
    () => [
      '#',
      tCommon('name'),
      tCommon('email'),
      t('joined_organizations'),
      t('blocked_organizations'),
    ],
    [t, tCommon],
  );

  const tableColumns: Array<IColumnDef<InterfaceQueryUserListItem>> =
    React.useMemo(
      () => [
        {
          id: 'index',
          header: headerTitles[0],
          accessor: (row: InterfaceQueryUserListItem) =>
            userIndexMap.get(row.id) || 0,
        },
        {
          id: 'name',
          header: headerTitles[1],
          accessor: 'name',
          meta: {
            searchable: true,
          },
        },
        {
          id: 'email',
          header: headerTitles[2],
          accessor: 'emailAddress',
          meta: {
            searchable: true,
          },
        },
        {
          id: 'joinedOrganizations',
          header: headerTitles[3],
          accessor: 'id',
          meta: {
            sortable: false,
          },
        },
        {
          id: 'blockedOrganizations',
          header: headerTitles[4],
          accessor: 'id',
          meta: {
            sortable: false,
          },
        },
      ],
      [headerTitles, userIndexMap],
    );

  const usersQueryErrorPanel = error ? (
    <div
      className={`${styles.container} bg-white rounded-4 my-3`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.errorIcon} />
        <h6 className="fw-bold text-danger text-center">
          {t('errorLoadingUsers')}
          <br />
          {error.message}
        </h6>
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => refetch()}
            aria-label={tCommon('retry')}
          >
            {tCommon('retry')}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Search and Filter Controls */}
      <div className={styles.btnsContainer} data-testid="testcomp">
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={t('enterName')}
          searchValue={searchByName}
          onSearchChange={handleSearch}
          searchInputTestId="searchByName"
          searchButtonTestId="searchButton"
          dropdowns={[
            {
              id: 'users-sort',
              label: t('sortBy'),
              type: 'sort',
              options: [
                { label: t('Newest'), value: 'newest' },
                { label: t('Oldest'), value: 'oldest' },
              ],
              selectedOption: sortingOption,
              onOptionChange: (value) => handleSorting(value.toString()),
              dataTestIdPrefix: 'sortUsers',
            },
            {
              id: 'users-filter',
              label: t('filterByRole'),
              type: 'filter',
              options: [
                { label: tCommon('admin'), value: 'admin' },
                { label: tCommon('user'), value: 'user' },
                { label: tCommon('cancel'), value: 'cancel' },
              ],
              selectedOption: filteringOption,
              onOptionChange: (value) => handleFiltering(value.toString()),
              dataTestIdPrefix: 'filterUsers',
            },
          ]}
        />
      </div>

      {/* Error Panel */}
      {usersQueryErrorPanel}

      {/* Users Table with Infinite Scroll */}
      <div className={styles.listBox}>
        <LoadingState
          isLoading={loading}
          variant="table"
          tableHeaderTitles={headerTitles}
          noOfRows={tableLoaderRowLength}
          data-testid="TableLoader"
        >
          {displayedUsers.length === 0 ? (
            <EmptyState
              icon={<PersonOff />}
              message={getEmptyStateMessage()}
              description={
                searchByName.length > 0
                  ? tCommon('tryAdjustingFilters')
                  : undefined
              }
              dataTestId="users-empty-state"
            />
          ) : (
            <InfiniteScroll
              dataLength={displayedUsers.length}
              next={loadMoreUsers}
              loader={
                <TableLoader
                  noOfCols={headerTitles.length}
                  noOfRows={tableLoaderRowLength}
                />
              }
              hasMore={pageInfo?.hasNextPage ?? false}
              className={styles.listBox}
              data-testid="users-list"
              endMessage={
                <div className="w-100 text-center my-4">
                  <h5 className="m-0">{tCommon('endOfResults')}</h5>
                </div>
              }
            >
              <DataTable
                data={displayedUsers}
                columns={tableColumns}
                rowKey="id"
                tableClassName="mb-0"
                renderRow={(
                  user: (typeof displayedUsers)[number],
                  index: number,
                ) => (
                  <UsersTableItem
                    index={index}
                    resetAndRefetch={resetAndRefetch}
                    user={user}
                    loggedInUserId={loggedInUserId}
                  />
                )}
              />
            </InfiniteScroll>
          )}
        </LoadingState>
      </div>
    </>
  );
};

export default Users;
