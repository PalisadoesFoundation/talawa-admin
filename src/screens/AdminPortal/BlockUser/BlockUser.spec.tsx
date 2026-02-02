import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import BlockUser from './BlockUser';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
} from 'GraphQl/Queries/Queries';
import {
  BLOCK_USER_MUTATION_PG,
  UNBLOCK_USER_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import type { DocumentNode } from 'graphql';

const { toastMocks, routerMocks, errorHandlerMock } = vi.hoisted(() => {
  const useParams = vi.fn();
  useParams.mockReturnValue({ orgId: '123' });

  return {
    toastMocks: {
      success: vi.fn(),
      error: vi.fn(),
    },
    routerMocks: {
      useParams,
    },
    errorHandlerMock: vi.fn(),
  };
});

vi.mock('components/NotificationToast/NotificationToast', async () => {
  return {
    NotificationToast: toastMocks,
  };
});

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

vi.mock('utils/errorHandler', () => ({
  errorHandler: errorHandlerMock,
}));

async function flushPromises() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
}

interface InterfaceMockOptions {
  blockUserError?: boolean;
  unblockUserError?: boolean;
  membersQueryError?: boolean;
  blockedUsersQueryError?: boolean;
  emptyMembers?: boolean;
  emptyBlockedUsers?: boolean;
  nullData?: boolean;
  delay?: number;
}

interface InterfaceGraphQLVariables {
  id?: string;
  first?: number;
  after?: unknown;
  userId?: string;
  organizationId?: string;
}

interface InterfaceGraphQLRequest {
  query: DocumentNode;
  variables: InterfaceGraphQLVariables;
}

interface InterfaceGraphQLMock {
  request: InterfaceGraphQLRequest;
  result?: { data: unknown };
  error?: Error;
  maxUsageCount?: number;
}

const createMocks = (
  options: InterfaceMockOptions = {},
): InterfaceGraphQLMock[] => {
  const {
    blockUserError = false,
    unblockUserError = false,
    membersQueryError = false,
    blockedUsersQueryError = false,
    emptyMembers = false,
    emptyBlockedUsers = false,
    nullData = false,
    delay = 0,
  } = options;

  const mocks: InterfaceGraphQLMock[] = [
    {
      request: {
        query: GET_ORGANIZATION_MEMBERS_PG,
        variables: { id: '123', first: 32, after: null },
      },
      ...(membersQueryError
        ? { error: new Error('Failed to fetch members') }
        : {
            delay,
            result: {
              data: nullData
                ? { organization: null }
                : {
                    organization: {
                      members: {
                        edges: emptyMembers
                          ? []
                          : [
                              {
                                node: {
                                  id: '1',
                                  name: 'John Doe',
                                  emailAddress: 'john@example.com',
                                  role: 'regular',
                                },
                              },
                              {
                                node: {
                                  id: '2',
                                  name: 'Jane Smith',
                                  emailAddress: 'jane@example.com',
                                  role: 'regular',
                                },
                              },
                            ],
                        pageInfo: { hasNextPage: false, endCursor: null },
                      },
                    },
                  },
            },
          }),
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: GET_ORGANIZATION_BLOCKED_USERS_PG,
        variables: { id: '123', first: 32, after: null },
      },
      ...(blockedUsersQueryError
        ? { error: new Error('Failed to fetch blocked users') }
        : {
            delay,
            result: {
              data: nullData
                ? { organization: null }
                : {
                    organization: {
                      blockedUsers: {
                        edges: emptyBlockedUsers
                          ? []
                          : [
                              {
                                node: {
                                  id: '3',
                                  name: 'Bob Johnson',
                                  emailAddress: 'bob@example.com',
                                  role: 'regular',
                                },
                              },
                            ],
                        pageInfo: { hasNextPage: false, endCursor: null },
                      },
                    },
                  },
            },
          }),
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: BLOCK_USER_MUTATION_PG,
        variables: { userId: '1', organizationId: '123' },
      },
      ...(blockUserError
        ? { error: new Error('Failed to block user') }
        : { result: { data: { blockUser: { success: true } } } }),
    },
    {
      request: {
        query: BLOCK_USER_MUTATION_PG,
        variables: { userId: '2', organizationId: '123' },
      },
      ...(blockUserError
        ? { error: new Error('Failed to block user') }
        : { result: { data: { blockUser: { success: true } } } }),
    },
    {
      request: {
        query: UNBLOCK_USER_MUTATION_PG,
        variables: { userId: '3', organizationId: '123' },
      },
      ...(unblockUserError
        ? { error: new Error('Failed to unblock user') }
        : { result: { data: { unblockUser: { success: true } } } }),
    },
  ];
  return mocks;
};

