import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserOrganizations from './UserOrganizations';
import { MemoryRouter } from 'react-router';
import React from 'react';
import {
  InterfacePeopleTabNavbarProps,
  InterfacePeopleTabUserOrganizationProps,
} from 'types/PeopleTab/interface';
import {
  USER_DETAILS,
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
} from 'GraphQl/Queries/Queries';
import { DocumentNode } from 'graphql';
import { OperationVariables } from '@apollo/client/core/types';
import { QueryHookOptions } from '@apollo/client/react/types/types';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useLocation: () => ({
      state: null,
      pathname: '/user',
    }),
  };
});

vi.mock('utils/useLocalstorage', () => {
  const getItemFn = vi.fn((key: string) => {
    if (key === 'id' || key === 'userId') return 'user-1';
    return null;
  });

  return {
    default: () => ({
      getItem: getItemFn,
    }),
  };
});

// ---- DATA ---- //

const USER_ID = 'user-1';

const mockUserData = {
  user: {
    __typename: 'User',
    createdOrganizations: [
      {
        __typename: 'Organization',
        id: '1',
        name: 'Created Org',
        adminsCount: 1,
        membersCount: 5,
        description: 'Created organization description',
        avatarUrl: 'https://example.com/avatar1.png',
      },
    ],
    organizationsWhereMember: {
      __typename: 'OrganizationConnection',
      edges: [
        {
          __typename: 'OrganizationEdge',
          node: {
            __typename: 'Organization',
            id: '2',
            name: 'Belong Org',
            adminsCount: 2,
            membersCount: 3,
            description: 'Belong organization description',
            avatarUrl: 'https://example.com/avatar2.png',
          },
        },
      ],
    },
  },
};

const mockJoinedOrganizationsData = {
  user: {
    __typename: 'User',
    organizationsWhereMember: {
      __typename: 'OrganizationConnection',
      edges: [
        {
          __typename: 'OrganizationEdge',
          node: {
            __typename: 'Organization',
            id: '3',
            name: 'Joined Org',
            adminsCount: 1,
            membersCount: 4,
            description: 'Joined organization description',
            avatarUrl: 'https://example.com/avatar3.png',
          },
        },
      ],
    },
  },
};

vi.mock(
  'shared-components/PeopleTabUserOrganizations/PeopleTabUserOrganizations',
  () => ({
    default: (props: InterfacePeopleTabUserOrganizationProps) => (
      <div data-testid="org-card">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    ),
  }),
);

