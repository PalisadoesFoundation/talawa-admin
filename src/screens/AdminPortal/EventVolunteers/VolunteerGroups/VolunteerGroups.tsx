/**
 * Component for managing volunteer groups within an event.
 *
 * This component provides functionality to:
 * - View, filter, and sort volunteer groups.
 * - Create, edit, and delete volunteer groups using modals.
 * - Display volunteer group details such as group name, leader,
 *   number of volunteers, and completed actions.
 *
 * Features:
 * - Search functionality to filter groups by leader or group name.
 * - Sorting options for volunteer count (ascending/descending).
 * - Integration with GraphQL to fetch and manage volunteer group data.
 * - Customizable modals for creating, editing, viewing, and deleting groups.
 * - Error handling and loading states with appropriate UI feedback.
 *
 * @returns The rendered volunteer groups management component.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import { Navigate, useParams } from 'react-router';

import { Groups, WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';

import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import styles from './VolunteerGroups.module.css';
import { GET_EVENT_VOLUNTEER_GROUPS } from 'GraphQl/Queries/EventVolunteerQueries';
import VolunteerGroupModal from './modal/VolunteerGroupModal';
import VolunteerGroupDeleteModal from './deleteModal/VolunteerGroupDeleteModal';
import VolunteerGroupViewModal from 'shared-components/VolunteerGroupViewModal/VolunteerGroupViewModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
  VIEW = 'view',
}

/**
 * Renders the Volunteer Groups management screen.
 *
 * Responsibilities:
 * - Displays volunteer groups for an event
 * - Supports searching by group name or leader via SearchFilterBar
 * - Enables sorting by volunteer count
 * - Handles create, edit, view, and delete group flows
 * - Renders assignee avatars and volunteer counts
 *
 * Localization:
 * - Uses `common` and `eventVolunteers` namespaces
 *
 * @returns JSX.Element
 */
