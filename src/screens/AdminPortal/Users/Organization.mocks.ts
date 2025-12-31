export const createAddress = {
  city: 'Kingston',
  countryCode: 'JM',
  dependentLocality: 'Sample Dependent Locality',
  line1: '123 Jamaica Street',
  line2: 'Apartment 456',
  postalCode: 'JM12345',
  sortingCode: 'ABC-123',
  state: 'Kingston Parish',
};

export const createCreator = {
  _id: '123',
  firstName: 'Jack',
  lastName: 'Smith',
  image: null,
  email: 'jack@example.com',
  createdAt: '19/06/2030',
};

export const MOCK_USERS = [
  {
    user: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      image: null,
      email: 'john@example.com',
      createdAt: '2030-04-13T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '20/06/2030',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '20/06/2030',
          },
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '20/06/2030',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '20/06/2022',
          },
        },
      ],
    },
  },
  {
    user: {
      _id: 'user2',
      firstName: 'Jane',
      lastName: 'Doe',
      image: null,
      email: 'jane@example.com',
      createdAt: '2030-04-17T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: '456',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '21/06/2030',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '21/06/2030',
          },
        },
      ],
      joinedOrganizations: [
        {
          _id: '123',
          name: 'Palisadoes',
          image: null,
          address: createAddress,
          createdAt: '21/06/2030',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '21/06/2022',
          },
        },
      ],
    },
  },
  {
    user: {
      _id: 'user3',
      firstName: 'Jack',
      lastName: 'Smith',
      image: null,
      email: 'jack@example.com',
      createdAt: '2030-04-09T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2030',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2030',
          creator: createCreator,
        },
      ],
    },
  },
];
