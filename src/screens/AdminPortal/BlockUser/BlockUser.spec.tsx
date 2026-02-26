import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
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
import { OrganizationMembershipRole } from 'types/AdminPortal/OrganizationMembershipRole/interface';

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

interface InterfaceMockOptions {
  blockUserError?: boolean;
  unblockUserError?: boolean;
  blockUserNullData?: boolean;
  unblockUserNullData?: boolean;
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
  where?: {
    role?: {
      notEqual?: string;
    };
  };
}

interface InterfaceGraphQLRequest {
  query: DocumentNode;
  variables: InterfaceGraphQLVariables;
}

interface InterfaceGraphQLMock {
  request: InterfaceGraphQLRequest;
  result?: { data: unknown };
  newData?: () => { data: unknown };
  error?: Error;
  delay?: number;
  maxUsageCount?: number;
}

const createMocks = (
  options: InterfaceMockOptions = {},
): InterfaceGraphQLMock[] => {
  const {
    blockUserError = false,
    unblockUserError = false,
    blockUserNullData = false,
    unblockUserNullData = false,
    membersQueryError = false,
    blockedUsersQueryError = false,
    emptyMembers = false,
    emptyBlockedUsers = false,
    nullData = false,
    delay = 0,
  } = options;

  // Mutable state shared between query and mutation mocks for this test run.
  // When a mutation fires, it updates mockState. When a query refetches,
  // newData() reads the current mockState, returning the correct data.
  const mockState = {
    members: emptyMembers
      ? []
      : [
          {
            id: '1',
            name: 'John Doe',
            emailAddress: 'john@example.com',
            role: 'regular',
          },
          {
            id: '2',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            role: 'regular',
          },
        ],
    blockedUsers: emptyBlockedUsers
      ? []
      : [
          {
            id: '3',
            name: 'Bob Johnson',
            emailAddress: 'bob@example.com',
            role: 'regular',
          },
        ],
  };

  const mocks: InterfaceGraphQLMock[] = [
    {
      request: {
        query: GET_ORGANIZATION_MEMBERS_PG,
        variables: {
          id: '123',
          first: 32,
          after: null,
          where: {
            role: {
              notEqual: OrganizationMembershipRole.ADMIN,
            },
          },
        },
      },
      ...(membersQueryError
        ? { error: new Error('Failed to fetch members') }
        : {
            delay,
            newData: () => ({
              data: nullData
                ? { organization: null }
                : {
                    organization: {
                      members: {
                        edges: mockState.members.map((node) => ({ node })),
                        pageInfo: { hasNextPage: false, endCursor: null },
                      },
                    },
                  },
            }),
          }),
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: GET_ORGANIZATION_BLOCKED_USERS_PG,
        variables: {
          id: '123',
          first: 32,
          after: null,
        },
      },
      ...(blockedUsersQueryError
        ? { error: new Error('Failed to fetch blocked users') }
        : {
            delay,
            newData: () => ({
              data: nullData
                ? { organization: null }
                : {
                    organization: {
                      blockedUsers: {
                        edges: mockState.blockedUsers.map((node) => ({
                          node,
                        })),
                        pageInfo: { hasNextPage: false, endCursor: null },
                      },
                    },
                  },
            }),
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
        : {
            newData: () => {
              if (blockUserNullData) {
                return { data: { blockUser: null } };
              }
              const idx = mockState.members.findIndex((u) => u.id === '1');
              if (idx > -1) {
                const [removed] = mockState.members.splice(idx, 1);
                mockState.blockedUsers.push(removed);
              }
              return { data: { blockUser: { success: true } } };
            },
          }),
    },
    {
      request: {
        query: BLOCK_USER_MUTATION_PG,
        variables: { userId: '2', organizationId: '123' },
      },
      ...(blockUserError
        ? { error: new Error('Failed to block user') }
        : {
            newData: () => {
              if (blockUserNullData) {
                return { data: { blockUser: null } };
              }
              const idx = mockState.members.findIndex((u) => u.id === '2');
              if (idx > -1) {
                const [removed] = mockState.members.splice(idx, 1);
                mockState.blockedUsers.push(removed);
              }
              return { data: { blockUser: { success: true } } };
            },
          }),
    },
    {
      request: {
        query: UNBLOCK_USER_MUTATION_PG,
        variables: { userId: '3', organizationId: '123' },
      },
      ...(unblockUserError
        ? { error: new Error('Failed to unblock user') }
        : {
            newData: () => {
              if (unblockUserNullData) {
                return { data: { unblockUser: null } };
              }
              const idx = mockState.blockedUsers.findIndex((u) => u.id === '3');
              if (idx > -1) {
                const [removed] = mockState.blockedUsers.splice(idx, 1);
                mockState.members.push(removed);
              }
              return { data: { unblockUser: { success: true } } };
            },
          }),
    },
  ];
  return mocks;
};

