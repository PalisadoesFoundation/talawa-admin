import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import styles from './Pledges.module.css';
import { useTranslation } from 'react-i18next';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfacePledgeInfo, InterfaceUserInfo } from 'utils/interfaces';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { type ApolloQueryResult, useQuery } from '@apollo/client';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import dayjs from 'dayjs';
import { currencySymbols } from 'utils/currency';
import PledgeDeleteModal from 'screens/FundCampaignPledge/PledgeDeleteModal';
import { Navigate, useParams } from 'react-router-dom';
import PledgeModal from '../Campaigns/PledgeModal';
import SortingButton from 'subComponents/SortingButton';

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

enum ModalState {
  UPDATE = 'update',
  DELETE = 'delete',
}
/**
 * The `Pledges` component is responsible for rendering a user's pledges within a campaign.
 * It fetches pledges data using Apollo Client's `useQuery` hook and displays the data
 * in a DataGrid with various features such as search, sorting, and modal dialogs for updating
 * or deleting a pledge. The component also handles various UI interactions including opening
 * modals for editing or deleting a pledge, showing additional pledgers in a popup, and
 * applying filters for searching pledges by campaign or pledger name.
 *
 * Key functionalities include:
 * - Fetching pledges data from the backend using GraphQL query `USER_PLEDGES`.
 * - Displaying pledges in a table with columns for pledgers, associated campaigns,
 *   end dates, pledged amounts, and actions.
 * - Handling search and sorting of pledges.
 * - Opening and closing modals for updating and deleting pledges.
 * - Displaying additional pledgers in a popup when the list of pledgers exceeds a certain limit.
 *
 * @returns  The rendered Pledges component.
 */

const Pledges = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userCampaigns',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const { orgId } = useParams();
  if (!orgId || !userId) {
    return <Navigate to={'/'} replace />;
  }

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfo[]>([]);
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
  }>({
    [ModalState.UPDATE]: false,
    [ModalState.DELETE]: false,
  });

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  }: {
    data?: {
      getPledgesByUserId: InterfacePledgeInfo[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => Promise<
      ApolloQueryResult<{
        getPledgesByUserId: InterfacePledgeInfo[];
      }>
    >;
  } = useQuery(USER_PLEDGES, {
    variables: {
      userId: userId,
      where: {
        firstName_contains: searchBy === 'pledgers' ? searchTerm : undefined,
        name_contains: searchBy === 'campaigns' ? searchTerm : undefined,
      },
      orderBy: sortBy,
    },
  });

  const openModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };

  const closeModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleOpenModal = useCallback(
    (pledge: InterfacePledgeInfo | null): void => {
      setPledge(pledge);
      openModal(ModalState.UPDATE);
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
    users: InterfaceUserInfo[],
  ): void => {
    setExtraUsers(users);
    setAnchor(anchor ? null : event.currentTarget);
  };

  useEffect(() => {
    if (pledgeData) {
      setPledges(pledgeData.getPledgesByUserId);
    }
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
      flex: 4,
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
      field: 'associatedCampaign',
      headerName: 'Associated Campaign',
      flex: 2,
      minWidth: 100,
      align: 'left',
      headerAlign: 'left',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <>{params.row.campaign?.name}</>;
      },
    },
    {
      field: 'endDate',
      headerName: 'End Date',
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
      field: 'progress',
      headerName: 'Progress',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: () => {
        return (
          <div className="d-flex justify-content-center align-items-center h-100">
            <ProgressBar
              now={200}
              label={`${(200 / 1000) * 100}%`}
              max={1000}
              className={styles.progressBar}
              data-testid="progressBar"
            />
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
              onClick={() => handleOpenModal(params.row as InterfacePledgeInfo)}
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
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={t('searchBy') + ' ' + t(searchBy)}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchPledges"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center`}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className="d-flex gap-4 ">
          <SortingButton
            sortingOptions={[
              { label: t('pledgers'), value: 'pledgers' },
              { label: t('campaigns'), value: 'campaigns' },
            ]}
            selectedOption={searchBy}
            onSortChange={(value) =>
              setSearchBy(value as 'pledgers' | 'campaigns')
            }
            dataTestIdPrefix="searchByDrpdwn"
            buttonLabel={t('searchBy')}
          />

          <SortingButton
            sortingOptions={[
              { label: t('lowestAmount'), value: 'amount_ASC' },
              { label: t('highestAmount'), value: 'amount_DESC' },
              { label: t('latestEndDate'), value: 'endDate_DESC' },
              { label: t('earliestEndDate'), value: 'endDate_ASC' },
            ]}
            selectedOption={sortBy}
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
      </div>

      <DataGrid
        disableColumnMenu
        columnBufferPx={8}
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
          campaign: pledge.campaign,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />

      <PledgeModal
        isOpen={modalState[ModalState.UPDATE]}
        hide={() => closeModal(ModalState.UPDATE)}
        campaignId={pledge?.campaign ? pledge?.campaign._id : ''}
        userId={userId}
        pledge={pledge}
        refetchPledge={refetchPledge}
        endDate={pledge?.campaign ? pledge?.campaign.endDate : new Date()}
        mode={'edit'}
      />

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

export default Pledges;
