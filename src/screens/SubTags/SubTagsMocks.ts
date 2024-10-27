import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import {
  USER_TAG_ANCESTORS,
  USER_TAG_SUB_TAGS,
} from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_PAGE_SIZE } from 'utils/organizationTagsUtils';

export const MOCKS = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_PAGE_SIZE,
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [
              {
                node: {
                  _id: 'subTag1',
                  name: 'subTag 1',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag1',
              },
              {
                node: {
                  _id: 'subTag2',
                  name: 'subTag 2',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 0,
                  },
                },
                cursor: 'subTag2',
              },
              {
                node: {
                  _id: 'subTag3',
                  name: 'subTag 3',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag3',
              },
              {
                node: {
                  _id: 'subTag4',
                  name: 'subTag 4',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 0,
                  },
                },
                cursor: 'subTag4',
              },
              {
                node: {
                  _id: 'subTag5',
                  name: 'subTag 5',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag5',
              },
              {
                node: {
                  _id: 'subTag6',
                  name: 'subTag 6',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag6',
              },
              {
                node: {
                  _id: 'subTag7',
                  name: 'subTag 7',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag7',
              },
              {
                node: {
                  _id: 'subTag8',
                  name: 'subTag 8',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag8',
              },
              {
                node: {
                  _id: 'subTag9',
                  name: 'subTag 9',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag9',
              },
              {
                node: {
                  _id: 'subTag10',
                  name: 'subTag 10',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag10',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '10',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 11,
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
        after: '10',
        first: TAGS_QUERY_PAGE_SIZE,
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'tag1',
          childTags: {
            edges: [
              {
                node: {
                  _id: 'subTag11',
                  name: 'subTag 11',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 0,
                  },
                },
                cursor: 'subTag11',
              },
            ],
            pageInfo: {
              startCursor: '11',
              endCursor: '11',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 11,
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
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'subTag1',
        first: TAGS_QUERY_PAGE_SIZE,
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'subTag 1',
          childTags: {
            edges: [
              {
                node: {
                  _id: 'subTag1.1',
                  name: 'subTag 1.1',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag1.1',
              },
            ],
            pageInfo: {
              startCursor: 'subTag1.1',
              endCursor: 'subTag1.1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 1,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAG_ANCESTORS,
      variables: {
        id: 'subTag1',
      },
    },
    result: {
      data: {
        getUserTagAncestors: [
          {
            _id: '1',
            name: 'tag 1',
          },
          {
            _id: 'subTag1',
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
        name: 'subTag 12',
        organizationId: '123',
        parentTagId: '1',
      },
    },
    result: {
      data: {
        createUserTag: {
          _id: 'subTag12',
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
        id: '1',
        first: TAGS_QUERY_PAGE_SIZE,
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
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_PAGE_SIZE,
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'tag1',
          childTags: {
            edges: [],
            pageInfo: {
              startCursor: '0',
              endCursor: '0',
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
        id: '1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
