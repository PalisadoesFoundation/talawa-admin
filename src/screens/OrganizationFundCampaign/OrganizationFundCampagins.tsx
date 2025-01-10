import { useQuery } from '@apollo/client';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import { Stack, Typography, Breadcrumbs, Link } from '@mui/material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import CampaignModal from './CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import styles from '../../style/app.module.css';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
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

/**
 * `orgFundCampaign` component displays a list of fundraising campaigns for a specific fund within an organization.
 * It allows users to search, sort, view and edit campaigns.
 *
 * ### Functionality
 * - Displays a data grid with campaigns information, including their names, start and end dates, funding goals, and actions.
 * - Provides search functionality to filter campaigns by name.
 * - Offers sorting options based on funding goal and end date.
 * - Opens modals for creating or editing campaigns.
 *
 *
 * ### State
 * - `campaign`: The current campaign being edited or deleted.
 * - `searchTerm`: The term used for searching campaigns by name.
 * - `sortBy`: The current sorting criteria for campaigns.
 * - `modalState`: An object indicating the visibility of different modals (`same` for create/edit).
 * - `campaignModalMode`: Determines if the modal is in 'edit' or 'create' mode.
 *
 * ### Methods
 * - `handleOpenModal(campaign: InterfaceCampaignInfo | null, mode: 'edit' | 'create')`: Opens the modal for creating or editing a campaign.
 * - `handleClick(campaignId: string)`: Navigates to the pledge details page for a specific campaign.
 *
 * ### GraphQL Queries
 * - Uses `FUND_CAMPAIGN` query to fetch the list of campaigns based on the provided fund ID, search term, and sorting criteria.
 *
 * ### Rendering
 * - Renders a `DataGrid` component with campaigns information.
 * - Displays modals for creating and editing campaigns.
 * - Shows error and loading states using `Loader` and error message components.
 *
 * @returns The rendered component including breadcrumbs, search and filter controls, data grid, and modals.
 */
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

  const [modalState, setModalState] = useState<boolean>(false);
  const [campaignModalMode, setCampaignModalMode] = useState<'edit' | 'create'>(
    'create',
  );

  const handleOpenModal = useCallback(
    (campaign: InterfaceCampaignInfo | null, mode: 'edit' | 'create'): void => {
      setCampaign(campaign);
      setCampaignModalMode(mode);
      setModalState(true);
    },
    [],
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

  const { campaigns, fundName, isArchived } = useMemo(() => {
    const fundName = campaignData?.getFundById?.name || 'Fund';
    const isArchived = campaignData?.getFundById?.isArchived || false;
    const campaigns = campaignData?.getFundById?.campaigns || [];
    return { fundName, campaigns, isArchived };
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
      field: 'fundingRaised',
      headerName: 'Raised',
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
          {fundName}
        </Link>
        <Typography color="text.primary">{t('title')}</Typography>
      </Breadcrumbs>

      <div className={styles.btnsContainerOrganizationFundCampaign}>
        <div className={styles.inputOrganizationFundCampaign}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchByName')}
            autoComplete="off"
            required
            className={styles.inputFieldOrganizationFundCampaign}
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
        <div className={styles.btnsBbtnsBlockOrganizationFundCampaignlock}>
          <div className="d-flex justify-space-between">
            <SortingButton
              sortingOptions={[
                { label: t('lowestGoal'), value: 'fundingGoal_ASC' },
                { label: t('highestGoal'), value: 'fundingGoal_DESC' },
                { label: t('latestEndDate'), value: 'endDate_DESC' },
                { label: t('earliestEndDate'), value: 'endDate_ASC' },
              ]}
              onSortChange={(value) =>
                setSortBy(
                  value as
                    | 'fundingGoal_ASC'
                    | 'fundingGoal_DESC'
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
              className={styles.orgFundCampaignButton}
              onClick={() => handleOpenModal(null, 'create')}
              data-testid="addCampaignBtn"
              disabled={isArchived}
            >
              <i className={'fa fa-plus me-2'} />
              {t('addCampaign')}
            </Button>
          </div>
        </div>
      </div>

      <DataGrid
        disableColumnMenu
        columnBufferPx={8}
        hideFooter={true}
        getRowId={(row) => row.campaign._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noCampaignsFound')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() =>
          `${styles.rowBackgroundOrganizationFundCampaign}`
        }
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
        isOpen={modalState}
        hide={() => setModalState(false)}
        refetchCampaign={refetchCampaign}
        fundId={fundId}
        orgId={orgId}
        campaign={campaign}
        mode={campaignModalMode}
      />
    </div>
  );
};
export default orgFundCampaign;
