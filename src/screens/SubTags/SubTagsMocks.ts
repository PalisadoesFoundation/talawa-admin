import {
  CREATE_USER_TAG,
  REMOVE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import {
  USER_TAG_ANCESTORS,
  USER_TAG_SUB_TAGS,
} from 'GraphQl/Queries/userTagQueries';

export const MOCKS = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'tag1',
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
          childTags: {
            edges: [
              {
                node: {
                  _id: '1',
                  name: 'subTag 1',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  name: 'subTag 2',
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
                  name: 'subTag 3',
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
                  name: 'subTag 4',
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
                  name: 'subTag 5',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
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
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'tag1',
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
          childTags: {
            edges: [
              {
                node: {
                  _id: '6',
                  name: 'subTag 6',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 0,
                  },
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
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'tag1',
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
          childTags: {
            edges: [
              {
                node: {
                  _id: '1',
                  name: 'subTag 1',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  name: 'subTag 2',
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
                  name: 'subTag 3',
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
                  name: 'subTag 4',
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
                  name: 'subTag 5',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
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
      query: USER_TAG_SUB_TAGS,
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
          name: 'subTag 1',
          childTags: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 0,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAG_ANCESTORS,
      variables: {
        id: 'tag1',
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
      query: USER_TAG_ANCESTORS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        getUserTagAncestors: [
          {
            _id: 'tag1',
            name: 'tag 1',
          },
          {
            _id: '1',
            name: 'subTag 1',
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'subTag 7',
        organizationId: '123',
        parentTagId: 'tag1',
      },
    },
    result: {
      data: {
        createUserTag: {
          _id: '7',
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

export const MOCKS_ERROR_SUB_TAGS = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'tag1',
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
        id: 'tag1',
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
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'tag1',
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
          childTags: {
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
        id: 'tag1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
