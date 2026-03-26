/**
 * The `Pledges` component is responsible for rendering a user's pledges within a campaign.
 * It fetches pledges data using Apollo Client's `useQuery` hook and displays the data
 * in a DataTable with search, pagination, and modal dialogs.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { Button } from 'shared-components/Button';
import { ProgressBar } from 'react-bootstrap';
import styles from './Pledges.module.css';
import { useTranslation } from 'react-i18next';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import {
  type ApolloError,
  type ApolloQueryResult,
  useQuery,
} from '@apollo/client';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { DataTable } from 'shared-components/DataTable/DataTable';
import dayjs from 'dayjs';
import { currencySymbols } from 'utils/currency';
import { Navigate, useParams } from 'react-router';
import PledgeModal from '../Campaigns/PledgeModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

interface InterfaceUserPledgeRow {
  id: string;
  campaign: InterfacePledgeInfo['campaign'];
  amount: number;
  currency: string;
  goalAmount: number;
  endDate: Date | string | undefined;
  campaignName: string;
}

const Pledges = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userCampaigns' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { getItem } = useLocalStorage();
  const userIdFromStorage = getItem('userId');
  const { orgId } = useParams();
  const userId = (userIdFromStorage as string | null) ?? null;

  const [pledges, setPledges] = useState<InterfacePledgeInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const {
    isOpen: isUpdateModalOpen,
    open: openUpdateModal,
    close: closeUpdateModal,
  } = useModalState();

  type PledgeQueryResult = ApolloQueryResult<{
    getPledgesByUserId: InterfacePledgeInfo[];
  }>;
  interface IPledgeRefetchFn {
    (): Promise<PledgeQueryResult>;
  }

  const shouldSkip = !orgId || !userId;

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  }: {
    data?: { getPledgesByUserId: InterfacePledgeInfo[] };
    loading: boolean;
    error?: ApolloError;
    refetch: IPledgeRefetchFn;
  } = useQuery(USER_PLEDGES, {
    skip: shouldSkip,
    variables: shouldSkip
      ? undefined
      : {
          input: { userId: userId as string },
          where: {},
          orderBy: 'endDate_DESC',
        },
    fetchPolicy: 'cache-and-network',
  });

  const handleOpenModal = useCallback(
    (p: InterfacePledgeInfo | null): void => {
      setPledge(p);
      openUpdateModal();
    },
    [openUpdateModal],
  );

  const isNoPledgesFoundError =
    pledgeError?.graphQLErrors.some((graphQLError) => {
      const code = (graphQLError.extensions as { code?: string } | undefined)
        ?.code;
      return code === 'arguments_associated_resources_not_found';
    }) ?? false;

  useEffect(() => {
    if (pledgeData?.getPledgesByUserId) {
      setPledges(pledgeData.getPledgesByUserId);
      return;
    }
    if (isNoPledgesFoundError) {
      setPledges([]);
    }
  }, [pledgeData, isNoPledgesFoundError]);

  const rows = useMemo<InterfaceUserPledgeRow[]>(() => {
    return pledges.map((p) => {
      return {
        id: p.id,
        campaign: p.campaign,
        amount: p.amount,
        currency: p.campaign?.currencyCode ?? 'USD',
        goalAmount: p.campaign?.goalAmount ?? 0,
        endDate: p.campaign?.endAt,
        campaignName: p.campaign?.name || '',
      };
    });
  }, [pledges]);

  const filteredRows = useMemo<InterfaceUserPledgeRow[]>(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => row.campaignName.toLowerCase().includes(query));
  }, [rows, searchText]);

  const columns: IColumnDef<InterfaceUserPledgeRow>[] = [
    {
      id: 'associatedCampaign',
      header: t('associatedCampaign'),
      accessor: 'campaignName',
      render: (value) => <>{String(value || '')}</>,
      meta: { sortable: false },
    },
    {
      id: 'endDate',
      header: tCommon('endDate'),
      accessor: 'endDate',
      render: (value) =>
        value ? dayjs(String(value)).format('DD/MM/YYYY') : '-',
      meta: { sortable: false },
    },
    {
      id: 'amount',
      header: t('pledged'),
      accessor: 'amount',
      render: (value, row) => (
        <div data-testid="amountCell">
          {currencySymbols[row.currency as keyof typeof currencySymbols]}
          {Number(value)}
        </div>
      ),
      meta: { sortable: false },
    },
    {
      id: 'donated',
      header: t('donated'),
      accessor: 'amount',
      render: (_value, row) => (
        <div data-testid="paidCell">
          {currencySymbols[row.currency as keyof typeof currencySymbols]}0
        </div>
      ),
      meta: { sortable: false },
    },
    {
      id: 'progress',
      header: t('progress'),
      accessor: 'goalAmount',
      render: (_value, row) => (
        <ProgressBar
          now={row.goalAmount > 0 ? (row.amount / row.goalAmount) * 100 : 0}
          label={
            row.goalAmount > 0
              ? `${Math.round((row.amount / row.goalAmount) * 100)}%`
              : '0%'
          }
          data-testid="progressBar"
        />
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
          data-testid="editPledgeBtn"
          onClick={() => handleOpenModal(row as unknown as InterfacePledgeInfo)}
        >
          <i className="fa fa-edit me-1" />
          {tCommon('edit')}
        </Button>
      ),
      meta: { sortable: false },
    },
  ];

  if (!orgId || !userId) {
    return <Navigate to="/" replace />;
  }

  if (pledgeError && !isNoPledgesFoundError) {
    return (
      <div className={styles.container + ' bg-white rounded-4 my-3'}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Pledges' })}
            <br />
            {pledgeError.message}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <LoadingState isLoading={pledgeLoading} variant="spinner">
      <div>
        <div className="mb-4">
          <SearchFilterBar
            searchPlaceholder={tCommon('searchBy', {
              item: t('campaigns'),
            })}
            searchValue={searchText}
            onSearchChange={(value) => setSearchText(value.trim())}
            onSearchSubmit={(value: string) => setSearchText(value.trim())}
            searchInputTestId="searchByInput"
            searchButtonTestId="searchBtn"
            hasDropdowns={false}
          />
        </div>

        <DataTable
          data={filteredRows}
          columns={columns}
          rowKey="id"
          loading={pledgeLoading}
          paginationMode="client"
          pageSize={10}
          emptyMessage={t('noPledges')}
          ariaLabel={t('myPledges')}
        />

        {isUpdateModalOpen && pledge && pledge.campaign?.id && (
          <PledgeModal
            isOpen={isUpdateModalOpen}
            hide={closeUpdateModal}
            pledge={pledge}
            refetchPledge={refetchPledge}
            campaignId={pledge.campaign.id}
            userId={userId}
            mode="edit"
          />
        )}
      </div>
    </LoadingState>
  );
};

export default Pledges;
