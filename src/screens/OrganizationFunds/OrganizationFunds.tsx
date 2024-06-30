import { useQuery } from '@apollo/client';
import { Search, Sort, WarningAmberRounded } from '@mui/icons-material';
import Loader from 'components/Loader/Loader';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { InterfaceFundInfo } from 'utils/interfaces';
import FundModal from './FundModal';
import styles from './OrganizationFunds.module.css';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import FundDeleteModal from './FundDeleteModal';

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

enum Modal {
  SAME = 'same',
  DELETE = 'delete',
}

const organizationFunds = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'funds',
  });
  const { t: tCommon } = useTranslation('common');

  const { orgId } = useParams();
  const navigate = useNavigate();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const [fund, setFund] = useState<InterfaceFundInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );

  const [modalState, setModalState] = useState<{ [key in Modal]: boolean }>({
    [Modal.SAME]: false,
    [Modal.DELETE]: false,
  });
  const [fundModalMode, setFundModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const openModal = (modal: Modal): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: Modal): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleOpenModal = useCallback(
    (fund: InterfaceFundInfo | null, mode: 'edit' | 'create'): void => {
      setFund(fund);
      setFundModalMode(mode);
      openModal(Modal.SAME);
    },
    [openModal],
  );

  const {
    data: fundData,
    loading: fundLoading,
    error: fundError,
    refetch: refetchFunds,
  }: {
    data?: {
      fundsByOrganization: InterfaceFundInfo[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(FUND_LIST, {
    variables: {
      organizationId: orgId,
      filter: searchTerm,
      orderBy: sortBy,
    },
  });

  const handleDeleteClick = useCallback(
    (fund: InterfaceFundInfo): void => {
      setFund(fund);
      openModal(Modal.DELETE);
    },
    [openModal],
  );

  const funds = useMemo(() => fundData?.fundsByOrganization ?? [], [fundData]);

  const handleClick = (fundId: string): void => {
    navigate(`/orgfundcampaign/${orgId}/${fundId}`);
  };

  if (fundLoading) {
    return <Loader size="xl" />;
  }
  if (fundError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Funds
            <br />
            {fundError.message}
          </h6>
        </div>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.id}</div>;
      },
    },
    {
      field: 'fundName',
      headerName: 'Fund Name',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="fundName"
            onClick={() => handleClick(params.row._id as string)}
          >
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return params.row.creator.firstName + ' ' + params.row.creator.lastName;
      },
    },
    {
      field: 'createdOn',
      headerName: 'Created On',
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 2,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="createdOn">
            {dayjs(params.row.createdAt).format('DD/MM/YYYY')}
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return params.row.isArchived ? 'Archived' : 'Active';
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 2,
      align: 'center',
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
              className="me-2 rounded"
              data-testid="editFundBtn"
              onClick={() =>
                handleOpenModal(params.row as InterfaceFundInfo, 'edit')
              }
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteFundBtn"
              onClick={() => handleDeleteClick(params.row as InterfaceFundInfo)}
            >
              <i className="fa fa-trash" />
            </Button>
          </>
        );
      },
    },
    {
      field: 'assocCampaigns',
      headerName: 'Associated Campaigns',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            variant="outline-success"
            size="sm"
            className="rounded"
            onClick={() => handleClick(params.row._id as string)}
            data-testid="viewBtn"
          >
            <i className="fa fa-eye me-1" />
            {t('viewCampaigns')}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchByName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchByName"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center`}
            style={{ marginBottom: '9px' }}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className="d-flex gap-4 mb-1">
          <div className="d-flex justify-space-between align-items-center">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="filter"
              >
                <Sort className={'me-1'} />
                {tCommon('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSortBy('createdAt_DESC')}
                  data-testid="createdAt_DESC"
                >
                  {t('createdLatest')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('createdAt_ASC')}
                  data-testid="createdAt_ASC"
                >
                  {t('createdEarliest')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Button
              variant="success"
              onClick={() => handleOpenModal(null, 'create')}
              style={{ marginTop: '11px' }}
              data-testid="createFundBtn"
            >
              <i className={'fa fa-plus me-2'} />
              {t('createFund')}
            </Button>
          </div>
        </div>
      </div>

      <DataGrid
        disableColumnMenu
        columnBuffer={7}
        hideFooter={true}
        getRowId={(row) => row._id}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noFundsFound')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={funds.map((fund, index) => ({
          id: index + 1,
          ...fund,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />
      <FundModal
        isOpen={modalState[Modal.SAME]}
        hide={() => closeModal(Modal.SAME)}
        refetchFunds={refetchFunds}
        fund={fund}
        orgId={orgId}
        mode={fundModalMode}
      />

      <FundDeleteModal
        isOpen={modalState[Modal.DELETE]}
        hide={() => closeModal(Modal.DELETE)}
        fund={fund}
        refetchFunds={refetchFunds}
      />
    </div>
  );
};

export default organizationFunds;
