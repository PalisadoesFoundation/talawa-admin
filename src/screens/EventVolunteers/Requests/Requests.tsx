/**
 * @file Requests.tsx
 * @description This component renders a table displaying volunteer membership requests for a specific event.
 * It allows administrators to search, sort, and manage these requests by accepting or rejecting them.
 *
 * @module Requests
 *
 * @requires react
 * @requires react-i18next
 * @requires react-bootstrap
 * @requires react-router-dom
 * @requires @apollo/client
 * @requires @mui/x-data-grid
 * @requires dayjs
 * @requires react-toastify
 * @requires components/Loader/Loader
 * @requires components/Avatar/Avatar
 * @requires subComponents/SortingButton
 * @requires subComponents/SearchBar
 * @requires GraphQl/Queries/EventVolunteerQueries
 * @requires GraphQl/Mutations/EventVolunteerMutation
 * @requires utils/interfaces
 *
 * @function requests
 * @returns {JSX.Element} A React component that displays a searchable and sortable table of volunteer membership requests.
 *
 * @remarks
 * - Displays a loader while fetching data and handles errors gracefully.
 * - Uses Apollo Client's `useQuery` to fetch data and `useMutation` to update membership status.
 * - Provides search functionality with debouncing and sorting options.
 * - Displays volunteer details, request date, and action buttons for accepting or rejecting requests.
 * - Redirects to the home page if `orgId` or `eventId` is missing in the URL parameters.
 *
 * @example
 * <Requests />
 */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { Navigate, useParams } from 'react-router';
import { FaXmark } from 'react-icons/fa6';
import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import Avatar from 'components/Avatar/Avatar';
import styles from '../../../style/app-fixed.module.css';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceVolunteerMembership } from 'utils/interfaces';
import dayjs from 'dayjs';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { toast } from 'react-toastify';
import { debounce } from '@mui/material';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

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

function requests(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'createdAt_ASC' | 'createdAt_DESC' | null
  >(null);
  const [filterBy, setFilterBy] = useState<'all' | 'individual' | 'group'>(
    'all',
  );

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const [updateMembership] = useMutation(UPDATE_VOLUNTEER_MEMBERSHIP);

  const updateMembershipStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
  ): Promise<void> => {
    try {
      await updateMembership({ variables: { id: id, status: status } });
      toast.success(
        t(
          status === 'accepted' ? 'requestAccepted' : 'requestRejected',
        ) as string,
      );
      refetchRequests();
    } catch (error: unknown) {
      toast.error((error as Error).message);
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
        userName: searchTerm ? searchTerm : undefined,
      },
      orderBy: sortBy ? sortBy : undefined,
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

  // loads the requests when the component mounts
  if (requestsLoading) return <Loader size="xl" />;
  if (requestsError) {
    // Displays an error message if there is an issue loading the requests
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Volunteership Requests' })}
          </h6>
        </div>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'srNo',
      headerName: 'Sr. No.',
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
      headerName: 'Volunteer',
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
                alt="volunteer"
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
      headerName: 'Request Type',
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
              {group ? t('groups') : t('individuals')}
            </span>
            {group && <small className="text-muted">{group.name}</small>}
          </div>
        );
      },
    },
    {
      field: 'requestDate',
      headerName: 'Request Date',
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
      headerName: 'Options',
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
              style={{ minWidth: '32px' }}
              className="me-2 rounded"
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
              <FaXmark size={18} fontWeight={900} />
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
          placeholder={tCommon('searchBy', { item: 'Name' })}
          onSearch={debouncedSearch}
          inputTestId="searchBy"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-3 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <SortingButton
              sortingOptions={[
                { label: t('latest'), value: 'createdAt_DESC' },
                { label: t('earliest'), value: 'createdAt_ASC' },
              ]}
              selectedOption={sortBy ?? ''}
              onSortChange={(value) =>
                setSortBy(value as 'createdAt_DESC' | 'createdAt_ASC')
              }
              dataTestIdPrefix="sort"
              buttonLabel={tCommon('sort')}
            />

            <SortingButton
              type="filter"
              sortingOptions={[
                { label: tCommon('all'), value: 'all' },
                { label: t('individuals'), value: 'individual' },
                { label: t('groups'), value: 'group' },
              ]}
              selectedOption={filterBy}
              onSortChange={(value) =>
                setFilterBy(value as 'all' | 'individual' | 'group')
              }
              dataTestIdPrefix="filter"
              buttonLabel={tCommon('filter')}
            />
          </div>
        </div>
      </div>

      {/* Table with Volunteer Membership Requests */}

      {requests.length > 0 ? (
        <DataGrid
          disableColumnMenu
          columnBufferPx={5}
          hideFooter={true}
          getRowId={(row) => row.id}
          sx={dataGridStyle}
          getRowClassName={() => `${styles.rowBackgrounds}`}
          autoHeight
          rowHeight={65}
          rows={requests}
          columns={columns}
          isRowSelectable={() => false}
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <h5>{t('noRequests')}</h5>
        </div>
      )}
    </div>
  );
}

export default requests;
