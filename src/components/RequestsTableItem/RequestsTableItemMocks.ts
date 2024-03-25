import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        acceptMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        rejectMembershipRequest: {
          _id: '1',
        },
      },
    },
  },
];
