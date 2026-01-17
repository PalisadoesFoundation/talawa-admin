import { useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { Stack, Typography, Breadcrumbs, Link } from '@mui/material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import Button from 'react-bootstrap/Button';
import { Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import CampaignModal from './modal/CampaignModal';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import styles from '../../style/app-fixed.module.css';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

const dataGridStyle = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--row-background)',
  '& .MuiDataGrid-row': {
    backgroundColor: 'var(--row-background)',
    '&:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'var(--row-background)' },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--row-background)',
  },
  '& .MuiDataGrid-cell:focus': { outline: 'none' },
  '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
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
 * - `.head`
 * - `.btnsContainer`
 * - `.input`
 * - `.inputField`
 * - `.searchButon`
 * - `.btnsBlock`
 * - `.dropdown`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
const orgFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'fundCampaign' });
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
      fund: InterfaceQueryOrganizationFundCampaigns;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(FUND_CAMPAIGN, {
    variables: {
      input: { id: fundId },
    },
    skip: !fundId,
  });

  const compaignsData = useMemo(() => {
    return campaignData?.fund?.campaigns?.edges.map((edge) => edge.node) ?? [];
  }, [campaignData]);

  const filteredCampaigns = useMemo(() => {
    return compaignsData.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [compaignsData, searchTerm]);

  const handleClick = (campaignId: string): void => {
    navigate(`/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const { fundName, isArchived } = useMemo(() => {
    const fundName = campaignData?.fund?.name || 'Fund';
    const isArchived = false;
    return { fundName, isArchived };
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
      headerName: '#',
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
      field: 'name',
      headerName: 'Campaign Name',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div
          className={styles.hyperlinkText}
          data-testid="campaignName"
          onClick={() => handleClick(params.row.id as string)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(params.row.id as string);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {params.row.name}
        </div>
      ),
    },
    {
      field: 'startAt',
      headerName: 'Start Date',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.row.startAt).format('DD/MM/YYYY'),
    },
    {
      field: 'endAt',
      headerName: 'End Date',
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="endDateCell">
            {dayjs(params.row.endAt).format('DD/MM/YYYY')}{' '}
          </div>
        );
      },
    },
    {
      field: 'goalAmount',
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
                params.row.currencyCode as keyof typeof currencySymbols
              ]
            }
            {params.row.goalAmount as number}
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
                params.row.currencyCode as keyof typeof currencySymbols
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
      renderCell: (params: GridCellParams) => (
        <Button
          variant="success"
          size="sm"
          className={styles.editButton}
          data-testid="editCampaignBtn"
          onClick={() =>
            handleOpenModal(params.row as InterfaceCampaignInfo, 'edit')
          }
        >
          <i className="fa fa-edit" />
        </Button>
      ),
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
            className={styles.editButton}
            data-testid="viewBtn"
            onClick={() => handleClick(params.row.id as string)}
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

      <Row className={styles.head}>
        <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
          <SearchBar
            placeholder={tCommon('searchByName')}
            onSearch={setSearchTerm}
            inputTestId="searchFullName"
            buttonTestId="searchBtn"
          />
          <div className={styles.btnsBlock}>
            <SortingButton
              sortingOptions={[
                { label: t('lowestGoal'), value: 'goalAmount_ASC' },
                { label: t('highestGoal'), value: 'goalAmount_DESC' },
                { label: t('latestEndDate'), value: 'endAt_DESC' },
                { label: t('earliestEndDate'), value: 'endAt_ASC' },
              ]}
              selectedOption={
                sortBy === 'goalAmount_ASC'
                  ? tCommon('lowestGoal')
                  : sortBy === 'goalAmount_DESC'
                    ? tCommon('highestGoal')
                    : sortBy === 'endAt_DESC'
                      ? tCommon('latestEndDate')
                      : tCommon('earliestEndDate')
              }
              onSortChange={(value) =>
                setSortBy(
                  value as
                    | 'goalAmount_ASC'
                    | 'goalAmount_DESC'
                    | 'endAt_ASC'
                    | 'endAt_DESC',
                )
              }
              dataTestIdPrefix="filter"
              buttonLabel={tCommon('sort')}
            />
          </div>
          <div className={styles.btnsBlock}>
            <Button
              variant="success"
              className={styles.dropdown}
              onClick={() => handleOpenModal(null, 'create')}
              data-testid="addCampaignBtn"
              disabled={isArchived}
            >
              <i className={'fa fa-plus me-2'} />
              {t('addCampaign')}
            </Button>
          </div>
        </div>
      </Row>

      <DataGrid
        disableColumnMenu
        columnBufferPx={8}
        hideFooter={true}
        getRowId={(row) => row.id}
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
        rows={filteredCampaigns}
        columns={columns}
        isRowSelectable={() => false}
      />

      {/* Create Campaign Modal */}
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
