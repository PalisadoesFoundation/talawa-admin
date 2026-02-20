import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import People from './People';
import userEvent from '@testing-library/user-event';
import { vi, it, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface InterfaceMemberEdgeProps {
  cursor?: string;
  id?: string;
  name?: string;
  role?: string;
  avatarURL?: string | null;
  emailAddress?: string | null;
}

const memberEdge = (props: InterfaceMemberEdgeProps = {}) => ({
  cursor: props.cursor || 'cursor1',
  node: {
    id: props.id || 'user-1',
    name: props.name || 'User 1',
    role: props.role || 'member',
    avatarURL: props.avatarURL ?? null,
    emailAddress:
      'emailAddress' in props ? props.emailAddress : 'user1@example.com',
    createdAt: dayjs.utc().subtract(1, 'year').month(2).toISOString(),
  },
});

const makeQueryVars = (overrides = {}) => ({
  orgId: '',
  where: undefined,
  first: 10,
  after: null,
  ...overrides,
});

const defaultMembersEdges = [
  memberEdge({
    cursor: 'cursor1',
    id: '1',
    name: 'Test User',
    role: 'member',
    emailAddress: 'test@example.com',
  }),
  memberEdge({
    cursor: 'cursor2',
    id: '2',
    name: 'Admin User',
    role: 'administrator',
    emailAddress: 'admin@example.com',
  }),
  memberEdge({
    cursor: 'cursor3',
    id: '3',
    name: 'User Custom Role',
    role: 'member',
    emailAddress: null,
  }),
];

const defaultQueryMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: defaultMembersEdges,
          pageInfo: {
            endCursor: 'cursor3',
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

const loadMoreEdges = [
  memberEdge({
    cursor: 'cursor4',
    id: '4',
    name: 'Extra User',
    role: 'member',
    emailAddress: 'extra@example.com',
  }),
];

const loadMoreMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({ after: 'cursor3' }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: loadMoreEdges,
          pageInfo: {
            endCursor: 'cursor4',
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'cursor4',
          },
        },
      },
    },
  },
};

const adminModeMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({
      where: { role: { equal: 'administrator' } },
    }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            memberEdge({
              cursor: 'cursor2',
              id: '2',
              name: 'Admin User',
              role: 'administrator',
              emailAddress: 'admin@example.com',
            }),
          ],
          pageInfo: {
            endCursor: 'cursor2',
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'cursor2',
          },
        },
      },
    },
  },
};

const emptyMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [],
          pageInfo: {
            endCursor: null,
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
          },
        },
      },
    },
  },
};

const nullEmailMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            memberEdge({
              cursor: 'cursor1',
              id: 'user-null-email',
              name: 'Test User No Email',
              role: 'member',
              emailAddress: null,
            }),
          ],
          pageInfo: {
            endCursor: 'cursor1',
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

const avatarMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            memberEdge({
              cursor: 'cursor1',
              id: '1',
              name: 'User With Avatar',
              role: 'member',
              emailAddress: 'avatar@example.com',
              avatarURL: 'https://example.com/avatar.jpg',
            }),
            memberEdge({
              cursor: 'cursor2',
              id: '2',
              name: 'User Without Avatar',
              role: 'member',
              emailAddress: 'noavatar@example.com',
              avatarURL: null,
            }),
          ],
          pageInfo: {
            endCursor: 'cursor2',
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

const sharedMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: '' })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: sharedMocks.useParams,
  };
});

const setMatchMediaStub = (): void => {
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
};

let user: ReturnType<typeof userEvent.setup>;
beforeEach(() => {
  vi.restoreAllMocks();
  user = userEvent.setup();
  sharedMocks.useParams.mockReturnValue({ orgId: '' });
  setMatchMediaStub();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  sharedMocks.useParams.mockReturnValue({ orgId: '' });
});

