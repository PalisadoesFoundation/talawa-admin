/**
 * Component for managing volunteer groups within an event.
 * It allows administrators to view, search, sort, and manage volunteer groups.
 *
 * @remarks
 * - Displays a loader while fetching data and handles errors gracefully.
 * - Uses Apollo Client's `useQuery` to fetch volunteer group data.
 * - Uses DataGridWrapper for unified search and sort interface with debouncing.
 * - Provides search across both group name and leader name simultaneously.
 * - Provides sorting by volunteer count (most/least volunteers).
 * - Displays group details with leader avatars, volunteer counts, and action buttons.
 * - Supports create, edit, view, and delete operations through modals.
 * - All UI text is internationalized using i18n translation keys.
 * - Redirects to the home page if `orgId` or `eventId` is missing in the URL parameters.
 *
 * @returns A React component that displays a searchable and sortable table of volunteer groups.
 */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';
import { WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import {
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';

import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import Avatar from 'components/Avatar/Avatar';
import styles from 'style/app-fixed.module.css';
import { GET_EVENT_VOLUNTEER_GROUPS } from 'GraphQl/Queries/EventVolunteerQueries';
import VolunteerGroupModal from './modal/VolunteerGroupModal';
import VolunteerGroupDeleteModal from './deleteModal/VolunteerGroupDeleteModal';
import VolunteerGroupViewModal from './viewModal/VolunteerGroupViewModal';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';
import LoadingState from 'shared-components/LoadingState/LoadingState';

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
  VIEW = 'view',
}

function volunteerGroups(): JSX.Element {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [group, setGroup] = useState<InterfaceVolunteerGroupInfo | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
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

  // Effect to set recurring event info similar to Volunteers component
  useEffect(() => {
    if (eventData && eventData.event) {
      setIsRecurring(!!eventData.event.recurrenceRule);
      setBaseEvent(eventData.event.baseEvent || null);
    }
  }, [eventData]);

  const groups = useMemo(() => {
    if (!eventData?.event?.volunteerGroups) return [];

    // Add computed fields for leader name and group name to enable search
    return eventData.event.volunteerGroups.map((group) => ({
      ...group,
      leaderName: group.leader?.name || '',
      groupName: group.name || '',
    }));
  }, [eventData]);

  if (groupsLoading) {
    return (
      <LoadingState isLoading={groupsLoading} variant="spinner">
        <div></div>
      </LoadingState>
    );
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
      field: 'name',
      headerName: t('eventVolunteers.groupHeader'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
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
      renderCell: (params: GridCellParams) => {
        const { id, name, avatarURL } = params.row.leader;
        return (
          <div
            className="d-flex fw-bold align-items-center justify-content-center ms-2"
            data-testid="assigneeName"
          >
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={`${name} ${tCommon('avatar')}`}
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
      headerName: t('eventVolunteers.numVolunteersHeader'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex justify-content-center fw-bold">
            {params.row.volunteers.length}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* DataGridWrapper with Volunteer Groups */}
      <DataGridWrapper<
        InterfaceVolunteerGroupInfo & { leaderName: string; groupName: string }
      >
        rows={groups}
        columns={columns}
        loading={groupsLoading}
        searchConfig={{
          enabled: true,
          fields: ['groupName', 'leaderName'],
          placeholder: tCommon('searchBy', { item: tCommon('name') }),
        }}
        sortConfig={{
          sortingOptions: [
            {
              label: t('eventVolunteers.mostVolunteers'),
              value: 'volunteers_desc',
            },
            {
              label: t('eventVolunteers.leastVolunteers'),
              value: 'volunteers_asc',
            },
          ],
          sortFunction: (rows, sortValue) => {
            const [field, order] = String(sortValue).split('_');
            if (field === 'volunteers') {
              return [...rows].sort((a, b) => {
                const aCount = a.volunteers?.length || 0;
                const bCount = b.volunteers?.length || 0;
                return order === 'asc' ? aCount - bCount : bCount - aCount;
              });
            }
            return rows;
          },
        }}
        emptyStateMessage={t('eventVolunteers.noVolunteerGroups')}
        headerButton={
          <Button
            variant="success"
            onClick={() => handleModalClick(null, ModalState.SAME)}
            data-testid="createGroupBtn"
            aria-label={tCommon('createNew', { item: 'Volunteer Group' })}
          >
            <i className="fa fa-plus me-2" aria-hidden="true" />
            {tCommon('create')}
          </Button>
        }
        actionColumn={(row: InterfaceVolunteerGroupInfo) => (
          <>
            <Button
              variant="success"
              size="sm"
              className={`me-2 rounded ${styles.iconButton}`}
              data-testid="viewGroupBtn"
              onClick={() => handleModalClick(row, ModalState.VIEW)}
              aria-label={t('eventVolunteers.viewDetails', {
                name: row.name,
              })}
            >
              <i className="fa fa-info" aria-hidden="true" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className="me-2 rounded"
              data-testid="editGroupBtn"
              onClick={() => handleModalClick(row, ModalState.SAME)}
              aria-label={t('eventVolunteers.editVolunteerGroup', {
                name: row.name,
              })}
            >
              <i className="fa fa-edit" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteGroupBtn"
              onClick={() => handleModalClick(row, ModalState.DELETE)}
              aria-label={t('eventVolunteers.deleteVolunteerGroup', {
                name: row.name,
              })}
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </Button>
          </>
        )}
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
