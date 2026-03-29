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
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFunds.module.css';
import Button from 'shared-components/Button';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

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

  // Header titles for the funds table
  const headerTitles: string[] = [
    tCommon('hash'),
    t('funds.fundName'),
    tCommon('createdOn'),
    tCommon('status'),
    t('funds.associatedCampaigns'),
    tCommon('action'),
  ];

  const fundIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredAndSortedFunds.forEach((item, index) => {
      if (item.id) {
        map.set(item.id, index + 1);
      }
    });
    return map;
  }, [filteredAndSortedFunds]);

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
      accessor: 'id',
      render: (_value, row) => (
        <span className={styles.requestsTableItemIndex}>
          {fundIndexMap.get(row.id) ?? 0}
        </span>
      ),
      meta: {
        sortable: false,
      },
    },
    {
      id: 'fundName',
      header: t('funds.fundName'),
      accessor: 'name',
      render: (value, row) => {
        return (
          <Button
            variant="link"
            className={styles.fundNameButton}
            data-testid="fundName"
            onClick={() => handleClick(row.id)}
          >
            <i className="fa fa-link me-1" aria-hidden="true" />
            {String(value)}
          </Button>
        );
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'createdAt',
      header: tCommon('createdOn'),
      accessor: 'createdAt',
      render: (value) => {
        return (
          <div data-testid="createdOn">
            {dayjs(String(value)).format('DD/MM/YYYY')}
          </div>
        );
      },
      meta: {
        sortable: true,
        sortFn: (a, b) =>
          dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      },
    },
    {
      id: 'status',
      header: t('funds.status'),
      accessor: 'isArchived',
      render: (value) => {
        return value ? t('funds.archived') : tCommon('active');
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'assocCampaigns',
      header: t('funds.assocCampaigns'),
      accessor: 'id',
      render: (value) => {
        return (
          <Button
            size="sm"
            className={styles.editButton}
            aria-label={t('funds.viewCampaigns')}
            onClick={() => handleClick(value as string)}
            data-testid="viewBtn"
          >
            <i className="fa fa-eye me-1" />
            {t('funds.viewCampaigns')}
          </Button>
        );
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'action',
      header: tCommon('action'),
      accessor: 'id',
      render: (_value, row) => {
        return (
          <Button
            size="sm"
            className={styles.editButton}
            data-testid="editFundBtn"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(row, 'edit');
            }}
          >
            <i className="fa fa-edit me-1" />
            {t('funds.editFund')}
          </Button>
        );
      },
      meta: {
        sortable: false,
      },
    },
  ];

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

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
      fundData &&
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
      ) : !fundLoading && fundData && filteredAndSortedFunds.length === 0 ? (
        <EmptyState
          icon={<AccountBalanceWallet />}
          message={t('funds.noFundsFound')}
          dataTestId="funds-empty"
        />
      ) : (
        <div className={styles.listBox}>
          {fundLoading ? (
            <TableLoader headerTitles={headerTitles} noOfRows={PAGE_SIZE} />
          ) : (
            <>
              <DataTable
                data={filteredAndSortedFunds}
                columns={columns}
                rowKey="id"
                loading={fundLoading}
                paginationMode="client"
                pageSize={PAGE_SIZE}
                tableClassName={styles.listTable}
                emptyMessage={t('funds.noFundsFound')}
                ariaLabel={t('funds.title')}
              />
              {filteredAndSortedFunds.length > 0 && (
                <div className={'w-100 text-center my-4'}>
                  <h5 className="m-0">{tCommon('endOfResults')}</h5>
                </div>
              )}
            </>
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
