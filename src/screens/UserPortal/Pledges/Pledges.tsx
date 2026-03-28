/**
 * The `Pledges` component is responsible for rendering a user's pledges within a campaign.
 * It fetches pledges data using Apollo Client's `useQuery` hook and displays the data
 * in a DataTable with search, pagination, and modal dialogs.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { Button } from 'shared-components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './Pledges.module.css';
import { useTranslation } from 'react-i18next';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { useQuery } from '@apollo/client';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import dayjs from 'dayjs';
import { currencySymbols } from 'utils/currency';
import { Navigate, useParams } from 'react-router';
import PledgeModal from '../Campaigns/PledgeModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

interface InterfaceUserPledgeRow {
  id: string;
  original: InterfacePledgeInfo;
  campaign: InterfacePledgeInfo['campaign'];
  amount: number;
  amountRaised: number;
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

  const [searchText, setSearchText] = useState('');
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const {
    isOpen: isUpdateModalOpen,
    open: openUpdateModal,
    close: closeUpdateModal,
  } = useModalState();

  const shouldSkip = !orgId || !userId;

  const pledgesQueryResult = useQuery<{
    getPledgesByUserId: InterfacePledgeInfo[];
  }>(USER_PLEDGES, {
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

  const {
    rows,
    loading: pledgeLoading,
    refetch: refetchPledge,
  } = useTableData<
    InterfacePledgeInfo,
    InterfaceUserPledgeRow,
    { getPledgesByUserId: InterfacePledgeInfo[] }
  >(pledgesQueryResult, {
    path: (data) => ({
      edges: (data.getPledgesByUserId ?? []).map((node) => ({ node })),
    }),
    transformNode: (p) => ({
      id: p.id,
      original: p,
      campaign: p.campaign,
      amount: p.amount,
      amountRaised: p.campaign?.amountRaised ?? 0,
      currency: p.campaign?.currencyCode ?? 'USD',
      goalAmount: p.campaign?.goalAmount ?? 0,
      endDate: p.campaign?.endAt,
      campaignName: p.campaign?.name || '',
    }),
  });

  const { error: pledgeError } = pledgesQueryResult;

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
      meta: { sortable: false, align: 'center' },
    },
    {
      id: 'endDate',
      header: tCommon('endDate'),
      accessor: 'endDate',
      render: (value) =>
        value ? dayjs(String(value)).format('DD/MM/YYYY') : '-',
      meta: { sortable: false, align: 'center' },
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
      meta: { sortable: false, align: 'center' },
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
      meta: { sortable: false, align: 'center' },
    },
    {
      id: 'progress',
      header: t('progress'),
      accessor: 'goalAmount',
      render: (_value, row) => {
        const percentage =
          row.goalAmount > 0
            ? Math.min((row.amountRaised / row.goalAmount) * 100, 100)
            : 0;
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
            data-testid="progressBar"
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
      meta: { sortable: false, align: 'center' },
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
          onClick={() => handleOpenModal(row.original)}
        >
          <i className="fa fa-edit me-1" />
          {tCommon('edit')}
        </Button>
      ),
      meta: { sortable: false, align: 'center' },
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
      <div className={styles.contentWrapper}>
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
          tableClassName={styles.uniformTableLayout}
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
