import { useQuery } from '@apollo/client';
import Campaign from '@mui/icons-material/Campaign';
import Search from '@mui/icons-material/Search';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import CampaignModal from './modal/CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import { currencySymbols } from 'utils/currency';
import type { InterfaceCampaignInfo } from 'utils/interfaces';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFundCampaigns.module.css';
import Button from 'shared-components/Button';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useSimpleTableData } from 'shared-components/DataTable/hooks/useSimpleTableData';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

interface InterfaceFundCampaignQueryData {
  fund?: {
    name?: string;
    campaigns?: {
      edges?: Array<{ node: InterfaceCampaignInfo }>;
    };
  };
}

/**
 * `orgFundCampaign` component displays a list of fundraising campaigns for a specific fund within an organization.
 */
const orgFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const navigate = useNavigate();

  const { fundId, orgId } = useParams();

  const [campaign, setCampaign] = useState<InterfaceCampaignInfo | null>(null);
  const [searchText, setSearchText] = useState('');

  const { isOpen, open, close } = useModalState();
  const [campaignModalMode, setCampaignModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const handleOpenModal = useCallback(
    (
      selectedCampaign: InterfaceCampaignInfo | null,
      mode: 'edit' | 'create',
    ): void => {
      setCampaign(selectedCampaign);
      setCampaignModalMode(mode);
      open();
    },
    [open],
  );

  const campaignsQuery = useQuery<InterfaceFundCampaignQueryData>(
    FUND_CAMPAIGN,
    {
      variables: {
        input: { id: fundId },
      },
      skip: !fundId,
    },
  );

  const extractCampaigns = useCallback(
    (data: InterfaceFundCampaignQueryData) =>
      data?.fund?.campaigns?.edges?.map((edge) => edge.node) ?? [],
    [],
  );

  const {
    rows: campaignsData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaign,
  } = useSimpleTableData<InterfaceCampaignInfo, InterfaceFundCampaignQueryData>(
    campaignsQuery,
    { path: extractCampaigns },
  );

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((currentCampaign) =>
      currentCampaign.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaignsData, searchText]);

  const campaignIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredCampaigns.forEach((currentCampaign, idx) => {
      map.set(currentCampaign.id, idx + 1);
    });
    return map;
  }, [filteredCampaigns]);

  const handleClick = useCallback(
    (campaignId: string): void => {
      navigate(`/admin/fundCampaignPledge/${orgId}/${campaignId}`);
    },
    [navigate, orgId],
  );

  const { fundName, isArchived } = useMemo(() => {
    const currentFundName = campaignsQuery.data?.fund?.name || 'Fund';
    const currentIsArchived = false;
    return { fundName: currentFundName, isArchived: currentIsArchived };
  }, [campaignsQuery.data]);

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

  const columns: IColumnDef<InterfaceCampaignInfo>[] = [
    {
      id: 'id',
      header: '#',
      accessor: 'id',
      render: (_value, row) => (
        <span className={styles.requestsTableItemIndex}>
          {campaignIndexMap.get(row.id) ?? 0}
        </span>
      ),
      meta: { sortable: false },
    },
    {
      id: 'name',
      header: t('campaignName'),
      accessor: 'name',
      render: (_value, row) => (
        <Button
          variant="outline-light"
          size="sm"
          className="p-0 border-0 bg-transparent text-primary"
          data-testid="campaignName"
          onClick={() => handleClick(row.id)}
        >
          {row.name}
        </Button>
      ),
      meta: { sortable: false },
    },
    {
      id: 'startAt',
      header: tCommon('startDate'),
      accessor: 'startAt',
      render: (value) => dayjs(String(value)).format('DD/MM/YYYY'),
      meta: {
        sortable: true,
        sortFn: (a, b) =>
          dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf(),
      },
    },
    {
      id: 'endAt',
      header: tCommon('endDate'),
      accessor: 'endAt',
      render: (value) => (
        <div data-testid="endDateCell">
          {dayjs(String(value)).format('DD/MM/YYYY')}
        </div>
      ),
      meta: {
        sortable: true,
        sortFn: (a, b) => dayjs(a.endAt).valueOf() - dayjs(b.endAt).valueOf(),
      },
    },
    {
      id: 'goalAmount',
      header: t('fundingGoal'),
      accessor: 'goalAmount',
      render: (value, row) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="goalCell"
        >
          {currencySymbols[row.currencyCode as keyof typeof currencySymbols]}
          {Number(value)}
        </div>
      ),
      meta: { sortable: true },
    },
    {
      id: 'fundingRaised',
      header: t('raised'),
      accessor: 'fundingRaised',
      render: (value, row) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="raisedCell"
        >
          {currencySymbols[row.currencyCode as keyof typeof currencySymbols]}
          {Number(value ?? 0)}
        </div>
      ),
      meta: { sortable: false },
    },
    {
      id: 'percentageRaised',
      header: t('percentageRaised'),
      accessor: (row) => {
        const raised = row.fundingRaised ?? 0;
        const goal = row.goalAmount;
        return goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
      },
      render: (value) => {
        const percentage = Number(value);
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
      meta: { sortable: false },
    },
    {
      id: 'action',
      header: tCommon('action'),
      accessor: 'id',
      render: (_value, row) => (
        <Button
          size="sm"
          className={styles.editButton}
          data-testid="editCampaignBtn"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(row, 'edit');
          }}
        >
          <i className="fa fa-edit me-1" />
          {t('editCampaign')}
        </Button>
      ),
      meta: { sortable: false },
    },
  ];

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
      campaignsQuery.data &&
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
      ) : !campaignLoading &&
        campaignsQuery.data &&
        filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={<Campaign />}
          message={t('noCampaignsFound')}
          dataTestId="campaigns-empty"
        />
      ) : (
        <div className={styles.listBox}>
          <DataTable<InterfaceCampaignInfo>
            data={filteredCampaigns}
            columns={columns}
            loading={campaignLoading}
            error={null}
            rowKey="id"
            paginationMode="client"
            pageSize={10}
            tableClassName={`${styles.listTable} ${styles.overflowVisible}`}
          />
          {filteredCampaigns.length > 0 && (
            <div className={'w-100 text-center my-4'}>
              <h5 className="m-0">{tCommon('endOfResults')}</h5>
            </div>
          )}
        </div>
      )}

      <CampaignModal
        isOpen={isOpen}
        hide={close}
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
