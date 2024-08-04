import {
  CREATE_PlEDGE,
  DELETE_PLEDGE,
  UPDATE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import {
  FUND_CAMPAIGN_PLEDGE,
  USER_PLEDGES,
} from 'GraphQl/Queries/fundQueries';

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
                image: 'image-url3',
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
                image: 'image-url3',
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
                image: 'image-url3',
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
              {
                _id: 'userId12',
                firstName: 'Jane4',
                lastName: 'Doe4',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId13',
                firstName: 'John5',
                lastName: 'Doe5',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId14',
                firstName: 'Jane5',
                lastName: 'Doe5',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId15',
                firstName: 'John6',
                lastName: 'Doe6',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId16',
                firstName: 'Jane6',
                lastName: 'Doe6',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId17',
                firstName: 'John7',
                lastName: 'Doe7',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId18',
                firstName: 'Jane7',
                lastName: 'Doe7',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId19',
                firstName: 'John8',
                lastName: 'Doe8',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId20',
                firstName: 'Jane8',
                lastName: 'Doe8',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId21',
                firstName: 'John9',
                lastName: 'Doe9',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId22',
                firstName: 'Jane9',
                lastName: 'Doe9',
                image: null,
                __typename: 'User',
              },
              {
                _id: 'userId23',
                firstName: 'John10',
                lastName: 'Doe10',
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
                image: 'image-url3',
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

export const MOCKS_CREATE_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: undefined,
        },
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            startDate: '2024-01-01',
            endDate: '2024-01-01',
            pledges: [
              {
                _id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2024-01-01',
                endDate: '2024-01-01',
                users: [
                  {
                    _id: '1',
                    firstName: 'John',
                  },
                ],
              },
              {
                _id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2024-03-03',
                endDate: '2024-04-03',
                users: [
                  {
                    _id: '2',
                    firstName: 'Jane',
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
    error: new Error('Error creating pledge'),
  },
];

export const MOCKS_UPDATE_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: undefined,
        },
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            startDate: '2024-01-01',
            endDate: '2024-01-01',
            pledges: [
              {
                _id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2024-01-01',
                endDate: '2024-01-01',
                users: [
                  {
                    _id: '1',
                    firstName: 'John',
                  },
                ],
              },
              {
                _id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2024-03-03',
                endDate: '2024-04-03',
                users: [
                  {
                    _id: '2',
                    firstName: 'Jane',
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
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 200,
        currency: 'USD',
        startDate: '2024-03-10',
        endDate: '2024-03-10',
      },
    },
    error: new Error('Error updating pledge'),
  },
];

export const MOCKS_DELETE_PLEDGE_ERROR = [
  {
    request: {
      query: FUND_CAMPAIGN_PLEDGE,
      variables: {
        where: {
          id: undefined,
        },
      },
    },
    result: {
      data: {
        getFundraisingCampaigns: [
          {
            startDate: '2024-01-01',
            endDate: '2024-01-01',
            pledges: [
              {
                _id: '1',
                amount: 100,
                currency: 'USD',
                startDate: '2024-01-01',
                endDate: '2024-01-01',
                users: [
                  {
                    _id: '1',
                    firstName: 'John',
                  },
                ],
              },
              {
                _id: '2',
                amount: 200,
                currency: 'USD',
                startDate: '2024-03-03',
                endDate: '2024-04-03',
                users: [
                  {
                    _id: '2',
                    firstName: 'Jane',
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
    error: new Error('Error deleting pledge'),
  },
];

export const PLEDGE_MODAL_MOCKS = [
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
