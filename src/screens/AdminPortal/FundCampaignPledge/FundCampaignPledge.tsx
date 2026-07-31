import { useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { currencySymbols } from 'utils/currency';
import styles from './FundCampaignPledge.module.css';
import PledgeModal from './modal/PledgeModal';
import Popover from '@mui/material/Popover';
import Avatar from 'shared-components/Avatar/Avatar';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
  InterfaceQueryFundCampaignsPledges,
  InterfaceCampaignInfoPG,
} from 'utils/interfaces';
import { getPledgeColumns } from './PledgeColumns';
import type { InterfacePledgeTableRow } from './PledgeColumns';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import Button from 'shared-components/Button/Button';

/**
 * Renders the Fund Campaign Pledges screen with pledge management, search/sort, and progress tracking.
 */
const fundCampaignPledge = (): JSX.Element => {
  type FundCampaignPledgeNode =
    InterfaceQueryFundCampaignsPledges['pledges']['edges'][number]['node'] & {
      users?: InterfaceUserInfoPG[];
      note?: string | null;
      updatedAt?: string;
    };

  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { fundCampaignId, orgId } = useParams();
  if (!fundCampaignId || !orgId) {
    return <Navigate to={'/'} replace />;
  }

  const [campaignInfo, setCampaignInfo] = useState<InterfaceCampaignInfoPG>({
    name: '',
    goal: 0,
    startDate: new Date(),
    endDate: new Date(),
    currency: '',
  });

  const pledgeModal = useModalState();

  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfoPG[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popup' : undefined;
  const [pledgeModalMode, setPledgeModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const pledgeQueryResult = useQuery<{
    fundCampaign: InterfaceQueryFundCampaignsPledges;
  }>(FUND_CAMPAIGN_PLEDGE, {
    variables: { input: { id: fundCampaignId } },
  });

  const {
    rows: pledgeRows,
    loading: pledgeLoading,
    error: pledgeError,
  } = useTableData<
    FundCampaignPledgeNode,
    InterfacePledgeTableRow,
    { fundCampaign: InterfaceQueryFundCampaignsPledges }
  >(pledgeQueryResult, {
    path: (data) => data.fundCampaign?.pledges,
    transformNode: (node) => {
      const allUsers =
        'users' in node && Array.isArray(node.users)
          ? node.users
          : [node.pledger];

      return {
        id: node.id,
        original: {
          id: node.id,
          campaign: {
            id: node.campaign?.id ?? '',
            name: node.campaign?.name ?? '',
            endAt: pledgeQueryResult.data?.fundCampaign?.endAt ?? new Date(),
            currencyCode:
              pledgeQueryResult.data?.fundCampaign?.currencyCode ?? 'USD',
            goalAmount: pledgeQueryResult.data?.fundCampaign?.goalAmount ?? 0,
          },
          amount: node.amount || 0,
          note: node.note,
          currency: pledgeQueryResult.data?.fundCampaign?.currencyCode || 'USD',
          createdAt: node.createdAt ?? new Date().toISOString(),
          updatedAt: node.updatedAt,
          pledger: node.pledger,
          users: allUsers.filter(Boolean),
        },
        amount: node.amount || 0,
        pledgeDate: node.createdAt ? new Date(node.createdAt) : new Date(),
        endDate: pledgeQueryResult.data?.fundCampaign?.endAt
          ? new Date(pledgeQueryResult.data.fundCampaign.endAt)
          : new Date(),
        users: allUsers.filter(Boolean),
        currency: pledgeQueryResult.data?.fundCampaign?.currencyCode || 'USD',
      };
    },
    deps: [pledgeQueryResult.data?.fundCampaign?.endAt],
  });

  const { data: pledgeData, refetch: refetchPledge } = pledgeQueryResult;

  const filteredPledges = useMemo(() => {
    if (!searchTerm) return pledgeRows;

    const search = searchTerm.toLowerCase();
    return pledgeRows.filter((pledge) =>
      pledge.users.some((user) => user.name?.toLowerCase().includes(search)),
    );
  }, [pledgeRows, searchTerm]);

  const { totalPledged, totalRaised } = useMemo(() => {
    const totalPledged = pledgeRows.reduce(
      (total, pledge) => total + (pledge.amount || 0),
      0,
    );

    // Raised amount data is not available yet in this query response.
    const totalRaised = 0;

    return { totalPledged, totalRaised };
  }, [pledgeRows]);

  const { fundName, fundId } = useMemo(() => {
    const fundInfo =
      pledgeData?.fundCampaign?.pledges?.edges[0]?.node?.campaign?.fund;

    return {
      fundName: fundInfo?.name ?? tCommon('funds'),
      fundId: fundInfo?.id ?? null,
    };
  }, [pledgeData, tCommon]);

  useEffect(() => {
    if (pledgeData?.fundCampaign) {
      setCampaignInfo({
        name: pledgeData.fundCampaign.name,
        goal: pledgeData.fundCampaign.goalAmount ?? 0,
        startDate: pledgeData.fundCampaign.startAt ?? new Date(),
        endDate: pledgeData.fundCampaign.endAt ?? new Date(),
        currency: pledgeData.fundCampaign.currencyCode ?? 'USD',
      });
    }
  }, [pledgeData]);

  const handleOpenModal = useCallback(
    (
      selectedPledge: InterfacePledgeInfo | null,
      mode: 'edit' | 'create',
    ): void => {
      setPledge(selectedPledge);
      setPledgeModalMode(mode);
      pledgeModal.open();
    },
    [],
  );

  const handleClick = (
    event:
      | React.MouseEvent<HTMLSpanElement>
      | React.KeyboardEvent<HTMLSpanElement>,
    users: InterfaceUserInfoPG[],
  ): void => {
    setExtraUsers(users);
    setAnchorEl(event.currentTarget);
  };

  const isWithinCampaignDates = useMemo(() => {
    if (!pledgeData?.fundCampaign) return false;

    const now = dayjs();
    let start = dayjs(pledgeData.fundCampaign.startAt);
    let end = dayjs(pledgeData.fundCampaign.endAt);

    return now.isAfter(start) && now.isBefore(end);
  }, [pledgeData]);

  if (pledgeError) {
    return (
      <div className={`${styles.container} rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className={styles.centerText}>
            {tErrors('errorLoading', {
              entity: t('pledges.pledges'),
            })}
            <br />
            {pledgeError.message}
          </h6>
        </div>
      </div>
    );
  }

  const columns = getPledgeColumns({
    labels: {
      pledgers: t('pledges.pledgers'),
      pledgeDate: t('pledges.pledgeDate'),
      pledged: t('pledges.pledged'),
      donated: t('pledges.donated'),
      action: tCommon('action'),
      edit: tCommon('edit'),
    },
    getMoreCountLabel: (count: number) => tCommon('moreCount', { count }),
    id,
    handleClick,
    handleOpenModal,
  });

  const currencySymbol =
    currencySymbols[campaignInfo?.currency as keyof typeof currencySymbols] ||
    '$';

  return (
    <LoadingState isLoading={pledgeLoading} variant="spinner">
      <div>
        <BreadcrumbsComponent
          items={[
            { label: fundName, to: `/admin/orgfunds/${orgId}` },
            fundId
              ? {
                  label: campaignInfo?.name,
                  to: `/admin/orgfundcampaign/${orgId}/${fundId}`,
                }
              : { label: campaignInfo?.name },
            { translationKey: 'pledges.pledges', isCurrent: true },
          ]}
        />

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">{t('pledges.pledges')}</h1>
            <p className="page-subtitle">
              {campaignInfo?.name} &mdash; {t('pledges.endsOn')}{' '}
              {dayjs(campaignInfo?.endDate).format('DD/MM/YYYY')}
            </p>
          </div>
          <div className="page-header-actions">
            <Button
              variant="plain"
              className="btn btn-primary"
              disabled={!isWithinCampaignDates}
              onClick={() => handleOpenModal(null, 'create')}
              data-testid="addPledgeBtn"
              title={
                !isWithinCampaignDates ? t('pledges.campaignNotActive') : ''
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>{' '}
              {t('pledges.addPledge')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">
                {t('pledges.pledgedAmount')}
              </span>
              <div className="stat-card-icon green">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <div className="stat-card-value">
              {currencySymbol}
              {totalPledged.toLocaleString('en-US')}
            </div>
            <div className="stat-card-change neutral">
              {t('pledges.pledges')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">
                {t('pledges.raisedAmount')}
              </span>
              <div className="stat-card-icon blue">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="stat-card-value">
              {currencySymbol}
              {totalRaised.toLocaleString('en-US')}
            </div>
            <div className="stat-card-change">
              {campaignInfo?.goal
                ? `${Math.round((totalRaised / campaignInfo.goal) * 100)}%`
                : '0%'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">{tCommon('funds')}</span>
              <div className="stat-card-icon orange">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className="stat-card-value">
              {currencySymbol}
              {campaignInfo?.goal.toLocaleString('en-US')}
            </div>
            <div className="stat-card-change neutral">
              {t('pledges.endsOn')}{' '}
              {dayjs(campaignInfo?.endDate).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-bar">
            <svg
              aria-hidden="true"
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={t('pledges.searchPledger')}
              aria-label={t('pledges.searchPledger')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.trim())}
              data-testid="searchPledger"
            />
          </div>
        </div>

        {/* Pledges Table */}
        <div className="card">
          {filteredPledges.length === 0 ? (
            searchTerm ? (
              <EmptyState
                icon="search"
                message="noResultsFound"
                description={tCommon('noResultsFoundFor', {
                  query: `"${searchTerm}"`,
                })}
                dataTestId="fund-campaign-pledge-search-empty-state"
              />
            ) : (
              <EmptyState
                icon="volunteer_activism"
                message={t('pledges.noPledges')}
                dataTestId="fund-campaign-pledge-empty-state"
              />
            )
          ) : (
            <div className="table-wrapper">
              <DataTable
                data={filteredPledges}
                columns={columns}
                rowKey="id"
                loading={pledgeLoading}
                paginationMode="client"
                pageSize={10}
                tableClassName="data-table"
                emptyMessage={t('pledges.noPledges')}
                ariaLabel={t('pledges.pledges')}
              />
            </div>
          )}
        </div>

        <PledgeModal
          isOpen={pledgeModal.isOpen}
          hide={pledgeModal.close}
          campaignId={fundCampaignId}
          orgId={orgId}
          pledge={pledge}
          refetchPledge={refetchPledge}
          endDate={pledgeData?.fundCampaign?.endAt as Date}
          mode={pledgeModalMode}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <div
            className={`${styles.popup} ${extraUsers.length > 4 ? styles.popupExtra : ''}`}
            data-testid="extra-users-popup"
          >
            {extraUsers.map((user: InterfaceUserInfoPG, index: number) => (
              <div
                className={styles.pledgerContainer}
                key={user.id}
                data-testid={`extraUser-${index}`}
              >
                {user.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={user.name}
                    className={styles.TableImagePledge}
                  />
                ) : (
                  <Avatar
                    containerStyle={styles.imageContainerPledge}
                    avatarStyle={styles.TableImagePledge}
                    name={user.name}
                    alt={user.name}
                  />
                )}
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </Popover>
      </div>
    </LoadingState>
  );
};
export default fundCampaignPledge;
