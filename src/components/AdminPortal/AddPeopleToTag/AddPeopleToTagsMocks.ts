import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'types/AdminPortal/Tag/utils';

const baseMemberQueryVariables = {
  organizationId: '1',
  tagId: '1',
  first: TAGS_QUERY_DATA_CHUNK_SIZE,
};

const buildMembersResult = (
  members: Array<{ _id: string; name: string }>,
  hasNextPage = false,
  endCursor: string | null = members.at(-1)?._id ?? null,
) => ({
  data: {
    organization: {
      id: '1',
      members: {
        edges: members.map((member) => ({ node: member })),
        pageInfo: {
          startCursor: members[0]?._id ?? null,
          endCursor,
          hasNextPage,
          hasPreviousPage: false,
        },
      },
    },
    tag: {
      id: '1',
      assignees: {
        edges: [],
      },
    },
  },
});

const defaultMembers = [
  { _id: '1', name: 'member 1' },
  { _id: '2', name: 'member 2' },
  { _id: '3', name: 'member 3' },
  { _id: '4', name: 'member 4' },
  { _id: '5', name: 'member 5' },
  { _id: '6', name: 'member 6' },
  { _id: '7', name: 'member 7' },
  { _id: '8', name: 'member 8' },
  { _id: '9', name: 'member 9' },
  { _id: '10', name: 'member 10' },
];

const buildBaseMembersMock = () => ({
  request: {
    query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
    variables: baseMemberQueryVariables,
  },
  result: buildMembersResult(defaultMembers, true, '10'),
});

export const MOCKS = [
  buildBaseMembersMock(),
  buildBaseMembersMock(),
  buildBaseMembersMock(),
  buildBaseMembersMock(),
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        ...baseMemberQueryVariables,
        after: '10',
      },
    },
    result: buildMembersResult(
      [
        { _id: '11', name: 'member 11' },
        { _id: '12', name: 'member 12' },
      ],
      false,
      '12',
    ),
  },
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        ...baseMemberQueryVariables,
        where: {
          name_contains: 'usersToAssignTo',
        },
      },
    },
    result: buildMembersResult([
      { _id: '1', name: 'usersToAssignTo user1' },
      { _id: '2', name: 'usersToAssignTo user2' },
    ]),
  },
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        ...baseMemberQueryVariables,
        where: {
          name_contains: 'userToAssignTo',
        },
      },
    },
    result: buildMembersResult([
      { _id: '1', name: 'first userToAssignTo' },
      { _id: '2', name: 'second userToAssignTo' },
    ]),
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: {
        tagId: '1',
        userId: '1',
      },
    },
    result: {
      data: {
        assignUserTag: true,
      },
    },
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: {
        tagId: '1',
        userId: '2',
      },
    },
    result: {
      data: {
        assignUserTag: true,
      },
    },
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: {
        tagId: '1',
        userId: '3',
      },
    },
    result: {
      data: {
        assignUserTag: true,
      },
    },
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: {
        tagId: '1',
        userId: '5',
      },
    },
    result: {
      data: {
        assignUserTag: true,
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: baseMemberQueryVariables,
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCK_EMPTY = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: baseMemberQueryVariables,
    },
    result: buildMembersResult([]),
  },
];

export const MOCK_NON_ERROR = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: baseMemberQueryVariables,
    },
    result: buildMembersResult([{ _id: '1', name: 'Test User' }]),
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: { tagId: '1', userId: '1' },
    },
    error: {
      graphQLErrors: [{ message: 'Plain object' }],
    } as unknown as Error,
  },
];
