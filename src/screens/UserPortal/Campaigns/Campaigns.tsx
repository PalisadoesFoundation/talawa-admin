/**
 * Campaigns Component
 *
 * This component renders a list of fundraising campaigns for a specific organization.
 * It provides functionality for searching campaigns and adding pledges.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import styles from './Campaigns.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import Campaign from '@mui/icons-material/Campaign';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from 'shared-components/Button';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import useLocalStorage from 'utils/useLocalstorage';
import PledgeModal from './PledgeModal';
import { USER_FUND_CAMPAIGNS, USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import { useQuery } from '@apollo/client';
import type {
  InterfacePledgeInfo,
  InterfaceUserCampaign,
  InterfaceUserCampaignNode,
  InterfaceUserFundCampaignQueryResponse,
} from 'utils/interfaces';
import { currencySymbols } from 'utils/currency';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import dayjs from 'dayjs';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

/**
 * Extended interface for campaigns with computed status
 */
export type CampaignWithStatus = InterfaceUserCampaign & {
  status: 'active' | 'inactive' | 'pending';
  [key: string]: unknown;
};

const PAGE_SIZE = 10;

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

  const campaignQueryResult = useQuery<InterfaceUserFundCampaignQueryResponse>(
    USER_FUND_CAMPAIGNS,
    {
      variables: {
        input: { id: orgId as string },
      },
      fetchPolicy: 'cache-first',
      skip: !orgId || !userId,
    },
  );

  const {
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaigns,
  } = campaignQueryResult;

  const { data: userPledgesData } = useQuery<{
    getPledgesByUserId: InterfacePledgeInfo[];
  }>(USER_PLEDGES, {
    variables: {
      input: { userId },
      where: {},
      orderBy: 'endDate_DESC',
    },
    skip: !orgId || !userId,
    fetchPolicy: 'cache-and-network',
  });

  const { rows: fundRows } = useTableData<
    InterfaceUserCampaignNode,
    InterfaceUserCampaignNode,
    InterfaceUserFundCampaignQueryResponse
  >(campaignQueryResult, {
    path: (data) => data.organization?.funds,
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
    return fundRows
      .flatMap((fundNode) => fundNode.campaigns?.edges ?? [])
      .map(({ node: campaign }) => {
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
          amountRaised: campaign.amountRaised ?? 0,
          startDate: new Date(campaign.startAt),
          endDate: new Date(campaign.endAt),
          currency: campaign.currencyCode,
          status,
        };
      });
  }, [fundRows]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign: CampaignWithStatus) =>
      campaign.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaigns, searchText]);

  const campaignIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredCampaigns.forEach((item, index) => {
      map.set(item._id, index + 1);
    });
    return map;
  }, [filteredCampaigns]);

  const pledgedCampaignIds = useMemo(() => {
    return new Set(
      (userPledgesData?.getPledgesByUserId ?? [])
        .map((pledge) => pledge.campaign?.id)
        .filter((id): id is string => Boolean(id)),
    );
  }, [userPledgesData]);

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

  const columns: IColumnDef<CampaignWithStatus>[] = [
    {
      id: 'id',
      header: t('campaignIndex'),
      accessor: '_id',
      render: (_value, row) => (
        <span className={styles.requestsTableItemIndex}>
          {campaignIndexMap.get(row._id) ?? 0}
        </span>
      ),
      meta: {
        sortable: false,
      },
    },
    {
      id: 'name',
      header: t('campaignName'),
      accessor: 'name',
      render: (value) => <div data-testid="campaignName">{String(value)}</div>,
      meta: {
        sortable: false,
      },
    },
    {
      id: 'status',
      header: t('campaignStatus'),
      accessor: 'status',
      render: (value) => (
        <StatusBadge
          variant={value as 'active' | 'inactive' | 'pending'}
          dataTestId="campaignStatus"
        />
      ),
      meta: {
        sortable: false,
      },
    },
    {
      id: 'startDate',
      header: t('startDate'),
      accessor: 'startDate',
      render: (value) => dayjs(String(value)).format('DD/MM/YYYY'),
      meta: {
        sortable: true,
        sortFn: (a, b) =>
          dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
      },
    },
    {
      id: 'endDate',
      header: t('endDate'),
      accessor: 'endDate',
      render: (value) => (
        <div data-testid="endDateCell">
          {dayjs(String(value)).format('DD/MM/YYYY')}
        </div>
      ),
      meta: {
        sortable: true,
        sortFn: (a, b) =>
          dayjs(a.endDate).valueOf() - dayjs(b.endDate).valueOf(),
      },
    },
    {
      id: 'fundingGoal',
      header: t('fundGoal'),
      accessor: 'fundingGoal',
      render: (value, row) => (
        <div className="fw-bold" data-testid="goalCell">
          {currencySymbols[row.currency]}
          {value as number}
        </div>
      ),
      meta: {
        sortable: true,
      },
    },
    {
      id: 'amountRaised',
      header: t('amountRaised'),
      accessor: 'amountRaised',
      render: (value, row) => (
        <div className="fw-bold" data-testid="raisedCell">
          {currencySymbols[row.currency]}
          {(value as number) ?? 0}
        </div>
      ),
      meta: {
        sortable: false,
      },
    },
    {
      id: 'percentageRaised',
      header: t('percentRaised'),
      accessor: 'amountRaised',
      render: (_value, row) => {
        const raised = row.amountRaised ?? 0;
        const goal = row.fundingGoal;
        const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

        return (
          <Box data-testid="progressCell">
            <Typography>{percentage.toFixed(0)}%</Typography>
          </Box>
        );
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'action',
      header: t('addPledge'),
      accessor: '_id',
      render: (_value, row) => {
        const canCreatePledge = row.status === 'active';
        const hasAlreadyPledged = pledgedCampaignIds.has(row._id);
        const isEnded = row.status === 'inactive';

        return (
          <Button
            size="sm"
            className={styles.addPledgeButton}
            data-testid="addPledgeBtn"
            disabled={!canCreatePledge || hasAlreadyPledged}
            onClick={(e) => {
              e.stopPropagation();
              if (!canCreatePledge || hasAlreadyPledged) return;
              openModal(row);
            }}
            aria-label={
              !canCreatePledge && isEnded ? t('campaignEnded') : t('addPledge')
            }
          >
            <i className="fa fa-plus me-1" aria-hidden="true" />
            {t('addPledge')}
          </Button>
        );
      },
      meta: {
        sortable: false,
      },
    },
  ];

  return (
    <div className={styles.campaignsContainer}>
      <div className={styles.searchContainerRow}>
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
          className={`${styles.createButton} ${styles.buttonNoWrap} ${styles.buttonMarginReset}`}
          data-testid="myPledgesBtn"
          onClick={() => navigate(`/user/pledges/${orgId}`, { replace: true })}
        >
          {t('myPledges')}
        </Button>
      </div>

      {!campaignLoading && filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={<Campaign />}
          message={t('noCampaigns')}
          description={t('createFirstCampaign')}
          dataTestId="campaigns-empty-state"
        />
      ) : (
        <DataTable
          data={filteredCampaigns}
          columns={columns}
          rowKey="_id"
          loading={campaignLoading}
          paginationMode="client"
          pageSize={PAGE_SIZE}
          ariaLabel={t('campaigns')}
        />
      )}

      <PledgeModal
        isOpen={modalState}
        hide={closeModal}
        campaignId={selectedCampaign?._id ?? ''}
        userId={userId}
        pledge={null}
        refetchPledge={refetchCampaigns}
        mode="create"
      />
    </div>
  );
};

export default Campaigns;
