import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  ORGANIZATION_LIST,
  USER_LIST_FOR_ADMIN,
} from 'GraphQl/Queries/Queries';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import UsersTableItem from 'components/UsersTableItem/UsersTableItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import type {
  InterfaceQueryUserListItemForAdmin,
  InterfaceUserListQueryResponse,
} from 'utils/interfaces';
import styles from './Users.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { PersonOff } from '@mui/icons-material';
import ErrorPanel from 'shared-components/ErrorPanel';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';

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
const Users = (): React.ReactElement => {
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

  // Build where clause including role filter for server-side filtering
  const buildWhereClause = (
    name: string,
    filtering: FilteringOption,
  ): { name?: string; role?: string } | undefined => {
    const where: { name?: string; role?: string } = {};
    if (name) {
      where.name = name;
    }
    if (filtering === 'user') {
      where.role = USER_ROLES.REGULAR;
    } else if (filtering === 'admin') {
      where.role = USER_ROLES.ADMINISTRATOR;
    }
    return Object.keys(where).length > 0 ? where : undefined;
  };

  // Use GraphQL query with useTableData hook
  const queryResult = useQuery(USER_LIST_FOR_ADMIN, {
    variables: {
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: buildWhereClause(searchByName, filteringOption),
    },
    notifyOnNetworkStatusChange: true,
  });

  const { rows, loading, pageInfo, error, fetchMore, refetch } = useTableData<
    InterfaceQueryUserListItemForAdmin,
    InterfaceQueryUserListItemForAdmin,
    InterfaceUserListQueryResponse
  >(queryResult, {
    path: (data: InterfaceUserListQueryResponse) => {
      if (!data || !data.allUsers) {
        return undefined;
      }

      return data.allUsers;
    },
  });

  // Show warning if there are no organizations
  const { data: dataOrgs } = useQuery(ORGANIZATION_LIST);
  useEffect(() => {
    if (dataOrgs?.organizations?.length === 0) {
      NotificationToast.warning(t('noOrgError') as string);
    }
  }, [dataOrgs, t]);

  // Apply sorting only (filtering now happens server-side)
  const displayedUsers = React.useMemo(() => {
    const sorted = [...rows];

    // Apply sort
    if (sortingOption === 'newest') {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return sorted;
  }, [rows, sortingOption]);

  const handleSearch = (value: string): void => {
    setSearchByName(value);
    refetch({
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: buildWhereClause(value, filteringOption),
    });
  };

  const resetAndRefetch = (): void => {
    setSearchByName('');
    refetch({
      first: perPageResult,
      after: null,
      orgFirst: 32,
      where: buildWhereClause('', filteringOption),
    });
  };

  const handleSorting = (option: string): void => {
    if (isValidSortingOption(option)) {
      setSortingOption(option);
    }
  };

  const handleFiltering = (option: string): void => {
    if (isValidFilteringOption(option)) {
      setFilteringOption(option);
      refetch({
        first: perPageResult,
        after: null,
        orgFirst: 32,
        where: buildWhereClause(searchByName, option),
      });
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
        where: buildWhereClause(searchByName, filteringOption),
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
      tCommon('name'),
      tCommon('email'),
      'Role',
      'Organizations',
      'Joined',
      'Actions',
    ],
    [tCommon],
  );

  const usersQueryErrorPanel = error ? (
    <ErrorPanel
      message={t('errorLoadingUsers')}
      error={error}
      onRetry={refetch}
      testId="errorMsg"
    />
  ) : null;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('filterByRole')}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="toolbar" data-testid="testcomp">
        <div className="search-bar">
          <span className="search-icon">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={t('enterName')}
            aria-label={t('enterName')}
            value={searchByName}
            onChange={(e) => handleSearch(e.target.value)}
            data-testid="searchByName"
          />
        </div>
        <div className="filter-group">
          <button
            className={`filter-btn${filteringOption === 'cancel' ? ' active' : ''}`}
            onClick={() => handleFiltering('cancel')}
            data-testid="filterUsersAll"
          >
            {tCommon('all')}
          </button>
          <button
            className={`filter-btn${filteringOption === 'admin' ? ' active' : ''}`}
            onClick={() => handleFiltering('admin')}
            data-testid="filterUsersAdmin"
          >
            {tCommon('admin')}
          </button>
          <button
            className={`filter-btn${filteringOption === 'user' ? ' active' : ''}`}
            onClick={() => handleFiltering('user')}
            data-testid="filterUsersUser"
          >
            Super Admin
          </button>
        </div>
      </div>

      {/* Error Panel */}
      {usersQueryErrorPanel}

      {/* Users Table */}
      <div className="card">
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
            <div className="table-wrapper">
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
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">{tCommon('name')}</th>
                      <th scope="col">{tCommon('email')}</th>
                      <th scope="col">Role</th>
                      <th scope="col">Organizations</th>
                      <th scope="col">Joined</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((user, index) => (
                      <UsersTableItem
                        key={user.id}
                        index={index}
                        resetAndRefetch={resetAndRefetch}
                        user={user}
                        loggedInUserId={loggedInUserId}
                      />
                    ))}
                  </tbody>
                </table>
              </InfiniteScroll>
            </div>
          )}
        </LoadingState>
      </div>
    </>
  );
};

export default Users;
