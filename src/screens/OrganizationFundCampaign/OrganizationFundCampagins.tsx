import { useQuery } from '@apollo/client';
import { Search, Sort, WarningAmberRounded } from '@mui/icons-material';
import { Stack, Typography, Breadcrumbs, Link } from '@mui/material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import CampaignModal from './CampaignModal';
import CampaignDeleteModal from './CampaignDeleteModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import styles from './OrganizationFundCampaign.module.css';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';

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
  SAME = 'same',
  DELETE = 'delete',
}

const orgFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'fundCampaign',
  });
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  const { fundId, orgId } = useParams();

  if (!fundId || !orgId) {
    return <Navigate to={'/'} />;
  }

  const [campaign, setCampaign] = useState<InterfaceCampaignInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
  });
  const [campaignModalMode, setCampaignModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleOpenModal = useCallback(
    (campaign: InterfaceCampaignInfo | null, mode: 'edit' | 'create'): void => {
      setCampaign(campaign);
      setCampaignModalMode(mode);
      openModal(ModalState.SAME);
    },
    [openModal],
  );

  const handleDeleteClick = useCallback(
    (campaign: InterfaceCampaignInfo): void => {
      setCampaign(campaign);
      openModal(ModalState.DELETE);
    },
    [openModal],
  );

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaign,
  }: {
    data?: {
      getFundById: InterfaceQueryOrganizationFundCampaigns;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(FUND_CAMPAIGN, {
    variables: {
      id: fundId,
      orderBy: sortBy,
      where: {
        name_contains: searchTerm,
      },
    },
  });

  const handleClick = (campaignId: string): void => {
    navigate(`/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const campaigns = useMemo(() => {
    if (campaignData?.getFundById?.campaigns)
      return campaignData.getFundById.campaigns;
    return [];
  }, [campaignData]);

  if (campaignLoading) {
    return <Loader size="xl" />;
  }
  if (campaignError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Campaigns
            <br />
            {campaignError.message}
          </h6>
        </div>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.id}</div>;
      },
    },
    {
      field: 'campaignName',
      headerName: 'Campaign Name',
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="campaignName"
            onClick={() => handleClick(params.row.campaign._id as string)}
          >
            {params.row.campaign.name}
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
        return dayjs(params.row.campaign.startDate).format('DD/MM/YYYY');
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
        return (
          <div data-testid="endDateCell">
            {dayjs(params.row.campaign.endDate).format('DD/MM/YYYY')}{' '}
          </div>
        );
      },
    },
    {
      field: 'fundingGoal',
      headerName: 'Funding Goal',
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
            data-testid="goalCell"
          >
            {
              currencySymbols[
                params.row.campaign.currency as keyof typeof currencySymbols
              ]
            }
            {params.row.campaign.fundingGoal}
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
              data-testid="editCampaignBtn"
              onClick={() =>
                handleOpenModal(
                  params.row.campaign as InterfaceCampaignInfo,
                  'edit',
                )
              }
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="rounded"
              data-testid="deleteCampaignBtn"
              onClick={() =>
                handleDeleteClick(params.row.campaign as InterfaceCampaignInfo)
              }
            >
              <i className="fa fa-trash" />
            </Button>
          </>
        );
      },
    },
    {
      field: 'assocPledge',
      headerName: 'Associated Pledges',
      flex: 2,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            variant="outline-success"
            size="sm"
            className="rounded"
            data-testid="viewBtn"
            onClick={() => handleClick(params.row.campaign._id as string)}
          >
            <i className="fa fa-eye me-1" />
            {t('viewPledges')}
          </Button>
        );
      },
    },
  ];

  return (
    <div className={styles.organizationFundCampaignContainer}>
      <Breadcrumbs aria-label="breadcrumb" className="ms-1">
        <Link
          underline="hover"
          color="inherit"
          component="button"
          data-testid="fundsLink"
          onClick={() => navigate(`/orgfunds/${orgId}`)}
        >
          {tCommon('Funds')}
        </Link>
        <Typography color="text.primary">FundRaising Campaign</Typography>
      </Breadcrumbs>

      <div className={styles.btnsContainer}>
        <div className={styles.input}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchByName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchFullName"
          />
          <Button
            className="position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center"
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className={styles.btnsBlock}>
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
                  onClick={() => setSortBy('fundingGoal_ASC')}
                  data-testid="fundingGoal_ASC"
                >
                  {t('lowestGoal')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('fundingGoal_DESC')}
                  data-testid="fundingGoal_DESC"
                >
                  {t('highestGoal')}
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
              onClick={() => handleOpenModal(null, 'create')}
              data-testid="addCampaignBtn"
            >
              <i className={'fa fa-plus me-2'} />
              {t('addCampaign')}
            </Button>
          </div>
        </div>
      </div>

      <DataGrid
        disableColumnMenu
        columnBuffer={7}
        hideFooter={true}
        getRowId={(row) => row.campaign._id}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noCampaignsFound')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={campaigns.map((campaign, index) => ({
          id: index + 1,
          campaign,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />

      {/* Create Campaign ModalState */}
      <CampaignModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
        refetchCampaign={refetchCampaign}
        fundId={fundId}
        campaign={campaign}
        mode={campaignModalMode}
      />

      <CampaignDeleteModal
        isOpen={modalState[ModalState.DELETE]}
        hide={() => closeModal(ModalState.DELETE)}
        campaign={campaign}
        refetchCampaign={refetchCampaign}
      />
    </div>
  );
};
export default orgFundCampaign;
