import {
  CREATE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: null,
        where: { name_contains: '' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
          campaigns: [
            {
              _id: 'campaignId1',
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
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: null,
        where: { name_contains: '2' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
          campaigns: [
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
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: 'endDate_DESC',
        where: { name_contains: '' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
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
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: 'endDate_ASC',
        where: { name_contains: '' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
          campaigns: [
            {
              _id: '2',
              name: 'Campaign 2',
              fundingGoal: 200,
              startDate: '2021-01-01',
              endDate: '2021-01-01',
              currency: 'USD',
            },
            {
              _id: '1',
              name: 'Campaign 1',
              fundingGoal: 100,
              startDate: '2024-01-01',
              endDate: '2024-01-01',
              currency: 'USD',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: 'fundingGoal_DESC',
        where: { name_contains: '' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
          campaigns: [
            {
              _id: '2',
              name: 'Campaign 2',
              fundingGoal: 200,
              startDate: '2021-01-01',
              endDate: '2021-01-01',
              currency: 'USD',
            },
            {
              _id: '1',
              name: 'Campaign 1',
              fundingGoal: 100,
              startDate: '2024-01-01',
              endDate: '2024-01-01',
              currency: 'USD',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: 'fundingGoal_ASC',
        where: { name_contains: '' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
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
        fundId: 'fundId',
        organizationId: 'orgId',
        name: 'Campaign 2',
        fundingGoal: 200,
        startDate: '2024-01-02',
        endDate: '2024-02-02',
        currency: 'USD',
      },
    },
    result: {
      data: {
        createFundraisingCampaign: {
          _id: 'fundId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        id: 'campaignId1',
        name: 'Campaign 4',
        fundingGoal: 400,
        startDate: '2023-01-02',
        endDate: '2023-02-02',
      },
    },
    result: {
      data: {
        updateFundraisingCampaign: {
          _id: 'campaignId1',
        },
      },
    },
  },
];

export const MOCK_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: null,
        where: { name_contains: '2' },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: CREATE_CAMPAIGN_MUTATION,
      variables: {
        fundId: 'fundId',
        organizationId: 'orgId',
        name: 'Campaign 2',
        fundingGoal: 200,
        startDate: '2024-01-02',
        endDate: '2024-02-02',
        currency: 'USD',
      },
    },
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        id: 'campaignId1',
        name: 'Campaign 4',
        fundingGoal: 400,
        startDate: '2023-01-02',
        endDate: '2023-02-02',
      },
    },
    error: new Error('Mock graphql error'),
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        id: 'fundId',
        orderBy: null,
        where: { name_contains: '' },
      },
    },
    result: {
      data: {
        getFundById: {
          name: 'Fund 1',
          isArchived: false,
          campaigns: [],
        },
      },
    },
  },
];
