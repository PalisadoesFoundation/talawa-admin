/**
 * Campaigns Component
 *
 * This component renders a list of fundraising campaigns for a specific organization.
 * It provides functionality for searching, sorting, and adding pledges to campaigns.
 * The component also handles loading states, error handling, and navigation.
 *
 * @component
 *
 * @remarks
 * - Redirects to the homepage if `orgId` or `userId` is missing.
 * - Fetches campaigns using the `USER_FUND_CAMPAIGNS` GraphQL query.
 * - Displays a loader while campaigns are being fetched.
 * - Shows an error message if there is an issue loading campaigns.
 * - Allows users to search campaigns by name and sort them by funding goal or end date.
 * - Enables users to add pledges to active campaigns via a modal.
 *
 * @returns {JSX.Element} The rendered Campaigns component.
 *
 * @dependencies
 * - React, React Router, React Bootstrap, Material UI, Apollo Client, and custom utilities/components.
 *
 * @example
 * ```tsx
 * <Campaigns />
 * ```
 *
 * @see {@link PledgeModal} for the modal used to add pledges.
 * @see {@link USER_FUND_CAMPAIGNS} for the GraphQL query fetching campaigns.
 *
 * @function
 * @name Campaigns
 */
import React, { useEffect, useState } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import styles from 'style/app.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Circle, WarningAmberRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Stack,
} from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
import PledgeModal from './PledgeModal';
import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';
import { useQuery } from '@apollo/client';
import type { InterfaceUserCampaign } from 'utils/interfaces';
import { currencySymbols } from 'utils/currency';
import Loader from 'components/Loader/Loader';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

const Campaigns = (): JSX.Element => {
  // Retrieves translation functions for various namespaces
  const { t } = useTranslation('translation', { keyPrefix: 'userCampaigns' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Retrieves stored user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId') as string;

  // Extracts organization ID from the URL parameters
  const { orgId } = useParams();
  if (!orgId || !userId) {
    // Redirects to the homepage if orgId or userId is missing
    return <Navigate to={'/'} replace />;
  }

  // Navigation hook to programmatically navigate between routes
  const navigate = useNavigate();

  // State for managing search term, campaigns, selected campaign, modal state, and sorting order
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [campaigns, setCampaigns] = useState<InterfaceUserCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<InterfaceUserCampaign | null>(null);
  const [modalState, setModalState] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    'fundingGoal_ASC' | 'fundingGoal_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

  // Fetches campaigns based on the organization ID, search term, and sorting order
  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaigns,
  }: {
    data?: { getFundraisingCampaigns: InterfaceUserCampaign[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_FUND_CAMPAIGNS, {
    variables: {
      where: { organizationId: orgId, name_contains: searchTerm },
      campaignOrderBy: sortBy,
    },
  });

  /**
   * Opens the modal for adding a pledge to a selected campaign.
   *
   * @param campaign - The campaign to which the user wants to add a pledge.
   */
  const openModal = (campaign: InterfaceUserCampaign): void => {
    setSelectedCampaign(campaign);
    setModalState(true);
  };

  /**
   * Closes the modal and clears the selected campaign.
   */
  const closeModal = (): void => {
    setModalState(false);
    setSelectedCampaign(null);
  };

  // Updates the campaigns state when the fetched campaign data changes
  useEffect(() => {
    if (campaignData) {
      setCampaigns(campaignData.getFundraisingCampaigns);
    }
  }, [campaignData]);

  // Renders a loader while campaigns are being fetched
  if (campaignLoading) return <Loader size="xl" />;
  if (campaignError) {
    // Displays an error message if there is an issue loading the campaigns
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Campaigns' })}
            <br />
            {campaignError.message}
          </h6>
        </div>
      </div>
    );
  }

  // Renders the campaign list and UI elements for searching, sorting, and adding pledges
  return (
    <>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        {/* Search input field and button */}
        <SearchBar
          placeholder={t('searchByName')}
          onSearch={setSearchTerm}
          inputTestId="searchCampaigns"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-4 mb-1">
          <div className="d-flex justify-space-between">
            <SortingButton
              sortingOptions={[
                { label: t('lowestGoal'), value: 'fundingGoal_ASC' },
                { label: t('highestGoal'), value: 'fundingGoal_DESC' },
                { label: t('latestEndDate'), value: 'endDate_DESC' },
                { label: t('earliestEndDate'), value: 'endDate_ASC' },
              ]}
              selectedOption={sortBy}
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
            {/* Button to navigate to the user's pledges */}
            <Button
              variant="success"
              data-testid="myPledgesBtn"
              onClick={() =>
                navigate(`/user/pledges/${orgId}`, { replace: true })
              }
            >
              {t('myPledges')}
              <i className="fa fa-angle-right ms-2" />
            </Button>
          </div>
        </div>
      </div>
      {campaigns.length < 1 ? (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {/* Displayed if no campaigns are found */}
          {t('noCampaigns')}
        </Stack>
      ) : (
        campaigns.map((campaign: InterfaceUserCampaign, index: number) => (
          <Accordion className="mt-3 rounded" key={index}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <div className={styles.accordionSummary}>
                <div
                  className={styles.titleContainerVolunteer}
                  data-testid={`detailContainer${index + 1}`}
                >
                  <div className="d-flex">
                    <h3>{campaign.name}</h3>
                    <Chip
                      icon={<Circle className={styles.chipIcon} />}
                      label={
                        new Date(campaign.endDate) < new Date()
                          ? 'Ended'
                          : 'Active'
                      }
                      variant="outlined"
                      color="primary"
                      className={`${styles.chip} ${
                        new Date(campaign.endDate) < new Date()
                          ? styles.pending
                          : styles.active
                      }`}
                    />
                  </div>

                  <div className={`d-flex gap-4 ${styles.subContainer}`}>
                    <span>
                      Goal:{' '}
                      {
                        currencySymbols[
                          campaign.currency as keyof typeof currencySymbols
                        ]
                      }
                      {campaign.fundingGoal}
                    </span>
                    <span>Raised: $0</span>
                    <span>
                      Start Date: {campaign.startDate as unknown as string}
                    </span>
                    <span>
                      End Date: {campaign.endDate as unknown as string}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <Button
                    variant={
                      new Date(campaign.endDate) < new Date()
                        ? 'outline-secondary'
                        : 'outline-success'
                    }
                    data-testid="addPledgeBtn"
                    disabled={new Date(campaign.endDate) < new Date()}
                    onClick={() => openModal(campaign)}
                    className={styles.outlineBtn}
                  >
                    <i className={'fa fa-plus me-2'} />
                    {t('addPledge')}
                  </Button>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails className="d-flex gap-3 ms-2">
              <span className="fw-bold">Amount Raised: </span>
              <div className={styles.progressAccordion}>
                <span>$0</span>
                <ProgressBar
                  now={0}
                  label={`${(200 / 1000) * 100}%`}
                  max={1000}
                  className={styles.progressBarAccordion}
                  data-testid="progressBar"
                />
                <span>$1000</span>
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Modal for adding pledges to campaigns */}
      <PledgeModal
        isOpen={modalState}
        hide={closeModal}
        campaignId={selectedCampaign?._id ?? ''}
        userId={userId}
        pledge={null}
        refetchPledge={refetchCampaigns}
        endDate={selectedCampaign?.endDate ?? new Date()}
        mode="create"
      />
    </>
  );
};

export default Campaigns;
