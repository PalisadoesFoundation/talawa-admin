import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';

import {
  Circle,
  FilterAltOutlined,
  Search,
  Sort,
  WarningAmberRounded,
} from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import styles from '../EventVolunteers.module.css';
import { EVENT_VOLUNTEER_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import VolunteerCreateModal from './VolunteerCreateModal';
import VolunteerDeleteModal from './VolunteerDeleteModal';
import VolunteerViewModal from './VolunteerViewModal';

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
 * Component for managing and displaying action items within an organization.
 *
 * This component allows users to view, filter, sort, and create action items. It also handles fetching and displaying related data such as action item categories and members.
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
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { _id, firstName, lastName, image } = params.row.user;
        return (
          <div
            className="d-flex fw-bold align-items-center justify-content-center ms-2"
            data-testid="assigneeName"
          >
            {image ? (
              <img
                src={image}
                alt="volunteer"
                data-testid={`image${_id + 1}`}
                className={styles.TableImage}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={_id + '1'}
                  containerStyle={styles.imageContainer}
                  avatarStyle={styles.TableImage}
                  name={firstName + ' ' + lastName}
                  alt={firstName + ' ' + lastName}
                />
              </div>
            )}
            {params.row.user.firstName + ' ' + params.row.user.lastName}
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
      headerClassName: `${styles.tableHeader}`,
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
    {
      field: 'actionItem',
      headerName: 'Actions Completed',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
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
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              style={{ minWidth: '32px' }}
              className="me-2 rounded"
              data-testid={`viewItemBtn${params.row.id}`}
              onClick={() => handleOpenModal(params.row, ModalState.VIEW)}
            >
              <i className="fa fa-info" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid={`deleteItemBtn${params.row.id}`}
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
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchBy', {
              item: 'Name',
            })}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setSearchTerm(searchValue);
              } else if (e.key === 'Backspace' && searchValue === '') {
                setSearchTerm('');
              }
            }}
            data-testid="searchBy"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center`}
            onClick={() => setSearchTerm(searchValue)}
            style={{ marginBottom: '10px' }}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className="d-flex gap-3 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                className={styles.dropdown}
                data-testid="sort"
              >
                <Sort className={'me-1'} />
                {tCommon('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSortBy('hoursVolunteered_DESC')}
                  data-testid="hoursVolunteered_DESC"
                >
                  {t('mostHoursVolunteered')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('hoursVolunteered_ASC')}
                  data-testid="hoursVolunteered_ASC"
                >
                  {t('leastHoursVolunteered')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                className={styles.dropdown}
                data-testid="filter"
              >
                <FilterAltOutlined className={'me-1'} />
                {t('status')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setStatus(VolunteerStatus.All)}
                  data-testid="statusAll"
                >
                  {tCommon('all')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setStatus(VolunteerStatus.Pending)}
                  data-testid="statusPending"
                >
                  {tCommon('pending')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setStatus(VolunteerStatus.Accepted)}
                  data-testid="statusAccepted"
                >
                  {t('accepted')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
        getRowClassName={() => `${styles.rowBackground}`}
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

      <VolunteerDeleteModal
        isOpen={modalState[ModalState.DELETE]}
        hide={() => closeModal(ModalState.DELETE)}
        volunteer={volunteer}
        refetchVolunteers={refetchVolunteers}
      />
      {volunteer && (
        <VolunteerViewModal
          isOpen={modalState[ModalState.VIEW]}
          hide={() => closeModal(ModalState.VIEW)}
          volunteer={volunteer}
        />
      )}
    </div>
  );
}

export default volunteers;
