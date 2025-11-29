import {
  CREATE_PLEDGE,
  UPDATE_PLEDGE,
  DELETE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';

import { MEMBERS_LIST, USER_DETAILS } from 'GraphQl/Queries/Queries';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';

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
            {
              createdAt: '2030-04-13T04:53:17.742Z',
              email: 'testuser4@example.com',
              firstName: 'John',
              image: 'img-url',
              lastName: 'Doe',
              organizationsBlockedBy: [],
              __typename: 'User',
              _id: '1',
            },
            {
              createdAt: '2030-04-13T04:53:17.742Z',
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
                users: [
                  {
                    __typename: 'User',
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: 'img-url',
                  },
                ],
              },
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-09',
                users: [
                  {
                    __typename: 'User',
                    id: '2',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    image: null,
                  },
                ],
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
                users: [
                  {
                    __typename: 'User',
                    id: '2',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    image: null,
                  },
                ],
              },
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-10',
                users: [
                  {
                    __typename: 'User',
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                  },
                ],
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
                  {
                    __typename: 'User',
                    id: '2',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    image: null,
                  },
                  {
                    __typename: 'User',
                    id: '2',
                    firstName: 'John',
                    lastName: 'Doe2',
                    image: 'img-url2',
                  },
                  {
                    __typename: 'User',
                    id: '3',
                    firstName: 'John',
                    lastName: 'Doe3',
                    image: 'img-url3',
                  },
                  {
                    __typename: 'User',
                    id: '4',
                    firstName: 'John',
                    lastName: 'Doe4',
                    image: 'img-url4',
                  },
                  {
                    __typename: 'User',
                    id: '5',
                    firstName: 'John',
                    lastName: 'Doe5',
                    image: 'img-url5',
                  },
                  {
                    __typename: 'User',
                    id: '6',
                    firstName: 'John',
                    lastName: 'Doe6',
                    image: 'img-url6',
                  },
                  {
                    __typename: 'User',
                    id: '7',
                    firstName: 'John',
                    lastName: 'Doe7',
                    image: 'img-url7',
                  },
                  {
                    __typename: 'User',
                    id: '8',
                    firstName: 'John',
                    lastName: 'Doe8',
                    image: 'img-url8',
                  },
                  {
                    __typename: 'User',
                    id: '9',
                    firstName: 'John',
                    lastName: 'Doe9',
                    image: 'img-url9',
                  },
                  {
                    __typename: 'User',
                    id: '10',
                    firstName: 'John',
                    lastName: 'Doe10',
                    image: null,
                  },
                ],
              },
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2030-01-01',
                endDate: '2030-01-10',
                users: [
                  {
                    __typename: 'User',
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                  },
                ],
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
                users: [
                  {
                    __typename: 'User',
                    id: '1',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                  },
                ],
              },
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2024-01-01',
                endDate: '2024-01-09',
                users: [
                  {
                    __typename: 'User',
                    id: '2',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    image: null,
                  },
                ],
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
          users: [
            {
              __typename: 'User',
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              name: 'John Doe',
              image: null,
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
          users: [
            {
              __typename: 'User',
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              name: 'John Doe',
              image: null,
            },
          ],
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
        user: {
          __typename: 'User',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          image: null,
        },
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
              {
                __typename: 'User',
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
              },
              {
                __typename: 'User',
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                image: null,
              },
            ],
          },
        ],
      },
    },
  },
];
