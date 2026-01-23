/**
 * Volunteers.tsx
 * This component renders the Volunteers page for an event in the Talawa Admin application.
 * It provides functionalities to view, search, filter, sort, and manage volunteers for a specific event.
 * The page includes a data grid to display volunteer details and modals for adding, viewing, and deleting volunteers.
 *
 * module Volunteers
 *
 * requires
 * - react
 * - react-i18next
 * - react-bootstrap
 * - react-router-dom
 * - \@mui/icons-material
 * - \@apollo/client
 * - \@mui/x-data-grid
 * - \@mui/material
 * - shared-components/LoadingState/LoadingState
 * - components/Avatar/Avatar
 * - shared-components/SortingButton/SortingButton
 * - shared-components/SearchBar/SearchBar
 * - GraphQl/Queries/EventVolunteerQueries
 * - utils/interfaces
 * - ./createModal/VolunteerCreateModal
 * - ./deleteModal/VolunteerDeleteModal
 * - ./viewModal/VolunteerViewModal
 * - style/app.module.css
 *
 * typedef InterfaceEventVolunteerInfo - Interface for volunteer information.
 *
 * @returns The Volunteers page component.
 *
 * @example
 * ```tsx
 * // Usage
 * import Volunteers from './Volunteers';
 *
 * function App() {
 *   return <Volunteers />;
 * }
 * ```
 *
 * remarks
 * - The component uses Apollo Client's `useQuery` to fetch volunteer data.
 * - It supports search, sorting, and filtering functionalities.
 * - Modals are used for adding, viewing, and deleting volunteers.
 * - Displays a loader while fetching data and handles errors gracefully.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import { Navigate, useParams } from 'react-router';
import { VolunteerActivism, WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import styles from './Volunteers.module.css';
import { GET_EVENT_VOLUNTEERS } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import VolunteerCreateModal from './createModal/VolunteerCreateModal';
import VolunteerDeleteModal from './deleteModal/VolunteerDeleteModal';
import VolunteerViewModal from './viewModal/VolunteerViewModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

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
 * - Displays volunteer listings with status chips
 * - Supports search and filter via SearchFilterBar
 * - Shows volunteer avatars and hours volunteered
 * - Handles add, view, and delete volunteer flows
 * - Integrates with DataGrid for table display
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

  const [volunteer, setVolunteer] =
    useState<InterfaceEventVolunteerInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [status, setStatus] = useState<VolunteerStatus>(VolunteerStatus.All);
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

  const handleOpenModal = (
    volunteer: InterfaceEventVolunteerInfo | null,
    modalType: ModalState,
  ): void => {
    setVolunteer(volunteer);
    openModal(modalType);
  };

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
        hasAccepted:
          status === VolunteerStatus.All
            ? undefined
            : status === VolunteerStatus.Accepted,
        name_contains: searchTerm,
      },
      orderBy: sortBy
        ? (sortBy as 'hoursVolunteered_ASC' | 'hoursVolunteered_DESC')
        : undefined,
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

    // Apply client-side filtering based on volunteerStatus
    let filteredVolunteers = allVolunteers;

    // Filter by search term
    if (searchTerm) {
      filteredVolunteers = filteredVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) => {
          const userName = volunteer.user?.name || '';
          return userName.toLowerCase().includes(searchTerm.toLowerCase());
        },
      );
    }

    // Filter by status
    if (status === VolunteerStatus.All) {
      return filteredVolunteers;
    } else if (status === VolunteerStatus.Pending) {
      return filteredVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) =>
          volunteer.volunteerStatus === 'pending',
      );
    } else if (status === VolunteerStatus.Rejected) {
      return filteredVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) =>
          volunteer.volunteerStatus === 'rejected',
      );
    } else {
      // VolunteerStatus.Accepted
      return filteredVolunteers.filter(
        (volunteer: InterfaceEventVolunteerInfo) =>
          volunteer.volunteerStatus === 'accepted',
      );
    }
  }, [eventData, status, searchTerm]);

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }
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
              data-testid="viewItemBtn"
              onClick={() => handleOpenModal(params.row, ModalState.VIEW)}
              aria-label={t('eventVolunteers.viewDetails', {
                name: params.row.name,
              })}
            >
              <i className="fa fa-info" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteItemBtn"
              onClick={() => handleOpenModal(params.row, ModalState.DELETE)}
              aria-label={t('eventVolunteers.deleteVolunteerEntry', {
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
    <LoadingState isLoading={volunteersLoading} variant="spinner">
      <div>
        {/* Header with search, filter  and Create Button */}
        <SearchFilterBar
          searchPlaceholder={tCommon('searchBy', { item: tCommon('name') })}
          searchValue={searchTerm}
          onSearchChange={(value: string) => setSearchTerm(value)}
          onSearchSubmit={(value: string) => setSearchTerm(value)}
          searchInputTestId="searchBy"
          searchButtonTestId="searchBtn"
          hasDropdowns
          dropdowns={[
            {
              id: 'sort',
              type: 'sort',
              title: tCommon('sort'),
              label: tCommon('sort'),
              dataTestIdPrefix: 'sort',
              selectedOption: sortBy ?? '',
              options: [
                {
                  label: t('eventVolunteers.mostHoursVolunteered'),
                  value: 'hoursVolunteered_DESC',
                },
                {
                  label: t('eventVolunteers.leastHoursVolunteered'),
                  value: 'hoursVolunteered_ASC',
                },
              ],
              onOptionChange: (value) => setSortBy(String(value)),
            },
            {
              id: 'filter',
              type: 'filter',
              title: tCommon('filter'),
              label: t('eventVolunteers.status'),
              dataTestIdPrefix: 'filter',
              selectedOption: status,
              options: [
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
              onOptionChange: (value) => setStatus(value as VolunteerStatus),
            },
          ]}
          additionalButtons={
            <Button
              variant="success"
              onClick={() => handleOpenModal(null, ModalState.ADD)}
              className={styles.actionsButton}
              data-testid="addVolunteerBtn"
            >
              <i className="fa fa-plus me-2" />
              {t('eventVolunteers.add')}
            </Button>
          }
        />

        {/* Table with Volunteers */}
        <DataGridWrapper
          rows={volunteers}
          columns={columns}
          loading={volunteersLoading}
          emptyStateProps={{
            icon: <VolunteerActivism />,
            message: t('eventVolunteers.noVolunteers'),
            dataTestId: 'volunteers-empty-state',
          }}
          paginationConfig={{
            enabled: false,
          }}
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
    </LoadingState>
  );
}

export default Volunteers;
