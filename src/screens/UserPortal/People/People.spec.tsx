import { render, screen, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import type { MockedResponse } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import People from './People';
import userEvent from '@testing-library/user-event';
import { vi, it, beforeEach, afterEach, describe, expect } from 'vitest';
import dayjs from 'dayjs';

const DEFAULT_ORG_ID = 'test-org-id';
const SEARCH_DEBOUNCE_MS = 300;

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

const sharedMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: DEFAULT_ORG_ID })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: sharedMocks.useParams };
});

beforeEach(() => {
  vi.clearAllMocks();
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
  });

  it('performs search using the search button', async () => {
    const user = userEvent.setup();
    renderComponent([defaultQueryMock, adminSearchMock]);
    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toBeInTheDocument();
    });

    const input = screen.getByTestId('searchInput');
    await user.type(input, 'Admin');

    await act(async () => {
      await new Promise((r) => setTimeout(r, SEARCH_DEBOUNCE_MS + 50));
    });

    await waitFor(() => {
      expect(screen.getByTestId('people-name-2')).toHaveTextContent(
        'Admin User',
      );
      expect(screen.queryByTestId('people-name-1')).not.toBeInTheDocument();
    });
  });

  it('filters by Admins mode with server-side filtering', async () => {
    renderComponent([defaultQueryMock, adminFilterMock]);
    await waitFor(() => {
      expect(screen.getByTestId('people-name-1')).toBeInTheDocument();
    });

    const filterDropdown = screen.getByTestId('modeChangeBtn');
    await userEvent.click(filterDropdown);

    const adminOption = screen.getByTestId('1');
    await userEvent.click(adminOption);

    await waitFor(() => {
      expect(screen.getByTestId('people-name-2')).toHaveTextContent(
        'Admin User',
      );
      expect(screen.queryByTestId('people-name-1')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no members found', async () => {
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

    renderComponent([emptyMock]);

    await waitFor(() => {
      expect(screen.getByText('Nothing to show here')).toBeInTheDocument();
    });
  });

  it('handles GraphQL errors correctly', async () => {
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

    renderComponent([errorMock]);

    await waitFor(() => {
      expect(screen.getByTestId('cursor-pagination-error')).toBeInTheDocument();
      expect(screen.getByText('GraphQL error occurred')).toBeInTheDocument();
    });
  });

  it('displays member role correctly', async () => {
    renderComponent([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByTestId('people-role-1')).toHaveTextContent('Member');
      expect(screen.getByTestId('people-role-2')).toHaveTextContent('Admin');
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
});
