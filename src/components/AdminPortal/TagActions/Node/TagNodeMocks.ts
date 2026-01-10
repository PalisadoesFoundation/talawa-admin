import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';

export const MOCKS1 = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: 10,
        after: null,
      },
    },
    result: {
      data: {
        getChildTags: {
          __typename: 'GetChildTagsPayload',
          name: 'Parent Tag',
          ancestorTags: [],
          childTags: {
            __typename: 'ChildTagsConnection',
            edges: [
              {
                node: {
                  _id: 'subTag1',
                  name: 'subTag 1',
                  __typename: 'Tag',
                  childTags: { totalCount: 0 },
                  parentTag: { _id: '1' },
                  usersAssignedTo: { totalCount: 0 },
                  ancestorTags: [{ _id: '1', name: 'Parent Tag' }],
                },
              },
              {
                node: {
                  _id: 'subTag2',
                  name: 'subTag 2',
                  __typename: 'Tag',
                  childTags: { totalCount: 0 },
                  parentTag: { _id: '1' },
                  usersAssignedTo: { totalCount: 0 },
                  ancestorTags: [{ _id: '1', name: 'Parent Tag' }],
                },
              },
            ],
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: true,
              endCursor: 'subTag2',
            },
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
        first: 10,
        after: 'subTag2',
      },
    },
    result: {
      data: {
        getChildTags: {
          __typename: 'GetChildTagsPayload',
          name: 'Parent Tag',
          ancestorTags: [],
          childTags: {
            __typename: 'ChildTagsConnection',
            edges: [
              {
                node: {
                  _id: 'subTag11',
                  name: 'subTag 11',
                  __typename: 'Tag',
                  childTags: { totalCount: 0 },
                  parentTag: { _id: '1' },
                  usersAssignedTo: { totalCount: 0 },
                  ancestorTags: [{ _id: '1', name: 'Parent Tag' }],
                },
              },
            ],
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: 'subTag11',
            },
          },
        },
      },
    },
  },
];

export const MOCKS_ERROR_SUBTAGS_QUERY1 = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: 10,
        after: null,
      },
    },
    error: new Error('Mock GraphQL Error for fetching subtags'),
  },
];
