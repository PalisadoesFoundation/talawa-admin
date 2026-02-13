/**
 * The `Pledges` component is responsible for rendering a user's pledges within a campaign.
 * It fetches pledges data using Apollo Client's `useQuery` hook and displays the data
 * in a DataGrid with search, sorting, pagination, and modal dialogs.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { Button } from 'shared-components/Button';
import { ProgressBar } from 'react-bootstrap';
import styles from './Pledges.module.css';
import { useTranslation } from 'react-i18next';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import useLocalStorage from 'utils/useLocalstorage';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import {
  type ApolloError,
  type ApolloQueryResult,
  useQuery,
} from '@apollo/client';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import {
  DataGridWrapper,
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import Avatar from 'shared-components/Avatar/Avatar';
import dayjs from 'dayjs';
import { currencySymbols } from 'utils/currency';
import PledgeDeleteModal from 'screens/AdminPortal/FundCampaignPledge/deleteModal/PledgeDeleteModal';
import { Navigate, useParams } from 'react-router';
import PledgeModal from '../Campaigns/PledgeModal';

const Pledges = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userCampaigns' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { getItem } = useLocalStorage();
  const userIdFromStorage = getItem('userId');
  const { orgId } = useParams();
  const userId = (userIdFromStorage as string | null) ?? null;

  const [pledges, setPledges] = useState<InterfacePledgeInfo[]>([]);
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const {
    isOpen: isUpdateModalOpen,
    open: openUpdateModal,
    close: closeUpdateModal,
  } = useModalState();
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
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

  if (!orgId || !userId) {
    return <Navigate to="/" replace />;
  }

  const handleOpenModal = useCallback(
    (p: InterfacePledgeInfo | null): void => {
      setPledge(p);
      openUpdateModal();
    },
    [openUpdateModal],
  );

  const handleDeleteClick = useCallback(
    (p: InterfacePledgeInfo): void => {
      setPledge(p);
      openDeleteModal();
    },
    [openDeleteModal],
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

  const columns: GridColDef[] = [
    {
      field: 'pledger',
      headerName: t('pledgers'),
      flex: 4,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const pledger = params.row.pledger;
        const users = params.row.users || (pledger ? [pledger] : []);
        return (
          <div className="d-flex flex-wrap gap-1">
            {users
              .slice(0, 2)
              .map((user: InterfaceUserInfoPG, index: number) => (
                <div
                  className={styles.pledgerContainer}
                  key={`${user.id}-${index}`}
                >
                  {user.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={user.name}
                      data-testid={'image-pledger-' + user.id}
                      className={styles.TableImage}
                    />
                  ) : (
                    <Avatar
                      containerStyle={styles.imageContainerPledge}
                      avatarStyle={styles.TableImagePledge}
                      name={user.name}
                      alt={user.name}
                      dataTestId={'avatar-pledger-' + user.id}
                    />
                  )}
                  <span>{user.name}</span>
                </div>
              ))}
          </div>
        );
      },
    },
    {
      field: 'associatedCampaign',
      headerName: t('associatedCampaign'),
      flex: 2,
      sortable: false,
      renderCell: (params) => <>{params.row.campaign?.name}</>,
    },
    {
      field: 'endDate',
      headerName: tCommon('endDate'),
      flex: 1,
      sortable: false,
      renderCell: (params) =>
        params.row.endDate
          ? dayjs(params.row.endDate).format('DD/MM/YYYY')
          : '-',
    },
    {
      field: 'amount',
      headerName: t('pledged'),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div data-testid="amountCell">
          {currencySymbols[params.row.currency]}
          {params.row.amount}
        </div>
      ),
    },
    {
      field: 'donated',
      headerName: t('donated'),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div data-testid="paidCell">
          {currencySymbols[params.row.currency]}0
        </div>
      ),
    },
    {
      field: 'progress',
      headerName: t('progress'),
      flex: 2,
      sortable: false,
      renderCell: (params) => (
        <ProgressBar
          now={
            params.row.goalAmount > 0
              ? (params.row.amount / params.row.goalAmount) * 100
              : 0
          }
          label={
            params.row.goalAmount > 0
              ? `${Math.round(
                  (params.row.amount / params.row.goalAmount) * 100,
                )}%`
              : '0%'
          }
          data-testid="progressBar"
        />
      ),
    },
    {
      field: 'action',
      headerName: tCommon('action'),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="success"
            size="sm"
            data-testid="editPledgeBtn"
            onClick={() => handleOpenModal(params.row as InterfacePledgeInfo)}
          >
            <i className="fa fa-edit" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            data-testid="deletePledgeBtn"
            onClick={() => handleDeleteClick(params.row as InterfacePledgeInfo)}
          >
            <i className="fa fa-trash" />
          </Button>
        </>
      ),
    },
  ];

  const rows = pledges.map((p) => {
    const pledger = p.pledger;
    const users = p.users || (pledger ? [pledger] : []);
    const pledgerNames = users
      .map((u: InterfaceUserInfoPG) => u.name)
      .join(' ');

    return {
      id: p.id,
      campaign: p.campaign,
      pledger: p.pledger,
      users: p.users,
      amount: p.amount,
      currency: p.campaign?.currencyCode,
      goalAmount: p.campaign?.goalAmount,
      endDate: p.campaign?.endAt,
      pledgerName: pledgerNames,
      campaignName: p.campaign?.name || '',
    };
  });

  return (
    <LoadingState isLoading={pledgeLoading} variant="spinner">
      <div>
        <DataGridWrapper
          rows={rows}
          columns={columns}
          loading={pledgeLoading}
          emptyStateProps={{
            message: t('noPledges'),
          }}
          searchConfig={{
            enabled: true,
            fields: ['pledgerName', 'campaignName'],
            placeholder: tCommon('searchBy', {
              item: `${t('pledgers')} or ${t('campaigns')}`,
            }),
          }}
          paginationConfig={{
            enabled: true,
            defaultPageSize: 10,
            pageSizeOptions: [5, 10, 25, 50],
          }}
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

        {isDeleteModalOpen && pledge && (
          <PledgeDeleteModal
            isOpen={isDeleteModalOpen}
            hide={closeDeleteModal}
            pledge={pledge}
            refetchPledge={refetchPledge}
          />
        )}
      </div>
    </LoadingState>
  );
};

export default Pledges;
