import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variables: {
        previousPassword: 'Palisadoes',
        newPassword: 'ThePalisadoesFoundation',
        confirmNewPassword: 'ThePalisadoesFoundation',
      },
    },
    result: {
      data: {
        users: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variables: {
        previousPassword: 'This is wrong password',
        newPassword: 'ThePalisadoesFoundation',
        confirmNewPassword: 'ThePalisadoesFoundation',
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
];
