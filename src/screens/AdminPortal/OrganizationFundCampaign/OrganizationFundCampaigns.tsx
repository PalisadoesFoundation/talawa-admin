import { useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
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
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import styles from './OrganizationFundCampaigns.module.css';

const PAGE_SIZE = 10;

const OrganizationFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });
  const { t: tCommon } = useTranslation('common');

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
      variables: { input: { id: fundId } },
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
    return campaignsData.filter((c) =>
      c.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [campaignsData, searchText]);

  const handleClick = (campaignId: string): void => {
    navigate(`/admin/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const { fundName, isArchived } = useMemo(() => {
    return {
      fundName: campaignData?.fund?.name || 'Fund',
      isArchived: campaignData?.fund?.isArchived ?? false,
    };
  }, [campaignData]);

  if (!fundId || !orgId) {
    return <Navigate to={'/'} />;
  }

  if (campaignError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded
          style={{
            fontSize: 32,
            color: 'var(--red-500, #ef4444)',
            marginBottom: 12,
          }}
        />
        <div className={styles.errorText}>{campaignError.message}</div>
      </div>
    );
  }

  const headerTitles = [
    t('campaignName'),
    tCommon('startDate'),
    tCommon('endDate'),
    t('fundingGoal'),
    t('progress'),
    tCommon('action'),
  ];

  return (
    <div className={styles.container}>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{fundName}</h1>
          <p className="page-subtitle">{t('title')}</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/orgfunds/${orgId}`)}
          >
            &larr; {tCommon('back')}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <SearchBar
          placeholder={t('searchCampaigns')}
          onSearch={(v) => setSearchText(v.trim())}
          inputTestId="searchFullName"
          buttonTestId="searchButton"
          showSearchButton={false}
          showLeadingIcon
          showClearButton
        />
        <div className={styles.toolbarSpacer} />
        <button
          className={styles.createBtn}
          onClick={() => handleOpenModal(null, 'create')}
          data-testid="addCampaignBtn"
          disabled={isArchived}
        >
          + {t('addCampaign')}
        </button>
      </div>

      {/* Content */}
      {!campaignLoading &&
      campaignData &&
      filteredCampaigns.length === 0 &&
      searchText ? (
        <EmptyState
          message="noResultsFound"
          description={tCommon('noResultsFoundFor', {
            query: `"${searchText}"`,
          })}
          dataTestId="campaigns-search-empty"
        />
      ) : !campaignLoading && campaignData && filteredCampaigns.length === 0 ? (
        <EmptyState
          message={t('noCampaignsFound')}
          dataTestId="campaigns-empty"
        />
      ) : campaignLoading ? (
        <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
      ) : (
        <div className="table-wrapper">
          <table className="data-table" aria-label={t('title')}>
            <thead>
              <tr>
                <th>{t('campaignName')}</th>
                <th>{tCommon('startDate')}</th>
                <th>{tCommon('endDate')}</th>
                <th>{t('fundingGoal')}</th>
                <th>{t('progress')}</th>
                <th>{tCommon('action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => {
                const raised = c.amountRaised ?? 0;
                const goal = c.goalAmount;
                const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
                const symbol =
                  currencySymbols[
                    c.currencyCode as keyof typeof currencySymbols
                  ] || '$';
                const fillClass =
                  pct >= 100
                    ? styles.progressGreen
                    : pct >= 50
                      ? styles.progressYellow
                      : styles.progressBlue;

                return (
                  <tr key={c.id}>
                    <td>
                      <button
                        className={styles.campaignLink}
                        onClick={() => handleClick(c.id)}
                        data-testid="campaignName"
                      >
                        {c.name}
                      </button>
                    </td>
                    <td>{dayjs(c.startAt).format('MMM D, YYYY')}</td>
                    <td data-testid="endDateCell">
                      {dayjs(c.endAt).format('MMM D, YYYY')}
                    </td>
                    <td data-testid="goalCell">
                      <span style={{ fontWeight: 600 }}>
                        {symbol}
                        {goal.toLocaleString()}
                      </span>
                    </td>
                    <td data-testid="progressCell" style={{ minWidth: 120 }}>
                      <div className={styles.progressBarBg}>
                        <div
                          className={`${styles.progressBarFill} ${fillClass}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        {symbol}
                        {raised.toLocaleString()} ({pct}%)
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        data-testid="editCampaignBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(c as InterfaceCampaignInfo, 'edit');
                        }}
                      >
                        {tCommon('edit')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