vi.mock('shared-components/PeopleTabNavbar/PeopleTabNavbar', () => ({
  default: (props: InterfacePeopleTabNavbarProps) => (
    <div>
      {props.search && (
        <input
          data-testid={props.search.inputTestId ?? 'search-input'}
          placeholder={props.search.placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.search?.onSearch(e.target.value)
          }
        />
      )}
      {props.sorting &&
        props.sorting.map((s) => (
          <select
            key={s.title}
            data-testid={s.testIdPrefix}
            value={s.selected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              s.onChange(e.target.value)
            }
          >
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
    </div>
  ),
}));

// Mock @apollo/client with factory function
vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();

  // Create mock function inside the factory
  const mockUseQuery = vi.fn();

  return {
    ...actual,
    useQuery: mockUseQuery,
  };
});

// ---- TESTS ---- //

describe('UserOrganizations', () => {
  let mockUseQuery: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get the mocked useQuery function
    const apolloClient = await import('@apollo/client');
    mockUseQuery = apolloClient.useQuery as ReturnType<typeof vi.fn>;

    // Define interface for query variables
    interface InterfaceUserDetailsVariables {
      input: {
        id: string;
      };
    }

    interface InterfaceJoinedOrgsVariables {
      id: string;
      first: number;
      filter: string;
    }

    // Default mock implementation with proper typing
    mockUseQuery.mockImplementation(
      <TData, TVariables extends OperationVariables>(
        query: DocumentNode,
        options?: QueryHookOptions<TData, TVariables>,
      ) => {
        if (query === USER_DETAILS) {
          const vars = options?.variables as
            | InterfaceUserDetailsVariables
            | undefined;
          if (vars?.input?.id === USER_ID) {
            return {
              data: mockUserData,
              loading: false,
              error: undefined,
              refetch: vi.fn(),
            };
          }
        }

        if (query === USER_JOINED_ORGANIZATIONS_NO_MEMBERS) {
          const vars = options?.variables as
            | InterfaceJoinedOrgsVariables
            | undefined;
          if (vars?.id === USER_ID) {
            return {
              data: mockJoinedOrganizationsData,
              loading: false,
              error: undefined,
              refetch: vi.fn(),
            };
          }
        }

        return {
          data: undefined,
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <UserOrganizations />
      </MemoryRouter>,
    );

  it('renders all organization types', async () => {
    renderComponent();

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.queryByText('Loading organizations...'),
      ).not.toBeInTheDocument();
    });

    // Check all organizations are rendered
    await waitFor(() => {
      expect(screen.getByText('Created Org')).toBeInTheDocument();
      expect(screen.getByText('Belong Org')).toBeInTheDocument();
      expect(screen.getByText('Joined Org')).toBeInTheDocument();
    });
  });

  it('filters organizations by search', async () => {
    renderComponent();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Created Org')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'created');

    await waitFor(() => {
      expect(screen.getByText('Created Org')).toBeInTheDocument();
      expect(screen.queryByText('Belong Org')).not.toBeInTheDocument();
      expect(screen.queryByText('Joined Org')).not.toBeInTheDocument();
    });
  });

  it('filters organizations by type', async () => {
    renderComponent();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Joined Org')).toBeInTheDocument();
    });

    const orgFilter = screen.getByTestId('orgFilter');
    await userEvent.selectOptions(orgFilter, 'JOINED');

    await waitFor(() => {
      expect(screen.getByText('Joined Org')).toBeInTheDocument();
      expect(screen.queryByText('Created Org')).not.toBeInTheDocument();
      expect(screen.queryByText('Belong Org')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no orgs match filter', async () => {
    renderComponent();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Created Org')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'xyz');

    await waitFor(() => {
      expect(screen.getByText('noOrganizationsFound')).toBeInTheDocument();
    });
  });

  it('handles missing user data safely', async () => {
    // Mock empty data - return empty objects instead of null user
    mockUseQuery.mockImplementation((query: DocumentNode) => {
      if (query === USER_DETAILS) {
        return {
          data: {
            user: {
              createdOrganizations: [],
              organizationsWhereMember: { edges: [] },
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }
      if (query === USER_JOINED_ORGANIZATIONS_NO_MEMBERS) {
        return {
          data: {
            user: {
              organizationsWhereMember: { edges: [] },
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }
      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    });

    renderComponent();

    // Wait for the empty state
    await waitFor(() => {
      expect(screen.getByText('noOrganizationsFound')).toBeInTheDocument();
    });
  });

  it('changes sort order when sort option is changed', async () => {
    renderComponent();

    await waitFor(() => {
      const orgsAsc = screen.getAllByRole('heading', { level: 3 });

      expect(orgsAsc).toHaveLength(3);
      // Default sort is ASC, so order should be: Belong, Created, Joined
      expect(orgsAsc[0]).toHaveTextContent('Belong Org');
      expect(orgsAsc[1]).toHaveTextContent('Created Org');
      expect(orgsAsc[2]).toHaveTextContent('Joined Org');
    });

    const orgSort = screen.getByTestId('orgSort');
    await userEvent.selectOptions(orgSort, 'DESC');

    await waitFor(() => {
      const orgsDesc = screen.getAllByRole('heading', { level: 3 });
      expect(orgsDesc).toHaveLength(3);
      // DESC sort order should be: Joined, Created, Belong
      expect(orgsDesc[0]).toHaveTextContent('Joined Org');
      expect(orgsDesc[1]).toHaveTextContent('Created Org');
      expect(orgsDesc[2]).toHaveTextContent('Belong Org');
    });
  });

  it('handles undefined createdOrganizations and joinedOrganizationsData edges', async () => {
    // Mock useQuery to return userData with undefined createdOrganizations
    mockUseQuery.mockImplementation((query: DocumentNode) => {
      if (query === USER_DETAILS) {
        return {
          data: {
            user: {
              createdOrganizations: undefined,
              organizationsWhereMember: undefined, // undefined instead of empty edges
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }
      if (query === USER_JOINED_ORGANIZATIONS_NO_MEMBERS) {
        return {
          data: {
            user: {
              organizationsWhereMember: undefined, // undefined edges
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }
      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    });

    renderComponent();

    // Wait for the empty state text to appear
    await waitFor(() => {
      expect(screen.getByText('noOrganizationsFound')).toBeInTheDocument();
    });
  });
  it('falls back to prop id when state and localStorage are missing', async () => {
    render(
      <MemoryRouter>
        <UserOrganizations id="user-1" />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Created Org')).toBeInTheDocument();
    });

    expect(mockUseQuery).toHaveBeenCalledWith(
      USER_DETAILS,
      expect.objectContaining({
        variables: { input: { id: 'user-1' } },
      }),
    );
  });
  it('shows loading state when both userData.user and joinedOrganizationsData.user are missing', async () => {
    mockUseQuery.mockImplementation((query: DocumentNode) => {
      if (query === USER_DETAILS) {
        return {
          data: {}, // user is undefined
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      if (query === USER_JOINED_ORGANIZATIONS_NO_MEMBERS) {
        return {
          data: {}, // user is undefined
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('loadingOrganizations')).toBeInTheDocument();
    });
  });
  it('falls back to "No Description" when organization description is missing', async () => {
    mockUseQuery.mockImplementation((query: DocumentNode) => {
      if (query === USER_DETAILS) {
        return {
          data: {
            user: {
              createdOrganizations: [
                {
                  id: 'org-no-desc',
                  name: 'Org Without Description',
                  adminsCount: 1,
                  membersCount: 2,
                  description: undefined,
                  avatarURL: '',
                },
              ],
              organizationsWhereMember: { edges: [] },
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      if (query === USER_JOINED_ORGANIZATIONS_NO_MEMBERS) {
        return {
          data: {
            user: {
              organizationsWhereMember: { edges: [] },
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Org Without Description')).toBeInTheDocument();

      // fallback text rendered
      expect(screen.getByText('No Description')).toBeInTheDocument();
    });
  });

  it('falls back to default values for edge organizations', async () => {
    // Mock useQuery to return edge with missing fields
    mockUseQuery.mockImplementation((query: DocumentNode) => {
      if (query === USER_DETAILS) {
        return {
          data: {
            user: {
              createdOrganizations: [],
              organizationsWhereMember: {
                edges: [
                  {
                    node: {
                      id: 'edge-org-1',
                      name: 'Edge Org',
                      adminsCount: undefined, //   missing adminsCount
                      membersCount: undefined, //   missing membersCount
                      description: undefined, //   missing description
                      avatarURL: undefined,
                    },
                  },
                ],
              },
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      if (query === USER_JOINED_ORGANIZATIONS_NO_MEMBERS) {
        return {
          data: {
            user: {
              organizationsWhereMember: { edges: [] },
            },
          },
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        };
      }

      return {
        data: undefined,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
      };
    });

    renderComponent();

    await waitFor(() => {
      // The org should render
      expect(screen.getByText('Edge Org')).toBeInTheDocument();

      // Check fallback description
      expect(screen.getByText('No Description')).toBeInTheDocument();
    });
  });
});
