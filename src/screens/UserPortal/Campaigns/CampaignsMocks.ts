import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const userDetailsQuery = {
  request: {
    query: USER_DETAILS,
    variables: {
      id: 'userId',
    },
  },
  result: {
    data: {
      user: {
        user: {
          _id: 'userId',
          joinedOrganizations: [
            {
              _id: '6537904485008f171cf29924',
              __typename: 'Organization',
            },
          ],
          firstName: 'Harve',
          lastName: 'Lance',
          email: 'testuser1@example.com',
          image: null,
          createdAt: dayjs.utc().toISOString(),
          birthDate: null,
          educationGrade: null,
          employmentStatus: null,
          gender: null,
          maritalStatus: null,
          phone: null,
          address: {
            line1: 'Line1',
            countryCode: 'CountryCode',
            city: 'CityName',
            state: 'State',
            __typename: 'Address',
          },
          registeredEvents: [],
          membershipRequests: [],
          __typename: 'User',
        },
        appUserProfile: {
          _id: '67078abd85008f171cf2991d',
          adminFor: [],
          isSuperAdmin: false,
          appLanguageCode: 'en',
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          __typename: 'AppUserProfile',
        },
        __typename: 'UserData',
      },
    },
  },
};

export const MOCKS = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [
              {
                node: {
                  campaigns: {
                    edges: [
                      {
                        node: {
                          id: 'campaignId1',
                          name: 'School Campaign',
                          currencyCode: 'USD',
                          goalAmount: 22000,
                          startAt: '2024-06-15',
                          endAt: '2099-12-31',
                        },
                      },
                      {
                        node: {
                          id: 'campaignId2',
                          name: 'Hospital Campaign',
                          currencyCode: 'USD',
                          goalAmount: 9000,
                          startAt: '2024-07-28',
                          endAt: '2022-08-30',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  userDetailsQuery,
];

export const MOCKS_WITH_NO_FUNDS = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [],
          },
        },
      },
    },
  },
  userDetailsQuery,
];

export const MOCKS_WITH_FUND_NO_CAMPAIGNS = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [
              {
                node: {
                  campaigns: {
                    edges: [],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  userDetailsQuery,
];

export const MOCKS_WITH_NULL_ORGANIZATION = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: null,
      },
    },
  },
  userDetailsQuery,
];

export const MOCKS_WITH_UNDEFINED_CAMPAIGNS = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [
              {
                node: {
                  campaigns: undefined,
                },
              },
            ],
          },
        },
      },
    },
  },
  userDetailsQuery,
];

export const USER_FUND_CAMPAIGNS_ERROR = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    error: new Error('Error fetching campaigns'),
  },
  userDetailsQuery,
];

export const MOCKS_WITH_PENDING_CAMPAIGN = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [
              {
                node: {
                  campaigns: {
                    edges: [
                      {
                        node: {
                          id: 'pendingCampaignId',
                          name: 'Future School Campaign',
                          currencyCode: 'USD',
                          goalAmount: 50000,
                          startAt: dayjs().add(5, 'days').toISOString(),
                          endAt: dayjs().add(10, 'days').toISOString(),
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  userDetailsQuery,
];
