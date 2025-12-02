import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: {
        input: {
          membershipRequestId: '123',
        },
      },
    },
    result: {
      data: {
        acceptMembershipRequest: {
          __typename: 'MembershipRequestResponse',
          success: true,
          message: 'Membership request accepted successfully',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: {
        input: {
          membershipRequestId: '123',
        },
      },
    },
    result: {
      data: {
        rejectMembershipRequest: {
          __typename: 'MembershipRequestResponse',
          success: true,
          message: 'Membership request rejected successfully',
        },
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: {
        input: {
          membershipRequestId: '123',
        },
      },
    },
    error: new Error('Failed to accept membership request'),
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: {
        input: {
          membershipRequestId: '123',
        },
      },
    },
    error: new Error('Failed to reject membership request'),
  },
];
