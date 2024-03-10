import {
  CREATE_CAMPAIGN_MUTATION,
  DELETE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import dayjs from 'dayjs';

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
              startDate: '2024-01-01',
              endDate: '2024-01-01',
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
        fundId: undefined,
        name: 'Campaign 1',
        fundingGoal: 100,
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
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
        name: 'Campaign 4',
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        fundingGoal: 1000,
        currency: 'INR',
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
        removeFundraisingCampaign: {
          _id: '1',
        },
      },
    },
  },
];

export const MOCK_FUND_CAMPAIGN_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: undefined,
      },
    },
    error: new Error('An error occurred'),
  },
];
export const MOCKS_ERROR_CREATE_CAMPAIGN = [
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
        fundId: undefined,
        name: 'Campaign 1',
        fundingGoal: 100,
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        currency: 'USD',
      },
    },
    error: new Error('An error occurred'),
  },
];
export const MOCKS_ERROR_UPDATE_CAMPAIGN = [
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
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        id: undefined,
        name: 'Campaign 1',
        fundingGoal: 100,
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        currency: 'USD',
      },
    },
    error: new Error('An error occurred'),
  },
];
export const MOCKS_ERROR_DELETE_CAMPAIGN = [
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
      query: DELETE_CAMPAIGN_MUTATION,
      variables: {
        id: '1',
      },
    },
    error: new Error('An error occurred'),
  },
];
export const EMPTY_MOCKS = [
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
          campaigns: [],
        },
      },
    },
  },
];
