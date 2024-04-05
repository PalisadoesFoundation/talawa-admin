import {
  REMOVE_MEMBER_MUTATION,
<<<<<<< HEAD
=======
  UPDATE_USERTYPE_MUTATION,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
<<<<<<< HEAD
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
