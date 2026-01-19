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
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';

import { WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';

import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { debounce } from 'utils/performance';
import Avatar from 'components/Avatar/Avatar';
import styles from 'style/app-fixed.module.css';
import { GET_EVENT_VOLUNTEER_GROUPS } from 'GraphQl/Queries/EventVolunteerQueries';
import VolunteerGroupModal from './modal/VolunteerGroupModal';
import VolunteerGroupDeleteModal from './deleteModal/VolunteerGroupDeleteModal';
import VolunteerGroupViewModal from './viewModal/VolunteerGroupViewModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
  VIEW = 'view',
}

const dataGridStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  '& .MuiDataGrid-columnHeaders': { border: 'none' },
  '& .MuiDataGrid-cell': { border: 'none' },
  '& .MuiDataGrid-columnSeparator': { display: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-row.Mui-hovered': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-root': { borderRadius: '0.5rem' },
  '& .MuiDataGrid-main': { borderRadius: '0.5rem' },
};

/**
 * Component for managing volunteer groups for an event.
 * This component allows users to view, filter, sort, and create action items. It also provides a modal for creating and editing action items.
 * @returns The rendered component.
 */
function volunteerGroups(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [group, setGroup] = useState<InterfaceVolunteerGroupInfo | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'volunteers_ASC' | 'volunteers_DESC' | null
  >(null);
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

  const handleModalClick = useCallback(
    (group: InterfaceVolunteerGroupInfo | null, modal: ModalState): void => {
      if (modal === ModalState.SAME) {
        setModalMode(group ? 'edit' : 'create');
      }
      setGroup(group);
      openModal(modal);
    },
    [openModal],
  );

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

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

  if (groupsLoading) {
    return <Loader size="xl" />;
  }

  if (groupsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Volunteer Groups' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'group',
      headerName: 'Group',
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
      headerName: 'Leader',
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
                alt="Assignee"
                data-testid={`image${id + 1}`}
                className={styles.TableImages}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={id + '1'}
                  containerStyle={styles.imageContainer}
                  avatarStyle={styles.TableImages}
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
      headerName: 'No. of Volunteers',
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
      headerName: 'Options',
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
              style={{ minWidth: '32px' }}
              className="me-2 rounded"
              data-testid="viewGroupBtn"
              onClick={() => handleModalClick(params.row, ModalState.VIEW)}
            >
              <i className="fa fa-info" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className="me-2 rounded"
              data-testid="editGroupBtn"
              onClick={() => handleModalClick(params.row, ModalState.SAME)}
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteGroupBtn"
              onClick={() => handleModalClick(params.row, ModalState.DELETE)}
            >
              <i className="fa fa-trash" />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header with search, filter  and Create Button */}
      <div className={`${styles.btnsContainer} btncon gap-4 flex-wrap`}>
        <SearchBar
          placeholder={tCommon('searchBy', {
            item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
          })}
          onSearch={debouncedSearch}
          inputTestId="searchBy"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-3 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <SortingButton
              sortingOptions={[
                { label: t('leader'), value: 'leader' },
                { label: t('group'), value: 'group' },
              ]}
              selectedOption={searchBy}
              onSortChange={(value) => setSearchBy(value as 'leader' | 'group')}
              dataTestIdPrefix="searchByToggle"
              buttonLabel={tCommon('searchBy', { item: '' })}
            />
            <SortingButton
              title={tCommon('sort')}
              sortingOptions={[
                { label: t('mostVolunteers'), value: 'volunteers_DESC' },
                { label: t('leastVolunteers'), value: 'volunteers_ASC' },
              ]}
              selectedOption={sortBy ?? ''}
              onSortChange={(value) =>
                setSortBy(value as 'volunteers_DESC' | 'volunteers_ASC')
              }
              dataTestIdPrefix="sort"
              buttonLabel={tCommon('sort')}
            />
          </div>
          <div>
            <Button
              variant="success"
              onClick={() => handleModalClick(null, ModalState.SAME)}
              style={{ marginTop: '11px' }}
              className={styles.actionsButton}
              data-testid="createGroupBtn"
            >
              <i className={'fa fa-plus me-2'} />
              {tCommon('create')}
            </Button>
          </div>
        </div>
      </div>

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
        getRowClassName={() => `${styles.rowBackgrounds}`}
        autoHeight
        rowHeight={65}
        rows={groups}
        columns={columns}
        isRowSelectable={() => false}
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
  );
}

export default volunteerGroups;
