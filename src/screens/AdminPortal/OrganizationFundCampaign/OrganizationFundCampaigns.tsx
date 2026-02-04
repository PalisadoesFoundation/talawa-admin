import { useQuery } from '@apollo/client';
import { Campaign, Search, WarningAmberRounded } from '@mui/icons-material';
import { Typography, Box, CircularProgress } from '@mui/material';
import { type GridCellParams } from 'shared-components/DataGridWrapper';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import TableLoader from 'components/TableLoader/TableLoader';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';
import CampaignModal from './modal/CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from 'types/ReportingTable/interface';
import { PAGE_SIZE, ROW_HEIGHT } from 'types/ReportingTable/utils';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFundCampaigns.module.css';
import Button from 'shared-components/Button';

const dataGridStyle = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--row-background)',
  '& .MuiDataGrid-row': {
    backgroundColor: 'var(--row-background)',
    cursor: 'pointer',
    '&:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'var(--row-hover-bg)',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--row-hover-bg)',
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
  const { t: tErrors } = useTranslation('errors');
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
    navigate(`/admin/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const { fundName, isArchived } = useMemo(() => {
    const fundName = campaignData?.fund?.name || 'Fund';
    const isArchived = false;
    return { fundName, isArchived };
  }, [campaignData]);

  if (!fundId || !orgId) {
    return <Navigate to={'/'} />;
  }

  if (campaignError) {
    return (
      <div className={styles.whiteContainer}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.errorIconLarge}`}
          />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'campaign' })}
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
    tCommon('startDate'),
    tCommon('endDate'),
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
      headerName: t('campaignName'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div data-testid="campaignName">{params.row.name}</div>
      ),
    },
    {
      field: 'startAt',
      headerName: tCommon('startDate'),
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
      headerName: tCommon('endDate'),
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
      headerName: t('fundingGoal'),
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
      headerName: t('raised'),
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
            {params.row.fundingRaised ?? 0}
          </div>
        );
      },
    },
    {
      field: 'percentageRaised',
      headerName: t('percentageRaised'),
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const raised = params.row.fundingRaised ?? 0;
        const goal = params.row.goalAmount as number;
        const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

        return (
          <Box
            className={styles.progressCellContainer}
            data-testid="progressCell"
          >
            <Box className={styles.progressCircleContainer}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={32}
                thickness={4}
                className={styles.progressCircleBackground}
              />
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={32}
                thickness={4}
                aria-label={t('campaignProgress', {
                  percentage: percentage.toFixed(0),
                })}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
                className={`${styles.progressCircleForeground} ${
                  percentage >= 100
                    ? styles.progressComplete
                    : percentage >= 50
                      ? styles.progressHalf
                      : styles.progressLow
                }`}
              />
            </Box>
            <Typography variant="body2" className={styles.progressTypography}>
              {percentage.toFixed(0)}%
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'action',
      headerName: tCommon('action'),
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
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(params.row as InterfaceCampaignInfo, 'edit');
          }}
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
    getRowClassName: () =>
      `${styles.rowBackgroundOrganizationFundCampaign} ${styles.overflowVisible}`,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    rowHeight: ROW_HEIGHT,
    autoHeight: true,
    onRowClick: (params: { row: { id: string } }) =>
      handleClick(params.row.id as string),
  };

  return (
    <div className={styles.organizationFundCampaignContainer}>
      <BreadcrumbsComponent
        aria-label={tCommon('breadcrumb')}
        items={[
          {
            label: fundName,
            to: `/admin/orgfunds/${orgId}`,
          },
          {
            label: t('title'),
            to: `/admin/orgfunds/${orgId}/campaigns`,
          },
        ]}
      />
      <div className={styles.searchContainerRow}>
        <SearchFilterBar
          searchPlaceholder={t('searchCampaigns')}
          searchValue={searchText}
          onSearchChange={(value) => setSearchText(value.trim())}
          onSearchSubmit={(value: string) => {
            setSearchText(value.trim());
          }}
          searchInputTestId="searchFullName"
          searchButtonTestId="searchButton"
          hasDropdowns={false}
        />
        <Button
          variant="success"
          onClick={() => handleOpenModal(null, 'create')}
          className={`${styles.createButton} ${styles.buttonNoWrap} ${styles.buttonMarginReset}`}
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
        <EmptyState
          icon={<Search />}
          message="noResultsFound"
          description={tCommon('noResultsFoundFor', {
            query: `"${searchText}"`,
          })}
          dataTestId="campaigns-search-empty"
        />
      ) : !campaignLoading && campaignData && filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={<Campaign />}
          message={t('noCampaignsFound')}
          dataTestId="campaigns-empty"
        />
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
                className: `${styles.listTable} ${styles.overflowVisible}`,
                ['data-testid']: 'campaigns-list',
                scrollThreshold: 0.9,
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
