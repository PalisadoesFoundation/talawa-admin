import { act, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import People from './People';
import userEvent from '@testing-library/user-event';
import { vi, it, beforeEach, afterEach, describe, expect } from 'vitest';
import dayjs from 'dayjs';

const DEFAULT_ORG_ID = 'test-org-id';
const MODE_ADMINS = 1;

const memberNode = (id: string, name: string, role = 'member') => ({
  id,
  name,
  role,
  avatarURL: null,
  emailAddress: `${id}@example.com`,
  createdAt: dayjs().toISOString(),
});

const defaultMembersEdges = [
  { cursor: 'cur1', node: memberNode('1', 'Test User') },
  { cursor: 'cur2', node: memberNode('2', 'Admin User', 'administrator') },
];

const defaultQueryMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: DEFAULT_ORG_ID,
      first: 10,
      after: null,
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: defaultMembersEdges,
          pageInfo: {
            endCursor: 'cur2',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cur1',
          },
        },
      },
    },
  },
};

const loadMoreMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: DEFAULT_ORG_ID,
      first: 10,
      after: 'cur2',
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [{ cursor: 'cur3', node: memberNode('3', 'Page 2 User') }],
          pageInfo: {
            endCursor: 'cur3',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cur3',
          },
        },
      },
    },
  },
};

const adminSearchMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: DEFAULT_ORG_ID,
      where: { firstName: { contains: 'Admin' } },
      first: 10,
      after: null,
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            {
              cursor: 'cur2',
              node: memberNode('2', 'Admin User', 'administrator'),
            },
          ],
          pageInfo: {
            endCursor: 'cur2',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cur2',
          },
        },
      },
    },
  },
};

const adminFilterMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: DEFAULT_ORG_ID,
      first: 10,
      after: null,
      where: { role: { equal: 'administrator' } },
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            {
              cursor: 'cur2',
              node: memberNode('2', 'Admin User', 'administrator'),
            },
          ],
          pageInfo: {
            endCursor: 'cur2',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cur2',
          },
        },
      },
    },
  },
};

const emptyMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: DEFAULT_ORG_ID,
      first: 10,
      after: null,
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
          },
        },
      },
    },
  },
};

const errorMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: DEFAULT_ORG_ID,
      first: 10,
      after: null,
    },
  },
  error: new Error('GraphQL error occurred'),
};

const sharedMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: DEFAULT_ORG_ID })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: sharedMocks.useParams };
});

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('People Component Tests', () => {
  const renderComponent = (mocks: MockedResponse[]) =>
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

  it('renders members and handles loading state', async () => {
    renderComponent([defaultQueryMock]);
    // CursorPaginationManager's stable public API test ID (see CursorPaginationManager.spec.tsx)
    expect(screen.getByTestId('cursor-pagination-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toHaveTextContent(
        'Test User',
      );
    });
  });

  it('displays all members initially', async () => {
    renderComponent([defaultQueryMock]);
    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toHaveTextContent(
        'Test User',
      );
      expect(screen.getByTestId('people-name-2')).toHaveTextContent(
        'Admin User',
      );
    });
  });

  it('handles load more functionality', async () => {
    renderComponent([defaultQueryMock, loadMoreMock]);
    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toBeInTheDocument();
    });

    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    await userEvent.click(loadMoreBtn);

    await waitFor(() => {
      expect(screen.getByTestId('people-name-3')).toHaveTextContent(
        'Page 2 User',
      );
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /load more/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('performs search via debounced input', async () => {
    renderComponent([defaultQueryMock, adminSearchMock]);

    await screen.findByTestId('people-name-1');

    const input = screen.getByTestId('searchInput');
    await userEvent.type(input, 'Admin');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('people-name-2')).toHaveTextContent(
          'Admin User',
        );
        expect(screen.queryByTestId('people-name-1')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('filters by Admins mode with server-side filtering', async () => {
    renderComponent([defaultQueryMock, adminFilterMock]);
    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toBeInTheDocument();
    });

    const filterDropdown = screen.getByTestId('modeChangeBtn');
    await userEvent.click(filterDropdown);

    const adminOption = screen.getByTestId(`${MODE_ADMINS}`);
    await userEvent.click(adminOption);

    await waitFor(() => {
      expect(screen.getByTestId('people-name-2')).toHaveTextContent(
        'Admin User',
      );
      expect(screen.queryByTestId('people-name-1')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no members found', async () => {
    renderComponent([emptyMock]);

    await waitFor(() => {
      expect(screen.getByText(/nothing to show/i)).toBeInTheDocument();
    });
  });

  it('handles GraphQL errors correctly', async () => {
    renderComponent([errorMock]);

    await waitFor(() => {
      // CursorPaginationManager's stable public API test ID (see CursorPaginationManager.spec.tsx)
      expect(screen.getByTestId('cursor-pagination-error')).toBeInTheDocument();
      expect(screen.getByText('GraphQL error occurred')).toBeInTheDocument();
    });
  });

  it('displays member role correctly', async () => {
    renderComponent([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByTestId('people-role-1')).toHaveTextContent('Member');
      expect(screen.getByTestId('people-role-2')).toHaveTextContent('ADMIN');
    });
  });

  it('displays email addresses correctly', async () => {
    renderComponent([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByTestId('people-email-1')).toHaveTextContent(
        '1@example.com',
      );
      expect(screen.getByTestId('people-email-2')).toHaveTextContent(
        '2@example.com',
      );
    });
  });

  it('renders Avatar placeholder when avatarURL is null', async () => {
    renderComponent([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toBeInTheDocument();
    });

    const allImages = screen.getAllByRole('img');
    const avatarImages = allImages.filter((img) =>
      img.getAttribute('src')?.includes('data:image/svg+xml'),
    );

    expect(avatarImages).toHaveLength(2);

    expect(
      avatarImages.some((img) =>
        img.getAttribute('alt')?.includes('Test User'),
      ),
    ).toBe(true);
    expect(
      avatarImages.some((img) =>
        img.getAttribute('alt')?.includes('Admin User'),
      ),
    ).toBe(true);
  });

  it('combines search and admin filter simultaneously', async () => {
    const searchAdminMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          orgId: DEFAULT_ORG_ID,
          where: {
            firstName: { contains: 'Admin' },
            role: { equal: 'administrator' },
          },
          first: 10,
          after: null,
        },
      },
      result: {
        data: {
          organization: {
            members: {
              edges: [
                {
                  cursor: 'cur2',
                  node: memberNode('2', 'Admin User', 'administrator'),
                },
              ],
              pageInfo: {
                endCursor: 'cur2',
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: 'cur2',
              },
            },
          },
        },
      },
    };

    renderComponent([defaultQueryMock, adminFilterMock, searchAdminMock]);

    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toBeInTheDocument();
    });

    const filterDropdown = screen.getByTestId('modeChangeBtn');
    await userEvent.click(filterDropdown);

    const adminOption = screen.getByTestId(`${MODE_ADMINS}`);
    await userEvent.click(adminOption);

    await waitFor(() => {
      expect(screen.getByTestId('people-name-2')).toBeInTheDocument();
    });

    const input = screen.getByTestId('searchInput');
    await userEvent.type(input, 'Admin');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('people-name-2')).toHaveTextContent(
          'Admin User',
        );
      },
      { timeout: 2000 },
    );
  });
});
