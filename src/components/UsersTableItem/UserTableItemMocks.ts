import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';

const MOCKS = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: {
        userid: '123',
        orgid: 'abc',
      },
    },
    result: {
      data: {
        removeMember: {
          _id: '123',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        userId: '123',
        organizationId: 'abc',
        role: 'USER',
      },
    },
    result: {
      data: {
        updateUserRoleInOrganization: {
          _id: '123',
        },
      },
    },
  },
];

const MOCKS2 = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: {
        userid: '123',
        orgid: 'abc',
      },
    },
    error: new Error('Failed to remove member'),
  },
];

const MOCKS_UPDATE = [
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        userId: '123',
        organizationId: 'abc',
        role: 'ADMIN',
      },
    },
    error: new Error('Failed to update user role in organization'),
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        userId: '123',
        organizationId: 'abc',
        role: 'USER',
      },
    },
    result: {
      data: {
        updateUserRoleInOrganization: {
          _id: '123',
        },
      },
    },
  },
];

export { MOCKS, MOCKS2, MOCKS_UPDATE };
