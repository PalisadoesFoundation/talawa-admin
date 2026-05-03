import { useQuery } from '@apollo/client';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Search from '@mui/icons-material/Search';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import FundModal from './modal/FundModal';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import type {
  InterfaceFundInfo,
  InterfaceFundListQueryResponse,
} from 'utils/interfaces';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFunds.module.css';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';

const PAGE_SIZE = 10;

/**
 * `organizationFunds` component displays a list of funds for a specific organization,
 * allowing users to search, sort, view and edit funds.
 *
 * This component utilizes the `DataGrid` from Material-UI to present the list of funds in a tabular format,
 * and includes functionality for filtering and sorting. It also handles the opening and closing of modals
 * for creating and editing.
 *
 * It includes:
 * - A search input field to filter funds by name.
 * - A dropdown menu to sort funds by creation date.
 * - A button to create a new fund.
 * - A table to display the list of funds with columns for fund details and actions.
 * - Modals for creating and editing funds.
 *
 * ### GraphQL Queries
 * - `FUND_LIST`: Fetches a list of funds for the given organization, filtered and sorted based on the provided parameters.
 *
 * ### Props
 * - `orgId`: The ID of the organization whose funds are being managed.
 *
 * ### State
 * - `fund`: The currently selected fund for editing or deletion.
 * - `searchTerm`: The current search term used for filtering funds.
 * - `sortBy`: The current sorting order for funds.
 * - `modalState`: The state of the modals (edit/create).
 * - `fundModalMode`: The mode of the fund modal (edit or create).
 *
 * ### Methods
 * - `handleOpenModal(fund: InterfaceFundInfo | null, mode: 'edit' | 'create')`: Opens the fund modal with the given fund and mode.
 * - `handleClick(fundId: string)`: Navigates to the campaign page for the specified fund.
 *
 * @returns The rendered component.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.tableHeader`
 * - `.subtleBlueGrey`
 * - `.head`
 * - `.btnsContainer`
 * - `.input`
 * - `.inputField`
 * - `.searchButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
const organizationFunds = (): JSX.Element => {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [fund, setFund] = useState<InterfaceFundInfo | null>(null);

  const { isOpen, open, close } = useModalState();
  const [fundModalMode, setFundModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const [searchText, setSearchText] = useState('');

  const handleOpenModal = useCallback(
    (selectedFund: InterfaceFundInfo | null, mode: 'edit' | 'create'): void => {
      setFund(selectedFund);
      setFundModalMode(mode);
      open();
    },
    [],
  );

  const fundQueryResult = useQuery<InterfaceFundListQueryResponse>(FUND_LIST, {
    skip: !orgId,
    variables: {
      input: {
        id: orgId ?? '',
      },
    },
  });

  const {
    rows: funds,
    loading: fundLoading,
    error: fundError,
    refetch: refetchFunds,
  } = useTableData<
    InterfaceFundInfo,
    InterfaceFundInfo,
    InterfaceFundListQueryResponse
  >(fundQueryResult, {
    path: (data) => data.organization.funds,
  });

  const fundData = fundQueryResult.data;

  // Set the document title based on the translation
  useEffect(() => {
    document.title = t('funds.title');
  }, [t]);

  const filteredAndSortedFunds = useMemo(() => {
    let result = [...funds];

    // Apply search filter
    if (searchText) {
      result = result.filter((fund) =>
        fund.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply sorting with strict timestamp comparison
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      const sortMultiplier = -1; // Default to createdAt_DESC
      return (dateA - dateB) * sortMultiplier;
    });
  }, [funds, searchText]);

  const handleClick = (fundId: string): void => {
    navigate(`/admin/orgfundcampaign/${orgId}/${fundId}`);
  };

  // Compute aggregated campaign data for each fund
  const fundAggregates = useMemo(() => {
    const map = new Map<string, { totalGoal: number; totalRaised: number; nearestEnd: string | null }>();
    for (const f of filteredAndSortedFunds) {
      const campaigns = f.campaigns?.edges || [];
      let totalGoal = 0;
      let totalRaised = 0;
      let nearestEnd: string | null = null;
      for (const edge of campaigns) {
        totalGoal += edge.node.goalAmount || 0;
        totalRaised += edge.node.amountRaised || 0;
        if (edge.node.endAt && (!nearestEnd || edge.node.endAt < nearestEnd)) {
          nearestEnd = edge.node.endAt;
        }
      }
      map.set(f.id, { totalGoal, totalRaised, nearestEnd });
    }
    return map;
  }, [filteredAndSortedFunds]);

  // Header titles for the funds table (used by TableLoader during loading)
  const headerTitles: string[] = [
    t('funds.fundName'),
    t('funds.goal') || 'Goal',
    t('funds.progress') || 'Progress',
    tCommon('status'),
    t('funds.endDate') || 'End Date',
    tCommon('action'),
  ];

  if (fundError) {
    return (
      <div className={styles.whiteContainer}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.errorIconLarge}`}
          />
          <h6 style={{ textAlign: "center" }}>
            {t('funds.errorLoadingFundsData')}
            <br />
            {fundError.message}
          </h6>
        </div>
      </div>
    );
  }

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('funds.title')}</h1>
          <p className="page-subtitle">
            {t('funds.manageFundsDescription')}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal(null, 'create')}
            data-testid="createFundBtn"
          >
            + {t('funds.createFund')}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">{t('funds.title')}</span>
            <div className="stat-card-icon green">
              <AccountBalanceWallet fontSize="small" />
            </div>
          </div>
          <div className="stat-card-value">{filteredAndSortedFunds.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">{tCommon('active')}</span>
            <div className="stat-card-icon blue">
              <span aria-hidden="true">&#9733;</span>
            </div>
          </div>
          <div className="stat-card-value">
            {filteredAndSortedFunds.filter((f) => !f.isArchived).length}
          </div>
        </div>
      </div>

      <div className="toolbar" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          className="search-input"
          placeholder={t('funds.searchFunds')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value.trim())}
          data-testid="searchByName"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}
        />
      </div>

      {!fundLoading &&
      fundData &&
      filteredAndSortedFunds.length === 0 &&
      searchText.length > 0 ? (
        <div className="card">
          <EmptyState
            icon={<Search />}
            message="noResultsFound"
            description={tCommon('noResultsFoundFor', {
              query: `"${searchText}"`,
            })}
            dataTestId="funds-search-empty"
          />
        </div>
      ) : !fundLoading && fundData && filteredAndSortedFunds.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<AccountBalanceWallet />}
            message={t('funds.noFundsFound')}
            dataTestId="funds-empty"
          />
        </div>
      ) : (
        <div>
          {fundLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
          ) : (
            <div className="table-wrapper">
              <table className="data-table" aria-label={t('funds.title')}>
                <thead>
                  <tr>
                    <th scope="col">{t('funds.fundName')}</th>
                    <th scope="col">{t('funds.goal') || 'Goal'}</th>
                    <th scope="col">{t('funds.progress') || 'Progress'}</th>
                    <th scope="col">{tCommon('status')}</th>
                    <th scope="col">{t('funds.endDate') || 'End Date'}</th>
                    <th scope="col">{tCommon('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedFunds.map((fundItem) => {
                    const agg = fundAggregates.get(fundItem.id);
                    const totalGoal = agg?.totalGoal || 0;
                    const totalRaised = agg?.totalRaised || 0;
                    const progress = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;
                    const nearestEnd = agg?.nearestEnd;

                    return (
                      <tr key={fundItem.id}>
                        <td
                          className="cell-primary"
                          style={{ cursor: 'pointer' }}
                          data-testid="fundName"
                          onClick={() => handleClick(fundItem.id)}
                        >
                          {fundItem.name}
                        </td>
                        <td data-testid="fundGoal">
                          {totalGoal > 0 ? (
                            <span>
                              <span style={{ fontWeight: 600, color: 'var(--gray-900, #111827)' }}>
                                ${totalRaised.toLocaleString()}
                              </span>
                              <span style={{ color: 'var(--gray-400, #9ca3af)' }}>
                                {' '}/ ${totalGoal.toLocaleString()}
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: 'var(--gray-400, #9ca3af)' }}>—</span>
                          )}
                        </td>
                        <td data-testid="fundProgress" style={{ minWidth: 120 }}>
                          {totalGoal > 0 ? (
                            <div>
                              <div className={styles.progressBarBg}>
                                <div
                                  className={styles.progressBarFill}
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <span style={{ fontSize: 12, color: 'var(--gray-500, #6b7280)' }}>
                                {progress}%
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--gray-400, #9ca3af)' }}>—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${fundItem.isArchived ? 'badge-gray' : 'badge-green'}`}
                          >
                            {fundItem.isArchived ? t('funds.archived') : tCommon('active')}
                          </span>
                        </td>
                        <td data-testid="fundEndDate">
                          {nearestEnd
                            ? dayjs(nearestEnd).format('MMM D, YYYY')
                            : <span style={{ color: 'var(--gray-400, #9ca3af)' }}>—</span>
                          }
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            data-testid="editFundBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(fundItem, 'edit');
                            }}
                          >
                            {t('funds.editFund')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <FundModal
        isOpen={isOpen}
        hide={close}
        refetchFunds={refetchFunds}
        fund={fund}
        orgId={orgId}
        mode={fundModalMode}
      />
    </div>
  );
};

export default organizationFunds;
