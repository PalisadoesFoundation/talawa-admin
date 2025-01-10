import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

export const MOCKS1 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: null,
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            eventsAttended: [],
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            tagsAssignedWith: {
              edges: [
                {
                  node: {
                    _id: '1',
                    name: 'userTag 1',
                    parentTag: null,
                  },
                  cursor: '1',
                },
                {
                  node: {
                    _id: '2',
                    name: 'userTag 2',
                    parentTag: null,
                  },
                  cursor: '2',
                },
                {
                  node: {
                    _id: '3',
                    name: 'userTag 3',
                    parentTag: null,
                  },
                  cursor: '3',
                },
                {
                  node: {
                    _id: '4',
                    name: 'userTag 4',
                    parentTag: null,
                  },
                  cursor: '4',
                },
                {
                  node: {
                    _id: '5',
                    name: 'userTag 5',
                    parentTag: null,
                  },
                  cursor: '5',
                },
                {
                  node: {
                    _id: '6',
                    name: 'userTag 6',
                    parentTag: null,
                  },
                  cursor: '6',
                },
                {
                  node: {
                    _id: '7',
                    name: 'userTag 7',
                    parentTag: null,
                  },
                  cursor: '7',
                },
                {
                  node: {
                    _id: '8',
                    name: 'userTag 8',
                    parentTag: null,
                  },
                  cursor: '8',
                },
                {
                  node: {
                    _id: '9',
                    name: 'userTag 9',
                    parentTag: null,
                  },
                  cursor: '9',
                },
                {
                  node: {
                    _id: '10',
                    name: 'userTag 10',
                    parentTag: null,
                  },
                  cursor: '10',
                },
              ],
              pageInfo: {
                startCursor: '1',
                endCursor: '10',
                hasNextPage: true,
                hasPreviousPage: false,
              },
              totalCount: 12,
            },
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '10',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: null,
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            eventsAttended: [],
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            tagsAssignedWith: {
              edges: [
                {
                  node: {
                    _id: '11',
                    name: 'userTag 11',
                    parentTag: null,
                  },
                  cursor: '11',
                },
                {
                  node: {
                    _id: '12',
                    name: 'subTag 1',
                    parentTag: { _id: '1' },
                  },
                  cursor: '12',
                },
              ],
              pageInfo: {
                startCursor: '11',
                endCursor: '12',
                hasNextPage: false,
                hasPreviousPage: true,
              },
              totalCount: 12,
            },
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: '1',
        userId: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        unassignUserTag: {
          _id: '1',
        },
      },
    },
  },
];

export const MOCKS2 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: 'https://placeholder.com/200x200',
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            tagsAssignedWith: {
              edges: [],
              pageInfo: {
                startCursor: null,
                endCursor: null,
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 0,
            },
            eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
];
export const MOCKS3 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [],
            isSuperAdmin: true,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: 'https://placeholder.com/200x200',
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            tagsAssignedWith: {
              edges: [],
              pageInfo: {
                startCursor: null,
                endCursor: null,
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 0,
            },
            eventsAttended: [],
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
];
