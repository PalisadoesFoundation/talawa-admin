import {
  CREATE_ORGANIZATION_MUTATION,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  CURRENT_USER,
  ORGANIZATION_FILTER_LIST,
  USER_ORGANIZATION_LIST,
  ALL_ORGANIZATIONS_PG,
} from 'GraphQl/Queries/Queries';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import type {
  InterfaceOrgInfoTypePG,
  InterfaceUserType,
  InterfaceCurrentUserTypePG,
} from 'utils/interfaces';

const superAdminCurrentUser: InterfaceCurrentUserTypePG = {
  currentUser: {
    id: '123',
    name: 'John Doe',
    role: 'administrator',
    emailAddress: 'john.doe@akatsuki.com',
    addressLine1: '',
    addressLine2: '',
    avatarMimeType: null,
    avatarURL: null,
    birthDate: null,
    city: '',
    countryCode: '',
    createdAt: '',
    description: '',
    educationGrade: null,
    employmentStatus: null,
    homePhoneNumber: '',
    isEmailAddressVerified: false,
    maritalStatus: null,
    mobilePhoneNumber: '',
    natalSex: null,
    naturalLanguageCode: '',
    postalCode: '',
    state: '',
    updatedAt: '',
    workPhoneNumber: '',
    eventsAttended: {
      id: 'events-connection-id',
      edges: [],
      __typename: 'UserEventsConnection',
    },
  },
};

const superAdminUser: InterfaceUserType = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@akatsuki.com',
    image: null,
  },
};

const adminUser: InterfaceUserType = {
  user: {
    ...superAdminUser.user,
  },
};

const organizations: InterfaceOrgInfoTypePG[] = [
  {
    id: 'xyz',
    name: 'Dogs Care',
    avatarURL: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
    description: 'Dog care center',
    createdAt: '2023-04-13T04:53:17.742+00:00',
    members: {
      edges: [],
    },
    addressLine1: 'Texas, USA',
    role: 'admin',
  } as InterfaceOrgInfoTypePG,
];

// MOCKS FOR SUPERADMIN
const MOCKS = [
  {
    request: {
      query: CURRENT_USER,
      variables: { userId: '123' },
    },
    result: {
      data: {
        user: superAdminUser,
        currentUser: superAdminCurrentUser.currentUser,
      },
    },
  },
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: { userId: '123', input: { first: 5, skip: 0 } },
    },
    result: {
      data: {
        user: {
          id: '123',
          name: 'John Doe',
          __typename: 'User',
          notifications: [],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: 'N' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: 'D' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: organizations,
      },
    },
  },
  {
    request: {
      query: CREATE_SAMPLE_ORGANIZATION_MUTATION,
    },
    result: {
      data: {
        createSampleOrganization: {
          id: '1',
          name: 'Sample Organization',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ORGANIZATION_MUTATION,
      variables: {
        description: 'This is a dummy organization',
        address: {
          city: 'Kingston',
          countryCode: 'JM',
          dependentLocality: 'Sample Dependent Locality',
          line1: '123 Jamaica Street',
          line2: 'Apartment 456',
          postalCode: 'JM12345',
          sortingCode: 'ABC-123',
          state: 'Kingston Parish',
        },
        name: 'Dummy Organization',
        visibleInSearch: true,
        userRegistrationRequired: false,
        image: '',
      },
    },
    result: {
      data: {
        createOrganization: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: ALL_ORGANIZATIONS_PG,
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Organization 1',
            avatarURL: 'image1.jpg',
            addressLine1: 'Address 1',
            description: 'Description 1',
            createdAt: '2023-04-13T04:53:17.742+00:00',
            members: {
              edges: [
                {
                  node: {
                    id: 'abc',
                  },
                },
              ],
            },
          },
          {
            id: 'org2',
            name: 'Organization 2',
            avatarURL: 'image2.jpg',
            addressLine1: 'Address 2',
            description: 'Description 2',
            createdAt: '2023-04-14T04:53:17.742+00:00',
            members: {
              edges: [
                {
                  node: {
                    id: 'def',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ALL_ORGANIZATIONS_PG,
      variables: {
        id: '123',
        first: 8,
        skip: 2,
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org3',
            name: 'Organization 3',
            avatarURL: 'image3.jpg',
            addressLine1: 'Address 3',
            description: 'Description 3',
            createdAt: '2023-04-15T04:53:17.742+00:00',
            members: {
              edges: [
                {
                  node: {
                    id: 'def',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
];
const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: ALL_ORGANIZATIONS_PG,
      variables: {
        first: 8,
        skip: 0,
        filter: '',
        orderBy: 'createdAt_ASC',
      },
      notifyOnNetworkStatusChange: true,
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: CURRENT_USER,
      variables: { userId: '123' },
    },
    result: {
      data: {
        user: superAdminUser,
        currentUser: superAdminCurrentUser.currentUser,
      },
    },
  },
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: { userId: '123', input: { first: 5, skip: 0 } },
    },
    result: {
      data: {
        user: {
          id: '123',
          name: 'John Doe',
          __typename: 'User',
          notifications: [],
        },
      },
    },
  },
];
const MOCKS_WITH_ERROR = [
  {
    request: {
      query: ALL_ORGANIZATIONS_PG,
      variables: {
        first: 8,
        skip: 0,
        filter: '',
        orderBy: 'createdAt_ASC',
      },
      notifyOnNetworkStatusChange: true,
    },
    result: {
      data: {
        organizations: organizations,
      },
    },
  },
  {
    request: {
      query: CURRENT_USER,
      variables: { userId: '123' },
    },
    result: {
      data: {
        user: superAdminUser,
        currentUser: superAdminCurrentUser.currentUser,
      },
    },
  },
  {
    request: {
      query: CREATE_SAMPLE_ORGANIZATION_MUTATION,
    },
    error: new Error('Failed to create sample organization'),
  },
];

// MOCKS FOR ADMIN
const MOCKS_ADMIN = [
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: organizations,
      },
    },
  },
  {
    request: {
      query: CURRENT_USER,
      variables: { userId: '123' },
    },
    result: {
      data: {
        user: adminUser,
        currentUser: superAdminCurrentUser.currentUser,
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: organizations,
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { userId: '123' },
    },
    result: {
      data: { user: adminUser },
    },
  },
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: { userId: '123', input: { first: 5, skip: 0 } },
    },
    result: {
      data: {
        user: {
          id: '123',
          name: 'John Doe',
          __typename: 'User',
          notifications: [],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: 'N' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: 'D' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

export { MOCKS, MOCKS_ADMIN, MOCKS_EMPTY, MOCKS_WITH_ERROR };
