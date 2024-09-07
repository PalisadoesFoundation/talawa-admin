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
            fundId: {
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
            startDate: '2024-01-01',
            endDate: '2034-08-08',
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
                  {
                    _id: '2',
                    firstName: 'John',
                    lastName: 'Doe2',
                    image: 'img-url2',
                  },
                  {
                    _id: '3',
                    firstName: 'John',
                    lastName: 'Doe3',
                    image: 'img-url3',
                  },
                  {
                    _id: '4',
                    firstName: 'John',
                    lastName: 'Doe4',
                    image: 'img-url4',
                  },
                  {
                    _id: '5',
                    firstName: 'John',
                    lastName: 'Doe5',
                    image: 'img-url5',
                  },
                  {
                    _id: '6',
                    firstName: 'John',
                    lastName: 'Doe6',
                    image: 'img-url6',
                  },
                  {
                    _id: '7',
                    firstName: 'John',
                    lastName: 'Doe7',
                    image: 'img-url7',
                  },
                  {
                    _id: '8',
                    firstName: 'John',
                    lastName: 'Doe8',
                    image: 'img-url8',
                  },
                  {
                    _id: '9',
                    firstName: 'John',
                    lastName: 'Doe9',
                    image: 'img-url9',
                  },
                  {
                    _id: '10',
                    firstName: 'John',
                    lastName: 'Doe10',
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
            fundId: {
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
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
            fundId: {
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
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
            fundId: {
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
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
            fundId: {
              name: 'Fund 1',
            },
            name: 'Campaign Name',
            fundingGoal: 1000,
            currency: 'USD',
            startDate: '2024-01-01',
            endDate: '2024-01-01',
            pledges: [],
          },
        ],
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
