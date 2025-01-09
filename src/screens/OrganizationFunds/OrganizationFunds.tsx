import { useQuery } from '@apollo/client';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import { Stack } from '@mui/material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import FundModal from './FundModal';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import styles from '../../style/app.module.css';
import type { InterfaceFundInfo } from 'utils/interfaces';
import SortingButton from 'subComponents/SortingButton';

const dataGridStyle = {
  borderRadius: '20px',
  backgroundColor: '#EAEBEF',
  '& .MuiDataGrid-row': {
    backgroundColor: '#eff1f7',
    '&:focus-within': {
      outline: '2px solid #000',
      outlineOffset: '-2px',
    },
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#EAEBEF',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: '#EAEBEF',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-cell:focus': {
    outline: '2px solid #000',
    outlineOffset: '-2px',
  },
};

/**
 * `organizationFunds` component displays a list of funds for a specific organization,
 * allowing users to search, sort, view and edit funds.
 *
 * This component utilizes the `DataGrid` from Material-UI to present the list of funds in a tabular format,
 * and includes functionality for filtering and sorting. It also handles the opening and closing of modals
 * for creating and editing.
 *
 * It includes:
 * - A search input field to filter funds by name.
 * - A dropdown menu to sort funds by creation date.
 * - A button to create a new fund.
 * - A table to display the list of funds with columns for fund details and actions.
 * - Modals for creating and editing funds.
 *
 * ### GraphQL Queries
 * - `FUND_LIST`: Fetches a list of funds for the given organization, filtered and sorted based on the provided parameters.
 *
 * ### Props
 * - `orgId`: The ID of the organization whose funds are being managed.
 *
 * ### State
 * - `fund`: The currently selected fund for editing or deletion.
 * - `searchTerm`: The current search term used for filtering funds.
 * - `sortBy`: The current sorting order for funds.
 * - `modalState`: The state of the modals (edit/create).
 * - `fundModalMode`: The mode of the fund modal (edit or create).
 *
 * ### Methods
 * - `handleOpenModal(fund: InterfaceFundInfo | null, mode: 'edit' | 'create')`: Opens the fund modal with the given fund and mode.
 * - `handleClick(fundId: string)`: Navigates to the campaign page for the specified fund.
 *
 * @returns The rendered component.
 */
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

  const [modalState, setModalState] = useState<boolean>(false);
  const [fundModalMode, setFundModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const handleOpenModal = useCallback(
    (fund: InterfaceFundInfo | null, mode: 'edit' | 'create'): void => {
      setFund(fund);
      setFundModalMode(mode);
      setModalState(true);
    },
    [],
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
      headerClassName: `${styles.tableHeaders}`,
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
      headerClassName: `${styles.tableHeaders}`,
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
      headerClassName: `${styles.tableHeaders}`,
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
      headerClassName: `${styles.tableHeaders}`,
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
      headerClassName: `${styles.tableHeaders}`,
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
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              // className="me-2 rounded"
              className={styles.editButton}
              data-testid="editFundBtn"
              onClick={() =>
                handleOpenModal(params.row as InterfaceFundInfo, 'edit')
              }
            >
              <i className="fa fa-edit" />
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
      headerClassName: `${styles.tableHeaders}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            size="sm"
            className={styles.editButton}
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
            className={styles.inputFields}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchByName"
          />
          <Button
            tabIndex={-1}
            className={`${styles.searchButton} `}
            style={{ marginBottom: '0px' }}
            data-testid="searchBtn"
          >
            <Search className={styles.searchIcon} />
          </Button>
        </div>
        <div className="d-flex gap-4 mb-1">
          <SortingButton
            title={tCommon('sort')}
            sortingOptions={[
              { label: t('createdLatest'), value: 'createdAt_DESC' },
              { label: t('createdEarliest'), value: 'createdAt_ASC' },
            ]}
            selectedOption={
              sortBy === 'createdAt_DESC'
                ? t('createdLatest')
                : t('createdEarliest')
            }
            onSortChange={(value) =>
              setSortBy(value as 'createdAt_DESC' | 'createdAt_ASC')
            }
            dataTestIdPrefix="filter"
            buttonLabel={tCommon('sort')}
          />
          <div>
            <Button
              variant="success"
              onClick={() => handleOpenModal(null, 'create')}
              className={styles.createButton}
              style={{ marginTop: '0px' }}
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
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noFundsFound')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackgrounds}`}
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
        isOpen={modalState}
        hide={() => setModalState(false)}
        refetchFunds={refetchFunds}
        fund={fund}
        orgId={orgId}
        mode={fundModalMode}
      />
    </div>
  );
};

export default organizationFunds;
