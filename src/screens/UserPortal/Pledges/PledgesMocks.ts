import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';

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
          id: 'userId',
          joinedOrganizations: [
            {
              id: '6537904485008f171cf29924',
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
          id: '67078abd85008f171cf2991d',
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
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            endDate: '2024-09-30T23:59:59.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-09-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            endDate: '2024-08-30T23:59:59.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: 'Harve',
          name_contains: undefined,
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          name_contains: 'School',
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'amount_ASC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'amount_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'endDate_ASC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-13T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-14T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-14T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            // Adding users array for testing the "more users" functionality
            users: [
              {
                id: 'userId5',
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                avatarURL: null,
                __typename: 'User',
              },
              {
                id: 'userId6',
                name: 'Jane Doe',
                firstName: 'Jane',
                lastName: 'Doe',
                avatarURL: null,
                __typename: 'User',
              },
              {
                id: 'userId7',
                name: 'Jeramy Gracia',
                firstName: 'Jeramy',
                lastName: 'Gracia',
                avatarURL: 'image-url3',
                __typename: 'User',
              },
              {
                id: 'userId8',
                name: 'Praise Norris',
                firstName: 'Praise',
                lastName: 'Norris',
                avatarURL: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-13T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
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
          id: '1',
        },
      },
    },
  },
  // Mock for campaign search with empty name_contains
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          name_contains: '',
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-09-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  // Mock for campaign search with "School"
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          name_contains: 'School',
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-09-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  userDetailsQuery,
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [],
      },
    },
  },
  userDetailsQuery,
];

export const USER_PLEDGES_ERROR = [
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'endDate_DESC',
      },
    },
    error: new Error('Error fetching pledges'),
  },
  // Mock for search by campaign name with empty string
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: '',
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  // Mock for when switching to campaign search mode (initial empty search)
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          name_contains: '',
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  userDetailsQuery,
];

// Mock for testing "more users" functionality - includes 4 users
export const MOCKS_WITH_MORE_USERS = [
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
        orderBy: 'endDate_DESC',
      },
    },
    result: {
      data: {
        getPledgesByUserId: [
          {
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-09-30T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId3',
            amount: 300,
            note: 'Library pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId3',
              name: 'Library Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-15T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 3000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId3',
              name: 'Jeramy Gracia',
              avatarURL: 'image-url3',
              __typename: 'User',
            },
            updater: {
              id: 'userId3',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId4',
            amount: 200,
            note: 'Park pledge note',
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId4',
              name: 'Park Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-10T23:59:59.000Z',
              currencyCode: 'USD',
              goalAmount: 2000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId4',
              name: 'Praise Norris',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId4',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
  userDetailsQuery,
];
