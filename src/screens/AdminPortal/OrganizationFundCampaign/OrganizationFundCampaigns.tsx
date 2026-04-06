import { useQuery } from '@apollo/client';
import Campaign from '@mui/icons-material/Campaign';
import Search from '@mui/icons-material/Search';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import CampaignModal from './modal/CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import { currencySymbols } from 'utils/currency';
import type {
  CampaignRow,
  InterfaceCampaignInfo,
  InterfaceFundCampaignNode,
  InterfaceFundCampaignQueryResponse,
} from 'utils/interfaces';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFundCampaigns.module.css';
import Button from 'shared-components/Button';

const PAGE_SIZE = 10;

/**
 * Renders the organization fund campaigns listing screen.
 *
 * Displays campaign data for a selected fund with search, sorting, edit/create
 * actions, and loading/error/empty states.
 *
 * @returns Fund campaign management screen for an organization fund.
 */
const OrganizationFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId, fundId } = useParams();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [campaign, setCampaign] = useState<InterfaceCampaignInfo | null>(null);
  const [campaignModalMode, setCampaignModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const { isOpen, open, close } = useModalState();

  const campaignQueryResult = useQuery<InterfaceFundCampaignQueryResponse>(
    FUND_CAMPAIGN,
    {
      variables: {
        input: { id: fundId },
      },
      skip: !fundId,
    },
  );

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaign,
  } = campaignQueryResult;

  const { rows: campaignsData } = useTableData<
    InterfaceFundCampaignNode,
    CampaignRow,
    InterfaceFundCampaignQueryResponse
  >(campaignQueryResult, {
    path: (data) => data.fund.campaigns,
    transformNode: (node) => ({
      id: node.id,
      name: node.name,
      goalAmount: node.goalAmount,
      startAt: new Date(node.startAt),
      endAt: new Date(node.endAt),
      createdAt: node.createdAt ?? node.startAt,
      currencyCode: node.currencyCode,
      amountRaised: node.amountRaised ?? 0,
    }),
  });

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

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((campaignItem) =>
      campaignItem.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaignsData, searchText]);

  const handleClick = (campaignId: string): void => {
    navigate(`/admin/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const { fundName, isArchived } = useMemo(() => {
    const fundName = campaignData?.fund?.name || 'Fund';
    const isArchived = campaignData?.fund?.isArchived ?? false;
    return { fundName, isArchived };
  }, [campaignData]);

  const campaignIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredCampaigns.forEach((item, index) => {
      map.set(item.id, index + 1);
    });
    return map;
  }, [filteredCampaigns]);

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

  const columns: IColumnDef<CampaignRow>[] = [
    {
      id: 'id',
      header: '#',
      accessor: 'id',
      render: (_value, row) => (
        <span className={styles.requestsTableItemIndex}>
          {campaignIndexMap.get(row.id) ?? 0}
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
      render: (value, row) => (
        <Button
          variant="link"
          className={styles.campaignNameButton}
          data-testid="campaignName"
          onClick={() => handleClick(row.id)}
        >
          <i className="fa fa-link me-1" aria-hidden="true" />
          {String(value)}
        </Button>
      ),
      meta: {
        sortable: false,
      },
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
          {value as number}
        </div>
      ),
      meta: {
        sortable: true,
        align: 'center',
      },
    },
    {
      id: 'amountRaised',
      header: t('raised'),
      accessor: 'amountRaised',
      render: (value, row) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="raisedCell"
        >
          {currencySymbols[row.currencyCode as keyof typeof currencySymbols]}
          {(value as number) ?? 0}
        </div>
      ),
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'percentageRaised',
      header: t('percentageRaised'),
      accessor: 'amountRaised',
      render: (_value, row) => {
        const raised = row.amountRaised ?? 0;
        const goal = row.goalAmount;
        const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
        const angle = (percentage / 100) * 360;
        const radians = ((angle - 90) * Math.PI) / 180;
        const x = 16 + 16 * Math.cos(radians);
        const y = 16 + 16 * Math.sin(radians);
        const largeArcFlag = angle > 180 ? 1 : 0;
        const sectorPath =
          percentage >= 100
            ? ''
            : `M 16 16 L 16 0 A 16 16 0 ${largeArcFlag} 1 ${x} ${y} Z`;
        const pieClassName =
          percentage >= 100
            ? styles.progressComplete
            : percentage >= 50
              ? styles.progressHalf
              : styles.progressLow;

        return (
          <Box
            className={styles.progressCellContainer}
            data-testid="progressCell"
          >
            <svg
              className={`${styles.progressPie} ${pieClassName}`}
              viewBox="0 0 32 32"
              role="img"
              aria-label={t('campaignProgress', {
                percentage: percentage.toFixed(0),
              })}
            >
              <circle cx="16" cy="16" r="16" className={styles.progressTrack} />
              {percentage >= 100 ? (
                <circle
                  cx="16"
                  cy="16"
                  r="16"
                  className={styles.progressSlice}
                />
              ) : (
                percentage > 0 && (
                  <path d={sectorPath} className={styles.progressSlice} />
                )
              )}
            </svg>
            <Typography variant="body2" className={styles.progressTypography}>
              {percentage.toFixed(0)}%
            </Typography>
          </Box>
        );
      },
      meta: {
        sortable: false,
        align: 'center',
      },
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
            handleOpenModal(row as InterfaceCampaignInfo, 'edit');
          }}
        >
          <i className="fa fa-edit me-1" />
          {tCommon('edit')}
        </Button>
      ),
      meta: {
        sortable: false,
        align: 'center',
      },
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
            <>
              <DataTable
                data={filteredCampaigns}
                columns={columns}
                rowKey="id"
                loading={campaignLoading}
                paginationMode="client"
                pageSize={PAGE_SIZE}
                tableClassName={styles.listTable}
                emptyMessage={t('noCampaignsFound')}
                ariaLabel={t('title')}
              />
              {filteredCampaigns.length > 0 && (
                <div className={'w-100 text-center my-4'}>
                  <h5 className="m-0">{tCommon('endOfResults')}</h5>
                </div>
              )}
            </>
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

export default OrganizationFundCampaign;
