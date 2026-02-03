import {
  UPDATE_USER_PASSWORD_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variables: {
        previousPassword: 'Palisadoes',
        newPassword: 'ThePalisadoesFoundation1!',
        confirmNewPassword: 'ThePalisadoesFoundation1!',
      },
    },
    result: {
      data: {
        updateUserPassword: {
          user: {
            _id: '1',
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variables: {
        previousPassword: 'This is wrong password',
        newPassword: 'ThePalisadoesFoundation1!',
        confirmNewPassword: 'ThePalisadoesFoundation1!',
      },
    },
    result: {
      errors: [
        {
          message: 'Invalid previous password',
        },
      ],
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        input: {
          id: 'admin-target-user-id',
          password: 'ThePalisadoesFoundation1!',
        },
      },
    },
    result: {
      data: {
        updateUser: {
          id: 'admin-target-user-id',
          name: 'Test User',
        },
      },
    },
  },
];
