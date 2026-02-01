/**
 * Requests.tsx
 * This component renders a table displaying volunteer membership requests for a specific event.
 * It allows administrators to search, sort, and manage these requests by accepting or rejecting them.
 *
 * module Requests
 *
 * requires
 * - react
 * - react-i18next
 * - react-bootstrap
 * - react-router-dom
 * - \@apollo/client
 * - \@mui/x-data-grid
 * - dayjs
 * - NotificationToast
 * - shared-components/LoadingState/LoadingState
 * - components/Avatar/Avatar
 * - components/SearchFilterBar/SearchFilterBar
 * - GraphQl/Queries/EventVolunteerQueries
 * - GraphQl/Mutations/EventVolunteerMutation
 * - utils/interfaces
 *
 * function Requests
 * @returns A React component that displays a searchable and sortable table of volunteer membership requests.
 *
 * remarks
 * - Displays a loader while fetching data and handles errors gracefully.
 * - Uses Apollo Client's `useQuery` to fetch data and `useMutation` to update membership status.
 * - Uses SearchFilterBar for unified search and filter interface with debouncing.
 * - Provides sorting by creation date (latest/earliest) and filtering by request type (all/individuals/groups).
 * - Displays volunteer details with accessible avatar alt text, request type, request date, and action buttons.
 * - All UI text is internationalized using i18n translation keys.
 * - Redirects to the home page if `orgId` or `eventId` is missing in the URL parameters.
 *
 * @example
 * <Requests />
 */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import { Navigate, useParams } from 'react-router';
import { FaXmark } from 'react-icons/fa6';
import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import styles from './Requests.module.css';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceVolunteerMembership } from 'utils/interfaces';
import dayjs from 'dayjs';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

function Requests(): JSX.Element {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [filterBy, setFilterBy] = useState<'all' | 'individual' | 'group'>(
    'all',
  );

  const [updateMembership] = useMutation(UPDATE_VOLUNTEER_MEMBERSHIP);

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }
  const updateMembershipStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
  ): Promise<void> => {
    try {
      await updateMembership({ variables: { id: id, status: status } });
      NotificationToast.success(
        t(
          status === 'accepted' ? 'requestAccepted' : 'requestRejected',
        ) as string,
      );
      refetchRequests();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  /**
   * Query to fetch volunteer Membership requests for the event.
   */
  const {
    data: requestsData,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  }: {
    data?: { getVolunteerMembership: InterfaceVolunteerMembership[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_VOLUNTEER_MEMBERSHIP, {
    variables: {
      where: {
        eventId,
        status: 'requested',
        userName: searchTerm || undefined,
      },
      orderBy: sortBy
        ? (sortBy as 'createdAt_ASC' | 'createdAt_DESC')
        : undefined,
    },
  });

  const requests = useMemo(() => {
    if (!requestsData) return [];

    let filteredRequests = requestsData.getVolunteerMembership;

    // Apply filter by request type
    if (filterBy === 'individual') {
      filteredRequests = filteredRequests.filter((request) => !request.group);
    } else if (filterBy === 'group') {
      filteredRequests = filteredRequests.filter((request) => request.group);
    }

    return filteredRequests;
  }, [requestsData, filterBy]);

  if (requestsError) {
    // Displays an error message if there is an issue loading the requests
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.iconLg}`}
          />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', {
              entity: t('eventVolunteers.volunteershipRequests'),
            })}
          </h6>
        </div>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'srNo',
      headerName: tCommon('serialNumber'),
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1;
      },
    },
    {
      field: 'volunteer',
      headerName: tCommon('volunteer'),
      flex: 3,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { name, avatarURL } = params.row.volunteer.user;
        return (
          <div
            className="d-flex fw-bold align-items-center justify-content-center ms-2"
            data-testid="volunteerName"
          >
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={`${name} ${tCommon('avatar')}`}
                data-testid={`volunteer_image`}
                className={styles.tableImages}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key="volunteer_avatar"
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
      field: 'requestType',
      headerName: t('eventVolunteers.requestType'),
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const { group } = params.row;
        return (
          <div className="d-flex flex-column align-items-center">
            <span className="fw-bold">
              {group
                ? t('eventVolunteers.groups')
                : t('eventVolunteers.individuals')}
            </span>
            {group && <small className="text-muted">{group.name}</small>}
          </div>
        );
      },
    },
    {
      field: 'requestDate',
      headerName: t('eventVolunteers.requestDate'),
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return dayjs(params.row.createdAt).format('DD/MM/YYYY');
      },
    },
    {
      field: 'options',
      headerName: tCommon('options'),
      align: 'center',
      flex: 2,
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
              className={`${styles.iconButton} me-2 rounded`}
              data-testid="acceptBtn"
              onClick={() => updateMembershipStatus(params.row.id, 'accepted')}
            >
              <i className="fa fa-check" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid={`rejectBtn`}
              onClick={() => updateMembershipStatus(params.row.id, 'rejected')}
            >
              <FaXmark size={18} />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <LoadingState isLoading={requestsLoading} variant="spinner">
      <div>
        {/* Header with search, filter and sort */}
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
              label: tCommon('sort'),
              options: [
                { label: t('eventVolunteers.latest'), value: 'createdAt_DESC' },
                {
                  label: t('eventVolunteers.earliest'),
                  value: 'createdAt_ASC',
                },
              ],
              selectedOption: sortBy ?? '',
              onOptionChange: (value: string | number) =>
                setSortBy(String(value)),
              dataTestIdPrefix: 'sort',
            },
            {
              id: 'filter',
              type: 'filter',
              label: tCommon('filter'),
              options: [
                { label: tCommon('all'), value: 'all' },
                {
                  label: t('eventVolunteers.individuals'),
                  value: 'individual',
                },
                { label: t('eventVolunteers.groups'), value: 'group' },
              ],
              selectedOption: filterBy,
              onOptionChange: (value: string | number) =>
                setFilterBy(value as 'all' | 'individual' | 'group'),
              dataTestIdPrefix: 'filter',
            },
          ]}
        />

        {/* Table with Volunteer Membership Requests */}
        <DataGridWrapper
          rows={requests}
          columns={columns}
          loading={requestsLoading}
          emptyStateProps={{
            message: t('eventVolunteers.noRequests'),
            dataTestId: 'no-requests',
          }}
          paginationConfig={{
            enabled: false,
          }}
        />
      </div>
    </LoadingState>
  );
}

export default Requests;