describe('BlockUser Component', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });
  describe('Initial Loading and Error States', () => {
    it('shows loading state when fetching data', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ delay: 50 })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('TableLoader')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });
    });

    it('handles null organization data gracefully', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ nullData: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
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
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });
    });

    it('handles both queries returning null data', async () => {
      // Create custom mocks with both queries returning null data
      const customMocks = [
        {
          request: {
            query: GET_ORGANIZATION_MEMBERS_PG,
            variables: {
              id: '123',
              first: 32,
              after: null,
              where: {
                role: {
                  notEqual: OrganizationMembershipRole.ADMIN,
                },
              },
            },
          },
          result: {
            data: { organization: null },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_BLOCKED_USERS_PG,
            variables: {
              id: '123',
              first: 32,
              after: null,
            },
          },
          result: {
            data: { organization: null },
          },
        },
      ];

      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={customMocks}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
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
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });

      // Switch to blocked users view
      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      // Should show empty state for blocked users
      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText('No spammer found')).toBeInTheDocument();
      });
    });

    it('displays error panel when blocked users query fails', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ blockedUsersQueryError: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('errorBlockedUsers')).toBeInTheDocument();
        expect(
          screen.getByText((content, element) => {
            return (
              element?.textContent ===
              'Error occurred while loading blocked users dataFailed to fetch blocked users'
            );
          }),
        ).toBeInTheDocument();
      });
    });

    it('displays error panel when members query fails', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ membersQueryError: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('errorMembers')).toBeInTheDocument();
        expect(
          screen.getByText((content, element) => {
            return (
              element?.textContent ===
              'Error occurred while loading members dataFailed to fetch members'
            );
          }),
        ).toBeInTheDocument();
      });
    });
  });

  describe('View Switching', () => {
    it('displays all members initially', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('displays empty state when no members are available', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ emptyMembers: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });
    });

    it('displays empty state with noSpammerFound message when blocked tab is selected and searchTerm is empty', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ emptyBlockedUsers: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText('No spammer found')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('searches members by name', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await user.type(searchInput, 'John');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('searches members by email address', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await user.type(searchInput, 'jane@example.com');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('searches blocked users by name', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await user.type(searchInput, 'Bob');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('searches blocked users by email address', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await user.type(searchInput, 'bob@example.com');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('handles search with no results for members', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await user.type(searchInput, 'nonexistent');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(
          screen.getByText('No results found for nonexistent'),
        ).toBeInTheDocument();
      });
    });

    it('handles search with no results for blocked users', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');
      await user.type(searchInput, 'nonexistent');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(
          screen.getByText('No results found for nonexistent'),
        ).toBeInTheDocument();
      });
    });

    it('clears search results when search term is empty', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
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
      await user.type(searchInput, 'John');

      // Wait for SearchFilterBar's debounced `onSearchChange` to update `searchTerm`
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });

      await user.clear(searchInput);

      // Wait for SearchFilterBar's debounced `onSearchChange` to propagate clearing `searchTerm`
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });
  });

  describe('Block/Unblock Actions', () => {
    it('blocks a user successfully', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getByTestId('blockUserBtn-1');
      await user.click(blockButton);
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'User blocked successfully',
        );
      });

      // Wait for potential refetch to complete
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });
    });

    it('unblocks a user successfully', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const unblockButton = screen.getByTestId('unblockUserBtn-3');
      await user.click(unblockButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'User Un-Blocked successfully',
        );
      });

      // Wait for potential refetch to complete
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });
    });

    it('handles block user error', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ blockUserError: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getByTestId('blockUserBtn-1');
      await user.click(blockButton);

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    });

    it('handles unblock user error', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ unblockUserError: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const unblockButton = screen.getByTestId('unblockUserBtn-3');
      await user.click(unblockButton);

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    });

    it('can block multiple users', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Block first user
      const blockButton1 = screen.getByTestId('blockUserBtn-1');
      await user.click(blockButton1);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'User blocked successfully',
        );
      });

      // Wait for refetch to complete
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Check that first user is removed from members list
      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Block second user
      const blockButton2 = screen.getByTestId('blockUserBtn-2');
      await user.click(blockButton2);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'User blocked successfully',
        );
      });

      // Wait for refetch to complete
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Verify both users are no longer in the list
      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        expect(
          screen.getByTestId('block-user-empty-state'),
        ).toBeInTheDocument();
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });
    });

    it('shows blocked user in blocked users list after blocking', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Verify John Doe is in the members list
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Block John Doe
      const blockButton = screen.getByTestId('blockUserBtn-1');
      await user.click(blockButton);
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'User blocked successfully',
        );
      });

      // Wait for refetch to complete
      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Switch to blocked users view
      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

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

  describe('Mutation falsy-data guards', () => {
    it('does not show success toast when blockUser returns null', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ blockUserNullData: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getByTestId('blockUserBtn-1');
      await user.click(blockButton);

      // Wait for an indicator that the mutation completed (user still present = no refetch from success path)
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Allow the mutation promise to resolve
      await waitFor(() => {
        // The guard `if (data?.blockUser)` is false, so no toast should fire
        expect(NotificationToast.success).not.toHaveBeenCalled();
      });
    });

    it('does not show success toast when unblockUser returns null', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks({ unblockUserNullData: true })}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
      });

      // Switch to blocked users view
      const sortingButton = await screen.findByTestId('blockUserView-toggle');
      await user.click(sortingButton);

      const blockedUsersOption = await screen.findByTestId(
        'blockUserView-item-blockedUsers',
      );
      await user.click(blockedUsersOption);

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const unblockButton = screen.getByTestId('unblockUserBtn-3');
      await user.click(unblockButton);

      // Wait for an indicator that the mutation completed (user still blocked = no refetch from success path)
      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      // Allow the mutation promise to resolve
      await waitFor(() => {
        // The guard `if (data?.unblockUser)` is false, so no toast should fire
        expect(NotificationToast.success).not.toHaveBeenCalled();
      });
    });
  });

  describe('Component Behavior', () => {
    it('updates document title on mount', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      expect(document.title).toBe('Block/Unblock User');
    });

    it('renders table headers correctly', async () => {
      render(
        <I18nextProvider i18n={i18nForTest}>
          <MockedProvider mocks={createMocks()}>
            <BrowserRouter>
              <BlockUser />
            </BrowserRouter>
          </MockedProvider>
        </I18nextProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('TableLoader')).not.toBeInTheDocument();
        expect(screen.getByText('#')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Block/Unblock')).toBeInTheDocument();
      });
    });
  });
});
