import {
  CREATE_PLEDGE,
  UPDATE_PLEDGE,
  DELETE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import {
  MEMBERS_LIST,
  MEMBERS_LIST_PG,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
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
  name: `${firstName} ${lastName}`,
  eventsAttended: [],
  organizationsWhereMember: { edges: [] },
  createdOrganizations: [],
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
              dayjs.utc().toISOString(),
            ),
            createUser(
              '2',
              'Anna',
              'Bradley',
              null,
              'testuser2@example.com',
              dayjs.utc().toISOString(),
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
            startDate: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'year').toISOString(),
            pledges: [
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: dayjs.utc().toISOString(),
                endDate: dayjs.utc().add(10, 'day').toISOString(),
                users: [createUser('1', 'John', 'Doe', 'img-url')],
              },
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: dayjs.utc().toISOString(),
                endDate: dayjs.utc().add(9, 'day').toISOString(),
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
            startDate: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'year').toISOString(),
            pledges: [
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: dayjs.utc().toISOString(),
                endDate: dayjs.utc().add(9, 'day').toISOString(),
                users: [createUser('2', 'Jane', 'Doe')],
              },
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: dayjs.utc().toISOString(),
                endDate: dayjs.utc().add(10, 'day').toISOString(),
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
            startDate: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'year').toISOString(),
            pledges: [
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: dayjs.utc().toISOString(),
                endDate: dayjs.utc().add(9, 'day').toISOString(),
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
                startDate: dayjs.utc().toISOString(),
                endDate: dayjs.utc().add(10, 'day').toISOString(),
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
            startDate: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'year').toISOString(),
            pledges: [
              {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                currency: 'USD',
                startDate: dayjs.utc().subtract(1, 'month').toISOString(),
                endDate: dayjs.utc().subtract(20, 'day').toISOString(),
                users: [createUser('1', 'John', 'Doe')],
              },
              {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                currency: 'USD',
                startDate: dayjs.utc().subtract(1, 'month').toISOString(),
                endDate: dayjs.utc().subtract(21, 'day').toISOString(),
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
    },
    variableMatcher: (vars: {
      campaignId: string;
      amount: number;
      currency: string;
      userIds?: string[];
    }) =>
      vars.campaignId === 'campaignId' &&
      vars.amount === 200 &&
      vars.currency === 'USD' &&
      vars.userIds?.[0] === '1',
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
    },
    variableMatcher: (vars: {
      campaignId: string;
      amount: number;
      currency: string;
      userIds?: string[];
    }) =>
      vars.campaignId === 'campaignId' &&
      vars.amount === 100 &&
      vars.currency === 'USD' &&
      vars.userIds?.[0] === '1',
    result: {
      data: {
        createPledge: {
          __typename: 'Pledge',
          id: '1',
          amount: 100,
          currency: 'USD',
          startDate: dayjs.utc().toISOString(),
          endDate: dayjs.utc().add(9, 'day').toISOString(),
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
          startDate: dayjs.utc().toISOString(),
          endDate: dayjs.utc().add(9, 'day').toISOString(),
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

const membersListPgResult = {
  data: {
    organization: {
      __typename: 'Organization',
      id: 'orgId',
      members: {
        __typename: 'UserConnection',
        edges: [
          {
            __typename: 'UserEdge',
            node: {
              __typename: 'User',
              id: '1',
              name: 'John Doe',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
            },
          },
          {
            __typename: 'UserEdge',
            node: {
              __typename: 'User',
              id: '2',
              name: 'Jane Smith',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
            },
          },
        ],
      },
    },
  },
};

export const PLEDGE_MODAL_ERROR_MOCKS = [
  {
    request: {
      query: CREATE_PLEDGE,
    },
    variableMatcher: (vars: { campaignId: string; pledgerId: string }) =>
      vars.campaignId === 'campaignId' && vars.pledgerId === '1',
    error: new Error('Failed to create pledge'),
  },
  {
    request: {
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 200,
      },
    },
    error: new Error('Failed to update pledge'),
  },
  {
    request: {
      query: MEMBERS_LIST_PG,
      variables: { input: { id: 'orgId' } },
    },
    result: membersListPgResult,
  },
];
