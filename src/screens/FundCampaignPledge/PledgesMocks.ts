import {
  CREATE_PLEDGE,
  UPDATE_PLEDGE,
  DELETE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';

import { MEMBERS_LIST, USER_DETAILS } from 'GraphQl/Queries/Queries';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';

const createUser = (
  id: string,
  firstName: string,
  lastName: string,
  image: string | null = null,
  email?: string,
  createdAt?: string,
) => ({
  __typename: 'User',
  _id: id,
  id,
  firstName,
  lastName,
  image,
  email,
  createdAt,
  organizationsBlockedBy: [],
  name: `${firstName} ${lastName}`,
});

const memberList = {
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
          __typename: 'Organization',
          _id: 'orgId',
          members: [
            createUser(
              '1',
              'John',
              'Doe',
              'img-url',
              'testuser4@example.com',
              '2030-04-13T04:53:17.742Z',
            ),
            createUser(
              '2',
              'Anna',
              'Bradley',
              null,
              'testuser2@example.com',
              '2030-04-13T04:53:17.742Z',
            ),
          ],
        },
      ],
    },
  },
};

export const MOCKS = [
  memberList,
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: 'fundCampaignId',
        },
        pledgeOrderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            __typename: 'FundCampaign',
            fundId: {
              __typename: 'Fund',
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
            startDate: '2030-01-01',
            endDate: '2034-08-08',
            pledges: [
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-10',
                users: [createUser('1', 'John', 'Doe', 'img-url')],
              },
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-09',
                users: [createUser('2', 'Jane', 'Doe')],
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: 'fundCampaignId',
        },
        pledgeOrderBy: 'endDate_ASC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            __typename: 'FundCampaign',
            fundId: {
              __typename: 'Fund',
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
            startDate: '2030-01-01',
            endDate: '2030-08-08',
            pledges: [
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-09',
                users: [createUser('2', 'Jane', 'Doe')],
              },
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-10',
                users: [createUser('1', 'John', 'Doe')],
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: 'fundCampaignId',
        },
        pledgeOrderBy: 'amount_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            __typename: 'FundCampaign',
            fundId: {
              __typename: 'Fund',
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
            startDate: '2030-01-01',
            endDate: '2030-08-08',
            pledges: [
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-09',
                users: [
                  createUser('2', 'Jane', 'Doe'),
                  createUser('2', 'John', 'Doe2', 'img-url2'),
                  createUser('3', 'John', 'Doe3', 'img-url3'),
                  createUser('4', 'John', 'Doe4', 'img-url4'),
                  createUser('5', 'John', 'Doe5', 'img-url5'),
                  createUser('6', 'John', 'Doe6', 'img-url6'),
                  createUser('7', 'John', 'Doe7', 'img-url7'),
                  createUser('8', 'John', 'Doe8', 'img-url8'),
                  createUser('9', 'John', 'Doe9', 'img-url9'),
                  createUser('10', 'John', 'Doe10'),
                ],
              },
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-10',
                users: [createUser('1', 'John', 'Doe')],
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: 'fundCampaignId',
        },
        pledgeOrderBy: 'amount_ASC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            __typename: 'FundCampaign',
            fundId: {
              __typename: 'Fund',
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
            startDate: '2030-01-01',
            endDate: '2030-08-08',
            pledges: [
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2024-01-01',
                endDate: '2024-01-10',
                users: [createUser('1', 'John', 'Doe')],
              },
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2024-01-01',
                endDate: '2024-01-09',
                users: [createUser('2', 'Jane', 'Doe')],
              },
            ],
          },
        ],
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
          __typename: 'Pledge',
          id: '1',
        },
      },
    },
  },
];

export const MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR = [
  memberList,
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: 'fundCampaignId',
        },
        pledgeOrderBy: 'endDate_DESC',
      },
    },
    error: new Error('Error fetching pledges'),
  },
];

export const MOCKS_DELETE_PLEDGE_ERROR = [
  memberList,
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

export const PLEDGE_MODAL_MOCKS = [
  memberList,
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
          __typename: 'Pledge',
          id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_PLEDGE,
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
          __typename: 'Pledge',
          id: '3',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_PLEDGE,
      variables: {
        campaignId: 'campaignId',
        amount: 100,
        currency: 'USD',
        startDate: '2024-01-01',
        endDate: '2024-01-10',
        userIds: ['1'],
      },
    },
    result: {
      data: {
        createPledge: {
          __typename: 'Pledge',
          id: '1',
          amount: 100,
          currency: 'USD',
          startDate: '2024-01-01',
          endDate: '2024-01-10',
          users: [createUser('1', 'John', 'Doe')],
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
      },
    },
    result: {
      data: {
        updatePledge: {
          __typename: 'Pledge',
          id: '1',
          amount: 200,
          currency: 'USD',
          startDate: '2024-01-01',
          endDate: '2024-01-10',
          users: [createUser('1', 'John', 'Doe')],
        },
      },
    },
  },
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        user: createUser('1', 'John', 'Doe'),
      },
    },
  },
];

export const PLEDGE_MODAL_ERROR_MOCKS = [
  {
    request: {
      query: CREATE_PLEDGE,
      variables: {
        campaignId: 'campaignId',
        amount: 100,
        currency: 'USD',
        startDate: expect.any(String),
        endDate: expect.any(String),
        userIds: ['1'],
      },
    },
    error: new Error('Failed to create pledge'),
  },
  {
    request: {
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 200,
        currency: 'USD',
        startDate: expect.any(String),
        endDate: expect.any(String),
        users: ['1'],
      },
    },
    error: new Error('Failed to update pledge'),
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organizations: [
          {
            __typename: 'Organization',
            members: [
              createUser('1', 'John', 'Doe'),
              createUser('2', 'Jane', 'Smith'),
            ],
          },
        ],
      },
    },
  },
];
