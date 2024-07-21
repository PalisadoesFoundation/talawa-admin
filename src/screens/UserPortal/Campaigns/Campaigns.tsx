import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Button, ProgressBar } from 'react-bootstrap';
import styles from './Campaigns.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Circle, Search, Sort, WarningAmberRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
import PledgeModal from './PledgeModal';
import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';
import { useQuery } from '@apollo/client';
import type { InterfaceUserCampaign } from 'utils/interfaces';
import { currencySymbols } from 'utils/currency';
import Loader from 'components/Loader/Loader';

const Campaigns = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userCampaigns',
  });
  const { t: tCommon } = useTranslation('common');

  const { orgId } = useParams();
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [campaigns, setCampaigns] = useState<InterfaceUserCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<InterfaceUserCampaign | null>(null);
  const [modalState, setModalState] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    'goal_ASC' | 'goal_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
    refetch: refetchCampaigns,
  }: {
    data?: {
      getFundraisingCampaigns: InterfaceUserCampaign[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_FUND_CAMPAIGNS, {
    variables: {
      where: {
        organizationId: orgId,
      },
    },
  });

  const openModal = (campaign: InterfaceUserCampaign): void => {
    setSelectedCampaign(campaign);
    setModalState(true);
  };

  const closeModal = (): void => {
    setModalState(false);
    setSelectedCampaign(null);
  };

  useEffect(() => {
    if (campaignData) {
      setCampaigns(campaignData.getFundraisingCampaigns);
    }
  }, [campaignData]);

  if (campaignLoading) return <Loader size="xl" />;
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

  return (
    <>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={t('searchByName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="searchCampaigns"
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
                  onClick={() => setSortBy('goal_ASC')}
                  data-testid="goal_ASC"
                >
                  {t('lowestGoal')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy('goal_DESC')}
                  data-testid="goal_DESC"
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
      {campaigns.map((campaign: InterfaceUserCampaign, index: number) => (
        <Accordion className="mt-3 rounded" key={index}>
          <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
            <div className={styles.accordionSummary}>
              <div className={styles.titleContainer}>
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
                    className={`${styles.chip} ${new Date(campaign.endDate) < new Date() ? styles.pending : styles.active}`}
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
                  <span>Start Date: {campaign.startDate}</span>
                  <span>End Date: {campaign.endDate}</span>
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
                >
                  <i className={'fa fa-plus me-2'} />
                  {t('addPledge')}
                </Button>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails className="d-flex gap-3 ms-2">
            <span className="fw-bold">Progress: </span>
            <div className={styles.progress}>
              <span>$0</span>
              <ProgressBar
                striped
                now={200}
                label={`${(200 / 1000) * 100}%`}
                max={1000}
                className={styles.progressBar}
                data-testid="progressBar"
              />
              <span>$1000</span>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

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
