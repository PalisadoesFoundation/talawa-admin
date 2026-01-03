import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const userDetailsQuery = {
  request: {
    query: USER_DETAILS,
    variables: {
      input: { id: 'userId' },
    },
  },
  result: {
    data: {
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
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
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
    },
  },
};

export const MOCKS = [
  // Main pledges query
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'month').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(1, 'month').endOf('month').toISOString(),
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'month').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(1, 'month').endOf('month').toISOString(),
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
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
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
        input: { userId: 'userId' },
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(2, 'months').endOf('month').toISOString(),
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
            updatedAt: dayjs.utc().toISOString(),
            endDate: dayjs.utc().add(1, 'month').endOf('month').toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs.utc().startOf('month').toISOString(),
              endAt: dayjs.utc().add(1, 'month').endOf('month').toISOString(),
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
