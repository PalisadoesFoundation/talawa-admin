import {
  CREATE_PlEDGE,
  DELETE_PLEDGE,
  UPDATE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          pledges: [
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-01',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                },
              ],
            },
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-03-03',
              endDate: '2024-04-03',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_PlEDGE,
      variables: {
        campaignId: undefined,
        amount: 100,
        currency: 'USD',
        startDate: '2024-03-10',
        endDate: '2024-03-10',
        userIds: [null],
      },
    },
    result: {
      data: {
        createFundraisingCampaignPledge: {
          _id: '3',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 100100,
        currency: 'INR',
        startDate: '2024-03-10',
        endDate: '2024-03-10',
      },
    },
    result: {
      data: {
        updateFundraisingCampaignPledge: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_PLEDGE,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        removeFundraisingCampaignPledge: {
          _id: '1',
        },
      },
    },
  },
];
export const MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: undefined,
      },
    },
    error: new Error('Error fetching pledges'),
  },
];

export const MOCKS_CREATE_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          pledges: [
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-01',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                },
              ],
            },
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-03-03',
              endDate: '2024-04-03',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_PlEDGE,
      variables: {
        campaignId: undefined,
        amount: 100,
        currency: 'USD',
        startDate: '2024-03-10',
        endDate: '2024-03-10',
        userIds: null,
      },
    },
    error: new Error('Error creating pledge'),
  },
];
export const MOCKS_UPDATE_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          pledges: [
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-01',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                },
              ],
            },
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-03-03',
              endDate: '2024-04-03',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 200,
        currency: 'USD',
        startDate: '2024-03-10',
        endDate: '2024-03-10',
      },
    },
    error: new Error('Error updating pledge'),
  },
];
export const MOCKS_DELETE_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          pledges: [
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-01',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                },
              ],
            },
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-03-03',
              endDate: '2024-04-03',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_PLEDGE,
      variables: {
        id: '1',
      },
    },
    error: new Error('Error deleting pledge'),
  },
];
export const EMPTY_MOCKS = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-01-01',
          pledges: [],
        },
      },
    },
  },
];