const renderPeople = (mocks: MockedResponse[]) => {
  return render(
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
};

describe('People Screen [User Portal]', () => {
  it('renders members correctly', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', async () => {
    renderPeople([defaultQueryMock]);

    expect(screen.getByTestId('cursor-pagination-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('displays role labels correctly', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      // Admin User should have 'Admin' role label
      expect(screen.getByTestId('people-row-2')).toHaveTextContent('Admin');
      // Test User should have 'Member' role label
      expect(screen.getByTestId('people-row-1')).toHaveTextContent('Member');
    });
  });

  it('displays email addresses correctly', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });
  });

  it('displays emailNotAvailable when email is null', async () => {
    renderPeople([nullEmailMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User No Email')).toBeInTheDocument();
      expect(screen.getByText('Email not available')).toBeInTheDocument();
    });
  });

  it('renders avatar image when avatarURL is provided', async () => {
    renderPeople([avatarMock]);

    await waitFor(() => {
      const img = screen.getByAltText('User With Avatar');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });
  });

  it('renders Avatar component when avatarURL is null', async () => {
    renderPeople([avatarMock]);

    await waitFor(() => {
      expect(screen.getByText('User Without Avatar')).toBeInTheDocument();
      expect(screen.getByTestId('people-row-2')).toBeInTheDocument();
    });
  });

  it('shows empty state when no members', async () => {
    renderPeople([emptyMock]);

    await waitFor(() => {
      expect(screen.getByText('Nothing to show here')).toBeInTheDocument();
    });
  });
});

describe('People Screen Search [User Portal]', () => {
  it('filters members by name (client-side)', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('searchInput'), 'Admin');

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('filters members by email (client-side)', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('searchInput'), 'test@example');

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
    });
  });

  it('clears search input and shows all members', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchInput');
    await user.type(searchInput, 'Test');
    expect(searchInput).toHaveValue('Test');

    const clearBtn = screen.getByLabelText('Clear');
    await user.click(clearBtn);

    expect(searchInput).toHaveValue('');

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  it('handles search with enter key', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('searchInput'), 'Admin{enter}');

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });
});

describe('People Screen Mode Switch [User Portal]', () => {
  it('switches to Admins mode and refetches with where filter', async () => {
    renderPeople([defaultQueryMock, adminModeMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  it('switches back to All Members mode', async () => {
    renderPeople([defaultQueryMock, adminModeMock, defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-0'));

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});

describe('People Screen Load More [User Portal]', () => {
  it('loads more members when Load More is clicked', async () => {
    renderPeople([defaultQueryMock, loadMoreMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('load-more-button'));

    await waitFor(() => {
      expect(screen.getByText('Extra User')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});

describe('People Screen Keyboard Accessibility [User Portal]', () => {
  it('search input is focusable via Tab', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchInput');
    await user.tab();

    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });
  });

  it('table has correct ARIA roles', async () => {
    renderPeople([defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader').length).toBeGreaterThanOrEqual(
        4,
      );
      expect(screen.getAllByRole('row').length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByRole('cell').length).toBeGreaterThanOrEqual(4);
    });
  });

  it('Load More button has accessible aria-label and is keyboard activatable', async () => {
    renderPeople([defaultQueryMock, loadMoreMock]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    await waitFor(() => {
      const btn = screen.getByTestId('load-more-button');
      expect(btn).toHaveAttribute('aria-label');
    });

    const loadMoreBtn = screen.getByTestId('load-more-button');
    loadMoreBtn.focus();

    await waitFor(() => {
      expect(loadMoreBtn).toHaveFocus();
    });

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Extra User')).toBeInTheDocument();
    });
  });
});

describe('People Screen Error States [User Portal]', () => {
  it('displays error state when initial query fails', async () => {
    const errorMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: makeQueryVars(),
      },
      error: new Error('Network error'),
    };

    renderPeople([errorMock]);

    await waitFor(() => {
      expect(screen.getByTestId('cursor-pagination-error')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('displays retry button on query failure', async () => {
    const errorMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: makeQueryVars(),
      },
      error: new Error('Server error'),
    };

    renderPeople([errorMock, defaultQueryMock]);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });
  });

  it('handles rapid mode switching without errors', async () => {
    renderPeople([
      defaultQueryMock,
      adminModeMock,
      defaultQueryMock,
      adminModeMock,
    ]);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-0'));

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});
