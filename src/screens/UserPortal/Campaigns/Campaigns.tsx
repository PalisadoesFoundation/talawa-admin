import React, { useState } from 'react';
import { Dropdown, Form, Button, ProgressBar } from 'react-bootstrap';
import styles from './Campaigns.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { Circle, Search, Sort } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
// import PledgeModal from './PledgeModal';
// import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
// import { useQuery } from '@apollo/client';
// import { InterfaceQueryOrganizationFundCampaigns } from 'utils/interfaces';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'goal_ASC' | 'goal_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

  const openModal = (): void => {
    console.log({ sortBy, userId });
  };

  // const {
  //   data: fundCampaignData,
  //   loading: fundCampaignLoading,
  //   error: fundCampaignError,
  //   refetch: refetchFundCampaign,
  // }: {
  //   data?: {
  //     getFundById: InterfaceQueryOrganizationFundCampaigns;
  //   };
  //   loading: boolean;
  //   error?: Error | undefined;
  //   refetch: any;
  // } = useQuery(FUND_CAMPAIGN, {
  //   variables: {
  //     id: currentUrl,
  //   },
  // });

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
            <Button variant="success" data-testid="myPledgesBtn">
              {t('myPledges')}
              <i className="fa fa-angle-right ms-2" />
            </Button>
          </div>
        </div>
      </div>

      <Accordion>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <div className={styles.accordionSummary}>
            <div className={styles.titleContainer}>
              <div className="d-flex">
                <h3>Test Campaign 1</h3>
                <Chip
                  icon={<Circle className={styles.chipIcon} />}
                  label="Active"
                  variant="outlined"
                  color="primary"
                  className={`${styles.chip} ${styles.pending}`}
                />
              </div>

              <div className={`d-flex gap-4 ${styles.subContainer}`}>
                <span>Goal: $1000</span>
                <span>Raised: $750</span>
                <span>Start Date: 26-07-2024</span>
                <span>End Date: 26-08-2024</span>
              </div>
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="outline-success"
                data-testid="addPledgeBtn"
                onClick={openModal}
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
      {/* <PledgeModal
        isOpen={modalState[Modal.SAME]}
        hide={() => closeModal(Modal.SAME)}
        campaignId={fundCampaignId}
        orgId={orgId}
        pledge={pledge}
        refetchPledge={refetchPledge}
        endDate={pledgeData?.getFundraisingCampaignById.endDate as Date}
        mode='create'
      /> */}
    </>
  );
};

export default Campaigns;
