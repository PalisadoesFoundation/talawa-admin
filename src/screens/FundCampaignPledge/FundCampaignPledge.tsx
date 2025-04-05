/**
 * @file FundCampaignPledge.tsx
 * @description This component renders the Fund Campaign Pledge screen, allowing users to view, search, sort,
 *              and manage pledges for a specific fundraising campaign. It includes features like progress tracking,
 *              pledge management, and user interaction with modals for editing or deleting pledges.
 *
 * @module FundCampaignPledge
 *
 * @requires react
 * @requires react-router-dom
 * @requires @apollo/client
 * @requires @mui/material
 * @requires @mui/x-data-grid
 * @requires react-bootstrap
 * @requires dayjs
 * @requires components/Loader/Loader
 * @requires components/Avatar/Avatar
 * @requires subComponents/SortingButton
 * @requires subComponents/SearchBar
 * @requires utils/currency
 * @requires utils/interfaces
 * @requires style/app-fixed.module.css
 *
 * @typedef {InterfaceCampaignInfo} InterfaceCampaignInfo - Represents the campaign details including name, goal, dates, and currency.
 * @typedef {InterfacePledgeInfo} InterfacePledgeInfo - Represents the pledge details including users, amount, and dates.
 * @typedef {InterfaceUserInfo} InterfaceUserInfo - Represents user details like name and image.
 *
 * @component
 * @description
 * - Displays a breadcrumb navigation for campaign context.
 * - Shows campaign progress with a toggle between pledged and raised amounts.
 * - Provides a searchable and sortable table of pledges with actions to edit or delete.
 * - Includes modals for adding/editing and deleting pledges.
 * - Handles error and loading states for data fetching.
 *
 * @returns {JSX.Element} The Fund Campaign Pledge screen.
 */
import { useQuery, type ApolloQueryResult } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
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
  InterfaceUserInfo,
  InterfaceQueryFundCampaignsPledges,
} from 'utils/interfaces';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

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

  const [campaignInfo, setCampaignInfo] = useState<InterfaceCampaignInfo>({
    name: '',
    goal: 0,
    startDate: new Date(),
    endDate: new Date(),
    currency: '',
  });

  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({ [ModalState.SAME]: false, [ModalState.DELETE]: false });

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfo[]>([]);
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
    data?: { fundCampaign: InterfaceQueryFundCampaignsPledges[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => Promise<
      ApolloQueryResult<{
        fundCampaign: InterfaceQueryFundCampaignsPledges[];
      }>
    >;
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: {
      input: { id: fundCampaignId },
    },
  });

  const endDate = dayjs(
    pledgeData?.fundCampaign?.endAt,
    'YYYY-MM-DD',
  ).toDate();

  const { pledges, totalPledged, fundName } = useMemo(() => {
    let totalPledged = 0;
    
    const pledges = pledgeData?.fundCampaign?.pledges?.edges.map(edge => {
      const amount = edge.node.amount || 0;
      totalPledged += amount;
      
      // Ensure we have valid dates by using proper date parsing
      const createdAt = edge.node.createdAt ? new Date(edge.node.createdAt) : new Date();
      const campaignEnd = pledgeData.fundCampaign.endAt ? new Date(pledgeData.fundCampaign.endAt) : new Date();
      
      return {
        id: edge.node.id,
        amount: amount,
        startDate: createdAt,
        endDate: campaignEnd,
        pledgeDate: createdAt,
        users: [{
          id: edge.node.pledger.id,
          name: edge.node.pledger.name || '',
          image: null
        }],
        currency: 'USD'
      };
    }) ?? [];

    // Apply sorting after ensuring valid dates
    const sortedPledges = [...pledges].sort((a, b) => {
      switch (sortBy) {
        case 'amount_ASC':
          return a.amount - b.amount;
        case 'amount_DESC':
          return b.amount - a.amount;
        case 'endDate_ASC':
          return a.endDate.getTime() - b.endDate.getTime();
        case 'endDate_DESC':
          return b.endDate.getTime() - a.endDate.getTime();
        default:
          return 0;
      }
    });

    // Apply search filter to sorted pledges
    const filteredPledges = sortedPledges.filter((pledge) => {
      const search = searchTerm.toLowerCase();
      return pledge.users.some((user) => 
        user.name.toLowerCase().includes(search)
      );
    });

    const fundName = pledgeData?.fundCampaign?.name ?? tCommon('Funds');
    return { pledges: filteredPledges, totalPledged, fundName };
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
console.log("campaignInfo", campaignInfo);

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
    [openModal],  // Removed unnecessary dependencies
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
    users: InterfaceUserInfo[],
  ): void => {
    setExtraUsers(users);
    setAnchor(anchor ? null : event.currentTarget);
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
        return (
          <div className="d-flex flex-wrap gap-1" style={{ maxHeight: 120 }}>
            {params.row.users
              .slice(0, 2)
              .map((user: InterfaceUserInfo, index: number) => (
                <div className={styles.pledgerContainer} key={index}>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="pledge"
                      data-testid={`image${index + 1}`}
                      className={styles.TableImagePledge}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={user.id + '1'}
                        containerStyle={styles.imageContainerPledge}
                        avatarStyle={styles.TableImagePledge}
                        name={user.name}
                        alt={user.name}
                      />
                    </div>
                  )}
                  <span key={user.id + '2'}>
                    {user.name}
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
              now={progressIndicator === 'pledged' ? totalPledged : 0}
              label={`$${progressIndicator === 'pledged' ? totalPledged : 0}`}
              max={campaignInfo?.goal}
              style={{ height: '1.5rem', fontSize: '0.9rem' }}
              data-testid="progressBar"
              className={`${styles.progressBar}`}
            />
            <div className={styles.endpoints}>
              <div className={styles.start}>$0</div>
              <div className={styles.end}>${campaignInfo?.goal}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.btnsContainerPledge} gap-4 flex-wrap`}>
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
          startDate: pledge.startDate,
          endDate: pledge.endDate,
          pledgeDate: pledge.pledgeDate,
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
        endDate={pledgeData?.fundCampaign?.endDate as Date}
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
        {extraUsers.map((user: InterfaceUserInfo, index: number) => (
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
                className={styles.TableImagePledge}
              />
            ) : (
              <div className={styles.avatarContainer}>
                <Avatar
                  key={user.id + '1'}
                  containerStyle={styles.imageContainerPledge}
                  avatarStyle={styles.TableImagePledge}
                  name={user.name}
                  alt={user.name}
                  dataTestId={`extraAvatar${index + 1}`}
                />
              </div>
            )}
            <span key={user.id + '2'}>
              {user.name}
            </span>
          </div>
        ))}
      </BasePopup>
    </div>
  );
};
export default fundCampaignPledge;
