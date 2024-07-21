import React, { useState } from 'react';
import { Dropdown, Form, Button } from 'react-bootstrap';
import styles from './Pledges.module.css';
import { useTranslation } from 'react-i18next';
// import { Navigate, useParams } from 'react-router-dom';
import { Search, Sort } from '@mui/icons-material';
import useLocalStorage from 'utils/useLocalstorage';
// import PledgeModal from '../Campaigns/PledgeModal';
// import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';
// import { useQuery } from '@apollo/client';
// import { InterfaceUserCampaign } from 'utils/interfaces';
// import { currencySymbols } from 'utils/currency';
// import { set } from 'react-datepicker/dist/date_utils';

const Pledges = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userCampaigns',
  });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();
  // const userId = getItem('userId');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [sortBy, setSortBy] = useState<
    'goal_ASC' | 'goal_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

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
        </div>
      </div>

      {/* <PledgeModal
        isOpen={modalState}
        hide={closeModal}
        campaignId={selectedCampaign?._id ?? ''}
        userId={userId}
        pledge={null}
        refetchPledge={refetchCampaigns}
        endDate={selectedCampaign?.endDate ?? new Date()}
        mode="create"
      /> */}
    </>
  );
};

export default Pledges;
