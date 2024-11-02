import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';

import { Search, Sort, WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';

import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { debounce, Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import styles from '../EventVolunteers.module.css';
import { EVENT_VOLUNTEER_GROUP_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import VolunteerGroupModal from './VolunteerGroupModal';
import VolunteerGroupDeleteModal from './VolunteerGroupDeleteModal';
import VolunteerGroupViewModal from './VolunteerGroupViewModal';

enum ModalState {
  SAME = 'same',
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
 * Component for managing volunteer groups for an event.
 * This component allows users to view, filter, sort, and create action items. It also provides a modal for creating and editing action items.
 * @returns The rendered component.
 */
function volunteerGroups(): JSX.Element {
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

  const [group, setGroup] = useState<InterfaceVolunteerGroupInfo | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'volunteers_ASC' | 'volunteers_DESC' | null
  >(null);
  const [searchBy, setSearchBy] = useState<'leader' | 'group'>('group');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
    [ModalState.VIEW]: false,
  });

  /**
   * Query to fetch the list of volunteer groups for the event.
   */
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  }: {
    data?: {
      getEventVolunteerGroups: InterfaceVolunteerGroupInfo[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(EVENT_VOLUNTEER_GROUP_LIST, {
    variables: {
      where: {
        eventId: eventId,
        leaderName: searchBy === 'leader' ? searchTerm : null,
        name_contains: searchBy === 'group' ? searchTerm : null,
      },
      orderBy: sortBy,
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

  const groups = useMemo(
    () => groupsData?.getEventVolunteerGroups || [],
    [groupsData],
  );

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
        const { _id, firstName, lastName, image } = params.row.leader;
        return (
          <div
            className="d-flex fw-bold align-items-center ms-2"
            data-testid="assigneeName"
          >
            {image ? (
              <img
                src={image}
                alt="Assignee"
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
            {firstName + ' ' + lastName}
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions Completed',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex justify-content-center fw-bold">
            {params.row.assignments.length}
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
            {params.row.volunteers.length}
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
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchBy', {
              item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
            })}
            autoComplete="off"
            required
            className={styles.inputField}
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
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="searchByToggle"
              >
                <Sort className={'me-1'} />
                {tCommon('searchBy', { item: '' })}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSearchBy('leader')}
                  data-testid="leader"
                >
                  {t('leader')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSearchBy('group')}
                  data-testid="group"
                >
                  {t('group')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="sort"
              >
                <Sort className={'me-1'} />
                {tCommon('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSortBy('volunteers_DESC')}
                  data-testid="volunteers_DESC"
                >
                  {t('mostVolunteers')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('volunteers_ASC')}
                  data-testid="volunteers_ASC"
                >
                  {t('leastVolunteers')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Button
              variant="success"
              onClick={() => handleModalClick(null, ModalState.SAME)}
              style={{ marginTop: '11px' }}
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
        getRowId={(row) => row._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noVolunteerGroups')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={groups.map((group, index) => ({
          id: index + 1,
          ...group,
        }))}
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
          />
        </>
      )}
    </div>
  );
}

export default volunteerGroups;
