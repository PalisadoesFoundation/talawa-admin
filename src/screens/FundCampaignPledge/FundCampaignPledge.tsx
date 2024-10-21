import { useQuery, type ApolloQueryResult } from '@apollo/client';
import { Search, Sort, WarningAmberRounded } from '@mui/icons-material';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { currencySymbols } from 'utils/currency';
import styles from './FundCampaignPledge.module.css';
import PledgeDeleteModal from './PledgeDeleteModal';
import PledgeModal from './PledgeModal';
import { Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from 'components/Avatar/Avatar';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import type {
  InterfacePledgeInfo,
  InterfacePledger,
  InterfaceQueryFundCampaignsPledges,
} from 'utils/interfaces';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface InterfaceCampaignInfo {
  name: string;
  goal: number;
  startDate: Date;
  endDate: Date;
  currency: string;
}

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
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.5rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.5rem',
  },
};
const fundCampaignPledge = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pledges',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { fundCampaignId, orgId } = useParams();
  if (!fundCampaignId || !orgId) {
    return <Navigate to={'/'} replace />;
  }

  const [campaignInfo, setCampaignInfo] = useState<InterfaceCampaignInfo>({
    name: '',
    goal: 0,
    startDate: new Date(),
    endDate: new Date(),
    currency: '',
  });

  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
  });

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [extraUsers, setExtraUsers] = useState<InterfacePledger[]>([]);
  const [progressIndicator, setProgressIndicator] = useState<
    'raised' | 'pledged'
  >('pledged');
  const open = Boolean(anchor);
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
    data?: {
      getFundraisingCampaigns: InterfaceQueryFundCampaignsPledges[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => Promise<
      ApolloQueryResult<{
        getFundraisingCampaigns: InterfaceQueryFundCampaignsPledges[];
      }>
    >;
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: {
      where: {
        id: fundCampaignId,
      },
      pledgeOrderBy: sortBy,
    },
  });

  const endDate = dayjs(
    pledgeData?.getFundraisingCampaigns[0]?.endDate,
    'YYYY-MM-DD',
  ).toDate();

  const { pledges, totalPledged, fundName } = useMemo(() => {
    let totalPledged = 0;
    const pledges =
      pledgeData?.getFundraisingCampaigns[0].pledges.filter((pledge) => {
        totalPledged += pledge.amount;
        const search = searchTerm.toLowerCase();
        return pledge.users.some((user) => {
          const fullName = `${user.firstName} ${user.lastName}`;
          return fullName.toLowerCase().includes(search);
        });
      }) ?? [];
    const fundName =
      pledgeData?.getFundraisingCampaigns[0].fundId.name ?? tCommon('Funds');
    return { pledges, totalPledged, fundName };
  }, [pledgeData, searchTerm]);

  useEffect(() => {
    if (pledgeData) {
      setCampaignInfo({
        name: pledgeData.getFundraisingCampaigns[0].name,
        goal: pledgeData.getFundraisingCampaigns[0].fundingGoal,
        startDate: pledgeData.getFundraisingCampaigns[0].startDate,
        endDate: pledgeData.getFundraisingCampaigns[0].endDate,
        currency: pledgeData.getFundraisingCampaigns[0].currency,
      });
    }
  }, [pledgeData]);

  useEffect(() => {
    refetchPledge();
  }, [sortBy, refetchPledge]);

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

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    users: InterfacePledger[],
  ): void => {
    setExtraUsers(users);
    setAnchor(anchor ? null : event.currentTarget);
  };

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
        return (
          <div className="d-flex flex-wrap gap-1" style={{ maxHeight: 120 }}>
            {params.row.users
              .slice(0, 2)
              .map((user: InterfacePledger, index: number) => (
                <div className={styles.pledgerContainer} key={index}>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="pledge"
                      data-testid={`image${index + 1}`}
                      className={styles.TableImage}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={user._id + '1'}
                        containerStyle={styles.imageContainer}
                        avatarStyle={styles.TableImage}
                        name={user.firstName + ' ' + user.lastName}
                        alt={user.firstName + ' ' + user.lastName}
                      />
                    </div>
                  )}
                  <span key={user._id + '2'}>
                    {user.firstName + ' ' + user.lastName}
                  </span>
                </div>
              ))}
            {params.row.users.length > 2 && (
              <div
                className={styles.moreContainer}
                aria-describedby={id}
                data-testid="moreContainer"
                onClick={(e) => handleClick(e, params.row.users.slice(2))}
              >
                <span>+{params.row.users.length - 2} more...</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return dayjs(params.row.startDate).format('DD/MM/YYYY');
      },
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return dayjs(params.row.endDate).format('DD/MM/YYYY');
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
            {params.row.amount}
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
              className="me-2 rounded"
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
          onClick={
            /* istanbul ignore next */
            () => history.go(-2)
          }
        >
          {fundName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component="button"
          onClick={
            /* istanbul ignore next */
            () => history.back()
          }
        >
          {campaignInfo?.name}
        </Link>
        <Typography color="text.primary">{t('pledges')}</Typography>
      </Breadcrumbs>
      <div className={styles.overviewContainer}>
        <div className={styles.titleContainer}>
          <h3>{campaignInfo?.name}</h3>
          <span>
            {t('endsOn')} {campaignInfo?.endDate.toString()}
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
                className={`btn-check ${styles.toggleBtn}`}
                name="btnradio"
                id="pledgedRadio"
                checked={progressIndicator === 'pledged'}
                onChange={() => setProgressIndicator('pledged')}
              />
              <label
                className={`btn btn-outline-primary ${styles.toggleBtn}`}
                htmlFor="pledgedRadio"
              >
                {t('pledgedAmount')}
              </label>

              <input
                type="radio"
                className={`btn-check`}
                name="btnradio"
                id="raisedRadio"
                onChange={() => setProgressIndicator('raised')}
                checked={progressIndicator === 'raised'}
              />
              <label
                className={`btn btn-outline-primary ${styles.toggleBtn}`}
                htmlFor="raisedRadio"
              >
                {t('raisedAmount')}
              </label>
            </div>
          </div>

          <div className={styles.progress}>
            <ProgressBar
              now={progressIndicator === 'pledged' ? totalPledged : 0}
              label={`$${progressIndicator === 'pledged' ? totalPledged : 0}`}
              max={campaignInfo?.goal}
              style={{ height: '1.5rem', fontSize: '0.9rem' }}
              data-testid="progressBar"
            />
            <div className={styles.endpoints}>
              <div className={styles.start}>$0</div>
              <div className={styles.end}>${campaignInfo?.goal}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={t('searchPledger')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchPledger"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center`}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className="d-flex gap-4 mb-1">
          <div className="d-flex justify-space-between">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="filter"
              >
                <Sort className={'me-1'} />
                {tCommon('sort')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSortBy('amount_ASC')}
                  data-testid="amount_ASC"
                >
                  {t('lowestAmount')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('amount_DESC')}
                  data-testid="amount_DESC"
                >
                  {t('highestAmount')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('endDate_DESC')}
                  data-testid="endDate_DESC"
                >
                  {t('latestEndDate')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('endDate_ASC')}
                  data-testid="endDate_ASC"
                >
                  {t('earliestEndDate')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Button
              variant="success"
              className={styles.orgFundCampaignButton}
              disabled={endDate < new Date()}
              onClick={() => handleOpenModal(null, 'create')}
              data-testid="addPledgeBtn"
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
        getRowId={(row) => row._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noPledges')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={pledges.map((pledge) => ({
          _id: pledge._id,
          users: pledge.users,
          startDate: pledge.startDate,
          endDate: pledge.endDate,
          amount: pledge.amount,
          currency: pledge.currency,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />
      {/* Update Pledge ModalState */}
      <PledgeModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
        campaignId={fundCampaignId}
        orgId={orgId}
        pledge={pledge}
        refetchPledge={refetchPledge}
        endDate={pledgeData?.getFundraisingCampaigns[0].endDate as Date}
        mode={pledgeModalMode}
      />
      {/* Delete Pledge ModalState */}
      <PledgeDeleteModal
        isOpen={modalState[ModalState.DELETE]}
        hide={() => closeModal(ModalState.DELETE)}
        pledge={pledge}
        refetchPledge={refetchPledge}
      />
      <BasePopup
        id={id}
        open={open}
        anchor={anchor}
        disablePortal
        className={`${styles.popup} ${extraUsers.length > 4 ? styles.popupExtra : ''}`}
      >
        {extraUsers.map((user: InterfacePledger, index: number) => (
          <div
            className={styles.pledgerContainer}
            key={index}
            data-testid={`extra${index + 1}`}
          >
            {user.image ? (
              <img
                src={user.image}
                alt="pledger"
                data-testid={`extraImage${index + 1}`}
                className={styles.TableImage}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={user._id + '1'}
                  containerStyle={styles.imageContainer}
                  avatarStyle={styles.TableImage}
                  name={user.firstName + ' ' + user.lastName}
                  alt={user.firstName + ' ' + user.lastName}
                  dataTestId={`extraAvatar${index + 1}`}
                />
              </div>
            )}
            <span key={user._id + '2'}>
              {user.firstName + ' ' + user.lastName}
            </span>
          </div>
        ))}
      </BasePopup>
    </div>
  );
};
export default fundCampaignPledge;
