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
  // Main pledges query
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        userId: { id: 'userId' },
        where: {},
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
  // Search by user name
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        userId: { id: 'userId' },
        where: {
          firstName_contains: 'Harve',
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
  // Search by campaign name (with firstName_contains)
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        userId: { id: 'userId' },
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
        ],
      },
    },
  },
  // Search by campaign name (only name_contains)
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        userId: { id: 'userId' },
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
        ],
      },
    },
  },
  // Sort by amount ASC
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        userId: { id: 'userId' },
        where: {},
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

  // Delete pledge mock
  {
    request: {
      query: DELETE_PLEDGE,
      variables: {
        id: 'pledgeId1',
      },
    },
    result: {
      data: {
        deleteFundCampaignPledge: {
          id: 'pledgeId1',
          __typename: 'FundraisingCampaignPledge',
        },
      },
    },
  },
  userDetailsQuery,
];
