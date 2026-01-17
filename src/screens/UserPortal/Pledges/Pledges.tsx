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
 * - `.editButton`
 * - `.searchButton`
 * - `.btnsBlock`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ProgressBar } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { WarningAmberRounded } from '@mui/icons-material';
import useLocalStorage from 'utils/useLocalstorage';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import { Popover } from '@base-ui-components/react/popover';
import {
  type ApolloError,
  type ApolloQueryResult,
  useQuery,
} from '@apollo/client';
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
import PledgeDeleteModal from 'screens/FundCampaignPledge/deleteModal/PledgeDeleteModal';
import { Navigate, useParams } from 'react-router';
import PledgeModal from '../Campaigns/PledgeModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

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
  if (!orgId || !userIdFromStorage) {
    return <Navigate to={'/'} replace />;
  }
  const userId: string = userIdFromStorage as string;

  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfoPG[]>([]);
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

  const [open, setOpen] = useState(false);
  const id = open ? 'simple-popup' : undefined;

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  }: {
    data?: { getPledgesByUserId: InterfacePledgeInfo[] };
    loading: boolean;
    error?: ApolloError;
    refetch: () => Promise<
      ApolloQueryResult<{ getPledgesByUserId: InterfacePledgeInfo[] }>
    >;
  } = useQuery(USER_PLEDGES, {
    variables: {
      userId: { id: userId },
      where: searchTerm
        ? {
            ...(searchBy === 'pledgers' && { firstName_contains: searchTerm }),
            ...(searchBy === 'campaigns' && { name_contains: searchTerm }),
          }
        : {},
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

  const handleClick = (users: InterfaceUserInfoPG[]): void => {
    setExtraUsers(users);
    setOpen(true);
  };

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

  if (pledgeLoading) return <Loader size="xl" />;
  if (pledgeError && !isNoPledgesFoundError) {
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
      field: 'pledger',
      headerName: 'Pledger',
      flex: 4,
      minWidth: 50,
      align: 'left',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const pledger = params.row.pledger;
        const users = params.row.users || (pledger ? [pledger] : []);
        return (
          <div className="d-flex flex-wrap gap-1" style={{ maxHeight: 120 }}>
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
                      alt={user.avatarURL}
                      data-testid={`image-pledger-${user.id}`}
                      className={styles.TableImage}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={`${user.id}-avatar`}
                        containerStyle={styles.imageContainerPledge}
                        avatarStyle={styles.TableImagePledge}
                        name={user.name}
                        alt={user.name}
                        dataTestId={`avatar-pledger-${user.id}`}
                      />
                    </div>
                  )}
                  <span key={`${user.id}-name`}>{user.name}</span>
                </div>
              ))}
            {users.length > 2 && (
              <div
                className={styles.moreContainer}
                aria-describedby={id}
                data-testid={`moreContainer-${params.row.id}`}
                onClick={() => handleClick(users.slice(2))}
              >
                +{users.length - 2} more...
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
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex justify-content-center align-items-center h-100">
            <ProgressBar
              now={
                params.row.goalAmount > 0
                  ? (params.row.amount / params.row.goalAmount) * 100
                  : 0
              }
              label={
                params.row.goalAmount > 0
                  ? `${Math.round((params.row.amount / params.row.goalAmount) * 100)}%`
                  : '0%'
              }
              max={100}
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
              className={`me-2 rounded ${styles.editButton}`}
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
        <SearchBar
          placeholder={t('searchBy') + ' ' + t(searchBy)}
          onSearch={setSearchTerm}
          inputTestId="searchPledges"
          buttonTestId="searchBtn"
        />
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
        </div>
        <div className={styles.btnsBlock}>
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
        getRowId={(row) => row.id}
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
          id: pledge.id,
          name: pledge.pledger?.name,
          image: pledge.pledger?.avatarURL,
          startDate: pledge.startDate,
          endDate: pledge.campaign?.endAt,
          amount: pledge.amount,
          campaign: pledge.campaign,
          pledger: pledge.pledger,
          users: pledge.users, // Include users array for multiple pledgers functionality
          currency: pledge.campaign?.currencyCode,
          goalAmount: pledge.campaign?.goalAmount,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />

      <PledgeModal
        isOpen={modalState[ModalState.UPDATE]}
        hide={() => closeModal(ModalState.UPDATE)}
        campaignId={pledge?.campaign ? pledge?.campaign.id : ''}
        userId={userId}
        pledge={pledge}
        refetchPledge={refetchPledge}
        endDate={pledge?.campaign ? pledge?.campaign.endAt : new Date()}
        mode={'edit'}
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
                  key={index}
                  data-testid={`extra${index + 1}`}
                >
                  {user.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt="pledger"
                      data-testid={`extraImage${index + 1}`}
                      className={styles.TableImage}
                    />
                  ) : (
                    <div className={styles.avatarContainer}>
                      <Avatar
                        key={user.id + '1'}
                        containerStyle={styles.imageContainer}
                        avatarStyle={styles.TableImage}
                        name={user.name}
                        alt={user.name}
                        dataTestId={`extraAvatar${index + 1}`}
                      />
                    </div>
                  )}
                  <span key={user.id + '2'}>{user.name}</span>
                </div>
              ))}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default Pledges;
