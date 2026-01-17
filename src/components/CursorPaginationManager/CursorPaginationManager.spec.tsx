// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CursorPaginationManager } from './CursorPaginationManager';
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
      const mocks = [createSuccessMock(true), createLoadMoreMock()];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
    it('logs error to console when load more fails (Line 191)', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
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
        <MockedProvider mocks={mocks} addTypename={false}>
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

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error loading data',
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={[mockWithoutPageInfo]} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={[malformedMock]} addTypename={false}>
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
        <MockedProvider mocks={[mockWithNullCursor]} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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

  describe('KeyExtractor', () => {
    it('uses keyExtractor when provided for item keys', async () => {
      const mocks = [createSuccessMock()];
      const keyExtractor = vi.fn((user: User) => user.id);

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              keyExtractor={keyExtractor}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Verify keyExtractor was called for each item
      expect(keyExtractor).toHaveBeenCalledWith(
        { id: '1', name: 'User 1', email: 'user1@test.com' },
        0,
      );
      expect(keyExtractor).toHaveBeenCalledWith(
        { id: '2', name: 'User 2', email: 'user2@test.com' },
        1,
      );
    });

    it('falls back to index when keyExtractor is not provided', async () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
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

      // Items should be rendered (keys are internal to React, so we just verify rendering)
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
    });

    it('uses keyExtractor with index parameter', async () => {
      const mocks = [createSuccessMock()];
      const keyExtractor = vi.fn(
        (user: User, index: number) => `${user.id}-${index}`,
      );

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              keyExtractor={keyExtractor}
              renderItem={(user: User) => <div>{user.name}</div>}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });

      // Verify keyExtractor was called with both item and index
      expect(keyExtractor).toHaveBeenCalledWith(
        { id: '1', name: 'User 1', email: 'user1@test.com' },
        0,
      );
      expect(keyExtractor).toHaveBeenCalledWith(
        { id: '2', name: 'User 2', email: 'user2@test.com' },
        1,
      );
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
        <MockedProvider
          mocks={[initialMock, slowFetchMoreMock, refetchMock]}
          addTypename={false}
        >
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
        <MockedProvider
          mocks={[initialMock, slowFetchMoreMock, refetchMock]}
          addTypename={false}
        >
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

  describe('Client-side filtering', () => {
    it('applies client-side filter when provided', async () => {
      const mocks = [
        {
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
                    node: { id: '1', name: 'Alice', email: 'alice@test.com' },
                  },
                  {
                    cursor: 'cursor2',
                    node: { id: '2', name: 'Bob', email: 'bob@test.com' },
                  },
                  {
                    cursor: 'cursor3',
                    node: {
                      id: '3',
                      name: 'Charlie',
                      email: 'charlie@test.com',
                    },
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: 'cursor1',
                  endCursor: 'cursor3',
                },
              },
            },
          },
        },
      ];

      // Filter to only show names starting with 'A' or 'C'
      const filterFn = (user: User): boolean => {
        return user.name.startsWith('A') || user.name.startsWith('C');
      };

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              clientSideFilter={filterFn}
              renderItem={(user: User) => <div>{user.name}</div>}
              keyExtractor={(user: User) => user.id}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for data to load and filter to be applied
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
      });

      // Bob should be filtered out
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('shows all items when no filter is provided', async () => {
      const mocks = [createSuccessMock()];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={10}
              renderItem={(user: User) => <div>{user.name}</div>}
              keyExtractor={(user: User) => user.id}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // All items should be visible without filter
      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
      });
    });

    it('applies filter to "Load More" data', async () => {
      const initialMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 2, after: null },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor1',
                  node: { id: '1', name: 'Alice', email: 'alice@test.com' },
                },
                {
                  cursor: 'cursor2',
                  node: { id: '2', name: 'Bob', email: 'bob@test.com' },
                },
              ],
              pageInfo: {
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: 'cursor1',
                endCursor: 'cursor2',
              },
            },
          },
        },
      };

      const loadMoreMock = {
        request: {
          query: MOCK_QUERY,
          variables: { first: 2, after: 'cursor2' },
        },
        result: {
          data: {
            users: {
              edges: [
                {
                  cursor: 'cursor3',
                  node: { id: '3', name: 'Charlie', email: 'charlie@test.com' },
                },
                {
                  cursor: 'cursor4',
                  node: { id: '4', name: 'Dennis', email: 'dennis@test.com' },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: true,
                startCursor: 'cursor3',
                endCursor: 'cursor4',
              },
            },
          },
        },
      };

      // Filter to only show names with 'a' in them (case insensitive)
      const filterFn = (user: User): boolean => {
        return user.name.toLowerCase().includes('a');
      };

      render(
        <MockedProvider mocks={[initialMock, loadMoreMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <CursorPaginationManager
              query={MOCK_QUERY}
              dataPath="users"
              itemsPerPage={2}
              clientSideFilter={filterFn}
              renderItem={(user: User) => <div>{user.name}</div>}
              keyExtractor={(user: User) => user.id}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Initial data: Alice should show, Bob should be filtered out
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();

      // Click Load More
      const loadMoreButton = await screen.findByRole('button', {
        name: /load more/i,
      });
      await userEvent.click(loadMoreButton);

      // After loading more: Charlie has 'a', Dennis doesn't
      await waitFor(() => {
        expect(screen.getByText('Charlie')).toBeInTheDocument();
      });
      expect(screen.queryByText('Dennis')).not.toBeInTheDocument();

      // Alice should still be visible
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});
