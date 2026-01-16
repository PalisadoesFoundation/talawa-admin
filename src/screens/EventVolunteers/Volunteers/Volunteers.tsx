/**
 * This component renders the Volunteers page for an event in the Talawa Admin application.
 * It provides functionalities to view, search, filter, sort, and manage volunteers for a specific event.
 * The page uses DataGridWrapper to display volunteer details with integrated search, sort, and filter capabilities,
 * along with modals for adding, viewing, and deleting volunteers.
 *
 * @remarks
 * - The component uses Apollo Client's `useQuery` to fetch volunteer data.
 * - Uses DataGridWrapper for unified search, sort, and filter interface with debouncing.
 * - Provides search by volunteer name.
 * - Provides sorting by hours volunteered (most/least).
 * - Provides filtering by volunteer status (All/Pending/Accepted/Rejected).
 * - Modals are used for adding, viewing, and deleting volunteers.
 * - Displays a loader while fetching data and handles errors gracefully.
 */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';

import { VolunteerActivism, WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import {
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import styles from './Volunteers.module.css';
import { GET_EVENT_VOLUNTEERS } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import VolunteerCreateModal from './createModal/VolunteerCreateModal';
import VolunteerDeleteModal from './deleteModal/VolunteerDeleteModal';
import VolunteerViewModal from './viewModal/VolunteerViewModal';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';

enum VolunteerStatus {
  All = 'all',
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

enum ModalState {
  ADD = 'add',
  DELETE = 'delete',
  VIEW = 'view',
}

/**
 * Renders the Event Volunteers screen.
 *
 * Responsibilities:
 * - Displays volunteer listings with status chips (Accepted/Pending/Rejected)
 * - Uses DataGridWrapper for integrated search, sort, and filter capabilities
 * - Search by volunteer name with debouncing
 * - Sort by hours volunteered (most/least)
 * - Filter by status (All/Pending/Accepted/Rejected)
 * - Shows volunteer avatars and hours volunteered
 * - Handles add, view, and delete volunteer flows via modals
 *
 * Localization:
 * - Uses `common` and `eventVolunteers` namespaces
 *
 * @returns JSX.Element
 */
function Volunteers(): JSX.Element {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [volunteer, setVolunteer] =
    useState<InterfaceEventVolunteerInfo | null>(null);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [baseEvent, setBaseEvent] = useState<{ id: string } | null>(null);
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.ADD]: false,
    [ModalState.DELETE]: false,
    [ModalState.VIEW]: false,
  });

  const openModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };

  const closeModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleOpenModal = useCallback(
    (
      volunteer: InterfaceEventVolunteerInfo | null,
      modalType: ModalState,
    ): void => {
      setVolunteer(volunteer);
      openModal(modalType);
    },
    [openModal],
  );

  /**
   * Query to fetch event volunteers for the event.
   */
  const {
    data: eventData,
    loading: volunteersLoading,
    error: volunteersError,
    refetch: refetchVolunteers,
  }: {
    data?: {
      event: {
        id: string;
        recurrenceRule?: { id: string } | null;
        baseEvent?: { id: string } | null;
        volunteers: InterfaceEventVolunteerInfo[];
      };
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(GET_EVENT_VOLUNTEERS, {
    variables: {
      input: {
        id: eventId,
      },
      where: {
        eventId: eventId,
        hasAccepted: undefined,
      },
    },
  });

  // Effect to set recurring event info similar to EventActionItems
  useEffect(() => {
    if (eventData && eventData.event) {
      setIsRecurring(!!eventData.event.recurrenceRule);
      setBaseEvent(eventData.event.baseEvent || null);
    }
  }, [eventData]);

  const volunteers = useMemo(() => {
    const allVolunteers = eventData?.event?.volunteers || [];

    // Add computed field for volunteer name to enable search
    return allVolunteers.map((volunteer) => ({
      ...volunteer,
      volunteerName: volunteer.user?.name || '',
    }));
  }, [eventData]);

  if (volunteersError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded
          className={`${styles.icon} ${styles.iconLg}`}
          aria-hidden="true"
        />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Volunteers' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'volunteer',
      headerName: t('eventVolunteers.volunteerHeader'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { id, name, avatarURL } = params.row.user;
        return (
          <div
            className="d-flex fw-bold align-items-center justify-content-center ms-2"
            data-testid="volunteerName"
          >
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={tCommon('volunteer')}
                data-testid="volunteer_image"
                className={styles.tableImages}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={id + '1'}
                  dataTestId="volunteer_avatar"
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
      field: 'status',
      headerName: t('eventVolunteers.statusHeader'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const status = params.row.volunteerStatus;
        const statusVariant =
          status === 'accepted'
            ? 'accepted'
            : status === 'rejected'
              ? 'rejected'
              : 'pending';

        return <StatusBadge variant={statusVariant} dataTestId="statusChip" />;
      },
    },
    {
      field: 'hours',
      headerName: t('eventVolunteers.hoursVolunteeredHeader'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="categoryName"
          >
            {params.row.hoursVolunteered ?? '-'}
          </div>
        );
      },
    },
    // {
    //   field: 'actionItem',
    //   headerName: 'Actions Completed',
    //   align: 'center',
    //   headerAlign: 'center',
    //   sortable: false,
    //   headerClassName: `${styles.tableHeader}`,
    //   flex: 1,
    //   renderCell: (params: GridCellParams) => {
    //     return (
    //       <div
    //         className="d-flex justify-content-center fw-bold"
    //         data-testid="actionNos"
    //       >
    //         {params.row.assignments.length}
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <div>
      {/* DataGridWrapper with Volunteers */}
      <DataGridWrapper
        rows={volunteers}
        columns={columns}
        loading={volunteersLoading}
        searchConfig={{
          enabled: true,
          fields: ['volunteerName'],
          placeholder: tCommon('searchBy', { item: tCommon('name') }),
          searchInputTestId: 'searchBy',
        }}
        sortConfig={{
          sortingOptions: [
            {
              label: t('eventVolunteers.mostHoursVolunteered'),
              value: 'hoursVolunteered_DESC',
            },
            {
              label: t('eventVolunteers.leastHoursVolunteered'),
              value: 'hoursVolunteered_ASC',
            },
          ],
          sortFunction: (rows, sortValue) => {
            const [field, order] = String(sortValue).split('_');
            if (field === 'hoursVolunteered') {
              return [...rows].sort((a, b) => {
                const aHours = a.hoursVolunteered || 0;
                const bHours = b.hoursVolunteered || 0;
                return order === 'ASC' ? aHours - bHours : bHours - aHours;
              });
            }
            return rows;
          },
        }}
        filterConfig={{
          filterOptions: [
            { label: tCommon('all'), value: VolunteerStatus.All },
            { label: tCommon('pending'), value: VolunteerStatus.Pending },
            {
              label: t('eventVolunteers.accepted'),
              value: VolunteerStatus.Accepted,
            },
            {
              label: t('eventVolunteers.rejected'),
              value: VolunteerStatus.Rejected,
            },
          ],
          filterFunction: (rows, filterValue) => {
            if (filterValue === VolunteerStatus.All) return rows;
            return rows.filter((volunteer) => {
              if (filterValue === VolunteerStatus.Pending) {
                return volunteer.volunteerStatus === 'pending';
              } else if (filterValue === VolunteerStatus.Rejected) {
                return volunteer.volunteerStatus === 'rejected';
              } else {
                return volunteer.volunteerStatus === 'accepted';
              }
            });
          },
          defaultFilter: VolunteerStatus.All,
        }}
        emptyStateProps={{
          icon: <VolunteerActivism />,
          message: t('eventVolunteers.noVolunteers'),
          dataTestId: 'volunteers-empty-state',
        }}
        headerButton={
          <Button
            variant="success"
            onClick={() => handleOpenModal(null, ModalState.ADD)}
            data-testid="addVolunteerBtn"
          >
            <i className="fa fa-plus me-2" />
            {t('eventVolunteers.add')}
          </Button>
        }
        actionColumn={(row: InterfaceEventVolunteerInfo) => (
          <>
            <Button
              variant="success"
              size="sm"
              className={`me-2 rounded ${styles.iconButton}`}
              data-testid="viewItemBtn"
              onClick={() => handleOpenModal(row, ModalState.VIEW)}
              aria-label={t('eventVolunteers.viewDetails', {
                name: row.user?.name,
              })}
            >
              <i className="fa fa-info" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteItemBtn"
              onClick={() => handleOpenModal(row, ModalState.DELETE)}
              aria-label={t('eventVolunteers.deleteVolunteerEntry', {
                name: row.user?.name,
              })}
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </Button>
          </>
        )}
      />

      <VolunteerCreateModal
        isOpen={modalState[ModalState.ADD]}
        hide={() => closeModal(ModalState.ADD)}
        eventId={eventId}
        orgId={orgId}
        refetchVolunteers={refetchVolunteers}
        isRecurring={isRecurring}
        baseEvent={baseEvent}
        recurringEventInstanceId={eventId}
      />

      {volunteer && (
        <>
          <VolunteerViewModal
            isOpen={modalState[ModalState.VIEW]}
            hide={() => closeModal(ModalState.VIEW)}
            volunteer={volunteer}
          />
          <VolunteerDeleteModal
            isOpen={modalState[ModalState.DELETE]}
            hide={() => closeModal(ModalState.DELETE)}
            volunteer={volunteer}
            refetchVolunteers={refetchVolunteers}
            isRecurring={isRecurring}
            eventId={eventId}
          />
        </>
      )}
    </div>
  );
}

export default Volunteers;
