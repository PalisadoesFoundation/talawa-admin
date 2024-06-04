import { useQuery, type ApolloQueryResult } from '@apollo/client';
import { Search, Sort, WarningAmberRounded } from '@mui/icons-material';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { currencySymbols } from 'utils/currency';
import styles from './FundCampaignPledge.module.css';
import PledgeDeleteModal from './PledgeDeleteModal';
import PledgeModal from './PledgeModal';
import { Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from 'components/Avatar/Avatar';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import type {
  InterfacePledgeInfo,
  InterfacePledgeVolunteer,
  InterfaceQueryFundCampaignsPledges,
} from 'utils/interfaces';

enum Modal {
  SAME = 'same',
  DELETE = 'delete',
}

const fundCampaignPledge = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pledges',
  });
  const { t: tCommon } = useTranslation('common');

  const { fundCampaignId, orgId } = useParams();
  if (!fundCampaignId || !orgId) {
    return <Navigate to={'/'} replace />;
  }

  const [modalState, setModalState] = useState<{ [key in Modal]: boolean }>({
    [Modal.SAME]: false,
    [Modal.DELETE]: false,
  });

  const [pledgeModalMode, setPledgeModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<
    'highest' | 'lowest' | 'latest' | 'earliest'
  >('latest');

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  }: {
    data?: {
      getFundraisingCampaignById: InterfaceQueryFundCampaignsPledges;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => Promise<
      ApolloQueryResult<{
        getFundraisingCampaignById: InterfaceQueryFundCampaignsPledges;
      }>
    >;
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: {
      id: fundCampaignId,
    },
  });

  const endDate = dayjs(
    pledgeData?.getFundraisingCampaignById?.endDate,
    'YYYY-MM-DD',
  ).toDate();

  const pledges = useMemo(() => {
    return (
      pledgeData?.getFundraisingCampaignById.pledges
        .filter((pledge) => {
          const search = searchTerm.toLowerCase();
          return pledge.users.some((user) => {
            const fullName = `${user.firstName} ${user.lastName}`;
            return fullName.toLowerCase().includes(search);
          });
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'highest':
              return b.amount - a.amount;
            case 'lowest':
              return a.amount - b.amount;
            case 'latest':
              return (
                new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
              );
            case 'earliest':
              return (
                new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
              );
          }
        }) ?? []
    );
  }, [pledgeData, sortBy, searchTerm]);

  const openModal = (modal: Modal): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };

  const closeModal = (modal: Modal): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleOpenModal = useCallback(
    (pledge: InterfacePledgeInfo | null, mode: 'edit' | 'create'): void => {
      setPledge(pledge);
      setPledgeModalMode(mode);
      openModal(Modal.SAME);
    },
    [openModal],
  );

  const handleDeleteClick = useCallback(
    (pledge: InterfacePledgeInfo): void => {
      setPledge(pledge);
      openModal(Modal.DELETE);
    },
    [openModal],
  );

  if (pledgeLoading) return <Loader size="xl" />;
  if (pledgeError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Funds
            <br />
            {pledgeError.message}
          </h6>
        </div>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'volunteers',
      headerName: 'Volunteers',
      flex: 2,
      minWidth: 50,
      align: 'left',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex flex-wrap gap-1" style={{ maxHeight: 120 }}>
            {params.row.users.map(
              (user: InterfacePledgeVolunteer, index: number) => (
                <div className={styles.volunteerContainer} key={index}>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="volunteer"
                      className={styles.TableImage}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={user._id + '1'}
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
              ),
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
      headerName: 'Pledge Amount',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex justify-content-center fw-bold">
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
              className="me-2"
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
            placeholder={t('searchVolunteer')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchVolunteer"
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
                  onClick={() => setSortBy('highest')}
                  data-testid="highest"
                >
                  {t('highestAmount')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('lowest')}
                  data-testid="lowest"
                >
                  {t('lowestAmount')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('latest')}
                  data-testid="latest"
                >
                  {t('latestEndDate')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('earliest')}
                  data-testid="earliest"
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
        columnBuffer={5}
        hideFooter={true}
        className={`${styles.datagrid}`}
        getRowId={(row) => row._id}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              Nothing Found !!
            </Stack>
          ),
        }}
        sx={{
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
        }}
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

      {/* Update Pledge Modal */}
      <PledgeModal
        isOpen={modalState[Modal.SAME]}
        hide={() => closeModal(Modal.SAME)}
        campaignId={fundCampaignId}
        orgId={orgId}
        pledge={pledge}
        refetchPledge={refetchPledge}
        endDate={pledgeData?.getFundraisingCampaignById.endDate as Date}
        mode={pledgeModalMode}
      />

      {/* Delete Pledge Modal */}
      <PledgeDeleteModal
        isOpen={modalState[Modal.DELETE]}
        hide={() => closeModal(Modal.DELETE)}
        pledge={pledge}
        refetchPledge={refetchPledge}
      />
    </div>
  );
};
export default fundCampaignPledge;
