import { describe, it, expect } from 'vitest';
import { buildAssignedUsers } from './ManageTagMockUtils';

describe('buildAssignedUsers', () => {
  it('returns default values when no overrides are provided', () => {
    const res = buildAssignedUsers();

    expect(res.name).toBe('tag1');
    expect(res.usersAssignedTo?.edges.length).toBe(1);
    expect(res.usersAssignedTo?.totalCount).toBe(1);
    expect(res.ancestorTags).toEqual([]);
  });

  it('sets usersAssignedTo to null when explicitly overridden', () => {
    const res = buildAssignedUsers({ usersAssignedTo: null });

    expect(res.usersAssignedTo).toBeNull();
  });

  it('uses custom edges when provided', () => {
    const res = buildAssignedUsers({
      usersAssignedTo: {
        edges: [
          {
            node: {
              _id: '99',
              firstName: 'John',
              lastName: 'Doe',
            },
            cursor: 'abc',
          },
        ],
        totalCount: 5,
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    expect(res.usersAssignedTo?.edges[0].node._id).toBe('99');
    expect(res.usersAssignedTo?.edges[0].__typename).toBe(
      'UserTagUsersAssignedToEdge',
    );
    expect(res.usersAssignedTo?.totalCount).toBe(5);
  });

  it('uses custom pageInfo when provided', () => {
    const res = buildAssignedUsers({
      usersAssignedTo: {
        edges: [],
        totalCount: 0,
        pageInfo: {
          startCursor: 'sc',
          endCursor: 'ec',
          hasNextPage: true,
          hasPreviousPage: true,
        },
      },
    });

    expect(res.usersAssignedTo?.pageInfo).toEqual({
      __typename: 'PageInfo',
      startCursor: 'sc',
      endCursor: 'ec',
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('overrides ancestorTags correctly', () => {
    const res = buildAssignedUsers({
      ancestorTags: [
        { _id: '1', name: 'Parent' },
        { _id: '2', name: 'Child' },
      ],
    });

    expect(res.ancestorTags.length).toBe(2);
    expect(res.ancestorTags[0].name).toBe('Parent');
  });
});
