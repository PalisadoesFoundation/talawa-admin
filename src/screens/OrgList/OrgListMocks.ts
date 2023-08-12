import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceUserType,
} from 'utils/interfaces';

const superAdminUser: InterfaceUserType = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
    image: '',
    email: 'John_Does_Palasidoes@gmail.com',
    userType: 'SUPERADMIN',
    adminFor: [
      {
        _id: '1',
        name: 'Akatsuki',
        image: '',
      },
    ],
  },
};

const adminUser: InterfaceUserType = {
  user: { ...superAdminUser.user, userType: 'ADMIN' },
};

const organizations: InterfaceOrgConnectionInfoType[] = [
  {
    _id: '1',
    creator: { _id: 'xyz', firstName: 'John', lastName: 'Doe' },
    image: '',
    name: 'Akatsuki',
    createdAt: '02/02/2022',
    admins: [
      {
        _id: '123',
      },
    ],
    members: [
      {
        _id: '234',
      },
    ],
    location: 'Washington DC',
  },
];

for (let x = 0; x < 100; x++) {
  organizations.push({
    _id: 'a' + x,
    image: '',
    name: 'name',
    creator: {
      _id: '123',
      firstName: 'firstName',
      lastName: 'lastName',
    },
    admins: [
      {
        _id: x + '1',
      },
    ],
    members: [
      {
        _id: x + '2',
      },
    ],
    createdAt: new Date().toISOString(),
    location: 'location',
  });
}

// MOCKS FOR SUPERADMIN
const MOCKS = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: organizations,
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: '123' },
    },
    result: {
      data: superAdminUser,
    },
  },
];
const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [],
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: '123' },
    },
    result: {
      data: superAdminUser,
    },
  },
];

// MOCKS FOR ADMIN
const MOCKS_ADMIN = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: organizations,
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: '123' },
    },
    result: {
      data: adminUser,
    },
  },
];

export { MOCKS, MOCKS_EMPTY, MOCKS_ADMIN };
