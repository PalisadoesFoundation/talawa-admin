import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import Requests from './BlockUser';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
} from 'GraphQl/Queries/Queries';
import {
  BLOCK_USER_MUTATION_PG,
  UNBLOCK_USER_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { DocumentNode } from 'graphql';

vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify');
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '123' }),
  };
});

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

interface InterfaceMockOptions {
  blockUserError?: boolean;
  unblockUserError?: boolean;
  membersQueryError?: boolean;
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
}

const createMocks = (
  options: InterfaceMockOptions = {},
): InterfaceGraphQLMock[] => {
  const {
    blockUserError = false,
    unblockUserError = false,
    membersQueryError = false,
  } = options;

  return [
    {
      request: {
        query: GET_ORGANIZATION_MEMBERS_PG,
        variables: { id: '123', first: 32, after: null },
      },
      ...(membersQueryError
        ? { error: new Error('Failed to fetch members') }
        : {
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
      result: {
        data: { blockUser: { success: true } },
      },
    },
    {
      request: {
        query: UNBLOCK_USER_MUTATION_PG,
        variables: { userId: '3', organizationId: '123' },
      },
      ...(unblockUserError
        ? { error: new Error('Failed to unblock user') }
        : { result: { data: { unBlockUser: { success: true } } } }),
    },
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
                    id: '2',
                    name: 'Jane Smith',
                    emailAddress: 'jane@example.com',
                    role: 'regular',
                  },
                },
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
  ];
};
describe('Requests Component - Additional Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles between all members and blocked users view', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText('Jane Smith')).toBeInTheDocument(),
    );

    const sortingButton = screen.getByTestId('userFilter');
    fireEvent.click(sortingButton);

    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() =>
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument(),
    );
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

    fireEvent.click(sortingButton);
    const allMembersOption = screen.getByTestId('userFilterallMembers');
    fireEvent.click(allMembersOption);

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText('Jane Smith')).toBeInTheDocument(),
    );
  });

  it('unblocks a user successfully', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
          <ToastContainer data-testid="toast-container" />
        </BrowserRouter>
      </MockedProvider>,
    );

    const sortingButton = await waitFor(() => screen.getByTestId('userFilter'));
    fireEvent.click(sortingButton);
    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() =>
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument(),
    );

    const unblockButton = screen.getByTestId('blockUser3');
    await act(async () => {
      fireEvent.click(unblockButton);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Un-BlockedSuccessfully');
    });
  });

  it('handles error when blocking a user fails', async () => {
    render(
      <MockedProvider
        mocks={createMocks({ blockUserError: true })}
        addTypename={false}
      >
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument(),
    );

    const blockButton = screen.getByTestId('blockUser1');
    await act(async () => {
      fireEvent.click(blockButton);
    });

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  it('handles error when unblocking a user fails', async () => {
    render(
      <MockedProvider
        mocks={createMocks({ unblockUserError: true })}
        addTypename={false}
      >
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    const sortingButton = await waitFor(() => screen.getByTestId('userFilter'));
    fireEvent.click(sortingButton);

    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() =>
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument(),
    );

    const unblockButton = screen.getByTestId('blockUser3');
    await act(async () => {
      fireEvent.click(unblockButton);
    });

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  it('shows error toast when members query fails', async () => {
    render(
      <MockedProvider
        mocks={createMocks({ membersQueryError: true })}
        addTypename={false}
      >
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch members');
    });
  });

  it('filters members by search term', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('shows "no users found" message when filtered members list is empty', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Nobody' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
    });
  });
  it('clears search field and shows all results', async () => {
    const mocks = [
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
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles search with empty results when searching blocked users', async () => {
    const mocks = [
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
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const sortingButton = screen.getByTestId('userFilter');
      fireEvent.click(sortingButton);
    });

    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'Nobody' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
      expect(screen.getByText(/Nobody/i)).toBeInTheDocument();
    });
  });

  it('handles search with special characters', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: '!@#$%^&*()' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
      expect(screen.getByText(/!@#\$%\^&\*\(\)/i)).toBeInTheDocument();
    });
  });

  it('handles empty state when no members or blocked users exist', async () => {
    const emptyMocks = [
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
                edges: [],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
    });

    const sortingButton = screen.getByTestId('userFilter');
    fireEvent.click(sortingButton);
    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
    });
  });

  it('handles filtering between all members and blocked users', async () => {
    const mocks = [
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
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const sortingButton = screen.getByTestId('userFilter');
    fireEvent.click(sortingButton);
    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    fireEvent.click(sortingButton);
    const allMembersOption = screen.getByTestId('userFilterallMembers');
    fireEvent.click(allMembersOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles successful blocking of a user', async () => {
    const mocks = [
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
          query: BLOCK_USER_MUTATION_PG,
          variables: { userId: '1', organizationId: '123' },
        },
        result: {
          data: { blockUser: { success: true } },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Requests />
          <ToastContainer />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const blockButton = screen.getByTestId('blockUser1');
    await act(async () => {
      fireEvent.click(blockButton);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('blockedSuccessfully');
    });
  });

  it('handles search functionality for members list', async () => {
    const mocks = [
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
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles email search for blocked users', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    const sortingButton = await waitFor(() => screen.getByTestId('userFilter'));
    fireEvent.click(sortingButton);
    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'bob@example.com' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  it('handles case-insensitive search', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'john' } });

    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: 'JOHN' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles multiple block operations in sequence', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
          <ToastContainer />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const blockButton1 = screen.getByTestId('blockUser1');
    await act(async () => {
      fireEvent.click(blockButton1);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('blockedSuccessfully');
    });

    const blockButton2 = screen.getByTestId('blockUser2');
    await act(async () => {
      fireEvent.click(blockButton2);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('blockedSuccessfully');
    });
  });

  it('preserves search term when switching between views', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    const searchButton = screen.getByTestId('searchBtn');
		fireEvent.click(searchButton);

    const sortingButton = screen.getByTestId('userFilter');
    fireEvent.click(sortingButton);
    const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
    fireEvent.click(blockedUsersOption);

    expect(searchInput).toHaveValue('John');

    fireEvent.click(sortingButton);
    const allMembersOption = screen.getByTestId('userFilterallMembers');
    fireEvent.click(allMembersOption);

    expect(searchInput).toHaveValue('John');
  });

  it('handles rapid view switching', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const sortingButton = screen.getByTestId('userFilter');

    for (let i = 0; i < 3; i++) {
      fireEvent.click(sortingButton);
      const blockedUsersOption = screen.getByTestId('userFilterblockedUsers');
      fireEvent.click(blockedUsersOption);

      fireEvent.click(sortingButton);
      const allMembersOption = screen.getByTestId('userFilterallMembers');
      fireEvent.click(allMembersOption);
    }

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles rapid search input changes', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    const searchButton = screen.getByTestId('searchBtn');

    fireEvent.change(searchInput, { target: { value: 'J' } });
    fireEvent.click(searchButton);
    fireEvent.change(searchInput, { target: { value: 'Jo' } });
    fireEvent.click(searchButton);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('handles search with only whitespace', async () => {
    render(
      <MockedProvider mocks={createMocks()} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: '   ' } });
    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles null name in member data', async () => {
    const mocksWithNullName = [
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
                      name: null,
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
    ];

    render(
      <MockedProvider mocks={mocksWithNullName} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'john' } });
    const searchButton = screen.getByTestId('searchBtn');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
    });
  });

  it('handles undefined edges in members response', async () => {
    const mocksWithUndefinedEdges = [
      {
        request: {
          query: GET_ORGANIZATION_MEMBERS_PG,
          variables: { id: '123', first: 32, after: null },
        },
        result: {
          data: {
            organization: {
              members: {
                edges: undefined,
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
    ];

    render(
      <MockedProvider mocks={mocksWithUndefinedEdges} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
    });
  });

  it('handles undefined organization in response', async () => {
    const mocksWithUndefinedOrg = [
      {
        request: {
          query: GET_ORGANIZATION_MEMBERS_PG,
          variables: { id: '123', first: 32, after: null },
        },
        result: {
          data: {
            organization: undefined,
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
    ];

    render(
      <MockedProvider mocks={mocksWithUndefinedOrg} addTypename={false}>
        <BrowserRouter>
          <Requests />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/noResultsFoundFor/i)).toBeInTheDocument();
    });
  });
});
