import {
<<<<<<< HEAD
  CREATE_ORGANIZATION_MUTATION,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceUserType,
} from 'utils/interfaces';

const superAdminUser: InterfaceUserType = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
<<<<<<< HEAD
    email: 'john.doe@akatsuki.com',
    image: null,
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  },
};

const adminUser: InterfaceUserType = {
<<<<<<< HEAD
  user: {
    ...superAdminUser.user,
  },
=======
  user: { ...superAdminUser.user, userType: 'ADMIN' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};

const organizations: InterfaceOrgConnectionInfoType[] = [
  {
    _id: '1',
    creator: { _id: 'xyz', firstName: 'John', lastName: 'Doe' },
    image: '',
    name: 'Palisadoes Foundation',
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
<<<<<<< HEAD
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
  },
];

for (let x = 0; x < 1; x++) {
=======
    location: 'Jamaica',
  },
];

for (let x = 0; x < 100; x++) {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
    location: 'location',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
}

// MOCKS FOR SUPERADMIN
const MOCKS = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
      variables: {
        first: 8,
        skip: 0,
        filter: '',
<<<<<<< HEAD
        orderBy: 'createdAt_ASC',
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      notifyOnNetworkStatusChange: true,
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
<<<<<<< HEAD
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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
];
const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
      variables: {
        first: 8,
        skip: 0,
        filter: '',
<<<<<<< HEAD
        orderBy: 'createdAt_ASC',
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      notifyOnNetworkStatusChange: true,
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
<<<<<<< HEAD
const MOCKS_WITH_ERROR = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
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
  {
    request: {
      query: CREATE_SAMPLE_ORGANIZATION_MUTATION,
    },
    error: new Error('Failed to create sample organization'),
  },
];
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

// MOCKS FOR ADMIN
const MOCKS_ADMIN = [
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
      variables: {
        first: 8,
        skip: 0,
        filter: '',
<<<<<<< HEAD
        orderBy: 'createdAt_ASC',
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      notifyOnNetworkStatusChange: true,
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

<<<<<<< HEAD
export { MOCKS, MOCKS_ADMIN, MOCKS_EMPTY, MOCKS_WITH_ERROR };
=======
export { MOCKS, MOCKS_ADMIN, MOCKS_EMPTY };
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
