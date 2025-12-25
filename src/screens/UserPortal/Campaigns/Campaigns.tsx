/**
 * Campaigns Component
 *
 * This component renders a list of fundraising campaigns for a specific organization.
 * It provides functionality for searching, sorting, and viewing pledges for campaigns.
 * The component uses ReportingTable for consistent table display.
 *
 * @component
 */
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import { WarningAmberRounded } from '@mui/icons-material';
import { Stack, Box, CircularProgress, Typography } from '@mui/material';
import { type GridCellParams } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
import PledgeModal from './PledgeModal';
import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';
import { useQuery } from '@apollo/client';
import type { InterfaceUserCampaign } from 'utils/interfaces';
import { currencySymbols } from 'utils/currency';
import TableLoader from 'components/TableLoader/TableLoader';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import ReportingTable from 'shared-components/ReportingTable/ReportingTable';
import dayjs from 'dayjs';
import {
  ReportingRow,
  ReportingTableColumn,
  ReportingTableGridProps,
} from 'types/ReportingTable/interface';
import { PAGE_SIZE, ROW_HEIGHT } from 'types/ReportingTable/utils';
import EmptyState from 'shared-components/EmptyState/EmptyState';

const dataGridStyle = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--row-background)',
  '& .MuiDataGrid-row': {
    backgroundColor: 'var(--row-background)',
    '&:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'var(--row-background)',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--row-background)',
  },
  '& .MuiDataGrid-cell:focus': { outline: 'none' },
  '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
};

