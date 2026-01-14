/**
 * This component renders a table displaying volunteer membership requests for a specific event.
 * It allows administrators to search, sort, filter, and manage these requests by accepting or rejecting them.
 *
 * @remarks
 * - Displays a loader while fetching data and handles errors gracefully.
 * - Uses Apollo Client's `useQuery` to fetch data and `useMutation` to update membership status.
 * - Uses DataGridWrapper for unified search, sort, and filter interface with debouncing.
 * - Provides sorting by creation date (latest/earliest) and filtering by request type (all/individuals/groups).
 * - Displays volunteer details with accessible avatar alt text, request type, request date, and action buttons.
 * - All UI text is internationalized using i18n translation keys.
 * - Redirects to the home page if `orgId` or `eventId` is missing in the URL parameters.
 *
 * @returns A React component that displays a searchable, sortable, and filterable table of volunteer membership requests.
 */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';
import { FaXmark } from 'react-icons/fa6';
import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import {
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import styles from '../../../style/app-fixed.module.css';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceVolunteerMembership } from 'utils/interfaces';
import dayjs from 'dayjs';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';

function Requests(): JSX.Element {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [updateMembership] = useMutation(UPDATE_VOLUNTEER_MEMBERSHIP);

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
      },
    },
  });

  const requests = useMemo(() => {
    if (!requestsData) return [];

    // Add a computed field for volunteer name to enable search
    return requestsData.getVolunteerMembership.map((request) => ({
      ...request,
      volunteerName: request.volunteer.user.name,
    }));
  }, [requestsData]);

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
                className={styles.TableImages}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key="volunteer_avatar"
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
      field: 'requestType',
      headerName: t('eventVolunteers.requestType'),
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
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
      field: 'createdAt',
      headerName: t('eventVolunteers.requestDate'),
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      renderCell: (params: GridCellParams) => {
        return dayjs(params.row.createdAt).format('DD/MM/YYYY');
      },
    },
  ];

  return (
    <div>
      {/* DataGridWrapper with Volunteer Membership Requests */}
      <DataGridWrapper<InterfaceVolunteerMembership & { volunteerName: string }>
        rows={requests}
        columns={columns}
        loading={requestsLoading}
        searchConfig={{
          enabled: true,
          fields: ['volunteerName'],
          placeholder: tCommon('searchBy', { item: tCommon('name') }),
        }}
        sortConfig={{
          sortingOptions: [
            { label: t('eventVolunteers.latest'), value: 'createdAt_desc' },
            { label: t('eventVolunteers.earliest'), value: 'createdAt_asc' },
          ],
        }}
        filterConfig={{
          filterOptions: [
            { label: tCommon('all'), value: 'all' },
            {
              label: t('eventVolunteers.individuals'),
              value: 'individual',
            },
            { label: t('eventVolunteers.groups'), value: 'group' },
          ],
          defaultFilter: 'all',
          filterFunction: (rows, filterValue) => {
            if (filterValue === 'all') return rows;
            if (filterValue === 'individual') {
              return rows.filter((request) => !request.group);
            }
            if (filterValue === 'group') {
              return rows.filter((request) => request.group);
            }
            return rows;
          },
        }}
        emptyStateMessage={t('eventVolunteers.noRequests')}
        actionColumn={(row: InterfaceVolunteerMembership) => (
          <>
            <Button
              variant="success"
              size="sm"
              className={`${styles.iconButton} me-2 rounded`}
              data-testid="acceptBtn"
              onClick={() => updateMembershipStatus(row.id, 'accepted')}
            >
              <i className="fa fa-check" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="rejectBtn"
              onClick={() => updateMembershipStatus(row.id, 'rejected')}
            >
              <FaXmark size={18} />
            </Button>
          </>
        )}
      />
    </div>
  );
}

export default Requests;
