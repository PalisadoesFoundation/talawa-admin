import { useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import {
  Stack,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  CircularProgress,
} from '@mui/material';
import { type GridCellParams } from '@mui/x-data-grid';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import TableLoader from 'components/TableLoader/TableLoader';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';
import CampaignModal from './modal/CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import styles from '../../style/app-fixed.module.css';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from 'types/ReportingTable/interface';
import { PAGE_SIZE, ROW_HEIGHT } from 'types/ReportingTable/utils';

const dataGridStyle = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--row-background)',
  '& .MuiDataGrid-row': {
    backgroundColor: 'var(--row-background)',
    cursor: 'pointer',
    '&:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#f0f0f0',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: '#f0f0f0',
  },
  '& .MuiDataGrid-cell:focus': { outline: 'none' },
  '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
};

/**
 * `orgFundCampaign` component displays a list of fundraising campaigns for a specific fund within an organization.
 * It allows users to search, sort, view and edit campaigns.
 *
 * ### Functionality
 * - Displays a data grid with campaigns information, including their names, start and end dates, funding goals, and actions.
 * - Provides search functionality to filter campaigns by name.
 * - Offers sorting options based on funding goal and end date.
 * - Opens modals for creating or editing campaigns.
 *
 *
 * ### State
 * - `campaign`: The current campaign being edited or deleted.
 * - `searchTerm`: The term used for searching campaigns by name.
 * - `modalState`: An object indicating the visibility of different modals (`same` for create/edit).
 * - `campaignModalMode`: Determines if the modal is in 'edit' or 'create' mode.
 *
 * ### Methods
 * - `handleOpenModal(campaign: InterfaceCampaignInfo | null, mode: 'edit' | 'create')`: Opens the modal for creating or editing a campaign.
 * - `handleClick(campaignId: string)`: Navigates to the pledge details page for a specific campaign.
 *
 * ### GraphQL Queries
 * - Uses `FUND_CAMPAIGN` query to fetch the list of campaigns based on the provided fund ID, search term, and sorting criteria.
 *
 * ### Rendering
 * - Renders a `ReportingTable` component with campaigns information.
 * - Displays modals for creating and editing campaigns.
 * - Shows error and loading states using `Loader` and error message components.
 *
 * @returns The rendered component including breadcrumbs, search and filter controls, data grid, and modals.
 */
const orgFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  const { fundId, orgId } = useParams();

  const [campaign, setCampaign] = useState<InterfaceCampaignInfo | null>(null);
  const [searchText, setSearchText] = useState('');

  const [modalState, setModalState] = useState<boolean>(false);
  const [campaignModalMode, setCampaignModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const handleOpenModal = useCallback(
    (campaign: InterfaceCampaignInfo | null, mode: 'edit' | 'create'): void => {
      setCampaign(campaign);
      setCampaignModalMode(mode);
      setModalState(true);
    },
    [],
  );

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaign,
  }: {
    data?: {
      fund: InterfaceQueryOrganizationFundCampaigns;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(FUND_CAMPAIGN, {
    variables: {
      input: { id: fundId },
    },
    skip: !fundId,
  });

  const campaignsData = useMemo(() => {
    return campaignData?.fund?.campaigns?.edges.map((edge) => edge.node) ?? [];
  }, [campaignData]);

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaignsData, searchText]);

  const handleClick = (campaignId: string): void => {
    navigate(`/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const { fundName, isArchived } = useMemo(() => {
    const fundName = campaignData?.fund?.name || 'Fund';
    const isArchived = false;
    return { fundName, isArchived };
  }, [campaignData]);

  if (!fundId || !orgId) {
    return <Navigate to={'/'} />;
  }

  if (campaignLoading) {
    return <Loader size="xl" />;
  }
  if (campaignError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Campaigns
            <br />
            {campaignError.message}
          </h6>
        </div>
      </div>
    );
  }

  // Header titles for the table loader
  const headerTitles: string[] = [
    '#',
    t('campaignName'),
    t('startDate'),
    t('endDate'),
    t('fundingGoal'),
    t('raised'),
    t('progress'),
    tCommon('action'),
  ];

  const columns: ReportingTableColumn[] = [
    {
      field: 'id',
      headerName: '#',
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
      field: 'name',
      headerName: 'Campaign Name',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div
          className={styles.hyperlinkText}
          data-testid="campaignName"
          onClick={() => handleClick(params.row.id as string)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(params.row.id as string);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {params.row.name}
        </div>
      ),
    },
    {
      field: 'startAt',
      headerName: 'Start Date',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: true,
      sortComparator: (v1, v2) => dayjs(v1).valueOf() - dayjs(v2).valueOf(),
      renderCell: (params: GridCellParams) =>
        dayjs(params.row.startAt).format('DD/MM/YYYY'),
    },
    {
      field: 'endAt',
      headerName: 'End Date',
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      sortable: true,
      sortComparator: (v1, v2) => dayjs(v1).valueOf() - dayjs(v2).valueOf(),
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="endDateCell">
            {dayjs(params.row.endAt).format('DD/MM/YYYY')}{' '}
          </div>
        );
      },
    },
    {
      field: 'goalAmount',
      headerName: 'Fund Goal',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: true,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="goalCell"
          >
            {
              currencySymbols[
              params.row.currencyCode as keyof typeof currencySymbols
              ]
            }
            {params.row.goalAmount as number}
          </div>
        );
      },
    },
    {
      field: 'fundingRaised',
      headerName: 'Raised',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="raisedCell"
          >
            {
              currencySymbols[
              params.row.currencyCode as keyof typeof currencySymbols
              ]
            }
            0
          </div>
        );
      },
    },
    {
      field: 'percentageRaised',
      headerName: '% Raised',
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const raised = 0; // Currently hardcoded, will be updated when actual data is available
        const goal = params.row.goalAmount as number;
        const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              height: '100%',
            }}
            data-testid="progressCell"
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={32}
                thickness={4}
                sx={{ color: '#e0e0e0' }}
              />
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={32}
                thickness={4}
                sx={{
                  color:
                    percentage >= 100
                      ? '#4caf50'
                      : percentage >= 50
                        ? '#ff9800'
                        : '#2196f3',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {percentage.toFixed(0)}%
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1.5,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <Button
          size="sm"
          className={styles.editButton}
          data-testid="editCampaignBtn"
          onClick={() =>
            handleOpenModal(params.row as InterfaceCampaignInfo, 'edit')
          }
        >
          <i className="fa fa-edit me-1" />
          {t('editCampaign')}
        </Button>
      ),
    },
  ];

  const gridProps: ReportingTableGridProps = {
    sx: { ...dataGridStyle },
    paginationMode: 'client',
    getRowId: (row: InterfaceCampaignInfo) => row.id,
    rowCount: filteredCampaigns.length,
    pageSizeOptions: [PAGE_SIZE],
    loading: campaignLoading,
    hideFooter: true,
    compactColumns: columns.length >= 7,
    slots: {
      noRowsOverlay: () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {t('noCampaignsFound')}
        </Stack>
      ),
    },
    getRowClassName: () => `${styles.rowBackgroundOrganizationFundCampaign}`,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    rowHeight: ROW_HEIGHT,
    autoHeight: true,
    style: { overflow: 'visible' },
    onRowClick: (params: { row: { id: string } }) =>
      handleClick(params.row.id as string),
  };

  return (
    <div className={styles.organizationFundCampaignContainer}>
      <Breadcrumbs aria-label="breadcrumb" className="ms-1">
        <Link
          underline="hover"
          color="inherit"
          component="button"
          data-testid="fundsLink"
          onClick={() => navigate(`/orgfunds/${orgId}`)}
        >
          {fundName}
        </Link>
        <Typography color="text.primary">{t('title')}</Typography>
      </Breadcrumbs>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          marginTop: '1rem',
        }}
      >
        <div className={styles.head} style={{ flex: 1, margin: 0 }}>
          <SearchBar
            placeholder={tCommon('searchByName')}
            value={searchText}
            onChange={(value) => setSearchText(value.trim())}
            onClear={() => setSearchText('')}
            showSearchButton={false}
            inputTestId="searchFullName"
            clearButtonTestId="clearSearch"
          />
        </div>
        <Button
          variant="success"
          onClick={() => handleOpenModal(null, 'create')}
          className={styles.createButton}
          style={{ whiteSpace: 'nowrap' }}
          data-testid="addCampaignBtn"
          disabled={isArchived}
        >
          <i className={'fa fa-plus me-2'} />
          {t('addCampaign')}
        </Button>
      </div>

      {!campaignLoading &&
        campaignData &&
        filteredCampaigns.length === 0 &&
        searchText.length > 0 ? (
        <div className={styles.notFound}>
          <h4 className="m-0">
            {tCommon('noResultsFoundFor')} &quot;{searchText}&quot;
          </h4>
        </div>
      ) : !campaignLoading &&
        campaignData &&
        filteredCampaigns.length === 0 ? (
        <div className={styles.notFound}>
          <h4>{t('noCampaignsFound')}</h4>
        </div>
      ) : (
        <div className={styles.listBox}>
          {campaignLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
          ) : (
            <ReportingTable
              rows={
                filteredCampaigns.map((campaign) => ({
                  ...campaign,
                })) as ReportingRow[]
              }
              columns={columns}
              gridProps={gridProps}
              listProps={{
                loader: <TableLoader noOfCols={8} noOfRows={2} />,
                className: styles.listTable,
                ['data-testid']: 'campaigns-list',
                scrollThreshold: 0.9,
                style: { overflow: 'visible' },
                endMessage:
                  filteredCampaigns.length > 0 ? (
                    <div className={'w-100 text-center my-4'}>
                      <h5 className="m-0">{tCommon('endOfResults')}</h5>
                    </div>
                  ) : null,
              }}
            />
          )}
        </div>
      )}

      {/* Create Campaign Modal */}
      <CampaignModal
        isOpen={modalState}
        hide={() => setModalState(false)}
        refetchCampaign={refetchCampaign}
        fundId={fundId}
        orgId={orgId}
        campaign={campaign}
        mode={campaignModalMode}
      />
    </div>
  );
};
export default orgFundCampaign;
