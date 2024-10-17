import {
  CREATE_PlEDGE,
  DELETE_PLEDGE,
  UPDATE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';

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
            _id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId2',
                firstName: 'Deanne',
                lastName: 'Marks',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId3',
                firstName: 'Jeramy',
                lastName: 'Garcia',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId4',
                firstName: 'Praise',
                lastName: 'Norris',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            _id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId6',
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
            _id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId',
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
            _id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId6',
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
            _id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            _id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId',
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
            _id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: 'image-url',
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            _id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId5',
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
            _id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                image: 'image-url',
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            _id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-14',
            campaign: {
              _id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId5',
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
            _id: 'pledgeId2',
            amount: 100,
            startDate: '2024-07-28',
            endDate: '2024-08-14',
            campaign: {
              _id: 'campaignId2',
              name: 'School Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId5',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId6',
                firstName: 'Jane',
                lastName: 'Doe',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId7',
                firstName: 'John2',
                lastName: 'Doe2',
                image: 'image-url3',
                __typename: 'User',
              },
              {
                _id: 'userId8',
                firstName: 'Jane2',
                lastName: 'Doe2',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId9',
                firstName: 'John3',
                lastName: 'Doe3',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId10',
                firstName: 'Jane3',
                lastName: 'Doe3',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId11',
                firstName: 'John4',
                lastName: 'Doe4',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'FundraisingCampaignPledge',
          },
          {
            _id: 'pledgeId1',
            amount: 700,
            startDate: '2024-07-28',
            endDate: '2024-08-13',
            campaign: {
              _id: 'campaignId1',
              name: 'Hospital Campaign',
              endDate: '2024-08-30',
              __typename: 'FundraisingCampaign',
            },
            currency: 'USD',
            users: [
              {
                _id: 'userId',
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
          _id: '1',
        },
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
];
