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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';
import { WarningAmberRounded } from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { Stack } from '@mui/material';
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import styles from 'style/app-fixed.module.css';
import { EVENT_VOLUNTEER_GROUP_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import VolunteerGroupViewModal from 'screens/EventVolunteers/VolunteerGroups/viewModal/VolunteerGroupViewModal';
import useLocalStorage from 'utils/useLocalstorage';
import GroupModal from './GroupModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

enum ModalState {
  EDIT = 'edit',
  VIEW = 'view',
}

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
};

function Groups(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  // Get the organization ID from URL parameters
  const { orgId } = useParams();
  if (!orgId || !userId) {
    return <Navigate to={'/'} replace />;
  }
  const [group, setGroup] = useState<InterfaceVolunteerGroupInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'volunteers_ASC' | 'volunteers_DESC'>(
    'volunteers_DESC',
  );
  const [searchBy, setSearchBy] = useState<'leader' | 'group'>('group');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({ [ModalState.EDIT]: false, [ModalState.VIEW]: false });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build where variables conditionally (omit if empty string)
  const whereVariables = useMemo(() => {
    const vars: Record<string, unknown> = {
      userId,
      orgId,
    };
    if (searchBy === 'leader' && debouncedSearchTerm.trim() !== '') {
      vars.leaderName = debouncedSearchTerm.trim();
    }
    if (searchBy === 'group' && debouncedSearchTerm.trim() !== '') {
      vars.name_contains = debouncedSearchTerm.trim();
    }
    return vars;
  }, [userId, orgId, searchBy, debouncedSearchTerm]);

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
  });
  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  const handleModalClick = useCallback(
    (group: InterfaceVolunteerGroupInfo | null, modal: ModalState): void => {
      setGroup(group);
      openModal(modal);
    },
    [openModal],
  );
  const searchByDropdown = {
    id: 'search-by',
    label: tCommon('searchBy', { item: '' }),
    type: 'filter' as const,
    options: [
      { label: t('group'), value: 'group' },
      { label: t('leader'), value: 'leader' },
    ],
    selectedOption: searchBy,
    onOptionChange: (value: string | number) =>
      setSearchBy(value as 'leader' | 'group'),
    dataTestIdPrefix: 'searchBy',
  };
  const sortDropdown = {
    id: 'sort',
    label: tCommon('sort'),
    type: 'sort' as const,
    options: [
      { label: t('mostVolunteers'), value: 'volunteers_DESC' },
      { label: t('leastVolunteers'), value: 'volunteers_ASC' },
    ],
    selectedOption: sortBy,
    onOptionChange: (value: string | number) =>
      setSortBy(value as 'volunteers_DESC' | 'volunteers_ASC'),
    dataTestIdPrefix: 'sort',
  };
  const groups = useMemo(
    () => groupsData?.getEventVolunteerGroups || [],
    [groupsData],
  );

  if (groupsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Volunteer Groups' })}
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
                className={styles.TableImage}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={id + '1'}
                  containerStyle={styles.imageContainer}
                  avatarStyle={styles.TableImage}
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
              onClick={() => handleModalClick(params.row, ModalState.VIEW)}
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
                onClick={() => handleModalClick(params.row, ModalState.EDIT)}
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
    <LoadingState isLoading={groupsLoading} variant="spinner">
      <div>
        <SearchFilterBar
          searchPlaceholder={tCommon('searchBy', { item: t('groupOrLeader') })}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchInputTestId="searchByInput"
          searchButtonTestId="searchBtn"
          hasDropdowns={true}
          dropdowns={[searchByDropdown, sortDropdown]}
        />
        {/* Table with Volunteer Groups */}
        <DataGrid
          disableColumnMenu
          columnBufferPx={7}
          hideFooter={true}
          getRowId={(row) => row.id}
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {t('noVolunteerGroups')}
              </Stack>
            ),
          }}
          sx={dataGridStyle}
          getRowClassName={() => `${styles.rowBackground}`}
          autoHeight
          rowHeight={65}
          rows={groups}
          columns={columns}
          isRowSelectable={() => false}
        />
        {group && (
          <>
            <GroupModal
              isOpen={modalState[ModalState.EDIT]}
              hide={() => closeModal(ModalState.EDIT)}
              refetchGroups={refetchGroups}
              group={group}
              eventId={group.event.id}
            />
            <VolunteerGroupViewModal
              isOpen={modalState[ModalState.VIEW]}
              hide={() => closeModal(ModalState.VIEW)}
              group={group}
            />
          </>
        )}
      </div>
    </LoadingState>
  );
}

export default Groups;