function VolunteerGroups(): JSX.Element {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  const [group, setGroup] = useState<InterfaceVolunteerGroupInfo | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'leader' | 'group'>('group');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [baseEvent, setBaseEvent] = useState<{ id: string } | null>(null);
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
    [ModalState.VIEW]: false,
  });

  /**
   * Query to fetch event and volunteer groups for the event.
   */
  const {
    data: eventData,
    loading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  }: {
    data?: {
      event: {
        id: string;
        recurrenceRule?: { id: string } | null;
        baseEvent?: { id: string } | null;
        volunteerGroups: InterfaceVolunteerGroupInfo[];
      };
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(GET_EVENT_VOLUNTEER_GROUPS, {
    variables: {
      input: {
        id: eventId,
      },
    },
  });

  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleModalClick = (
    group: InterfaceVolunteerGroupInfo | null,
    modal: ModalState,
  ): void => {
    if (modal === ModalState.SAME) {
      setModalMode(group ? 'edit' : 'create');
    }
    setGroup(group);
    openModal(modal);
  };

  // Effect to set recurring event info similar to Volunteers component
  useEffect(() => {
    if (eventData && eventData.event) {
      setIsRecurring(!!eventData.event.recurrenceRule);
      setBaseEvent(eventData.event.baseEvent || null);
    }
  }, [eventData]);

  const groups = useMemo(() => {
    const allGroups = eventData?.event?.volunteerGroups || [];

    // Apply client-side filtering based on search term
    let filteredGroups = allGroups;

    if (searchTerm) {
      filteredGroups = filteredGroups.filter(
        (group: InterfaceVolunteerGroupInfo) => {
          if (searchBy === 'leader') {
            const leaderName = group.leader?.name || '';
            return leaderName.toLowerCase().includes(searchTerm.toLowerCase());
          } else {
            const groupName = group.name || '';
            return groupName.toLowerCase().includes(searchTerm.toLowerCase());
          }
        },
      );
    }

    // Apply sorting (create a copy to avoid read-only array issues)
    let finalGroups = [...filteredGroups];
    if (sortBy === 'volunteers_ASC') {
      finalGroups.sort(
        (a, b) => (a.volunteers?.length || 0) - (b.volunteers?.length || 0),
      );
    } else if (sortBy === 'volunteers_DESC') {
      finalGroups.sort(
        (a, b) => (b.volunteers?.length || 0) - (a.volunteers?.length || 0),
      );
    }

    return finalGroups;
  }, [eventData, searchTerm, searchBy, sortBy]);

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }
  if (groupsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded
          className={`${styles.icon} ${styles.iconLg}`}
          aria-hidden="true"
        />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Volunteer Groups' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'group',
      headerName: t('eventVolunteers.groupHeader'),
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
      headerName: t('eventVolunteers.leaderHeader'),
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
            data-testid="assigneeName"
          >
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={tCommon('assignee')}
                data-testid={`image${id + 1}`}
                className={styles.tableImages}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={id + '1'}
                  containerStyle={styles.imageContainer}
                  avatarStyle={styles.tableImages}
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
      headerName: t('eventVolunteers.numVolunteersHeader'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex justify-content-center fw-bold">
            {params.row.volunteers.length}{' '}
          </div>
        );
      },
    },
    {
      field: 'options',
      headerName: t('eventVolunteers.optionsHeader'),
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
              className={`me-2 rounded ${styles.iconButton}`}
              data-testid="viewGroupBtn"
              onClick={() => handleModalClick(params.row, ModalState.VIEW)}
              aria-label={t('eventVolunteers.viewDetails', {
                name: params.row.name,
              })}
            >
              <i className="fa fa-info" aria-hidden="true" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className="me-2 rounded"
              data-testid="editGroupBtn"
              onClick={() => handleModalClick(params.row, ModalState.SAME)}
              aria-label={t('eventVolunteers.editVolunteerGroup', {
                name: params.row.name,
              })}
            >
              <i className="fa fa-edit" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteGroupBtn"
              onClick={() => handleModalClick(params.row, ModalState.DELETE)}
              aria-label={t('eventVolunteers.deleteVolunteerGroup', {
                name: params.row.name,
              })}
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <LoadingState isLoading={groupsLoading} variant="spinner">
      <div>
        {/* Header with search, filter  and Create Button */}
        <SearchFilterBar
          searchPlaceholder={tCommon('searchBy', {
            item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
          })}
          searchValue={searchTerm}
          onSearchChange={(value: string) => setSearchTerm(value)}
          onSearchSubmit={(value: string) => setSearchTerm(value)}
          searchInputTestId="searchBy"
          searchButtonTestId="searchBtn"
          hasDropdowns
          dropdowns={[
            {
              id: 'searchBy',
              title: tCommon('searchBy'),
              label: tCommon('searchBy', { item: '' }),
              dataTestIdPrefix: 'searchByToggle',
              selectedOption: searchBy,
              options: [
                { label: t('eventVolunteers.leader'), value: 'leader' },
                { label: t('eventVolunteers.group'), value: 'group' },
              ],
              onOptionChange: (value) => {
                setSearchBy(value as 'leader' | 'group');
              },
              type: 'filter',
            },
            {
              id: 'sort',
              title: tCommon('sort'),
              label: tCommon('sort'),
              dataTestIdPrefix: 'sort',
              selectedOption: sortBy ?? '',
              options: [
                {
                  label: t('eventVolunteers.mostVolunteers'),
                  value: 'volunteers_DESC',
                },
                {
                  label: t('eventVolunteers.leastVolunteers'),
                  value: 'volunteers_ASC',
                },
              ],
              onOptionChange: (value) => {
                setSortBy(String(value));
              },
              type: 'sort',
            },
          ]}
          additionalButtons={
            <Button
              variant="success"
              onClick={() => handleModalClick(null, ModalState.SAME)}
              className={styles.actionsButton}
              data-testid="createGroupBtn"
              aria-label={tCommon('createNew', { item: 'Volunteer Group' })}
            >
              <i className="fa fa-plus me-2" aria-hidden="true" />
              {tCommon('create')}
            </Button>
          }
        />

        {/* Table with Volunteer Groups */}
        <DataGridWrapper
          rows={groups}
          columns={columns}
          loading={groupsLoading}
          emptyStateProps={{
            icon: <Groups />,
            message: t('eventVolunteers.noVolunteerGroups'),
            dataTestId: 'volunteerGroups-empty-state',
          }}
          paginationConfig={{
            enabled: false,
          }}
        />

        <VolunteerGroupModal
          isOpen={modalState[ModalState.SAME]}
          hide={() => closeModal(ModalState.SAME)}
          refetchGroups={refetchGroups}
          eventId={eventId}
          orgId={orgId}
          group={group}
          mode={modalMode}
          isRecurring={isRecurring}
          baseEvent={baseEvent}
          recurringEventInstanceId={eventId}
        />

        {group && (
          <>
            <VolunteerGroupViewModal
              isOpen={modalState[ModalState.VIEW]}
              hide={() => closeModal(ModalState.VIEW)}
              group={group}
            />

            <VolunteerGroupDeleteModal
              isOpen={modalState[ModalState.DELETE]}
              hide={() => closeModal(ModalState.DELETE)}
              refetchGroups={refetchGroups}
              group={group}
              isRecurring={isRecurring}
              eventId={eventId}
            />
          </>
        )}
      </div>
    </LoadingState>
  );
}

export default VolunteerGroups;
