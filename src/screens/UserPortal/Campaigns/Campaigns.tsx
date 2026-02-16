/**
 * Campaigns Component
 *
 * This component renders a list of fundraising campaigns for a specific organization.
 * It provides functionality for searching, sorting, and viewing pledges for campaigns.
 * The component uses ReportingTable for consistent table display.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import styles from './Campaigns.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import { Campaign, WarningAmberRounded } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Button from 'shared-components/Button/Button';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';

/**
 * Extended interface for campaigns with computed status
 */
export type CampaignWithStatus = InterfaceUserCampaign & {
  status: 'active' | 'inactive' | 'pending';
  [key: string]: unknown;
};

import { type GridCellParams } from 'shared-components/DataGridWrapper';
import useLocalStorage from 'utils/useLocalstorage';
import PledgeModal from './PledgeModal';
import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';
import { useQuery } from '@apollo/client';
import type { InterfaceUserCampaign } from 'utils/interfaces';
import { currencySymbols } from 'utils/currency';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
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
  const { t: tErrors } = useTranslation('errors');

  const { getItem } = useLocalStorage();
  const userId = getItem('userId') as string;

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [selectedCampaign, setSelectedCampaign] =
    useState<InterfaceUserCampaign | null>(null);
  const {
    isOpen: modalState,
    open: openModalState,
    close: closeModalState,
  } = useModalState();

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

  const openModal = useCallback(
    (campaign: InterfaceUserCampaign): void => {
      setSelectedCampaign(campaign);
      openModalState();
    },
    [openModalState],
  );

  const closeModal = useCallback((): void => {
    closeModalState();
    setSelectedCampaign(null);
  }, [closeModalState]);

  const campaigns = useMemo((): CampaignWithStatus[] => {
    if (!campaignData?.organization?.funds?.edges) {
      return [];
    }

    return campaignData.organization.funds.edges
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
        }) => {
          const today = dayjs().startOf('day');
          const startDate = dayjs(campaign.startAt).startOf('day');
          const endDate = dayjs(campaign.endAt).startOf('day');

          let status: 'active' | 'inactive' | 'pending';
          if (endDate.isBefore(today)) {
            status = 'inactive';
          } else if (!startDate.isAfter(today) && !endDate.isBefore(today)) {
            status = 'active';
          } else {
            status = 'pending';
          }

          return {
            _id: campaign.id,
            name: campaign.name,
            fundingGoal: campaign.goalAmount,
            startDate: new Date(campaign.startAt),
            endDate: new Date(campaign.endAt),
            currency: campaign.currencyCode,
            status,
          };
        },
      );
  }, [campaignData]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign: CampaignWithStatus) =>
      campaign.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaigns, searchText]);

  if (!orgId || !userId) {
    return <Navigate to="/" replace />;
  }

  if (campaignError) {
    return (
      <div className={styles.whiteContainer}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.errorIconLarge}`}
            aria-hidden="true"
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

  const columns: ReportingTableColumn[] = [
    {
      field: 'id',
      headerName: t('campaignIndex'),
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
      field: 'status',
      headerName: t('campaignStatus'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <StatusBadge
          variant={(params.row as CampaignWithStatus).status}
          dataTestId="campaignStatus"
        />
      ),
    },
    {
      field: 'startDate',
      headerName: t('startDate'),
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
      headerName: t('endDate'),
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
      headerName: t('fundGoal'),
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: true,
      renderCell: (params: GridCellParams) => (
        <div className="fw-bold" data-testid="goalCell">
          {currencySymbols[params.row.currency]}
          {params.row.fundingGoal}
        </div>
      ),
    },
    {
      field: 'amountRaised',
      headerName: t('amountRaised'),
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div className="fw-bold" data-testid="raisedCell">
          {currencySymbols[params.row.currency]}0
        </div>
      ),
    },
    {
      field: 'percentageRaised',
      headerName: t('percentRaised'),
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: () => (
        <Box data-testid="progressCell">
          <Typography>0%</Typography>
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: t('addPledge'),
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
            data-testid="addPledgeBtn"
            disabled={isEnded}
            onClick={(e) => {
              e.stopPropagation();
              openModal(campaign);
            }}
            aria-label={isEnded ? t('campaignEnded') : t('addPledge')}
          >
            <i className="fa fa-plus me-1" aria-hidden="true" />
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
          icon={<Campaign />}
          message={t('noCampaigns')}
          description={t('createFirstCampaign')}
          dataTestId="campaigns-empty-state"
        />
      ),
    },
    getRowClassName: () => `${styles.rowBackground}`,
    isRowSelectable: () => false,
    disableColumnMenu: true,
    rowHeight: ROW_HEIGHT,
    autoHeight: true,
  };

  return (
    <>
      <SearchFilterBar
        searchPlaceholder={t('searchCampaigns')}
        searchValue={searchText}
        onSearchChange={setSearchText}
        searchInputTestId="searchByInput"
        searchButtonTestId="searchBtn"
        hasDropdowns={false}
      />

      <Button
        variant="success"
        data-testid="myPledgesBtn"
        onClick={() => navigate(`/user/pledges/${orgId}`, { replace: true })}
      >
        {t('myPledges')}
      </Button>

      <ReportingTable
        rows={filteredCampaigns as ReportingRow[]}
        columns={columns}
        gridProps={gridProps}
        listProps={{ ['data-testid']: 'campaigns-list' }}
      />

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
