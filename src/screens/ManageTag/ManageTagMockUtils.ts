// Shared utility functions for ManageTag mock data

// Helper function to build assigned users data structure
export const buildAssignedUsers = (
  overrides?: Partial<{
    name: string;
    usersAssignedTo: {
      edges: Array<{
        node: {
          _id: string;
          firstName: string;
          lastName: string;
          __typename?: string;
        };
        cursor: string;
      }>;
      pageInfo: {
        startCursor: string | null;
        endCursor: string | null;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
      totalCount: number;
    } | null;
    ancestorTags: Array<{ _id: string; name: string; __typename?: string }>;
  }>,
) => ({
  __typename: 'UserTag',
  name: overrides?.name ?? 'tag1',
  usersAssignedTo:
    overrides?.usersAssignedTo === null
      ? null
      : {
          __typename: 'UserTagUsersAssignedToConnection',
          edges: (
            overrides?.usersAssignedTo?.edges ?? [
              {
                node: {
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                  __typename: 'User',
                },
                cursor: '1',
              },
            ]
          ).map((edge) => ({
            ...edge,
            __typename: 'UserTagUsersAssignedToEdge',
          })),
          pageInfo: {
            __typename: 'PageInfo',
            ...(overrides?.usersAssignedTo?.pageInfo ?? {
              startCursor: '1',
              endCursor: '1',
              hasNextPage: false,
              hasPreviousPage: false,
            }),
          },
          totalCount: overrides?.usersAssignedTo?.totalCount ?? 1,
        },
  ancestorTags: overrides?.ancestorTags ?? [],
});
