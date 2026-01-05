import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
                  startAt: dayjs.utc().add(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  pledgedAmount: '50',
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Campaign 2',
                  startAt: dayjs.utc().subtract(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(11, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 200,
                  pledgedAmount: '150',
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
                  startAt: dayjs().toISOString(),
                  endAt: dayjs().add(2, 'years').startOf('year').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  pledgedAmount: '50',
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Campaign 2',
                  startAt: '2021-01-01T00:00:00.000Z',
                  endAt: dayjs().add(2, 'years').startOf('year').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 200,
                  pledgedAmount: '150',
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
    },
    variableMatcher: (vars: {
      fundId: string;
      name: string;
      goalAmount: number;
      startAt: string;
      endAt: string;
      currencyCode: string;
    }) =>
      vars.fundId === 'fundId' &&
      vars.name === 'Campaign 2' &&
      vars.goalAmount === 200 &&
      typeof vars.startAt === 'string' &&
      typeof vars.endAt === 'string' &&
      vars.currencyCode === 'USD',
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
    },
    variableMatcher: (vars: {
      input: {
        id: string;
        name: string;
        goalAmount: number;
        startAt: string;
        endAt: string;
      };
    }) =>
      vars.input.id === 'campaignId1' &&
      vars.input.name === 'Campaign 4' &&
      vars.input.goalAmount === 400 &&
      typeof vars.input.startAt === 'string' &&
      typeof vars.input.endAt === 'string',
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
    },
    variableMatcher: (vars: {
      fundId: string;
      name: string;
      goalAmount: number;
      startAt: string;
      endAt: string;
      currencyCode: string;
    }) =>
      vars.fundId === 'fundId' &&
      vars.name === 'Campaign 2' &&
      vars.goalAmount === 200 &&
      typeof vars.startAt === 'string' &&
      typeof vars.endAt === 'string' &&
      vars.currencyCode === 'USD',
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
    },
    variableMatcher: (vars: {
      input: {
        id: string;
        name: string;
        goalAmount: number;
        startAt: string;
        endAt: string;
      };
    }) =>
      vars.input.id === 'campaignId1' &&
      vars.input.name === 'Campaign 4' &&
      vars.input.goalAmount === 400 &&
      typeof vars.input.startAt === 'string' &&
      typeof vars.input.endAt === 'string',
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

// Mock with various pledgedAmount edge cases for testing
export const MOCKS_WITH_EDGE_CASES = [
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
                  startAt: dayjs.utc().add(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  pledgedAmount: null, // null pledgedAmount - tests nullable path (line 276, 304)
                },
              },
              {
                node: {
                  id: 'campaignId2',
                  name: 'Campaign 2',
                  startAt: dayjs.utc().add(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  pledgedAmount: '0', // zero pledgedAmount
                },
              },
              {
                node: {
                  id: 'campaignId3',
                  name: 'Campaign 3',
                  startAt: dayjs.utc().add(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  pledgedAmount: '100', // 100% pledgedAmount
                },
              },
              {
                node: {
                  id: 'campaignId4',
                  name: 'Campaign 4',
                  startAt: dayjs.utc().add(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  pledgedAmount: '150', // over 100% pledgedAmount - tests Math.min cap at 100% (line 307)
                },
              },
              {
                node: {
                  id: 'campaignId5',
                  name: 'Campaign 5',
                  startAt: dayjs.utc().add(1, 'month').toISOString(),
                  endAt: dayjs.utc().add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 0, // zero goal - tests goal > 0 ternary false branch (line 307)
                  pledgedAmount: '50',
                },
              },
            ],
          },
        },
      },
    },
  },
];
