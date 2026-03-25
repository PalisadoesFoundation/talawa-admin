import { useQuery } from '@apollo/client';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Search from '@mui/icons-material/Search';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import FundModal from './modal/FundModal';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import type { InterfaceFundInfo } from 'utils/interfaces';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFunds.module.css';
import Button from 'shared-components/Button';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

interface InterfaceFundListQueryData {
  organization?: {
    funds?: {
      edges?: Array<{ node: InterfaceFundInfo }>;
    };
  };
}

/**
 * `organizationFunds` component displays a list of funds for a specific organization,
 * allowing users to search, sort, view and edit funds.
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
    [open],
  );

  const fundsQuery = useQuery<InterfaceFundListQueryData>(FUND_LIST, {
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
    InterfaceFundListQueryData
  >(fundsQuery, {
    path: (data) => data?.organization?.funds,
  });

  useEffect(() => {
    document.title = t('funds.title');
  }, [t]);

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const filteredAndSortedFunds = useMemo(() => {
    let result = [...funds];

    if (searchText) {
      result = result.filter((currentFund) =>
        currentFund.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      const sortMultiplier = -1; // Default to createdAt_DESC
      return (dateA - dateB) * sortMultiplier;
    });
  }, [funds, searchText]);

  const fundIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredAndSortedFunds.forEach((currentFund, idx) => {
      map.set(currentFund.id, idx + 1);
    });
    return map;
  }, [filteredAndSortedFunds]);

  const handleClick = useCallback(
    (fundId: string): void => {
      navigate(`/admin/orgfundcampaign/${orgId}/${fundId}`);
    },
    [navigate, orgId],
  );

  if (fundError) {
    return (
      <div className={styles.whiteContainer}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={`${styles.errorIcon} ${styles.errorIconLarge}`}
          />
          <h6 className="fw-bold text-danger text-center">
            {t('funds.errorLoadingFundsData')}
            <br />
            {fundError.message}
          </h6>
        </div>
      </div>
    );
  }

  const columns: IColumnDef<InterfaceFundInfo>[] = [
    {
      id: 'sl_no',
      header: tCommon('hash'),
      accessor: () => 0,
      render: (_value, row) => (
        <span className={styles.requestsTableItemIndex}>
          {fundIndexMap.get(row.id) ?? 0}
        </span>
      ),
      meta: { sortable: false },
    },
    {
      id: 'fundName',
      header: t('funds.fundName'),
      accessor: 'name',
      render: (_value, row) => (
        <Button
          variant="outline-light"
          size="sm"
          className="p-0 border-0 bg-transparent text-primary"
          data-testid="fundName"
          onClick={() => handleClick(row.id)}
        >
          {row.name}
        </Button>
      ),
      meta: { sortable: false },
    },
    {
      id: 'createdAt',
      header: tCommon('createdOn'),
      accessor: 'createdAt',
      render: (value) => (
        <div data-testid="createdOn">
          {dayjs(String(value)).format('DD/MM/YYYY')}
        </div>
      ),
      meta: { sortable: false },
    },
    {
      id: 'status',
      header: t('funds.status'),
      accessor: 'isArchived',
      render: (value) => (value ? t('funds.archived') : tCommon('active')),
      meta: { sortable: false },
    },
    {
      id: 'assocCampaigns',
      header: t('funds.assocCampaigns'),
      accessor: 'id',
      render: (_value, row) => (
        <Button
          size="sm"
          className={styles.editButton}
          aria-label={t('funds.viewCampaigns')}
          onClick={() => handleClick(row.id)}
          data-testid="viewBtn"
        >
          <i className="fa fa-eye me-1" />
          {t('funds.viewCampaigns')}
        </Button>
      ),
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
          data-testid="editFundBtn"
          onClick={() => handleOpenModal(row, 'edit')}
        >
          <i className="fa fa-edit me-1" />
          {t('funds.editFund')}
        </Button>
      ),
      meta: { sortable: false },
    },
  ];

  return (
    <div>
      <div className={styles.searchContainerRowNoTopMargin}>
        <SearchFilterBar
          searchPlaceholder={t('funds.searchFunds')}
          searchValue={searchText}
          onSearchChange={(value) => setSearchText(value.trim())}
          onSearchSubmit={(value: string) => {
            setSearchText(value.trim());
          }}
          searchInputTestId="searchByName"
          searchButtonTestId="searchButton"
          hasDropdowns={false}
        />

        <Button
          variant="success"
          onClick={() => handleOpenModal(null, 'create')}
          className={`${styles.createFundButton} ${styles.buttonNoWrap}`}
          data-testid="createFundBtn"
        >
          <i className="fa fa-plus me-2" aria-hidden="true" />
          {t('funds.createFund')}
        </Button>
      </div>

      {!fundLoading &&
      fundsQuery.data &&
      filteredAndSortedFunds.length === 0 &&
      searchText.length > 0 ? (
        <EmptyState
          icon={<Search />}
          message="noResultsFound"
          description={tCommon('noResultsFoundFor', {
            query: `"${searchText}"`,
          })}
          dataTestId="funds-search-empty"
        />
      ) : !fundLoading &&
        fundsQuery.data &&
        filteredAndSortedFunds.length === 0 ? (
        <EmptyState
          icon={<AccountBalanceWallet />}
          message={t('funds.noFundsFound')}
          dataTestId="funds-empty"
        />
      ) : (
        <div className={styles.listBox}>
          <DataTable<InterfaceFundInfo>
            data={filteredAndSortedFunds}
            columns={columns}
            loading={fundLoading}
            error={null}
            rowKey="id"
            paginationMode="client"
            pageSize={10}
            tableClassName={`${styles.listTable} ${styles.overflowVisible}`}
          />
          {filteredAndSortedFunds.length > 0 && (
            <div className={'w-100 text-center my-4'}>
              <h5 className="m-0">{tCommon('endOfResults')}</h5>
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
