import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';

export const getUserByIdMock = {
  request: {
    query: GET_USER_BY_ID,
    variables: { input: { id: '123' } },
  },
  result: {
    data: {
      user: {
        id: '123',
        name: 'Test User',
      },
    },
  },
};

export const getUserByIdMockUser1 = {
  request: {
    query: GET_USER_BY_ID,
    variables: { input: { id: 'user1' } },
  },
  result: {
    data: {
      user: {
        id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        avatarURL: null,
        email: 'john.doe@example.com',
      },
    },
  },
};

export const getUserByIdMockUser2 = {
  request: {
    query: GET_USER_BY_ID,
    variables: { input: { id: 'user2' } },
  },
  result: {
    data: {
      user: {
        id: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        avatarURL: null,
        email: 'jane.smith@example.com',
      },
    },
  },
};

export const samplePosts = [
  {
    id: 'post1',
    caption: 'Sample Post 1',
    createdAt: '2023-01-01T00:00:00Z',
    pinnedAt: '2023-12-01T00:00:00Z',
    pinned: true,
    creator: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john.doe@example.com',
    },
  },
  {
    id: 'post2',
    caption: 'Sample Post 2',
    createdAt: '2023-01-02T00:00:00Z',
    pinnedAt: null,
    pinned: false,
    creator: {
      id: 'user2',
      firstName: 'Jane',
      lastName: 'Smith',
      name: 'Jane Smith',
      avatarURL: null,
      emailAddress: 'jane.smith@example.com',
    },
  },
  {
    id: 'post3',
    caption: 'Sample Post 3',
    createdAt: '2023-01-03T00:00:00Z',
    pinnedAt: null,
    pinned: false,
    creator: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john.doe@example.com',
    },
  },
];
