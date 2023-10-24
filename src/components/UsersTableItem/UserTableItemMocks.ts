import {
  REMOVE_USER_FROM_ORGANIZATION_MUTATION,
  UPDATE_USERTYPE_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: UPDATE_USERTYPE_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        updateUserType: {
          data: {
            id: '123',
          },
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_USER_FROM_ORGANIZATION_MUTATION,
      variables: {
        userId: '123',
        organizationId: 'abc',
      },
    },
    result: {
      data: {
        removeUserFromOrganization: {
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
        role: 'ADMIN',
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
