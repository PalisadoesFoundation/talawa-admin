import { useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { Stack } from '@mui/material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import FundModal from './modal/FundModal';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import styles from 'style/app-fixed.module.css';
import type { InterfaceFundInfo } from 'utils/interfaces';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

const dataGridStyle = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--row-background)',
  '& .MuiDataGrid-row': {
    backgroundColor: 'var(--row-background)',
    '&:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'var(--row-background)' },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--row-background)',
  },
  '& .MuiDataGrid-cell:focus': { outline: 'none' },
  '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
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
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.tableHeader`
 * - `.subtleBlueGrey`
 * - `.head`
 * - `.btnsContainer`
 * - `.input`
 * - `.inputField`
 * - `.searchButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
const organizationFunds = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'funds' });
  const { t: tCommon } = useTranslation('common');

  // Set the document title based on the translation
  document.title = t('title');

  const { orgId } = useParams();
  const navigate = useNavigate();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const [fund, setFund] = useState<InterfaceFundInfo | null>(null);
  // const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );

  const [modalState, setModalState] = useState<boolean>(false);
  const [fundModalMode, setFundModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const [searchText, setSearchText] = useState('');

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
      organization: {
        funds: {
          edges: { node: InterfaceFundInfo }[];
        };
      };
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(FUND_LIST, {
    variables: {
      input: {
        id: orgId,
      },
    },
  });

  const funds = useMemo(() => {
    return (
      fundData?.organization?.funds?.edges.map(
        (edge: { node: InterfaceFundInfo }) => edge.node,
      ) ?? []
    );
  }, [fundData]);

  const filteredAndSortedFunds = useMemo(() => {
    let result = [...funds];

    // Apply search filter
    if (searchText) {
      result = result.filter((fund) =>
        fund.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply sorting with strict timestamp comparison
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      const sortMultiplier = sortBy === 'createdAt_DESC' ? -1 : 1;
      return (dateA - dateB) * sortMultiplier;
    });
  }, [funds, searchText, sortBy]);

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
      headerName: '#',
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
            className={styles.hyperlinkText}
            data-testid="fundName"
            onClick={() => handleClick(params.row.id as string)}
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
        return params.row.creator.name;
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
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            size="sm"
            className={styles.editButton}
            onClick={() => handleClick(params.row.id as string)}
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
      <div className={styles.head}>
        <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
          <SearchBar
            placeholder={tCommon('searchByName')}
            inputTestId="searchByName"
            buttonTestId="searchBtn"
            onSearch={(text) => setSearchText(text)}
          />
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
              className={styles.dropdown}
            />
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
        getRowId={(row) => row.id}
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
        rows={filteredAndSortedFunds}
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
