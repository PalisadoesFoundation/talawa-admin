import { useQuery } from '@apollo/client';
import {
  AccountBalanceWallet,
  Search,
  WarningAmberRounded,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import FundModal from './modal/FundModal';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';
import type { InterfaceFundInfo } from 'utils/interfaces';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import styles from './OrganizationFunds.module.css';
import Button from 'shared-components/Button';
import { useModalState } from 'shared-components/CRUDModalTemplate';

/**
 * `organizationFunds` component displays a list of funds for a specific organization,
 * allowing users to search, sort, view and edit funds.
 *
 * This component utilizes the `DataTable` component to present the list of funds in a tabular format,
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
  type FundRow = InterfaceFundInfo & { slNo: number };

  const handleOpenModal = useCallback(
    (selectedFund: InterfaceFundInfo | null, mode: 'edit' | 'create'): void => {
      setFund(selectedFund);
      setFundModalMode(mode);
      open();
    },
    [],
  );

  const {
    data: fundData,
    loading: fundLoading,
    error: fundError,
    refetch: refetchFunds,
  }: {
    data?: {
      organization: {
        funds: {
          edges: { node: InterfaceFundInfo }[];
        };
      };
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(FUND_LIST, {
    skip: !orgId,
    variables: {
      input: {
        id: orgId ?? '',
      },
    },
  });

  // Set the document title based on the translation
  useEffect(() => {
    document.title = t('funds.title');
  }, [t]);

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const funds = useMemo<FundRow[]>(() => {
    return (
      fundData?.organization?.funds?.edges.map(
        (edge: { node: InterfaceFundInfo }, index: number) => ({
          ...edge.node,
          slNo: index + 1,
        }),
      ) ?? []
    );
  }, [fundData]);

  const filteredAndSortedFunds = useMemo<FundRow[]>(() => {
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

  // Column definitions for DataTable
  const columns: Array<IColumnDef<FundRow>> = [
    {
      id: 'sl_no',
      header: tCommon('hash'),
      accessor: 'slNo',
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'fundName',
      header: t('funds.fundName'),
      accessor: 'name',
      render: (value, fund) => (
        <Button
          variant="link"
          className="p-0 text-start"
          onClick={() => handleClick(fund.id)}
          data-testid="fundName"
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
      id: 'createdAt',
      header: tCommon('createdOn'),
      accessor: (fund) => dayjs(fund.createdAt).format('DD/MM/YYYY'),
      render: (value) => <div data-testid="createdOn">{value as string}</div>,
      meta: {
        sortable: true,
        align: 'center',
        sortFn: (a, b) =>
          dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      },
    },
    {
      id: 'status',
      header: t('funds.status'),
      accessor: (fund) =>
        fund.isArchived ? t('funds.archived') : tCommon('active'),
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'assocCampaigns',
      header: t('funds.assocCampaigns'),
      accessor: () => '',
      render: (_value, fund) => (
        <Button
          size="sm"
          className={styles.editButton}
          aria-label={t('funds.viewCampaigns')}
          onClick={() => handleClick(fund.id)}
          data-testid="viewBtn"
        >
          <i className="fa fa-eye me-1" />
          {t('funds.viewCampaigns')}
        </Button>
      ),
      meta: {
        sortable: false,
        align: 'center',
      },
    },
    {
      id: 'action',
      header: tCommon('action'),
      accessor: () => '',
      render: (_value, fund) => (
        <Button
          size="sm"
          className={styles.editButton}
          data-testid="editFundBtn"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(fund, 'edit');
          }}
        >
          <i className="fa fa-edit me-1" />
          {t('funds.editFund')}
        </Button>
      ),
      meta: {
        sortable: false,
        align: 'center',
      },
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
          <DataTable
            data={filteredAndSortedFunds}
            columns={columns}
            loading={fundLoading}
            rowKey="id"
            emptyMessage={t('funds.noFundsFound')}
            tableClassName={styles.listTable}
          />
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
