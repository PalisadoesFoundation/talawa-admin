import { useQuery } from '@apollo/client';
import { Campaign, Search, WarningAmberRounded } from '@mui/icons-material';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import CampaignModal from './modal/CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFundCampaigns.module.css';
import Button from 'shared-components/Button';

/**
 * `orgFundCampaign` component displays a list of fundraising campaigns for a specific fund within an organization.
 * It allows users to search, sort, view and edit campaigns.
 *
 * ### Functionality
 * - Displays a data table with campaigns information, including their names, start and end dates, funding goals, and actions.
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
 * - Renders a `DataTable` component with campaigns information.
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

  type CampaignNode =
    InterfaceQueryOrganizationFundCampaigns['campaigns']['edges'][number]['node'];
  type CampaignRow = CampaignNode & { slNo: number };

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

  const campaignsData = useMemo<CampaignRow[]>(() => {
    return (
      campaignData?.fund?.campaigns?.edges.map((edge, index) => ({
        ...edge.node,
        slNo: index + 1,
      })) ?? []
    );
  }, [campaignData]);

  const filteredCampaigns = useMemo<CampaignRow[]>(() => {
    return campaignsData.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaignsData, searchText]);

  const handleClick = (campaignId: string): void => {
    navigate(`/admin/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const toCampaignInfo = useCallback(
    (campaignRow: CampaignRow): InterfaceCampaignInfo => ({
      id: campaignRow.id,
      name: campaignRow.name,
      goalAmount: campaignRow.goalAmount,
      startAt: new Date(campaignRow.startAt),
      endAt: new Date(campaignRow.endAt),
      createdAt: campaignRow.startAt,
      currencyCode: campaignRow.currencyCode,
      fundingRaised: campaignRow.fundingRaised,
    }),
    [],
  );

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

  // Column definitions for DataTable
  const columns: Array<IColumnDef<CampaignRow>> = [
    {
      id: 'id',
      header: '#',
      accessor: 'slNo',
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'name',
      header: t('campaignName'),
      accessor: 'name',
      render: (value, campaign) => (
        <Button
          variant="link"
          className="p-0 text-start"
          onClick={() => handleClick(campaign.id)}
          data-testid="campaignName"
        >
          {value as string}
        </Button>
      ),
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'startAt',
      header: tCommon('startDate'),
      accessor: (campaign) => dayjs(campaign.startAt).format('DD/MM/YYYY'),
      meta: {
        sortable: true,
        align: 'center',
        sortFn: (a, b) =>
          dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf(),
      },
    },
    {
      id: 'endAt',
      header: tCommon('endDate'),
      accessor: (campaign) => dayjs(campaign.endAt).format('DD/MM/YYYY'),
      render: (value) => <div data-testid="endDateCell">{value as string}</div>,
      meta: {
        sortable: true,
        align: 'center',
        sortFn: (a, b) => dayjs(a.endAt).valueOf() - dayjs(b.endAt).valueOf(),
      },
    },
    {
      id: 'goalAmount',
      header: t('fundingGoal'),
      accessor: () => '',
      render: (_value, campaign) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="goalCell"
        >
          {
            currencySymbols[
              campaign.currencyCode as keyof typeof currencySymbols
            ]
          }
          {campaign.goalAmount}
        </div>
      ),
      meta: {
        sortable: true,
        align: 'center',
      },
    },
    {
      id: 'fundingRaised',
      header: t('raised'),
      accessor: () => '',
      render: (_value, campaign) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="raisedCell"
        >
          {
            currencySymbols[
              campaign.currencyCode as keyof typeof currencySymbols
            ]
          }
          {campaign.fundingRaised ?? 0}
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
      accessor: () => '',
      render: (_value, campaign) => {
        const raised = campaign.fundingRaised ?? 0;
        const goal = campaign.goalAmount;
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
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'action',
      header: tCommon('action'),
      accessor: () => '',
      render: (_value, campaign) => (
        <Button
          size="sm"
          className={styles.editButton}
          data-testid="editCampaignBtn"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(toCampaignInfo(campaign), 'edit');
          }}
        >
          <i className="fa fa-edit me-1" />
          {t('editCampaign')}
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
          <DataTable<CampaignRow>
            data={filteredCampaigns}
            columns={columns}
            loading={campaignLoading}
            rowKey="id"
            emptyMessage={t('noCampaignsFound')}
            tableClassName={styles.listTable}
          />
        </div>
      )}

      {/* Create Campaign Modal */}
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
