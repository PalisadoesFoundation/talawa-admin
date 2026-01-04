import {
  CREATE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  // Base mock with no filters
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        input: { id: 'fundId' },
      },
    },
    result: {
      data: {
        fund: {
          id: 'fundId',
          name: 'Fund 1',
          campaigns: {
            edges: [
              {
                node: {
                  id: 'campaignId1',
                  name: 'Campaign 1',
                  startAt: '2024-01-01T00:00:00.000Z',
                  endAt: '2026-01-01T00:00:00.000Z',
                  currencyCode: 'USD',
                  goalAmount: 100,
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Campaign 2',
                  startAt: '2021-01-01T00:00:00.000Z',
                  endAt: '2026-01-01T00:00:00.000Z',
                  currencyCode: 'USD',
                  goalAmount: 200,
                },
              },
            ],
          },
        },
      },
    },
  },
  // Sort by endDate DESC
  {
    request: {
      query: FUND_CAMPAIGN,
      variables: {
        input: { id: 'fundId' },
      },
    },
    result: {
      data: {
        fund: {
          id: 'fundId',
          name: 'Fund 1',
          campaigns: {
            edges: [
              {
                node: {
                  id: 'campaignId1',
                  name: 'Campaign 1',
                  startAt: '2024-01-01T00:00:00.000Z',
                  endAt: '2026-01-01T00:00:00.000Z',
                  currencyCode: 'USD',
                  goalAmount: 100,
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Campaign 2',
                  startAt: '2021-01-01T00:00:00.000Z',
                  endAt: '2026-01-01T00:00:00.000Z',
                  currencyCode: 'USD',
                  goalAmount: 200,
                },
              },
            ],
          },
        },
      },
    },
  },
  // Create campaign mock
  {
    request: {
      query: CREATE_CAMPAIGN_MUTATION,
      variables: {
        fundId: 'fundId',
        name: 'Campaign 2',
        goalAmount: 200,
        startAt: '2024-02-01T00:00:00.000Z',
        endAt: '2024-12-31T00:00:00.000Z',
        currencyCode: 'USD',
      },
    },
    result: {
      data: {
        createFundCampaign: {
          id: '01958c3d-12a4-7056-91dc-24abc0c6ad37',
        },
      },
    },
  },

  // Update campaign mock
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        input: {
          id: 'campaignId1',
          name: 'Campaign 4',
          goalAmount: 400,
          startAt: '2024-02-01T00:00:00.000Z',
          endAt: '2024-12-31T00:00:00.000Z',
        },
      },
    },
    result: {
      data: {
        updateFundCampaign: {
          id: 'campaignId1',
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
        input: { id: 'fundId' },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: CREATE_CAMPAIGN_MUTATION,
      variables: {
        fundId: 'fundId',
        name: 'Campaign 2',
        goalAmount: 200,
        startAt: '2024-02-01T00:00:00.000Z',
        endAt: '2024-02-02T00:00:00.000Z',
        currencyCode: 'USD',
      },
    },
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        input: {
          id: 'campaignId1',
          name: 'Campaign 4',
          goalAmount: 400,
          startAt: '2024-02-01T00:00:00.000Z',
          endAt: '2024-02-02T00:00:00.000Z',
        },
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
        input: { id: 'fundId' },
      },
    },
    result: {
      data: {
        fund: {
          id: 'fundId',
          name: 'Fund 1',
          campaigns: {
            edges: [],
          },
        },
      },
    },
  },
];
