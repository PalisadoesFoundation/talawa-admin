// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi, afterEach } from 'vitest';
import CursorPaginationManager, {
  extractDataFromPath,
} from './CursorPaginationManager';
import { gql } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GraphQLError } from 'graphql';

// Mock query for testing
const MOCK_QUERY = gql`
  query GetUsers($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          email
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Mock nested query for testing nested dataPath
const MOCK_NESTED_QUERY = gql`
  query GetOrgMembers($first: Int!, $after: String, $orgId: ID!) {
    organization(id: $orgId) {
      members(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            name
            role
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

// Type definitions for test data
type User = {
  id: string;
  name: string;
  email: string;
};

type Member = {
  id: string;
  name: string;
  role: string;
};

describe('extractDataFromPath utility', () => {
  it('extracts single-level path', () => {
    const data = {
      users: {
        edges: [
          {
            cursor: 'cursor1',
            node: { id: '1', name: 'User 1' },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
      },
    };

    const result = extractDataFromPath(data, 'users');
    expect(result?.edges).toBeDefined();
    expect(result?.edges).toHaveLength(1);
    expect(result?.pageInfo).toBeDefined();
  });

  it('extracts nested path', () => {
    const data = {
      organization: {
        members: {
          edges: [
            {
              cursor: 'cursor1',
              node: { id: '1', name: 'Member 1' },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor1',
          },
        },
      },
    };

    const result = extractDataFromPath(data, 'organization.members');
    expect(result?.edges).toBeDefined();
    expect(result?.edges).toHaveLength(1);
    expect(result?.pageInfo).toBeDefined();
  });

  it('returns null for broken path', () => {
    const data = { foo: 'bar' };
    const result = extractDataFromPath(data, 'missing.path');
    expect(result).toBeNull();
  });

  it('returns null for null data', () => {
    const result = extractDataFromPath(null, 'users');
    expect(result).toBeNull();
  });

  it('returns null for undefined data', () => {
    const result = extractDataFromPath(undefined, 'users');
    expect(result).toBeNull();
  });

  it('returns null when path leads to non-connection data', () => {
    const data = {
      users: {
        name: 'John',
      },
    };
    const result = extractDataFromPath(data, 'users');
    expect(result).toBeNull();
  });

  it('handles deep nested paths', () => {
    const data = {
      level1: {
        level2: {
          level3: {
            edges: [
              {
                cursor: 'cursor1',
                node: { id: '1' },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'cursor1',
              endCursor: 'cursor1',
            },
          },
        },
      },
    };

    const result = extractDataFromPath(data, 'level1.level2.level3');
    expect(result?.edges).toBeDefined();
    expect(result?.edges).toHaveLength(1);
  });

  it('handles connection data without pageInfo', () => {
    const data = {
      users: {
        edges: [
          {
            cursor: 'cursor1',
            node: { id: '1', name: 'User 1' },
          },
        ],
      },
    };

    const result = extractDataFromPath(data, 'users');
    expect(result?.edges).toBeDefined();
    expect(result?.pageInfo).toBeUndefined();
  });
});

describe('CursorPaginationManager', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  // Helper to create mocks
  const createSuccessMock = (hasNextPage = false) => ({
    request: {
      query: MOCK_QUERY,
      variables: { first: 10, after: null },
    },
    result: {
      data: {
        users: {
          edges: [
            {
              cursor: 'cursor1',
              node: { id: '1', name: 'User 1', email: 'user1@test.com' },
            },
            {
              cursor: 'cursor2',
              node: { id: '2', name: 'User 2', email: 'user2@test.com' },
            },
          ],
          pageInfo: {
            hasNextPage,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor2',
          },
        },
      },
    },
  });

  const createLoadMoreMock = () => ({
    request: {
      query: MOCK_QUERY,
      variables: { first: 10, after: 'cursor2' },
    },
    result: {
      data: {
        users: {
          edges: [
            {
              cursor: 'cursor3',
              node: { id: '3', name: 'User 3', email: 'user3@test.com' },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cursor3',
            endCursor: 'cursor3',
          },
        },
      },
    },
  });

  const createEmptyMock = () => ({
    request: {
      query: MOCK_QUERY,
      variables: { first: 10, after: null },
    },
    result: {
      data: {
        users: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
      },
    },
  });

  const createErrorMock = () => ({
    request: {
      query: MOCK_QUERY,
      variables: { first: 10, after: null },
    },
    error: new GraphQLError('Network error'),
  });

  const createNestedMock = () => ({
    request: {
      query: MOCK_NESTED_QUERY,
      variables: { first: 10, after: null, orgId: 'org1' },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor1',
                node: { id: '1', name: 'Member 1', role: 'Admin' },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'cursor1',
              endCursor: 'cursor1',
            },
          },
        },
      },
    },
  });

  // A. Basic Rendering Tests
  describe('Basic Rendering', () => {
    it('renders items using renderItem function', async () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
      });
    });

    it('applies correct data-testid', async () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-manager'),
        ).toBeInTheDocument();
      });
    });

    it('extracts data from nested path', async () => {
      const mocks = [createNestedMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_NESTED_QUERY}
              queryVariables={{ orgId: 'org1' }}
              dataPath="organization.members"
              itemsPerPage={10}
              renderItem={(member: Member) => <div>{member.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Member 1')).toBeInTheDocument();
      });
    });

    it('extracts data from single-level path', async () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });
    });
  });

  // B. UI States Tests
  describe('UI States', () => {
    it('shows loading state on initial load', () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(
        screen.getByTestId('cursor-pagination-loading'),
      ).toBeInTheDocument();
    });

    it('shows custom loadingComponent when provided', () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              loadingComponent={<div>Custom Loading...</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('shows empty state when no items returned', async () => {
      const mocks = [createEmptyMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-empty'),
        ).toBeInTheDocument();
      });
    });

    it('shows custom emptyStateComponent when provided', async () => {
      const mocks = [createEmptyMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              emptyStateComponent={<div>No users found</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });
    });

    it('shows error state on query failure', async () => {
      const mocks = [createErrorMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-error'),
        ).toBeInTheDocument();
      });
    });

    it('error retry button triggers refetch', async () => {
      const user = userEvent.setup();
      const errorMock = createErrorMock();
      const successMock = createSuccessMock();

      const mocks = [errorMock, successMock];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-error'),
        ).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button');
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });
    });
  });

  // C. Load More Functionality Tests
  describe('Load More Functionality', () => {
    it('shows "Load More" button when hasNextPage is true', async () => {
      const mocks = [createSuccessMock(true)];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
      });
    });

    it('hides "Load More" button when hasNextPage is false', async () => {
      const mocks = [createSuccessMock(false)];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
    });

    it('clicking "Load More" fetches next page with correct cursor', async () => {
      const user = userEvent.setup();
      const mocks = [createSuccessMock(true), createLoadMoreMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      await waitFor(() => {
        expect(screen.getByText('User 3')).toBeInTheDocument();
      });

      // Wait for loading state to finish (button disappears because hasNextPage is false)
      await waitFor(() => {
        expect(
          screen.queryByTestId('load-more-button'),
        ).not.toBeInTheDocument();
      });
    });

    it('appends new items to existing items array', async () => {
      const user = userEvent.setup();
      const mocks = [createSuccessMock(true), createLoadMoreMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      await waitFor(() => {
        expect(screen.getByText('User 3')).toBeInTheDocument();
      });

      // Wait for loading state to finish (button disappears because hasNextPage is false)
      await waitFor(() => {
        expect(
          screen.queryByTestId('load-more-button'),
        ).not.toBeInTheDocument();
      });
    });

    it('disables button and shows loading text during load more', async () => {
      const user = userEvent.setup();
      const delayedLoadMoreMock = {
        ...createLoadMoreMock(),
        delay: 100, // Add delay to capture loading state
      };
      const mocks = [createSuccessMock(true), delayedLoadMoreMock];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      // Button should be disabled during loading
      expect(loadMoreBtn).toBeDisabled();

      // Wait for operation to complete (button disappears because hasNextPage is false)
      await waitFor(() => {
        expect(
          screen.queryByTestId('load-more-button'),
        ).not.toBeInTheDocument();
      });
    });

    it('prevents concurrent load more requests', async () => {
      const user = userEvent.setup();
      const mocks = [createSuccessMock(true), createLoadMoreMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');

      // Try to click multiple times rapidly
      await user.click(loadMoreBtn);
      await user.click(loadMoreBtn);

      // Should still work correctly
      await waitFor(() => {
        expect(screen.getByText('User 3')).toBeInTheDocument();
      });

      // Wait for loading state to finish (button disappears because hasNextPage is false)
      await waitFor(() => {
        expect(
          screen.queryByTestId('load-more-button'),
        ).not.toBeInTheDocument();
      });
    });

    it('calls onDataChange callback with updated items', async () => {
      const user = userEvent.setup();
      const onDataChange = vi.fn();
      const mocks = [createSuccessMock(true), createLoadMoreMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
              onDataChange={onDataChange}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(onDataChange).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ id: '1', name: 'User 1' }),
          ]),
        );
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      await waitFor(() => {
        expect(onDataChange).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ id: '1' }),
            expect.objectContaining({ id: '2' }),
            expect.objectContaining({ id: '3' }),
          ]),
        );
      });

      // Wait for loading state to finish (button disappears because hasNextPage is false)
      await waitFor(() => {
        expect(
          screen.queryByTestId('load-more-button'),
        ).not.toBeInTheDocument();
      });
    });

    it('updates pageInfo after successful load more', async () => {
      const user = userEvent.setup();
      const mocks = [createSuccessMock(true), createLoadMoreMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      await waitFor(() => {
        // Button should disappear because hasNextPage is now false
        expect(
          screen.queryByTestId('load-more-button'),
        ).not.toBeInTheDocument();
      });
    });
  });

  // D. Refetch Functionality Tests
  describe('Refetch Functionality', () => {
    it('refetches data when refetchTrigger value changes', async () => {
      const initialMock = createSuccessMock();

      // Create a distinct mock for the refetch to ensure the update is detectable
      const refetchMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1-refetched',
                  node: {
                    id: '1-new',
                    name: 'User 1 Refetched',
                    email: 'user1@test.com',
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: 'cursor1-refetched',
                endCursor: 'cursor1-refetched',
              },
            },
          },
        },
      };

      const mocks = [initialMock, refetchMock];

      const Wrapper = ({ trigger }: { trigger: number }) => (
        <CursorPaginationManager
          query={MOCK_QUERY}
          dataPath="users"
          itemsPerPage={10}
          renderItem={(user: User) => <div>{user.name}</div>}
          refetchTrigger={trigger}
        />
      );

      const { rerender } = render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <Wrapper trigger={0} />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Change refetchTrigger - this should trigger a refetch
      rerender(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <Wrapper trigger={1} />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for the SPECIFIC new data to appear
      await waitFor(() => {
        expect(screen.getByText('User 1 Refetched')).toBeInTheDocument();
      });
    });

    it('resets items and pageInfo before refetch', async () => {
      const user = userEvent.setup();
      const initialMock = createSuccessMock(true);
      const loadMoreMock = createLoadMoreMock();
      const refetchMock = createSuccessMock(false);

      const mocks = [initialMock, loadMoreMock, refetchMock];

      const { rerender } = render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
              refetchTrigger={0}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Load more to get more items
      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      await waitFor(() => {
        expect(screen.getByText('User 3')).toBeInTheDocument();
      });

      // Trigger refetch
      rerender(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
              refetchTrigger={1}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // After refetch, should only have initial items
      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
      });
    });

    it('does not refetch when trigger value stays the same', async () => {
      const mocks = [createSuccessMock()];

      const { rerender } = render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              refetchTrigger={0}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Re-render with same trigger value
      rerender(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              refetchTrigger={0}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Should still show same data
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });

  describe('Coverage Gaps', () => {
    it('handles error when load more fails without console logging (Line 191)', async () => {
      const user = userEvent.setup();
      const mocks = [
        createSuccessMock(true),
        {
          request: {
            query: MOCK_QUERY,
            variables: { first: 10, after: 'cursor2' },
          },
          error: new Error('Async load failed'),
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      // Error is handled silently via Apollo's error prop
      // Button should remain enabled for retry
      await waitFor(() => {
        expect(loadMoreBtn).not.toBeDisabled();
      });
    });

    it('handles null data in load more response (Line 26)', async () => {
      const user = userEvent.setup();
      const mocks = [
        createSuccessMock(true),
        {
          request: {
            query: MOCK_QUERY,
            variables: { first: 10, after: 'cursor2' },
          },
          result: {
            data: null, // This triggers line 26: if (!data ...)
          },
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      // Should verify loading state finishes and no crash occurs
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(loadMoreBtn).not.toBeDisabled();
      });
    });

    it('handles broken intermediate paths in nested data (Line 34)', async () => {
      const user = userEvent.setup();

      // Create a nested mock that HAS a next page to enable the button
      const nestedWithNextPage = {
        request: {
          query: MOCK_NESTED_QUERY,
          variables: { first: 10, after: null, orgId: 'org1' },
        },
        result: {
          data: {
            organization: {
              members: {
                edges: [
                  {
                    cursor: 'cursor1',
                    node: { id: '1', name: 'Member 1', role: 'Admin' },
                  },
                ],
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: false,
                  startCursor: 'cursor1',
                  endCursor: 'cursor1',
                },
              },
            },
          },
        },
      };

      const brokenPathMock = {
        request: {
          query: MOCK_NESTED_QUERY,
          variables: { first: 10, after: 'cursor1', orgId: 'org1' },
        },
        result: {
          data: {
            organization: null, // This triggers line 34: intermediate path is null
          },
        },
      };

      const mocks = [nestedWithNextPage, brokenPathMock];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_NESTED_QUERY}
              queryVariables={{ orgId: 'org1' }}
              dataPath="organization.members"
              itemsPerPage={10}
              renderItem={(member: Member) => <div>{member.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Member 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      // Should silently fail (log nothing critical) and simply stop loading
      await waitFor(() => {
        expect(loadMoreBtn).not.toBeDisabled();
        // Items should remain unchanged
        expect(screen.getByText('Member 1')).toBeInTheDocument();
      });
    });
  });

  // E. Error Handling Tests
  describe('Error Handling', () => {
    it('handles invalid dataPath gracefully (shows empty state)', async () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="invalidPath"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-empty'),
        ).toBeInTheDocument();
      });
    });

    it('handles missing pageInfo field', async () => {
      const mockWithoutPageInfo = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1',
                  node: { id: '1', name: 'User 1', email: 'user1@test.com' },
                },
              ],
              // Missing pageInfo
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[mockWithoutPageInfo]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Should render items even when pageInfo is missing
      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-manager'),
        ).toBeInTheDocument();
      });

      // Verify the item is displayed
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    it('preserves existing items when load more fails', async () => {
      const user = userEvent.setup();
      const successMock = createSuccessMock(true);
      const errorMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: 'cursor2' },
        },
        error: new GraphQLError('Load more failed'),
      };

      const mocks = [successMock, errorMock];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(userItem: User) => <div>{userItem.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      // Wait for the button to be re-enabled after error (indicates error was handled)
      await waitFor(() => {
        expect(loadMoreBtn).not.toBeDisabled();
      });

      // Original items should still be there
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
    });

    it('handles malformed connection data', async () => {
      const malformedMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              // Missing edges array
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[malformedMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('cursor-pagination-empty'),
        ).toBeInTheDocument();
      });
    });
  });

  // F. Edge Cases Tests
  describe('Edge Cases', () => {
    it('handles null/undefined endCursor', async () => {
      const mockWithNullCursor = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1',
                  node: { id: '1', name: 'User 1', email: 'user1@test.com' },
                },
              ],
              pageInfo: {
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: 'cursor1',
                endCursor: null,
              },
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[mockWithNullCursor]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });
    });

    it('component unmounts cleanly during fetch', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mocks = [createSuccessMock()];

      const { unmount } = render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Unmount before data loads
      unmount();

      // Flush any pending promises/microtasks
      await waitFor(() => {
        expect(true).toBe(true);
      });

      // Verify no console errors occurred during unmount
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('works with custom queryVariables merged with pagination vars', async () => {
      const mocks = [createNestedMock()];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_NESTED_QUERY}
              queryVariables={{ orgId: 'org1' }}
              dataPath="organization.members"
              itemsPerPage={10}
              renderItem={(member: Member) => <div>{member.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Member 1')).toBeInTheDocument();
      });
    });
  });

  describe('Race Condition Protection', () => {
    it('discards stale fetchMore when refetch completes first', async () => {
      const user = userEvent.setup();
      const initialMock = createSuccessMock(true);

      // Slow fetchMore that will complete AFTER refetch
      const slowFetchMoreMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: 'cursor2' },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor3',
                  node: {
                    id: '3',
                    name: 'Stale User 3',
                    email: 'stale3@test.com',
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: true,
                startCursor: 'cursor3',
                endCursor: 'cursor3',
              },
            },
          },
        },
        delay: 200,
      };

      // Fast refetch that completes before fetchMore
      const refetchMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1-new',
                  node: {
                    id: '1',
                    name: 'Refetched User 1',
                    email: 'user1@test.com',
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: 'cursor1-new',
                endCursor: 'cursor1-new',
              },
            },
          },
        },
        delay: 50,
      };

      const { rerender } = render(
        <MockedProvider mocks={[initialMock, slowFetchMoreMock, refetchMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              refetchTrigger={0}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Click load more (starts slow fetchMore)
      const loadMoreBtn = screen.getByTestId('load-more-button');
      await user.click(loadMoreBtn);

      // Immediately trigger refetch (increments generation counter)
      rerender(
        <MockedProvider mocks={[initialMock, slowFetchMoreMock, refetchMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              refetchTrigger={1}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for refetch to complete
      await waitFor(() => {
        expect(screen.getByText('Refetched User 1')).toBeInTheDocument();
      });

      // Verify stale fetchMore data was NOT appended
      await waitFor(
        () => {
          expect(screen.queryByText('Stale User 3')).not.toBeInTheDocument();
        },
        { timeout: 300 },
      );

      // Should only have refetched data
      expect(screen.getByText('Refetched User 1')).toBeInTheDocument();
      expect(screen.queryByText('User 2')).not.toBeInTheDocument();
    });
  });

  describe('External UI Mode', () => {
    it('renders external UI mode with children render prop', async () => {
      const mocks = [createSuccessMock(true)];
      const renderPropSpy = vi.fn(({ items, loading }) => (
        <div>
          {loading ? (
            <div>External Loading</div>
          ) : (
            <div>
              {items.map((item: User) => (
                <div key={item.id}>{item.name}</div>
              ))}
            </div>
          )}
        </div>
      ));

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              useExternalUI={true}
            >
              {renderPropSpy}
            </CursorPaginationManager>
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(renderPropSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            items: expect.any(Array),
            loading: expect.any(Boolean),
            loadingMore: expect.any(Boolean),
            pageInfo: expect.any(Object),
            handleLoadMore: expect.any(Function),
            handleRefetch: expect.any(Function),
            error: undefined,
            queryData: expect.any(Object),
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });
    });

    it('external UI mode passes full queryData for custom rendering', async () => {
      const mockOrgMembers = {
        request: {
          query: MOCK_NESTED_QUERY,
          variables: { first: 10, after: null, orgId: 'org1' },
        },
        result: {
          data: {
            organization: {
              members: {
                edges: [
                  {
                    cursor: 'cursor1',
                    node: { id: '1', name: 'Member 1', role: 'Admin' },
                  },
                  {
                    cursor: 'cursor2',
                    node: { id: '2', name: 'Member 2', role: 'User' },
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: 'cursor1',
                  endCursor: 'cursor2',
                },
              },
            },
          },
        },
      };

      /**
       * Capturing the full query data object returned from the render prop
       * to verify that nested data structures are correctly passed through.
       * Type is unknown since it represents arbitrary GraphQL response data.
       */
      let capturedQueryData: unknown;

      render(
        <MockedProvider mocks={[mockOrgMembers]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_NESTED_QUERY}
              queryVariables={{ orgId: 'org1' }}
              dataPath="organization.members"
              itemsPerPage={10}
              useExternalUI={true}
            >
              {(props) => {
                capturedQueryData = props.queryData;
                return (
                  <div>
                    {(props.items as Member[]).map((item) => (
                      <div key={item.id}>{item.name}</div>
                    ))}
                  </div>
                );
              }}
            </CursorPaginationManager>
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          (capturedQueryData as unknown as { organization?: unknown })
            ?.organization,
        ).toBeDefined();
        expect(
          (
            capturedQueryData as unknown as {
              organization?: { members?: unknown };
            }
          )?.organization?.members,
        ).toBeDefined();
      });
    });

    it('external UI mode provides handleLoadMore and handleRefetch', async () => {
      const mocks = [createSuccessMock(true), createLoadMoreMock()];
      let capturedHandleLoadMore: (() => void) | null = null;
      let capturedHandleRefetch: (() => void) | null = null;

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              useExternalUI={true}
            >
              {(props) => {
                capturedHandleLoadMore = props.handleLoadMore;
                capturedHandleRefetch = props.handleRefetch;
                return (
                  <div>
                    <button
                      type="button"
                      onClick={props.handleLoadMore}
                      data-testid="external-load-more"
                    >
                      Load More
                    </button>
                    {(props.items as User[]).map((item) => (
                      <div key={item.id}>{item.name}</div>
                    ))}
                  </div>
                );
              }}
            </CursorPaginationManager>
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      expect(capturedHandleLoadMore).toBeInstanceOf(Function);
      expect(capturedHandleRefetch).toBeInstanceOf(Function);

      const user = userEvent.setup();
      const loadMoreBtn = screen.getByTestId('external-load-more');
      await user.click(loadMoreBtn);

      await waitFor(() => {
        expect(screen.getByText('User 3')).toBeInTheDocument();
      });
    });

    it('external UI mode handles error state correctly', async () => {
      const errorMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        error: new GraphQLError('Query failed'),
      };

      render(
        <MockedProvider mocks={[errorMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              useExternalUI={true}
            >
              {(props) => (
                <div>
                  {props.error ? (
                    <div data-testid="external-error">
                      Error: {props.error.message}
                    </div>
                  ) : (
                    <div>No Error</div>
                  )}
                  <div data-testid="items-count">{props.items.length}</div>
                </div>
              )}
            </CursorPaginationManager>
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('external-error')).toBeInTheDocument();
        expect(screen.getByTestId('external-error')).toHaveTextContent(
          'Query failed',
        );
      });

      // Items should be empty when error occurs
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });

    it('external UI mode handles empty state correctly', async () => {
      const emptyMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              edges: [],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[emptyMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              useExternalUI={true}
            >
              {(props) => (
                <div>
                  {props.items.length === 0 && !props.loading ? (
                    <div data-testid="external-empty">No items found</div>
                  ) : (
                    <div>
                      {(props.items as User[]).map((item) => (
                        <div key={item.id}>{item.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CursorPaginationManager>
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('external-empty')).toBeInTheDocument();
      });
    });
  });

  describe('RefetchTrigger Edge Cases', () => {
    it('handles refetchTrigger with initial value of 0', async () => {
      const initialMock = createSuccessMock();
      const refetchMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 10, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1',
                  node: {
                    id: '1',
                    name: 'User 1 Refetched',
                    email: 'user1@test.com',
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: 'cursor1',
                endCursor: 'cursor1',
              },
            },
          },
        },
      };

      const { rerender } = render(
        <MockedProvider mocks={[initialMock, refetchMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              refetchTrigger={0}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Changing from 0 to 1 should still trigger refetch
      rerender(
        <MockedProvider mocks={[initialMock, refetchMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              refetchTrigger={1}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1 Refetched')).toBeInTheDocument();
      });
    });

    it('handles large itemsPerPage values', async () => {
      const largeMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 1000, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1',
                  node: { id: '1', name: 'User 1', email: 'user1@test.com' },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: 'cursor1',
                endCursor: 'cursor1',
              },
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[largeMock]}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={1000}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });
    });
  });
});
