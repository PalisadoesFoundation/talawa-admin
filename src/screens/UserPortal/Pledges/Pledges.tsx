/**
 * The `Pledges` component is responsible for rendering a user's pledges within a campaign.
 * It fetches pledges data using Apollo Client's `useQuery` hook and displays the data
 * in a DataGrid with various features such as search, sorting, and modal dialogs.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { WarningAmberRounded } from '@mui/icons-material';
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
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import { Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import dayjs from 'dayjs';
import { currencySymbols } from 'utils/currency';
import PledgeDeleteModal from 'screens/AdminPortal/FundCampaignPledge/deleteModal/PledgeDeleteModal';
import { Navigate, useParams } from 'react-router';
import PledgeModal from '../Campaigns/PledgeModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
};

enum ModalState {
  UPDATE = 'update',
  DELETE = 'delete',
}

const Pledges = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userCampaigns' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { getItem } = useLocalStorage();
  const userIdFromStorage = getItem('userId');
  const { orgId } = useParams();
  const userId = (userIdFromStorage as string | null) ?? null;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pledges, setPledges] = useState<InterfacePledgeInfo[]>([]);
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const [searchBy, setSearchBy] = useState<'pledgers' | 'campaigns'>(
    'pledgers',
  );
  const [sortBy, setSortBy] = useState<
    'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({ [ModalState.UPDATE]: false, [ModalState.DELETE]: false });

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
          where: searchTerm
            ? {
                ...(searchBy === 'pledgers' && {
                  firstName_contains: searchTerm,
                }),
                ...(searchBy === 'campaigns' && {
                  name_contains: searchTerm,
                }),
              }
            : {},
          orderBy: sortBy,
        },
  });

  if (!orgId || !userId) {
    return <Navigate to="/" replace />;
  }

  const openModal = (modal: ModalState): void => {
    setModalState((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: ModalState): void => {
    setModalState((prev) => ({ ...prev, [modal]: false }));
  };

  const handleOpenModal = useCallback((p: InterfacePledgeInfo | null): void => {
    setPledge(p);
    openModal(ModalState.UPDATE);
  }, []);

  const handleDeleteClick = useCallback((p: InterfacePledgeInfo): void => {
    setPledge(p);
    openModal(ModalState.DELETE);
  }, []);

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
      renderCell: (params) => dayjs(params.row.endDate).format('DD/MM/YYYY'),
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

  const searchByDropdown = {
    id: 'searchBy',
    label: t('searchBy'),
    type: 'filter' as const,
    options: [
      { label: t('pledgers'), value: 'pledgers' },
      { label: t('campaigns'), value: 'campaigns' },
    ],
    selectedOption: searchBy,
    onOptionChange: (value: string | number) =>
      setSearchBy(value as 'pledgers' | 'campaigns'),
    dataTestIdPrefix: 'searchBy',
  };

  const sortDropdown = {
    id: 'sort',
    label: tCommon('sort'),
    type: 'sort' as const,
    options: [
      { label: t('lowestAmount'), value: 'amount_ASC' },
      { label: t('highestAmount'), value: 'amount_DESC' },
      { label: t('latestEndDate'), value: 'endDate_DESC' },
      { label: t('earliestEndDate'), value: 'endDate_ASC' },
    ],
    selectedOption: sortBy,
    onOptionChange: (value: string | number) =>
      setSortBy(
        value as 'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC',
      ),
    dataTestIdPrefix: 'sort',
  };

  return (
    <LoadingState isLoading={pledgeLoading} variant="spinner">
      <div>
        <SearchFilterBar
          searchPlaceholder={tCommon('searchBy', {
            item: `${t('pledgers')} or ${t('campaigns')}`,
          })}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchInputTestId="searchByInput"
          searchButtonTestId="searchBtn"
          hasDropdowns={true}
          dropdowns={[searchByDropdown, sortDropdown]}
        />

        <DataGrid
          disableColumnMenu
          hideFooter
          getRowId={(row) => row.id}
          sx={dataGridStyle}
          autoHeight
          rowHeight={65}
          rows={pledges.map((p) => ({
            id: p.id,
            campaign: p.campaign,
            pledger: p.pledger,
            users: p.users,
            amount: p.amount,
            currency: p.campaign?.currencyCode,
            goalAmount: p.campaign?.goalAmount,
            endDate: p.campaign?.endAt,
          }))}
          columns={columns}
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {t('noPledges')}
              </Stack>
            ),
          }}
        />

        <PledgeModal
          isOpen={modalState[ModalState.UPDATE]}
          hide={() => closeModal(ModalState.UPDATE)}
          campaignId={pledge?.campaign?.id || ''}
          userId={userId}
          pledge={pledge}
          refetchPledge={refetchPledge}
          mode="edit"
        />

        <PledgeDeleteModal
          isOpen={modalState[ModalState.DELETE]}
          hide={() => closeModal(ModalState.DELETE)}
          pledge={pledge}
          refetchPledge={refetchPledge}
        />
      </div>
    </LoadingState>
  );
};

export default Pledges;
