import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import {
  USER_TAG_ANCESTORS,
  USER_TAGS_ASSIGNED_MEMBERS,
} from 'GraphQl/Queries/userTagQueries';

export const MOCKS = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        after: null,
        before: null,
        first: 5,
        last: null,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'tag1',
          usersAssignedTo: {
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'member',
                  lastName: '2',
                },
                cursor: '2',
              },
              {
                node: {
                  _id: '3',
                  firstName: 'member',
                  lastName: '3',
                },
                cursor: '3',
              },
              {
                node: {
                  _id: '4',
                  firstName: 'member',
                  lastName: '4',
                },
                cursor: '4',
              },
              {
                node: {
                  _id: '5',
                  firstName: 'member',
                  lastName: '5',
                },
                cursor: '5',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '5',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 6,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        after: '5',
        before: null,
        first: 5,
        last: null,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'tag1',
          usersAssignedTo: {
            edges: [
              {
                node: {
                  _id: '6',
                  firstName: 'member',
                  lastName: '6',
                },
                cursor: '6',
              },
            ],
            pageInfo: {
              startCursor: '6',
              endCursor: '6',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 6,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        after: null,
        before: '6',
        first: null,
        last: 5,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'tag1',
          usersAssignedTo: {
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'member',
                  lastName: '2',
                },
                cursor: '2',
              },
              {
                node: {
                  _id: '3',
                  firstName: 'member',
                  lastName: '3',
                },
                cursor: '3',
              },
              {
                node: {
                  _id: '4',
                  firstName: 'member',
                  lastName: '4',
                },
                cursor: '4',
              },
              {
                node: {
                  _id: '5',
                  firstName: 'member',
                  lastName: '5',
                },
                cursor: '5',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '5',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 6,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAG_ANCESTORS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        getUserTagAncestors: [
          {
            _id: '1',
            name: 'tag1',
          },
        ],
      },
    },
  },
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: '1',
        userId: '1',
      },
    },
    result: {
      data: {
        unassignUserTag: {
          _id: '1',
        },
      },
    },
  },
];

export const MOCKS_ERROR_ASSIGNED_MEMBERS = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        after: null,
        before: null,
        first: 5,
        last: null,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: USER_TAG_ANCESTORS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        getUserTagAncestors: [],
      },
    },
  },
];

export const MOCKS_ERROR_TAG_ANCESTORS = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        after: null,
        before: null,
        first: 5,
        last: null,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'tag1',
          usersAssignedTo: {
            edges: [],
            pageInfo: {
              startCursor: '1',
              endCursor: '5',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 6,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAG_ANCESTORS,
      variables: {
        id: '1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
