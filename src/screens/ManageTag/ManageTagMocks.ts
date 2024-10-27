import {
  REMOVE_USER_TAG,
  UNASSIGN_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import {
  USER_TAG_ANCESTORS,
  USER_TAGS_ASSIGNED_MEMBERS,
  USER_TAGS_MEMBERS_TO_ASSIGN_TO,
} from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_PAGE_SIZE } from 'utils/organizationTagsUtils';

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
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: 7,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'tag1',
          usersToAssignTo: {
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
              {
                node: {
                  _id: '6',
                  firstName: 'member',
                  lastName: '6',
                },
                cursor: '6',
              },
              {
                node: {
                  _id: '7',
                  firstName: 'member',
                  lastName: '7',
                },
                cursor: '7',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '7',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 10,
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
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_PAGE_SIZE,
      },
    },
    result: {
      data: {
        organizations: [
          {
            userTags: {
              edges: [
                {
                  node: {
                    _id: '1',
                    name: 'userTag 1',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 11,
                    },
                  },
                  cursor: '1',
                },
                {
                  node: {
                    _id: '2',
                    name: 'userTag 2',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                  },
                  cursor: '2',
                },
                {
                  node: {
                    _id: '3',
                    name: 'userTag 3',
                    usersAssignedTo: {
                      totalCount: 0,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                  },
                  cursor: '3',
                },
                {
                  node: {
                    _id: '4',
                    name: 'userTag 4',
                    usersAssignedTo: {
                      totalCount: 0,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                  },
                  cursor: '4',
                },
                {
                  node: {
                    _id: '5',
                    name: 'userTag 5',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                  },
                  cursor: '5',
                },
                {
                  node: {
                    _id: '6',
                    name: 'userTag 6',
                    usersAssignedTo: {
                      totalCount: 6,
                    },
                    childTags: {
                      totalCount: 6,
                    },
                  },
                  cursor: '6',
                },
                {
                  node: {
                    _id: '7',
                    name: 'userTag 7',
                    usersAssignedTo: {
                      totalCount: 7,
                    },
                    childTags: {
                      totalCount: 7,
                    },
                  },
                  cursor: '7',
                },
                {
                  node: {
                    _id: '8',
                    name: 'userTag 8',
                    usersAssignedTo: {
                      totalCount: 8,
                    },
                    childTags: {
                      totalCount: 8,
                    },
                  },
                  cursor: '8',
                },
                {
                  node: {
                    _id: '9',
                    name: 'userTag 9',
                    usersAssignedTo: {
                      totalCount: 9,
                    },
                    childTags: {
                      totalCount: 9,
                    },
                  },
                  cursor: '9',
                },
                {
                  node: {
                    _id: '10',
                    name: 'userTag 10',
                    usersAssignedTo: {
                      totalCount: 10,
                    },
                    childTags: {
                      totalCount: 10,
                    },
                  },
                  cursor: '10',
                },
              ],
              pageInfo: {
                startCursor: '1',
                endCursor: '10',
                hasNextPage: true,
                hasPreviousPage: false,
              },
              totalCount: 12,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_TAG,
      variables: {
        tagId: '1',
        name: 'tag 1 edited',
      },
    },
    result: {
      data: {
        updateUserTag: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_USER_TAG,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        removeUserTag: {
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