describe('BlockUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('Initial Loading and Error States', () => {
    it('shows loading state when fetching data', async () => {
      render(
        <MockedProvider mocks={createMocks({ delay: 50 })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('TableLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });
    });

    it('handles members query error', async () => {
      render(
        <MockedProvider mocks={createMocks({ membersQueryError: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ message: 'Failed to fetch members' }),
        );
      });
    });

    it('handles blocked users query error', async () => {
      render(
        <MockedProvider mocks={createMocks({ blockedUsersQueryError: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ message: 'Failed to fetch blocked users' }),
        );
      });
    });

    it('handles null organization data gracefully', async () => {
      render(
        <MockedProvider mocks={createMocks({ nullData: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Should show empty state
      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText(/noUsersFound/i)).toBeInTheDocument();
      });
    });

    it('handles both queries returning null data', async () => {
      // Create custom mocks with both queries returning null data
      const customMocks = [
        {
          request: {
            query: GET_ORGANIZATION_MEMBERS_PG,
            variables: { id: '123', first: 32, after: null },
          },
          result: {
            data: { organization: null },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_BLOCKED_USERS_PG,
            variables: { id: '123', first: 32, after: null },
          },
          result: {
            data: { organization: null },
          },
        },
      ];

      render(
        <MockedProvider mocks={customMocks}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Should show empty state
      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText(/noUsersFound/i)).toBeInTheDocument();
      });

      // Switch to blocked users view
      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      // Should show empty state for blocked users
      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText(/noSpammerFound/i)).toBeInTheDocument();
      });
    });
  });

  describe('View Switching', () => {
    it('displays all members initially', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        const johnDoe = screen.getByText('John Doe');
        const janeSmith = screen.getByText('Jane Smith');
        expect(johnDoe).toBeInTheDocument();
        expect(janeSmith).toBeInTheDocument();
        expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
      });
    });

    it('switches to blocked users view', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('displays empty state when no members are available', async () => {
      render(
        <MockedProvider mocks={createMocks({ emptyMembers: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText(/noUsersFound/i)).toBeInTheDocument();
      });
    });

    it('displays empty state with noSpammerFound message when blocked tab is selected and searchTerm is empty', async () => {
      render(
        <MockedProvider mocks={createMocks({ emptyBlockedUsers: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText(/noSpammerFound/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('searches members by name', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'John' } });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
          expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('searches members by email address', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, {
          target: { value: 'jane@example.com' },
        });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
          expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('searches blocked users by name', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'Bob' } });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('searches blocked users by email address', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'bob@example.com' } });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('handles search with no results for members', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('handles search with no results for blocked users', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('clears search results when search term is empty', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // First search for something
      const searchInput = screen.getByTestId('searchByName');
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'John' } });
      });

      // Wait for debounced search to complete
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
          expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        },
        { timeout: 500 },
      );

      // Then clear the search
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: '' } });
      });

      // Wait for debounced clear to complete
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
          expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });
  });

  describe('Block/Unblock Actions', () => {
    it('blocks a user successfully', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getByTestId('blockUser1');
      await act(async () => {
        fireEvent.click(blockButton);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'blockedSuccessfully',
        );
      });
    });

    it('unblocks a user successfully', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const unblockButton = screen.getByTestId('blockUser3');
      await act(async () => {
        fireEvent.click(unblockButton);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Un-BlockedSuccessfully',
        );
      });
    });

    it('handles block user error', async () => {
      render(
        <MockedProvider mocks={createMocks({ blockUserError: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getByTestId('blockUser1');
      await act(async () => {
        fireEvent.click(blockButton);
      });

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    });

    it('handles unblock user error', async () => {
      render(
        <MockedProvider mocks={createMocks({ unblockUserError: true })}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const unblockButton = screen.getByTestId('blockUser3');
      await act(async () => {
        fireEvent.click(unblockButton);
      });

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    });

    it('can block multiple users', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Block first user
      const blockButton1 = screen.getByTestId('blockUser1');
      await act(async () => {
        fireEvent.click(blockButton1);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'blockedSuccessfully',
        );
      });

      // Block second user
      const blockButton2 = screen.getByTestId('blockUser2');
      await act(async () => {
        fireEvent.click(blockButton2);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'blockedSuccessfully',
        );
      });

      // Verify both users are no longer in the list
      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText(/noUsersFound/i)).toBeInTheDocument();
      });
    });

    it('shows blocked user in blocked users list after blocking', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Verify John Doe is in the members list
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Block John Doe
      const blockButton = screen.getByTestId('blockUser1');
      await act(async () => {
        fireEvent.click(blockButton);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'blockedSuccessfully',
        );
      });

      // Switch to blocked users view
      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await act(async () => {
        fireEvent.click(sortingButton);
      });

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      // Verify John Doe is now in the blocked users list
      // Note: In a real scenario, we would need to update the mock for the blocked users query
      // Here we're testing the component's internal state management
      await waitFor(() => {
        // Bob Johnson should still be there
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();

        // John Doe should now be in the list too (added to state)
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });
  // Tests for handling falsy responses from block and unblock mutations
  describe('Falsy Mutation Responses', () => {
    it('handles falsy block mutation response', async () => {
      const customMocks = [
        {
          request: {
            query: GET_ORGANIZATION_MEMBERS_PG,
            variables: { id: '123', first: 32, after: null },
          },
          result: {
            data: {
              organization: {
                members: {
                  edges: [
                    {
                      node: {
                        id: '1',
                        name: 'John Doe',
                        emailAddress: 'john@example.com',
                        role: 'regular',
                      },
                    },
                  ],
                  pageInfo: { hasNextPage: false, endCursor: null },
                },
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_BLOCKED_USERS_PG,
            variables: { id: '123', first: 32, after: null },
          },
          result: {
            data: {
              organization: {
                blockedUsers: {
                  edges: [],
                  pageInfo: { hasNextPage: false, endCursor: null },
                },
              },
            },
          },
        },
        {
          request: {
            query: BLOCK_USER_MUTATION_PG,
            variables: { userId: '1', organizationId: '123' },
          },
          result: { data: { blockUser: null } },
        },
      ];

      render(
        <MockedProvider mocks={customMocks}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await flushPromises();

      await waitFor(() =>
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument(),
      );
      await screen.findByText('John Doe');

      const blockButton = screen.getByTestId('blockUser1');
      await act(async () => {
        fireEvent.click(blockButton);
      });
      await flushPromises();

      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalledWith(
          'blockedSuccessfully',
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('handles falsy unblock mutation response', async () => {
      const customMocks = [
        {
          request: {
            query: GET_ORGANIZATION_MEMBERS_PG,
            variables: { id: '123', first: 32, after: null },
          },
          result: {
            data: {
              organization: {
                members: {
                  edges: [],
                  pageInfo: { hasNextPage: false, endCursor: null },
                },
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_BLOCKED_USERS_PG,
            variables: { id: '123', first: 32, after: null },
          },
          result: {
            data: {
              organization: {
                blockedUsers: {
                  edges: [
                    {
                      node: {
                        id: '3',
                        name: 'Bob Johnson',
                        emailAddress: 'bob@example.com',
                        role: 'regular',
                      },
                    },
                  ],
                  pageInfo: { hasNextPage: false, endCursor: null },
                },
              },
            },
          },
        },
        {
          request: {
            query: UNBLOCK_USER_MUTATION_PG,
            variables: { userId: '3', organizationId: '123' },
          },
          result: { data: null },
        },
      ];

      render(
        <MockedProvider mocks={customMocks}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await flushPromises();
      await waitFor(() =>
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument(),
      );

      const sortingButton = await screen.findByTestId('blockUserView-toggle');

      await act(async () => {
        fireEvent.click(sortingButton);
      });

      await flushPromises();

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await act(async () => {
        fireEvent.click(blockedUsersOption);
      });

      await flushPromises();

      await screen.findByText('Bob Johnson');

      const unblockBtn = screen.getByTestId('blockUser3');
      await act(async () => {
        fireEvent.click(unblockBtn);
      });

      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalledWith(
          'Un-BlockedSuccessfully',
        );
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });
  });

  describe('Component Behavior', () => {
    it('updates document title on mount', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      expect(document.title).toBe('title');
    });

    it('renders table headers correctly', async () => {
      render(
        <MockedProvider mocks={createMocks()}>
          <BrowserRouter>
            <BlockUser />
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Check for table headers
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('email')).toBeInTheDocument();
      expect(screen.getByText('block_unblock')).toBeInTheDocument();
    });
  });
});
