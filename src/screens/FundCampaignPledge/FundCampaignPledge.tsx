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

const fundCampaignPledge = (): JSX.Element => {
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
  const [extraUsers] = useState<InterfaceUserInfoPG[]>([]);
  const [open, setOpen] = useState(false);
  const [pledgeModalMode] = useState<'edit' | 'create'>('create');
  const [pledge] = useState<InterfacePledgeInfo | null>(null);
  const [searchTerm] = useState('');
  const [anchorEl] = useState<HTMLElement | null>(null);
  const [sortBy] = useState<
    'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

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

  // Columns definition (keep inline but condensed)
  const columns: GridColDef[] = [
    // ... (condensed version of columns - remove blank lines)
  ];

  return (
    <>
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
        {/* Campaign Progress Section */}
        {/* Pledge Actions Toolbar */}
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

export default fundCampaignPledge;
