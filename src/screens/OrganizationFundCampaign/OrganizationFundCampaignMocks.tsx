import {
  CREATE_CAMPAIGN_MUTATION,
  DELETE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        getFundById: {
          campaigns: [
            {
              _id: '1',
              name: 'Campaign 1',
              fundingGoal: 100,
              startDate: '2021-01-01',
              endDate: '2021-01-01',
              currency: 'USD',
            },
            {
              _id: '2',
              name: 'Campaign 2',
              fundingGoal: 200,
              startDate: '2021-01-01',
              endDate: '2021-01-01',
              currency: 'USD',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_CAMPAIGN_MUTATION,
      variables: {
        fundId: '1',
        name: 'Campaign 3',
        fundingGoal: 300,
        startDate: '2021-01-01',
        endDate: '2021-01-01',
        currency: 'USD',
      },
    },
    result: {
      data: {
        createFundraisingCampaign: {
          _id: '3',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        id: '1',
        name: 'Campaign 1',
        fundingGoal: 100,
        startDate: '2021-01-01',
        endDate: '2021-01-01',
        currency: 'USD',
      },
    },
    result: {
      data: {
        updateFundraisingCampaign: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_CAMPAIGN_MUTATION,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        deleteFundraisingCampaign: {
          _id: '1',
        },
      },
    },
  },
];
export const MOCKS_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: undefined,
      },
    },
    error: new Error('Error fetching campaigns'),
  },
  {
    request: {
      query: CREATE_CAMPAIGN_MUTATION,
      variables: {
        fundId: '1',
        name: 'Campaign 3',
        fundingGoal: 300,
        startDate: '2021-01-01',
        endDate: '2021-01-01',
        currency: 'USD',
      },
    },
    error: new Error('Error creating campaign'),
  },
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        id: '1',
        name: 'Campaign 1',
        fundingGoal: 100,
        startDate: '2021-01-01',
        endDate: '2021-01-01',
        currency: 'USD',
      },
    },
    error: new Error('Error updating campaign'),
  },
  {
    request: {
      query: DELETE_CAMPAIGN_MUTATION,
      variables: {
        id: '1',
      },
    },
    error: new Error('Error deleting campaign'),
  },
];
