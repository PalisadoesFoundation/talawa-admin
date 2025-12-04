import { useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Typography,
  Popover,
  TextField,
  Button,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import styles from 'style/app-fixed.module.css';
import PledgeDeleteModal from './deleteModal/PledgeDeleteModal';
import PledgeModal from './modal/PledgeModal';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from 'components/Avatar/Avatar';
import type { GridColDef } from '@mui/x-data-grid';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import {
  ModalState,
  dataGridStyle,
  processPledgesData,
  getCampaignInfo,
} from './FundCampaignPledge.utils';
import FilterListIcon from '@mui/icons-material/FilterList';

const FundCampaignPledge = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const { fundCampaignId, orgId } = useParams();

  if (!fundCampaignId || !orgId) return <Navigate to={'/'} replace />;

  const [campaignInfo, setCampaignInfo] = useState(getCampaignInfo(undefined));
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
  });
  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfoPG[]>([]);
  const [open, setOpen] = useState(false);
  const [pledgeModalMode, setPledgeModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [selectedPledge, setSelectedPledge] =
    useState<InterfacePledgeInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [sortBy, setSortBy] = useState<
    'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: { input: { id: fundCampaignId } },
  });

  const { pledges, fundName } = useMemo(
    () => processPledgesData(pledgeData, searchTerm, sortBy, tCommon),
    [pledgeData, searchTerm, sortBy, tCommon],
  );

  useEffect(() => {
    if (pledgeData?.fundCampaign) setCampaignInfo(getCampaignInfo(pledgeData));
  }, [pledgeData]);

  useEffect(() => {
    refetchPledge();
  }, [sortBy, refetchPledge]);

  const closeModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleOpenCreateModal = (): void => {
    setPledgeModalMode('create');
    setSelectedPledge(null);
    setModalState((prevState) => ({ ...prevState, [ModalState.SAME]: true }));
  };

  const handleOpenEditModal = (pledge: InterfacePledgeInfo): void => {
    setPledgeModalMode('edit');
    setSelectedPledge(pledge);
    setModalState((prevState) => ({ ...prevState, [ModalState.SAME]: true }));
  };

  const handleOpenDeleteModal = (pledge: InterfacePledgeInfo): void => {
    setSelectedPledge(pledge);
    setModalState((prevState) => ({ ...prevState, [ModalState.DELETE]: true }));
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>): void => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (): void => {
    setFilterAnchorEl(null);
  };

  const handleSortChange = (newSortBy: typeof sortBy): void => {
    setSortBy(newSortBy);
    handleFilterClose();
  };

  const handleShowExtraUsers = (
    usersToShow: InterfaceUserInfoPG[],
    event: React.MouseEvent,
  ): void => {
    setExtraUsers(usersToShow.slice(1));
    setAnchorEl(event.currentTarget as HTMLElement);
    setOpen(true);
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

  const isCampaignActive =
    new Date() >= new Date(campaignInfo.startDate) &&
    new Date() <= new Date(campaignInfo.endDate);

  // Columns definition
  const columns: GridColDef[] = [
    {
      field: 'users',
      headerName: t('pledger'),
      flex: 2,
      renderCell: (params) => {
        const users = params.value || [];
        const mainUser = users[0];
        const extraUsersCount = Math.max(0, users.length - 1);

        return (
          <div className="d-flex align-items-center">
            {mainUser?.avatarURL ? (
              <img
                src={mainUser.avatarURL}
                alt={mainUser?.name || 'User avatar'}
                className={styles.TableImagePledge}
                data-testid={`user-image-${mainUser.id}`}
              />
            ) : (
              <Avatar name={mainUser?.name || ''} />
            )}
            <div className="ms-3">
              <div>{mainUser?.name || 'Unknown'}</div>
              {extraUsersCount > 0 && (
                <Chip
                  label={`+${extraUsersCount} more...`}
                  size="small"
                  data-testid={`moreContainer-${params.row.id}`}
                  onClick={(e) => handleShowExtraUsers(users, e)}
                />
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: 'amount',
      headerName: t('amount'),
      flex: 1,
      renderCell: (params) => (
        <div data-testid="amountCell">
          {params.row.currency} {params.value}
        </div>
      ),
    },
    {
      field: 'pledgeDate',
      headerName: t('pledgeDate'),
      flex: 1,
      renderCell: (params) => {
        const dateValue = params.value
          ? new Date(params.value as string)
          : null;
        return dateValue ? dateValue.toLocaleDateString() : '';
      },
    },
    {
      field: 'endDate',
      headerName: t('endDate'),
      flex: 1,
      renderCell: (params) => {
        const dateValue = params.value
          ? new Date(params.value as string)
          : null;
        return dateValue ? dateValue.toLocaleDateString() : '';
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <Button
            data-testid="editPledgeBtn"
            variant="outlined"
            size="small"
            onClick={() => handleOpenEditModal(params.row)}
          >
            {t('edit')}
          </Button>
          <Button
            data-testid="deletePledgeBtn"
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleOpenDeleteModal(params.row)}
          >
            {t('delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <Breadcrumbs aria-label="breadcrumb" className="ms-1 my-3">
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => window.history.go(-2)}
          >
            {fundName}
          </Link>
          <Link
            underline="hover"
            color="inherit"
            component="button"
            onClick={() => window.history.back()}
          >
            {campaignInfo?.name}
          </Link>
          <Typography color="text.primary">{t('pledges')}</Typography>
        </Breadcrumbs>

        {/* Search and Filter Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <TextField
            data-testid="searchPledger"
            placeholder={t('searchPledgers') || 'Search pledgers...'}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            inputProps={{ 'data-testid': 'searchPledger-input' }}
          />
          <Button
            data-testid="searchBtn"
            variant="contained"
            onClick={() => refetchPledge()}
          >
            {t('search') || 'Search'}
          </Button>

          <Button
            data-testid="filter"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
          >
            {t('filter') || 'Filter'}
          </Button>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem
              data-testid="amount_ASC"
              onClick={() => handleSortChange('amount_ASC')}
            >
              {t('amountLowToHigh') || 'Amount: Low to High'}
            </MenuItem>
            <MenuItem
              data-testid="amount_DESC"
              onClick={() => handleSortChange('amount_DESC')}
            >
              {t('amountHighToLow') || 'Amount: High to Low'}
            </MenuItem>
            <MenuItem
              data-testid="endDate_ASC"
              onClick={() => handleSortChange('endDate_ASC')}
            >
              {t('endDateEarliest') || 'End Date: Earliest'}
            </MenuItem>
            <MenuItem
              data-testid="endDate_DESC"
              onClick={() => handleSortChange('endDate_DESC')}
            >
              {t('endDateLatest') || 'End Date: Latest'}
            </MenuItem>
          </Menu>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            data-testid="addPledgeBtn"
            variant="contained"
            onClick={handleOpenCreateModal}
            disabled={!isCampaignActive}
            title={
              !isCampaignActive
                ? t('campaignNotActive') || 'Campaign is not active'
                : ''
            }
          >
            {t('addPledge') || 'Add Pledge'}
          </Button>
        </Box>

        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Campaign Progress
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              data-testid="raised-button"
              aria-label="Raised amount"
              onClick={() => {
                /* Handle raised amount */
              }}
            >
              Raised: $0
            </Button>
            <Button
              data-testid="pledged-button"
              aria-label="Pledged amount"
              onClick={() => {
                /* Handle pledged amount */
              }}
            >
              Pledged: ${pledges.reduce((sum, p) => sum + (p.amount || 0), 0)}
            </Button>
            <Box data-testid="progressBar" sx={{ flexGrow: 1, ml: 2 }}>
              <Typography>
                Progress:{' '}
                {(
                  (pledges.reduce((sum, p) => sum + (p.amount || 0), 0) /
                    (campaignInfo.goal || 1000)) *
                  100
                ).toFixed(1)}
                %
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Campaign Progress Section would go here */}
        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button data-testid="raised-button" aria-label="Raised amount">
              $0
            </Button>
            <Button data-testid="pledged-button" aria-label="Pledged amount">
              ${pledges.reduce((sum, p) => sum + (p.amount || 0), 0)}
            </Button>
            <Box data-testid="progressBar" sx={{ flexGrow: 1, ml: 2 }}>
              <Typography>
                ${pledges.reduce((sum, p) => sum + (p.amount || 0), 0)} / $
                {campaignInfo.goal || 1000}
              </Typography>
            </Box>
          </Box>
        </Box>

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
          rowHeight={65}
          rows={pledges}
          columns={columns}
          isRowSelectable={() => false}
        />

        <PledgeModal
          isOpen={modalState[ModalState.SAME]}
          hide={() => closeModal(ModalState.SAME)}
          campaignId={fundCampaignId}
          orgId={orgId}
          pledge={selectedPledge}
          refetchPledge={refetchPledge}
          endDate={
            pledgeData?.fundCampaign?.endAt
              ? new Date(pledgeData.fundCampaign.endAt)
              : new Date()
          }
          mode={pledgeModalMode}
        />

        <PledgeDeleteModal
          isOpen={modalState[ModalState.DELETE]}
          hide={() => closeModal(ModalState.DELETE)}
          pledge={selectedPledge}
          refetchPledge={refetchPledge}
        />
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        data-testid="extra-users-popup"
        slotProps={{
          paper: {
            className: `${styles.popup} ${extraUsers.length > 4 ? styles.popupExtra : ''}`,
          },
        }}
      >
        <Box sx={{ p: 1 }}>
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
                  className={styles.avatar}
                />
              ) : (
                <Avatar />
              )}
              <p className={styles.pledgerName}>{user.name}</p>
            </div>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default FundCampaignPledge;
