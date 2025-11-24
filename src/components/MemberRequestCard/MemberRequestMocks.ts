import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        acceptMembershipRequest: {
          success: true,
          message: 'Membership request accepted successfully',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: { userid: '234' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '2',
          },
        ],
        rejectMembershipRequest: {
          success: true,
          message: 'Membership request rejected successfully',
        },
      },
    },
  },
];
export const MOCKS2 = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: { id: '1' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        acceptMembershipRequest: {
          success: true,
          message: 'Membership request accepted successfully',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: { userid: '1' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        rejectMembershipRequest: {
          success: true,
          message: 'Membership request rejected successfully',
        },
      },
    },
  },
];
export const MOCKS3 = [
  {
    request: {
      query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
      variables: { id: '5' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        acceptMembershipRequest: {
          success: true,
          message: 'Membership request accepted successfully',
        },
      },
    },
  },
  {
    request: {
      query: REJECT_ORGANIZATION_REQUEST_MUTATION,
      variables: { userid: '5' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
        rejectMembershipRequest: {
          success: true,
          message: 'Membership request rejected successfully',
        },
      },
    },
  },
];
