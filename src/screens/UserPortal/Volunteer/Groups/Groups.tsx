/**
 * Groups Component
 *
 * This component renders a table of volunteer groups for a specific organization and event.
 * It provides functionalities such as searching, sorting, and viewing/editing group details.
 *
 * @returns The rendered Groups component.
 *
 * @remarks
 * - Uses `@apollo/client` to fetch volunteer group data from the GraphQL API.
 * - Implements debounced search functionality for better performance.
 * - Displays a loader while data is being fetched and an error message if the query fails.
 * - Integrates modals for viewing and editing group details.
 *
 * requires
 * - `react`, `react-i18next` for translations.
 * - `@apollo/client` for GraphQL queries.
 * - `@mui/x-data-grid` for rendering the data grid.
 * - `react-bootstrap` for UI components.
 * - Custom components: `Loader`, `Avatar`, `GroupModal`, `VolunteerGroupViewModal`, `SearchBar`, `SortingButton`.
 *
 * enum [ModalState]
 * - `EDIT`: Represents the edit modal state.
 * - `VIEW`: Represents the view modal state.
 *
 * state
 * - `group`: Stores the currently selected group for modal interactions.
 * - `searchTerm`: Stores the search input value.
 * - `sortBy`: Stores the sorting criteria for volunteer groups.
 * - `searchBy`: Determines whether to search by group name or leader name.
 * - `modalState`: Tracks the visibility of the edit and view modals.
 *
 * query
 * - `EVENT_VOLUNTEER_GROUP_LIST`: Fetches the list of volunteer groups based on filters and sorting.
 *
 * @param  orgId - The organization ID retrieved from the URL parameters.
 * @param  userId - The user ID retrieved from local storage.
 *
 * @example
 * ```tsx
 * <Groups />
 * ```
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared-components/Button';
import { Navigate, useParams } from 'react-router';
import { WarningAmberRounded } from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import {
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import styles from './Groups.module.css';
import { EVENT_VOLUNTEER_GROUP_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import VolunteerGroupViewModal from 'shared-components/VolunteerGroupViewModal/VolunteerGroupViewModal';
import useLocalStorage from 'utils/useLocalstorage';
import GroupModal from './GroupModal';

function Groups(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const { getItem } = useLocalStorage();
  const { orgId } = useParams();

  const [group, setGroup] = useState<InterfaceVolunteerGroupInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'volunteers_ASC' | 'volunteers_DESC'>(
    'volunteers_DESC',
  );
  const [searchBy, setSearchBy] = useState<'leader' | 'group'>('group');
  const {
    isOpen: isEditModalOpen,
    open: openEditModal,
    close: closeEditModal,
  } = useModalState();
  const {
    isOpen: isViewModalOpen,
    open: openViewModal,
    close: closeViewModal,
  } = useModalState();

  const userId = getItem('userId');

  // Build where variables conditionally (omit if empty string)
  const whereVariables = useMemo(() => {
    if (!userId || !orgId) return {};

    const vars: Record<string, unknown> = {
      userId,
      orgId,
    };
    if (searchBy === 'leader' && searchTerm.trim() !== '') {
      vars.leaderName = searchTerm.trim();
    }
    if (searchBy === 'group' && searchTerm.trim() !== '') {
      vars.name_contains = searchTerm.trim();
    }
    return vars;
  }, [userId, orgId, searchBy, searchTerm]);

  /**
   * Query to fetch the list of volunteer groups for the event.
   */
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  }: {
    data?: { getEventVolunteerGroups: InterfaceVolunteerGroupInfo[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(EVENT_VOLUNTEER_GROUP_LIST, {
    variables: {
      where: whereVariables,
      orderBy: sortBy,
    },
    skip: !userId || !orgId,
  });

  const handleEditClick = useCallback(
    (group: InterfaceVolunteerGroupInfo | null): void => {
      setGroup(group);
      openEditModal();
    },
    [openEditModal],
  );

  const handleViewClick = useCallback(
    (group: InterfaceVolunteerGroupInfo | null): void => {
      setGroup(group);
      openViewModal();
    },
    [openViewModal],
  );

  const handleSearchChange = useCallback((term: string, _searchBy?: string) => {
    setSearchTerm(term);
  }, []);

  const handleSearchByChange = useCallback((searchBy: string) => {
    setSearchBy(searchBy as 'leader' | 'group');
  }, []);

  const groups = useMemo(
    () => groupsData?.getEventVolunteerGroups || [],
    [groupsData],
  );

  // Early return after all hooks
  if (!orgId || !userId) {
    return <Navigate to={'/'} replace />;
  }

  if (groupsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: t('volunteerGroups') })}
        </h6>
      </div>
    );
  }
  const columns: GridColDef[] = [
    {
      field: 'group',
      headerName: t('groupHeader'),
      flex: 1,
      align: 'left',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="groupName"
          >
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: 'leader',
      headerName: t('leaderHeader'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { id, name, avatarURL } = params.row.leader;
        return (
          <div
            className="d-flex fw-bold align-items-center ms-2"
            data-testid="leaderName"
          >
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={t('leader')}
                data-testid={`image${id + 1}`}
                className={styles.tableImage}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={id + '1'}
                  containerStyle={styles.imageContainer}
                  avatarStyle={styles.tableImage}
                  name={name}
                  alt={name}
                />
              </div>
            )}
            {name}
          </div>
        );
      },
    },
    {
      field: 'volunteers',
      headerName: t('numVolunteersHeader'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex justify-content-center fw-bold">
            {params.row.volunteers.length}
          </div>
        );
      },
    },
    {
      field: 'options',
      headerName: t('optionsHeader'),
      align: 'center',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              className={`${styles.groupsViewButton} me-2 rounded`}
              data-testid="viewGroupBtn"
              onClick={() => handleViewClick(params.row)}
              aria-label={t('viewGroup')}
            >
              <i className="fa fa-info" />
            </Button>
            {params.row.leader.id === userId && (
              <Button
                variant="success"
                size="sm"
                className="me-2 rounded"
                data-testid="editGroupBtn"
                onClick={() => handleEditClick(params.row)}
                aria-label={t('editGroup')}
              >
                <i className="fa fa-edit" />
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <DataGridWrapper
        rows={groups}
        columns={columns}
        loading={groupsLoading}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchTerm: searchTerm,
          searchByOptions: [
            { label: t('group'), value: 'group' },
            { label: t('leader'), value: 'leader' },
          ],
          selectedSearchBy: searchBy,
          onSearchChange: handleSearchChange,
          onSearchByChange: handleSearchByChange,
          searchInputTestId: 'searchByInput',
          placeholder: tCommon('searchBy', { item: t('groupOrLeader') }),
          debounceMs: 300,
        }}
        sortConfig={{
          sortingOptions: [
            { label: t('mostVolunteers'), value: 'volunteers_desc' },
            { label: t('leastVolunteers'), value: 'volunteers_asc' },
          ],
          selectedSort:
            sortBy === 'volunteers_ASC' ? 'volunteers_asc' : 'volunteers_desc',
          onSortChange: (value: string | number) =>
            setSortBy(
              value === 'volunteers_asc' ? 'volunteers_ASC' : 'volunteers_DESC',
            ),
        }}
        emptyStateMessage={t('noVolunteerGroups')}
      />
      {group && (
        <>
          <GroupModal
            isOpen={isEditModalOpen}
            hide={closeEditModal}
            refetchGroups={refetchGroups}
            group={group}
            eventId={group.event.id}
          />
          <VolunteerGroupViewModal
            isOpen={isViewModalOpen}
            hide={closeViewModal}
            group={group}
          />
        </>
      )}
    </div>
  );
}

export default Groups;
