import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'user1' },
    },
    result: {
      data: {
        user: {
          _id: 'user1',
          userType: 'SUPERADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: [
            {
              _id: 1,
              name: 'Palisadoes',
              image: '',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            _id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            adminFor: [
              {
                _id: '123',
              },
            ],
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: 'xyz',
                name: 'ABC',
                image: null,
                location: 'Jamaica',
                createdAt: '20/06/2022',
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
            joinedOrganizations: [
              {
                _id: 'abc',
                name: 'Joined Organization 1',
                image: null,
                location: 'Jamaica',
                createdAt: '20/06/2022',
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
          {
            _id: 'user2',
            firstName: 'Jane',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            adminFor: [
              {
                _id: '123',
              },
            ],
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '456',
                name: 'ABC',
                image: null,
                location: 'Jamaica',
                createdAt: '20/06/2022',
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
            joinedOrganizations: [
              {
                _id: '123',
                name: 'Palisadoes',
                image: null,
                location: 'Jamaica',
                createdAt: '20/06/2022',
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
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 123,
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            name: 'Palisadoes',
            members: [
              {
                _id: 'user1',
              },
              {
                _id: 'user2',
              },
            ],
            admins: [
              {
                _id: 'user1',
              },
              {
                _id: 'user2',
              },
            ],
            createdAt: '09/11/2001',
            location: 'Twin Tower',
          },
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_LIST,

      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [],
      },
    },
  },
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
];
