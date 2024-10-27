import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';

export const MOCKS = [
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
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: 7,
        after: '7',
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
                  _id: '8',
                  firstName: 'member',
                  lastName: '8',
                },
                cursor: '8',
              },
              {
                node: {
                  _id: '9',
                  firstName: 'member',
                  lastName: '9',
                },
                cursor: '9',
              },
              {
                node: {
                  _id: '10',
                  firstName: 'member',
                  lastName: '10',
                },
                cursor: '10',
              },
            ],
            pageInfo: {
              startCursor: '8',
              endCursor: '10',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 10,
          },
        },
      },
    },
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: {
        tagId: '1',
        userIds: ['1', '3', '5'],
      },
    },
    result: {
      data: {
        addPeopleToUserTag: {
          _id: '1',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: 7,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
