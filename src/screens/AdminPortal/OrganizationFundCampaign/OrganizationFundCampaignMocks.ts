import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import {
  CREATE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';

const BASE_DATE_UTC = dayjs.utc('2025-01-01T00:00:00.000Z');

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
                  startAt: BASE_DATE_UTC.add(1, 'month').toISOString(),
                  endAt: BASE_DATE_UTC.add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  fundingRaised: 0,
                },
              },
              {
                node: {
                  id: 'campaignId1half',
                  name: 'Campaign Half',
                  startAt: BASE_DATE_UTC.add(1, 'month').toISOString(),
                  endAt: BASE_DATE_UTC.add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  fundingRaised: 50,
                },
              },
              {
                node: {
                  id: 'campaignId1full',
                  name: 'Campaign Full',
                  startAt: BASE_DATE_UTC.add(1, 'month').toISOString(),
                  endAt: BASE_DATE_UTC.add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  fundingRaised: 100,
                },
              },
              {
                node: {
                  id: 'campaignId1over',
                  name: 'Campaign Over',
                  startAt: BASE_DATE_UTC.add(1, 'month').toISOString(),
                  endAt: BASE_DATE_UTC.add(13, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  fundingRaised: 150,
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Campaign 2',
                  startAt: BASE_DATE_UTC.subtract(1, 'month').toISOString(),
                  endAt: BASE_DATE_UTC.add(11, 'month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 200,
                  fundingRaised: 0,
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
                  startAt: BASE_DATE_UTC.toISOString(),
                  endAt: BASE_DATE_UTC.add(2, 'years')
                    .startOf('year')
                    .toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 100,
                  fundingRaised: 0,
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Campaign 2',
                  startAt: BASE_DATE_UTC.subtract(4, 'years').toISOString(),
                  endAt: BASE_DATE_UTC.add(2, 'years')
                    .startOf('year')
                    .toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 200,
                  fundingRaised: 0,
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
