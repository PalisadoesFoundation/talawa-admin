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
        userId: 'userId',
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
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId2',
                firstName: 'Deanne',
                lastName: 'Marks',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId3',
                firstName: 'Jeramy',
                lastName: 'Garcia',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId4',
                firstName: 'Praise',
                lastName: 'Norris',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId6',
                firstName: 'Jane',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
            ],
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
        userId: 'userId',
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
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: null,
                __typename: 'User',
              },
            ],
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
        userId: 'userId',
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
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId6',
                firstName: 'Jane',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
            ],
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
        userId: 'userId',
        where: {
          firstName_contains: '',
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
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: 'image-url',
                __typename: 'User',
              },
            ],
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
        userId: 'userId',
        where: {
          firstName_contains: '',
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
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: 'image-url',
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
            ],
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
        userId: 'userId',
        where: {
          firstName_contains: '',
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
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: 'image-url',
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-14',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
            ],
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
        userId: 'userId',
        where: {
          firstName_contains: '',
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
            startDate: '2024-07-28',
            endDate: '2024-08-14',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId6',
                firstName: 'Jane',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId7',
                firstName: 'John2',
                lastName: 'Doe2',
                image: 'image-url3',
                __typename: 'User',
              },
              {
                id: 'userId8',
                firstName: 'Jane2',
                lastName: 'Doe2',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId9',
                firstName: 'John3',
                lastName: 'Doe3',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId10',
                firstName: 'Jane3',
                lastName: 'Doe3',
                image: null,
                __typename: 'User',
              },
              {
                id: 'userId11',
                firstName: 'John4',
                lastName: 'Doe4',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: 'image-url',
                __typename: 'User',
              },
            ],
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
  userDetailsQuery,
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        userId: 'userId',
        where: {
          firstName_contains: '',
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
        userId: 'userId',
        where: {
          firstName_contains: '',
        },
        orderBy: 'endDate_DESC',
      },
    },
    error: new Error('Error fetching pledges'),
  },
  userDetailsQuery,
];
