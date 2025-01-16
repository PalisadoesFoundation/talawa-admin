import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import { Search, WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import Avatar from 'components/Avatar/Avatar';
import styles from '../../../style/app.module.css';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceVolunteerMembership } from 'utils/interfaces';
import dayjs from 'dayjs';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { toast } from 'react-toastify';
import { debounce } from '@mui/material';
import SortingButton from 'subComponents/SortingButton';

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.5rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.5rem',
  },
};

/**
 * Component for managing and displaying Volunteer Membership requests for an event.
 *
 * This component allows users to view, filter, sort, and create action items. It also allows users to accept or reject volunteer membership requests.
 *
 * @returns The rendered component.
 */
function requests(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId, eventId } = useParams();

  if (!orgId || !eventId) {
    return <Navigate to={'/'} replace />;
  }

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'createdAt_ASC' | 'createdAt_DESC' | null
  >(null);

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
      await updateMembership({
        variables: {
          id: id,
          status: status,
        },
      });
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
    data?: {
      getVolunteerMembership: InterfaceVolunteerMembership[];
    };
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
    return requestsData.getVolunteerMembership;
  }, [requestsData]);

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
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        return params.row.id;
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
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        const { firstName, lastName, image } = params.row.volunteer.user;
        return (
          <div
            className="d-flex fw-bold align-items-center justify-content-center ms-2"
            data-testid="volunteerName"
          >
            {image ? (
              <img
                src={image}
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
                  name={firstName + ' ' + lastName}
                  alt={firstName + ' ' + lastName}
                />
              </div>
            )}
            {firstName + ' ' + lastName}
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
      headerClassName: `${styles.tableHeaders}`,
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
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              style={{ minWidth: '32px' }}
              className="me-2 rounded"
              data-testid="acceptBtn"
              onClick={() => updateMembershipStatus(params.row._id, 'accepted')}
            >
              <i className="fa fa-check" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid={`rejectBtn`}
              onClick={() => updateMembershipStatus(params.row._id, 'rejected')}
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
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchBy', {
              item: 'Name',
            })}
            autoComplete="off"
            required
            className={styles.inputFields}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            data-testid="searchBy"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center`}
            style={{ marginBottom: '10px' }}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
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
          </div>
        </div>
      </div>

      {/* Table with Volunteer Membership Requests */}

      {requests.length > 0 ? (
        <DataGrid
          disableColumnMenu
          columnBufferPx={5}
          hideFooter={true}
          getRowId={(row) => row._id}
          sx={dataGridStyle}
          getRowClassName={() => `${styles.rowBackgrounds}`}
          autoHeight
          rowHeight={65}
          rows={requests.map((request, index) => ({
            id: index + 1,
            ...request,
          }))}
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