const Campaigns = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userCampaigns' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { getItem } = useLocalStorage();
  const userId = getItem('userId') as string;

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [selectedCampaign, setSelectedCampaign] =
    useState<InterfaceUserCampaign | null>(null);
  const [modalState, setModalState] = useState<boolean>(false);

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaigns,
  } = useQuery(USER_FUND_CAMPAIGNS, {
    variables: {
      input: { id: orgId as string },
    },
    fetchPolicy: 'cache-first',
    skip: !orgId || !userId,
  });

  if (!orgId || !userId) {
    return <Navigate to={'/'} replace />;
  }

  const openModal = useCallback((campaign: InterfaceUserCampaign): void => {
    setSelectedCampaign(campaign);
    setModalState(true);
  }, []);

  const closeModal = useCallback((): void => {
    setModalState(false);
    setSelectedCampaign(null);
  }, []);

  const campaigns = useMemo(() => {
    if (!campaignData?.organization?.funds?.edges) {
      return [];
    }

    const allCampaigns: InterfaceUserCampaign[] =
      campaignData.organization.funds.edges
        .flatMap(
          (fundEdge: { node: { campaigns?: { edges: unknown[] } } }) =>
            fundEdge?.node?.campaigns?.edges ?? [],
        )
        .map(
          ({
            node: campaign,
          }: {
            node: {
              id: string;
              name: string;
              currencyCode: string;
              goalAmount: number;
              startAt: string;
              endAt: string;
            };
          }) => ({
            _id: campaign.id,
            name: campaign.name,
            fundingGoal: campaign.goalAmount,
            startDate: new Date(campaign.startAt),
            endDate: new Date(campaign.endAt),
            currency: campaign.currencyCode,
          }),
        );

    return allCampaigns;
  }, [campaignData]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaigns, searchText]);

  if (campaignError) {
    return (
      <div className={styles.whiteContainer}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.errorIconLarge}`}
          />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Campaigns' })}
            <br />
            {campaignError.message}
          </h6>
        </div>
      </div>
    );
  }

  const headerTitles: string[] = [
    '#',
    t('campaignName'),
    t('startDate'),
    t('endDate'),
    t('fundingGoal'),
    t('raised'),
    t('progress'),
    t('viewPledge'),
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
          {params.api.getRowIndexRelativeToVisibleRows(params.row._id) + 1}
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
        <div data-testid="campaignName">{params.row.name}</div>
      ),
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: true,
      sortComparator: (v1, v2) => dayjs(v1).valueOf() - dayjs(v2).valueOf(),
      renderCell: (params: GridCellParams) =>
        dayjs(params.row.startDate).format('DD/MM/YYYY'),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: true,
      sortComparator: (v1, v2) => dayjs(v1).valueOf() - dayjs(v2).valueOf(),
      renderCell: (params: GridCellParams) => (
        <div data-testid="endDateCell">
          {dayjs(params.row.endDate).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      field: 'fundingGoal',
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
                params.row.currency as keyof typeof currencySymbols
              ]
            }
            {params.row.fundingGoal as number}
          </div>
        );
      },
    },
    {
      field: 'amountRaised',
      headerName: 'Amount Raised',
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
                params.row.currency as keyof typeof currencySymbols
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
        const goal = params.row.fundingGoal as number;
        const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

        return (
          <Box
            className={styles.progressCellContainer}
            data-testid="progressCell"
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={32}
                thickness={4}
                sx={{ color: 'var(--progress-track-color)' }}
              />
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={32}
                thickness={4}
                sx={{
                  color:
                    percentage >= 100
                      ? 'var(--progress-complete-color)'
                      : percentage >= 50
                        ? 'var(--progress-half-color)'
                        : 'var(--progress-low-color)',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                }}
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
      headerName: 'Add Pledge',
      flex: 1.5,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const campaign = params.row as InterfaceUserCampaign;
        const isEnded = new Date(campaign.endDate) < new Date();

        return (
          <Button
            size="sm"
            variant={isEnded ? 'outline-secondary' : 'outline-success'}
            className={styles.editButton}
            data-testid="addPledgeBtn"
            disabled={isEnded}
            onClick={(e) => {
              e.stopPropagation();
              openModal(campaign);
            }}
          >
            <i className="fa fa-plus me-1" />
            {t('addPledge')}
          </Button>
        );
      },
    },
  ];

  const gridProps: ReportingTableGridProps = {
    sx: { ...dataGridStyle },
    paginationMode: 'client',
    getRowId: (row: InterfaceUserCampaign) => row._id,
    rowCount: filteredCampaigns.length,
    pageSizeOptions: [PAGE_SIZE],
    loading: campaignLoading,
    hideFooter: true,
    compactColumns: columns.length >= 7,
    slots: {
      noRowsOverlay: () => (
        <EmptyState
          icon="campaign"
          message={t('noCampaigns')}
          dataTestId="campaigns-empty-state"
        />
      ),
    },
    getRowClassName: () => `${styles.rowBackground}`,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    rowHeight: ROW_HEIGHT,
    autoHeight: true,
    style: { overflow: 'visible' },
  };

  return (
    <>
      <div className={styles.searchContainerRowNoTopMargin}>
        <div className={styles.searchContainerCampaigns}>
          <SearchBar
            placeholder={t('searchCampaigns')}
            value={searchText}
            onChange={(value) => setSearchText(value.trim())}
            onClear={() => setSearchText('')}
            showSearchButton={false}
            showTrailingIcon={true}
            inputTestId="searchCampaigns"
            clearButtonTestId="clearSearch"
          />
        </div>
        <Button
          variant="success"
          data-testid="myPledgesBtn"
          className={`${styles.createFundButton} ${styles.buttonNoWrap}`}
          onClick={() => navigate(`/user/pledges/${orgId}`, { replace: true })}
        >
          {t('myPledges')}
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
      ) : !campaignLoading && campaignData && filteredCampaigns.length === 0 ? (
        <div className={styles.notFound}>
          <h4>{t('noCampaigns')}</h4>
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

      {/* Modal for adding pledges to campaigns */}
      <PledgeModal
        isOpen={modalState}
        hide={closeModal}
        campaignId={selectedCampaign?._id ?? ''}
        userId={userId}
        pledge={null}
        refetchPledge={refetchCampaigns}
        mode="create"
      />
    </>
  );
};

export default Campaigns;
