import {
  CREATE_PlEDGE,
  DELETE_PLEDGE,
  UPDATE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: 'fundCampaignId',
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-08-08',
          pledges: [
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-10',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                  lastName: 'Doe',
                  image: 'img-url',
                },
              ],
            },
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-09',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                  lastName: 'Doe',
                  image: null,
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
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: 'fundCampaignId',
        orderBy: 'endDate_ASC',
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-08-08',
          pledges: [
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-09',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                  lastName: 'Doe',
                  image: null,
                },
              ],
            },
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-10',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                  lastName: 'Doe',
                  image: null,
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
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: 'fundCampaignId',
        orderBy: 'amount_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-08-08',
          pledges: [
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-09',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                  lastName: 'Doe',
                  image: null,
                },
              ],
            },
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-10',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                  lastName: 'Doe',
                  image: null,
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
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        id: 'fundCampaignId',
        orderBy: 'amount_ASC',
      },
    },
    result: {
      data: {
        getFundraisingCampaignById: {
          startDate: '2024-01-01',
          endDate: '2024-08-08',
          pledges: [
            {
              _id: '1',
              amount: 100,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-10',
              users: [
                {
                  _id: '1',
                  firstName: 'John',
                  lastName: 'Doe',
                  image: null,
                },
              ],
            },
            {
              _id: '2',
              amount: 200,
              currency: 'USD',
              startDate: '2024-01-01',
              endDate: '2024-01-09',
              users: [
                {
                  _id: '2',
                  firstName: 'Jane',
                  lastName: 'Doe',
                  image: null,
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
        id: 'fundCampaignId',
        orderBy: 'endDate_DESC',
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
        campaignId: 'campaignId',
        amount: 200,
        currency: 'USD',
        startDate: '2024-01-02',
        endDate: '2024-01-02',
        userIds: ['1'],
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
        id: 'fundCampaignId',
        orderBy: 'endDate_DESC',
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

export const PLEDGE_MODAL_MOCKS = [
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            members: [
              {
                createdAt: '2023-04-13T04:53:17.742Z',
                email: 'testuser4@example.com',
                firstName: 'John',
                image: 'img-url',
                lastName: 'Doe',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '1',
              },
              {
                createdAt: '2024-04-13T04:53:17.742Z',
                email: 'testuser2@example.com',
                firstName: 'Anna',
                image: null,
                lastName: 'Bradley',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '2',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 200,
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
      query: CREATE_PlEDGE,
      variables: {
        campaignId: 'campaignId',
        amount: 200,
        currency: 'USD',
        startDate: '2024-01-02',
        endDate: '2024-01-02',
        userIds: ['1'],
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
];
