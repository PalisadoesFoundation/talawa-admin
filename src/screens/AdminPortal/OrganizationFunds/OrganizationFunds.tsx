import { useQuery } from '@apollo/client';
import {
  AccountBalanceWallet,
  Search,
  WarningAmberRounded,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { type GridCellParams } from 'shared-components/DataGridWrapper';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import TableLoader from 'components/TableLoader/TableLoader';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';
import FundModal from './modal/FundModal';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import type { InterfaceFundInfo } from 'utils/interfaces';
import {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from 'types/ReportingTable/interface';
import {
  PAGE_SIZE,
  ROW_HEIGHT,
  dataGridStyle as baseDataGridStyle,
} from 'types/ReportingTable/utils';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFunds.module.css';
import Button from 'shared-components/Button';

const dataGridStyle = {
  ...baseDataGridStyle,
  '& .MuiDataGrid-row': {
    ...baseDataGridStyle['& .MuiDataGrid-row'],
    cursor: 'pointer',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'var(--row-hover-bg)',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--row-hover-bg)',
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
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [fund, setFund] = useState<InterfaceFundInfo | null>(null);

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
    skip: !orgId,
    variables: {
      input: {
        id: orgId ?? '',
      },
    },
  });

  // Set the document title based on the translation
  useEffect(() => {
    document.title = t('funds.title');
  }, [t]);

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

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

      const sortMultiplier = -1; // Default to createdAt_DESC
      return (dateA - dateB) * sortMultiplier;
    });
  }, [funds, searchText]);

  const handleClick = (fundId: string): void => {
    navigate(`/admin/orgfundcampaign/${orgId}/${fundId}`);
  };

  if (fundError) {
    return (
      <div className={styles.whiteContainer}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.errorIconLarge}`}
          />
          <h6 className="fw-bold text-danger text-center">
            {t('funds.errorLoadingFundsData')}
            <br />
            {fundError.message}
          </h6>
        </div>
      </div>
    );
  }

  // Header titles for the funds table
  const headerTitles: string[] = [
    tCommon('hash'),
    t('funds.fundName'),
    tCommon('createdOn'),
    tCommon('status'),
    t('funds.associatedCampaigns'),
    tCommon('action'),
  ];

  const columns: ReportingTableColumn[] = [
    {
      field: 'sl_no',
      headerName: tCommon('hash'),
      flex: 1,
      minWidth: 60,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <span className={styles.requestsTableItemIndex}>
          {params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1}
        </span>
      ),
    },
    {
      field: 'fundName',
      headerName: t('funds.fundName'),
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return <div data-testid="fundName">{params.row.name}</div>;
      },
    },
    {
      field: 'createdAt',
      headerName: tCommon('createdOn'),
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: true,
      sortComparator: (v1, v2) => dayjs(v1).valueOf() - dayjs(v2).valueOf(),
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
      headerName: t('funds.status'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return params.row.isArchived ? t('funds.archived') : tCommon('active');
      },
    },
    {
      field: 'assocCampaigns',
      headerName: t('funds.assocCampaigns'),
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
            aria-label={t('funds.viewCampaigns')}
            onClick={() => handleClick(params.row.id as string)}
            data-testid="viewBtn"
          >
            <i className="fa fa-eye me-1" />
            {t('funds.viewCampaigns')}
          </Button>
        );
      },
    },
    {
      field: 'action',
      headerName: tCommon('action'),
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
            // className="me-2 rounded"
            className={styles.editButton}
            data-testid="editFundBtn"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(params.row as InterfaceFundInfo, 'edit');
            }}
          >
            <i className="fa fa-edit me-1" />
            {t('funds.editFund')}
          </Button>
        );
      },
    },
  ];

  const gridProps: ReportingTableGridProps = {
    sx: { ...dataGridStyle },
    paginationMode: 'client',
    getRowId: (row: InterfaceFundInfo) => row.id,
    rowCount: filteredAndSortedFunds.length,
    pageSizeOptions: [PAGE_SIZE],
    loading: fundLoading,
    hideFooter: true,
    slots: {
      noRowsOverlay: () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {t('funds.noFundsFound')}
        </Stack>
      ),
    },
    getRowClassName: () => `${styles.rowBackground} ${styles.overflowVisible}`,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    rowHeight: ROW_HEIGHT,
    autoHeight: true,
    onRowClick: (params: { row: { id: string } }) =>
      handleClick(params.row.id as string),
  };

  return (
    <div>
      <div className={styles.searchContainerRowNoTopMargin}>
        <SearchFilterBar
          searchPlaceholder={t('funds.searchFunds')}
          searchValue={searchText}
          onSearchChange={(value) => setSearchText(value.trim())}
          onSearchSubmit={(value: string) => {
            setSearchText(value.trim());
          }}
          searchInputTestId="searchByName"
          searchButtonTestId="searchButton"
          hasDropdowns={false}
        />

        <Button
          variant="success"
          onClick={() => handleOpenModal(null, 'create')}
          className={`${styles.createFundButton} ${styles.buttonNoWrap}`}
          data-testid="createFundBtn"
        >
          <i className="fa fa-plus me-2" aria-hidden="true" />
          {t('funds.createFund')}
        </Button>
      </div>

      {!fundLoading &&
      fundData &&
      filteredAndSortedFunds.length === 0 &&
      searchText.length > 0 ? (
        <EmptyState
          icon={<Search />}
          message="noResultsFound"
          description={tCommon('noResultsFoundFor', {
            query: `"${searchText}"`,
          })}
          dataTestId="funds-search-empty"
        />
      ) : !fundLoading && fundData && filteredAndSortedFunds.length === 0 ? (
        <EmptyState
          icon={<AccountBalanceWallet />}
          message={t('funds.noFundsFound')}
          dataTestId="funds-empty"
        />
      ) : (
        <div className={styles.listBox}>
          {fundLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
          ) : (
            <ReportingTable
              rows={
                filteredAndSortedFunds.map((fund) => ({
                  ...fund,
                })) as ReportingRow[]
              }
              columns={columns}
              gridProps={gridProps}
              listProps={{
                loader: <TableLoader noOfCols={6} noOfRows={2} />,
                className: `${styles.listTable} ${styles.overflowVisible}`,
                ['data-testid']: 'funds-list',
                scrollThreshold: 0.9,
                endMessage:
                  filteredAndSortedFunds.length > 0 ? (
                    <div className={'w-100 text-center my-4'}>
                      <h5 className="m-0">{tCommon('endOfResults')}</h5>
                    </div>
                  ) : null,
              }}
            />
          )}
        </div>
      )}

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
