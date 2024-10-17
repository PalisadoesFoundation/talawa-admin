import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { USER_FUND_CAMPAIGNS } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: '',
        },
        campaignOrderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            _id: 'campaignId1',
            startDate: '2024-07-28',
            endDate: '2025-08-31',
            name: 'School Campaign',
            fundingGoal: 22000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
          {
            _id: 'campaignId2',
            startDate: '2024-07-28',
            endDate: '2022-08-30',
            name: 'Hospital Campaign',
            fundingGoal: 9000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: '',
        },
        campaignOrderBy: 'endDate_ASC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            _id: 'campaignId2',
            startDate: '2024-07-28',
            endDate: '2024-08-30',
            name: 'Hospital Campaign',
            fundingGoal: 9000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
          {
            _id: 'campaignId1',
            startDate: '2024-07-28',
            endDate: '2024-08-31',
            name: 'School Campaign',
            fundingGoal: 22000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: '',
        },
        campaignOrderBy: 'fundingGoal_ASC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            _id: 'campaignId2',
            startDate: '2024-07-28',
            endDate: '2024-08-30',
            name: 'Hospital Campaign',
            fundingGoal: 9000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
          {
            _id: 'campaignId1',
            startDate: '2024-07-28',
            endDate: '2024-08-31',
            name: 'School Campaign',
            fundingGoal: 22000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: '',
        },
        campaignOrderBy: 'fundingGoal_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            _id: 'campaignId1',
            startDate: '2024-07-28',
            endDate: '2024-08-31',
            name: 'School Campaign',
            fundingGoal: 22000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
          {
            _id: 'campaignId2',
            startDate: '2024-07-28',
            endDate: '2024-08-30',
            name: 'Hospital Campaign',
            fundingGoal: 9000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: 'Hospital',
        },
        campaignOrderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            _id: 'campaignId2',
            startDate: '2024-07-28',
            endDate: '2024-08-30',
            name: 'Hospital Campaign',
            fundingGoal: 9000,
            currency: 'USD',
            __typename: 'FundraisingCampaign',
          },
        ],
      },
    },
  },
  {
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
            createdAt: '2023-04-13T04:53:17.742Z',
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
            pluginCreationAllowed: true,
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            __typename: 'AppUserProfile',
          },
          __typename: 'UserData',
        },
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: '',
        },
        campaignOrderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [],
      },
    },
  },
  {
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
            createdAt: '2023-04-13T04:53:17.742Z',
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
            pluginCreationAllowed: true,
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            __typename: 'AppUserProfile',
          },
          __typename: 'UserData',
        },
      },
    },
  },
];

export const USER_FUND_CAMPAIGNS_ERROR = [
  {
    request: {
      query: USER_FUND_CAMPAIGNS,
      variables: {
        where: {
          organizationId: 'orgId',
          name_contains: '',
        },
        campaignOrderBy: 'endDate_DESC',
      },
    },
    error: new Error('Error fetching campaigns'),
  },
];
