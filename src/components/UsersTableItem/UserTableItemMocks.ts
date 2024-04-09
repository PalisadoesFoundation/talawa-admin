import {
  REMOVE_MEMBER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
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
