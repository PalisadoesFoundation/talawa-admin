import { useQuery, type ApolloQueryResult } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import { Popover } from '@base-ui-components/react/popover';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { currencySymbols } from 'utils/currency';
import styles from 'style/app-fixed.module.css';
import PledgeDeleteModal from './deleteModal/PledgeDeleteModal';
import PledgeModal from './modal/PledgeModal';
import { Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from 'components/Avatar/Avatar';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
  InterfaceQueryFundCampaignsPledges,
  InterfaceCampaignInfoPG,
} from 'utils/interfaces';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
}

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-row.Mui-hovered': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-root': { borderRadius: '0.5rem' },
  '& .MuiDataGrid-main': { borderRadius: '0.5rem' },
};

const fundCampaignPledge = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });
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

  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({ [ModalState.SAME]: false, [ModalState.DELETE]: false });

  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfoPG[]>([]);
  const [progressIndicator, setProgressIndicator] = useState<
    'raised' | 'pledged'
  >('pledged');
  const [open, setOpen] = useState(false);
  const id = open ? 'simple-popup' : undefined;
  const [pledgeModalMode, setPledgeModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<
    'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  }: {
    data?: { fundCampaign: InterfaceQueryFundCampaignsPledges };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => Promise<
      ApolloQueryResult<{
        fundCampaign: InterfaceQueryFundCampaignsPledges;
      }>
    >;
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: {
      input: { id: fundCampaignId },
    },
  });

  const { pledges, totalPledged, totalRaised, fundName } = useMemo(() => {
    let totalPledged = 0;
    let totalRaised = 0;

    const pledgesList =
      pledgeData?.fundCampaign?.pledges?.edges.map((edge) => {
        const amount = edge.node.amount || 0;
        totalPledged += amount;
        // Assuming there's no raised amount for now,
        // this should be updated when raised amount data is available
        totalRaised += 0;

        const allUsers =
          'users' in edge.node && Array.isArray(edge.node.users)
            ? edge.node.users
            : [edge.node.pledger];

        return {
          id: edge.node.id,
          amount: amount,
          pledgeDate: edge.node.createdAt
            ? new Date(edge.node.createdAt)
            : new Date(),
          endDate: pledgeData.fundCampaign.endAt
            ? new Date(pledgeData.fundCampaign.endAt)
            : new Date(),
          users: allUsers.filter(Boolean),
          currency: pledgeData.fundCampaign.currencyCode || 'USD',
        };
      }) ?? [];

    const filteredPledges = searchTerm
      ? pledgesList.filter((pledge) => {
          const search = searchTerm.toLowerCase();
          return pledge.users.some((user) =>
            user.name?.toLowerCase().includes(search),
          );
        })
      : pledgesList;

    const sortedPledges = [...filteredPledges].sort((a, b) => {
      switch (sortBy) {
        case 'amount_ASC':
          return a.amount - b.amount;
        case 'amount_DESC':
          return b.amount - a.amount;
        case 'endDate_ASC':
          return a.endDate.getTime() - b.endDate.getTime();
        case 'endDate_DESC':
          return b.endDate.getTime() - a.endDate.getTime();
      }
    });

    // Get fund name from the campaign's fund property
    const fundName =
      pledgeData?.fundCampaign?.pledges?.edges[0]?.node?.campaign?.fund?.name ??
      tCommon('Funds');
    return { pledges: sortedPledges, totalPledged, totalRaised, fundName };
  }, [pledgeData, searchTerm, sortBy, tCommon]);

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

  useEffect(() => {
    refetchPledge();
  }, [sortBy, refetchPledge]);
  console.log('campaignInfo', campaignInfo);

  const openModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };

  const closeModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleOpenModal = useCallback(
    (pledge: InterfacePledgeInfo | null, mode: 'edit' | 'create'): void => {
      setPledge(pledge);
      setPledgeModalMode(mode);
      openModal(ModalState.SAME);
    },
    [openModal],
  );

  const handleDeleteClick = useCallback(
    (pledge: InterfacePledgeInfo): void => {
      setPledge(pledge);
      openModal(ModalState.DELETE);
    },
    [openModal],
  );

  const handleClick = (users: InterfaceUserInfoPG[]): void => {
    setExtraUsers(users);
    setOpen(true);
  };

  const isWithinCampaignDates = useMemo(() => {
    if (!pledgeData?.fundCampaign) return false;

    const now = dayjs();
    let start = dayjs(pledgeData.fundCampaign.startAt);
    let end = dayjs(pledgeData.fundCampaign.endAt);

    return now.isAfter(start) && now.isBefore(end);
  }, [pledgeData]);

  if (pledgeLoading) return <Loader size="xl" />;
  if (pledgeError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
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
      field: 'pledgers',
      headerName: 'Pledgers',
      flex: 3,
      minWidth: 50,
      align: 'left',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const users = params.row.users || [];
        const mainUsers = users.slice(0, 1);
        const extraUsers = users.slice(1);

        return (
          <div className="d-flex flex-wrap gap-1" style={{ maxHeight: 120 }}>
            {mainUsers.map((user: InterfaceUserInfoPG, index: number) => (
              <div
                className={styles.pledgerContainer}
                key={`${params.row.id}-main-${index}`}
                data-testid={`mainUser-${params.row.id}-${index}`}
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
            {extraUsers.length > 0 && (
              <div
                className={styles.moreContainer}
                aria-describedby={id}
                onClick={() => handleClick(extraUsers)}
                data-testid={`moreContainer-${params.row.id}`}
              >
                +{extraUsers.length} more...
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: 'pledgeDate',
      headerName: 'Pledge Date',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return dayjs(params.row.pledgeDate).format('DD/MM/YYYY');
      },
    },
    {
      field: 'amount',
      headerName: 'Pledged',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="amountCell"
          >
            {
              currencySymbols[
                params.row.currency as keyof typeof currencySymbols
              ]
            }
            {params.row.amount.toLocaleString('en-US')}
          </div>
        );
      },
    },
    {
      field: 'donated',
      headerName: 'Donated',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="paidCell"
          >
            {
              currencySymbols[
                params.row.currency as keyof typeof currencySymbols
              ]
            }
            0
          </div>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              className={`me-2 ${styles.editButton}`}
              data-testid="editPledgeBtn"
              onClick={() =>
                handleOpenModal(params.row as InterfacePledgeInfo, 'edit')
              }
            >
              {' '}
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deletePledgeBtn"
              onClick={() =>
                handleDeleteClick(params.row as InterfacePledgeInfo)
              }
            >
              <i className="fa fa-trash" />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" className="ms-1">
        <Link
          underline="hover"
          color="inherit"
          component="button"
          onClick={() => history.go(-2)}
        >
          {fundName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component="button"
          onClick={() => history.back()}
        >
          {campaignInfo?.name}
        </Link>
        <Typography color="text.primary">{t('pledges')}</Typography>
      </Breadcrumbs>
      <div className={styles.overviewContainer}>
        <div className={styles.titleContainer}>
          <h3>{campaignInfo?.name}</h3>
          <span>
            {t('endsOn')} {dayjs(campaignInfo?.endDate).format('DD/MM/YYYY')}
          </span>
        </div>
        <div className={styles.progressContainer}>
          <div className="d-flex justify-content-center">
            <div
              className={`btn-group ${styles.toggleGroup}`}
              role="group"
              aria-label="Toggle between Pledged and Raised amounts"
            >
              <input
                type="radio"
                className={`btn-check ${styles.toggleBtnPledge}`}
                name="btnradio"
                id="pledgedRadio"
                checked={progressIndicator === 'pledged'}
                onChange={() => {
                  setProgressIndicator('pledged');
                }}
              />
              <label
                className={`btn btn-outline-primary ${styles.toggleBtnPledge}`}
                htmlFor="pledgedRadio"
              >
                {t('pledgedAmount')}
              </label>

              <input
                type="radio"
                className={`btn-check ${styles.toggleBtnPledge}`}
                name="btnradio"
                id="raisedRadio"
                onChange={() => setProgressIndicator('raised')}
                checked={progressIndicator === 'raised'}
              />
              <label
                className={`btn btn-outline-primary ${styles.toggleBtnPledge}`}
                htmlFor="raisedRadio"
              >
                {t('raisedAmount')}
              </label>
            </div>
          </div>

          <div className={styles.progress}>
            <ProgressBar
              now={
                progressIndicator === 'pledged'
                  ? (totalPledged / (campaignInfo?.goal || 1)) * 100
                  : (totalRaised / (campaignInfo?.goal || 1)) * 100
              }
              label={`${
                currencySymbols[
                  campaignInfo?.currency as keyof typeof currencySymbols
                ] || '$'
              }${progressIndicator === 'pledged' ? totalPledged.toLocaleString('en-US') : totalRaised.toLocaleString('en-US')}`}
              max={100}
              style={{ height: '1.5rem', fontSize: '0.9rem' }}
              data-testid="progressBar"
              className={`${styles.progressBar}`}
            />
            <div className={styles.endpoints}>
              <div className={styles.start}>
                {currencySymbols[
                  campaignInfo?.currency as keyof typeof currencySymbols
                ] || '$'}
                0
              </div>
              <div className={styles.end}>
                {currencySymbols[
                  campaignInfo?.currency as keyof typeof currencySymbols
                ] || '$'}
                {campaignInfo?.goal.toLocaleString('en-US')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.btnsContainerPledge} align-items-center`}>
        <SearchBar
          placeholder={t('searchPledger')}
          onSearch={setSearchTerm}
          inputTestId="searchPledger"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-4 mb-1">
          <div className="d-flex justify-space-between">
            <SortingButton
              sortingOptions={[
                { label: t('lowestAmount'), value: 'amount_ASC' },
                { label: t('highestAmount'), value: 'amount_DESC' },
                { label: t('latestEndDate'), value: 'endDate_DESC' },
                { label: t('earliestEndDate'), value: 'endDate_ASC' },
              ]}
              selectedOption={sortBy ?? ''}
              onSortChange={(value) =>
                setSortBy(
                  value as
                    | 'amount_ASC'
                    | 'amount_DESC'
                    | 'endDate_ASC'
                    | 'endDate_DESC',
                )
              }
              dataTestIdPrefix="filter"
              buttonLabel={tCommon('sort')}
            />
          </div>
          <div>
            <Button
              variant="success"
              className={styles.dropdown}
              disabled={!isWithinCampaignDates}
              onClick={() => handleOpenModal(null, 'create')}
              data-testid="addPledgeBtn"
              title={!isWithinCampaignDates ? t('campaignNotActive') : ''}
            >
              <i className={'fa fa-plus me-2'} />
              {t('addPledge')}
            </Button>
          </div>
        </div>
      </div>
      <DataGrid
        disableColumnMenu
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row.id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noPledges')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackgroundPledge}`}
        autoHeight
        rowHeight={65}
        rows={pledges.map((pledge) => ({
          id: pledge.id,
          users: pledge.users,
          endDate: pledge.endDate,
          pledgeDate: pledge.pledgeDate,
          amount: pledge.amount,
          currency: pledge.currency,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />
      <PledgeModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
        campaignId={fundCampaignId}
        orgId={orgId}
        pledge={pledge}
        refetchPledge={refetchPledge}
        endDate={pledgeData?.fundCampaign?.endAt as Date}
        mode={pledgeModalMode}
      />
      <PledgeDeleteModal
        isOpen={modalState[ModalState.DELETE]}
        hide={() => closeModal(ModalState.DELETE)}
        pledge={pledge}
        refetchPledge={refetchPledge}
      />
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <div id={id} />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner
            className={`${styles.popup} ${extraUsers.length > 4 ? styles.popupExtra : ''}`}
            data-testid="extra-users-popup"
          >
            <Popover.Popup>
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
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
export default fundCampaignPledge;
