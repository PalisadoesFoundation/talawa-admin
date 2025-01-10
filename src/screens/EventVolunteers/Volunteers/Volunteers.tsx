import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';

import { Circle, Search, WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, debounce, Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import styles from '../../../style/app.module.css';
import { EVENT_VOLUNTEER_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import VolunteerCreateModal from './VolunteerCreateModal';
import VolunteerDeleteModal from './VolunteerDeleteModal';
import VolunteerViewModal from './VolunteerViewModal';
import SortingButton from 'subComponents/SortingButton';

enum VolunteerStatus {
  All = 'all',
  Pending = 'pending',
  Accepted = 'accepted',
}

enum ModalState {
  ADD = 'add',
  DELETE = 'delete',
  VIEW = 'view',
}

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
 * Component for managing and displaying event volunteers related to an event.
 *
 * This component allows users to view, filter, sort, and create volunteers. It also handles fetching and displaying related data such as volunteer acceptance status, etc.
 *
 * @returns The rendered component.
 */
function volunteers(): JSX.Element {
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

  const [volunteer, setVolunteer] =
    useState<InterfaceEventVolunteerInfo | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'hoursVolunteered_ASC' | 'hoursVolunteered_DESC' | null
  >(null);
  const [status, setStatus] = useState<VolunteerStatus>(VolunteerStatus.All);
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
    data: volunteersData,
    loading: volunteersLoading,
    error: volunteersError,
    refetch: refetchVolunteers,
  }: {
    data?: {
      getEventVolunteers: InterfaceEventVolunteerInfo[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(EVENT_VOLUNTEER_LIST, {
    variables: {
      where: {
        eventId: eventId,
        hasAccepted:
          status === VolunteerStatus.All
            ? undefined
            : status === VolunteerStatus.Accepted,
        name_contains: searchTerm,
      },
      orderBy: sortBy,
    },
  });

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const volunteers = useMemo(
    () => volunteersData?.getEventVolunteers || [],
    [volunteersData],
  );

  if (volunteersLoading) {
    return <Loader size="xl" />;
  }

  if (volunteersError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Volunteers' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'volunteer',
      headerName: 'Volunteer',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        const { _id, firstName, lastName, image } = params.row.user;
        return (
          <div
            className="d-flex fw-bold align-items-center justify-content-center ms-2"
            data-testid="volunteerName"
          >
            {image ? (
              <img
                src={image}
                alt="volunteer"
                data-testid="volunteer_image"
                className={styles.TableImages}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={_id + '1'}
                  dataTestId="volunteer_avatar"
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
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Chip
            icon={<Circle className={styles.chipIcon} />}
            label={params.row.hasAccepted ? 'Accepted' : 'Pending'}
            variant="outlined"
            color="primary"
            className={`${styles.chip} ${params.row.hasAccepted ? styles.active : styles.pending}`}
          />
        );
      },
    },
    {
      field: 'hours',
      headerName: 'Hours Volunteered',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeaders}`,
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
    {
      field: 'actionItem',
      headerName: 'Actions Completed',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeaders}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="actionNos"
          >
            {params.row.assignments.length}
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
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              style={{ minWidth: '32px' }}
              className="me-2 rounded"
              data-testid="viewItemBtn"
              onClick={() => handleOpenModal(params.row, ModalState.VIEW)}
            >
              <i className="fa fa-info" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteItemBtn"
              onClick={() => handleOpenModal(params.row, ModalState.DELETE)}
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
                {
                  label: t('mostHoursVolunteered'),
                  value: 'hoursVolunteered_DESC',
                },
                {
                  label: t('leastHoursVolunteered'),
                  value: 'hoursVolunteered_ASC',
                },
              ]}
              selectedOption={sortBy ?? ''}
              onSortChange={(value) =>
                setSortBy(
                  value as 'hoursVolunteered_DESC' | 'hoursVolunteered_ASC',
                )
              }
              dataTestIdPrefix="sort"
              buttonLabel={tCommon('sort')}
            />

            <SortingButton
              type="filter"
              sortingOptions={[
                { label: tCommon('all'), value: VolunteerStatus.All },
                { label: tCommon('pending'), value: VolunteerStatus.Pending },
                { label: t('accepted'), value: VolunteerStatus.Accepted },
              ]}
              selectedOption={status}
              onSortChange={(value) => setStatus(value as VolunteerStatus)}
              dataTestIdPrefix="filter"
              buttonLabel={t('status')}
            />
          </div>
          <div>
            <Button
              variant="success"
              onClick={() => handleOpenModal(null, ModalState.ADD)}
              style={{ marginTop: '11px' }}
              data-testid="addVolunteerBtn"
            >
              <i className={'fa fa-plus me-2'} />
              {t('add')}
            </Button>
          </div>
        </div>
      </div>

      {/* Table with Volunteers */}
      <DataGrid
        disableColumnMenu
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noVolunteers')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackgrounds}`}
        autoHeight
        rowHeight={65}
        rows={volunteers.map((volunteer, index) => ({
          id: index + 1,
          ...volunteer,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />

      <VolunteerCreateModal
        isOpen={modalState[ModalState.ADD]}
        hide={() => closeModal(ModalState.ADD)}
        eventId={eventId}
        orgId={orgId}
        refetchVolunteers={refetchVolunteers}
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
          />
        </>
      )}
    </div>
  );
}

export default volunteers;
