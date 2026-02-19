import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, type MockedResponse } from '@apollo/react-testing';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { vi, afterEach, beforeEach } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { languages } from 'utils/languages';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceSearchFilterBarAdvanced } from 'types/shared-components/SearchFilterBar/interface';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock('./addMember/AddMember', () => ({
  default: () => (
    <button type="button" data-testid="add-member-button">
      Add Member
    </button>
  ),
}));

vi.mock(
  'shared-components/SearchFilterBar/SearchFilterBar',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('shared-components/SearchFilterBar/SearchFilterBar')
      >();
    return {
      default: (props: React.ComponentProps<typeof actual.default>) => (
        <>
          <actual.default {...props} />
          <button
            type="button"
            data-testid="trigger-invalid-sort"
            onClick={() => {
              if (props.hasDropdowns) {
                (
                  props as InterfaceSearchFilterBarAdvanced
                ).dropdowns?.[0]?.onOptionChange?.('invalid');
              }
            }}
          >
            Invalid Sort
          </button>
        </>
      ),
    };
  },
);

interface InterfaceMemberEdgeProps {
  cursor?: string;
  id?: string;
  name?: string;
  role?: string;
  avatarURL?: string | null;
  emailAddress?: string | null;
  createdAt?: string;
}

const memberEdge = (props: InterfaceMemberEdgeProps = {}) => ({
  cursor: props.cursor || 'cursor1',
  node: {
    id: props.id || 'member1',
    name: props.name || 'John Doe',
    role: props.role || 'member',
    avatarURL: props.avatarURL ?? null,
    emailAddress:
      'emailAddress' in props ? props.emailAddress : 'john@example.com',
    createdAt:
      'createdAt' in props
        ? props.createdAt
        : dayjs.utc().subtract(3, 'day').toISOString(),
  },
});

const makeMemberQueryVars = (overrides = {}) => ({
  orgId: 'orgid',
  where: undefined,
  first: 10,
  after: null,
  ...overrides,
});

const makeUserQueryVars = (overrides = {}) => ({
  first: 10,
  after: null,
  ...overrides,
});

const defaultMemberEdges = [
  memberEdge({
    cursor: 'cursor1',
    id: 'member1',
    name: 'John Doe',
    role: 'member',
    emailAddress: 'john@example.com',
    avatarURL: 'https://example.com/avatar1.jpg',
    createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
  }),
  memberEdge({
    cursor: 'cursor2',
    id: 'member2',
    name: 'Jane Smith',
    role: 'member',
    emailAddress: 'jane@example.com',
    avatarURL: null,
    createdAt: dayjs.utc().subtract(2, 'day').toISOString(),
  }),
];

const defaultMemberMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeMemberQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: defaultMemberEdges,
          pageInfo: {
            endCursor: 'cursor2',
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

const adminMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeMemberQueryVars({
      where: { role: { equal: 'administrator' } },
    }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            memberEdge({
              cursor: 'adminCursor1',
              id: 'admin1',
              name: 'Admin User',
              role: 'administrator',
              emailAddress: 'admin@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
            }),
          ],
          pageInfo: {
            endCursor: 'adminCursor1',
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'adminCursor1',
          },
        },
      },
    },
  },
};

const userEdges = [
  memberEdge({
    cursor: 'userCursor1',
    id: 'user1',
    name: 'User One',
    role: 'member',
    emailAddress: 'user1@example.com',
    avatarURL: 'https://example.com/avatar1.jpg',
    createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
  }),
  memberEdge({
    cursor: 'userCursor2',
    id: 'user2',
    name: 'User Two',
    role: 'member',
    emailAddress: 'user2@example.com',
    avatarURL: null,
    createdAt: dayjs.utc().subtract(2, 'day').toISOString(),
  }),
];

const usersMock = {
  request: {
    query: USER_LIST_FOR_TABLE,
    variables: makeUserQueryVars(),
  },
  result: {
    data: {
      allUsers: {
        edges: userEdges,
        pageInfo: {
          endCursor: 'userCursor2',
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: 'userCursor1',
        },
      },
    },
  },
};

const emptyMemberMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeMemberQueryVars(),
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

const loadMoreEdges = [
  memberEdge({
    cursor: 'cursor3',
    id: 'member3',
    name: 'Extra Member',
    role: 'member',
    emailAddress: 'extra@example.com',
    createdAt: dayjs.utc().subtract(1, 'day').toISOString(),
  }),
];

const loadMoreMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeMemberQueryVars({ after: 'cursor2' }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: loadMoreEdges,
          pageInfo: {
            endCursor: 'cursor3',
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'cursor3',
          },
        },
      },
    },
  },
};

const SEARCH_DEBOUNCE_MS = 300;

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.clearAllMocks();
  user = userEvent.setup();
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderOrgPeople = (
  mocks: MockedResponse[],
  initialEntries: Array<string | { pathname: string; state?: unknown }> = [
    '/admin/orgpeople/orgid',
  ],
) => {
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={initialEntries}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/admin/orgpeople/:orgId"
                element={<OrganizationPeople />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('OrganizationPeople', () => {
  it('renders loading state initially', async () => {
    renderOrgPeople([defaultMemberMock]);
    expect(screen.getByTestId('cursor-pagination-loading')).toBeInTheDocument();
    await wait();
  });

  it('displays members list correctly', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays joined dates correctly', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    });
    const expectedDate1 = dateFormatter.format(
      dayjs.utc().subtract(3, 'day').toDate(),
    );

    expect(screen.getByTestId('org-people-joined-member1')).toHaveTextContent(
      `Joined : ${expectedDate1}`,
    );
  });

  it('renders avatar image when avatarURL is provided', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar1.jpg');
    expect(img).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('renders Avatar component when avatarURL is null', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByTestId('org-people-row-member2')).toBeInTheDocument();
  });

  it('renders member name as link to profile', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    const link = screen.getByText('John Doe').closest('a');
    expect(link).toHaveAttribute('href', '/admin/member/orgid/member1');
  });

  it('shows empty state when no members', async () => {
    renderOrgPeople([emptyMemberMock]);
    await wait();

    expect(
      screen.getByTestId('organization-people-empty-state'),
    ).toBeInTheDocument();
  });
});

describe('OrganizationPeople Search', () => {
  it('filters members by name (client-side)', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    await user.type(screen.getByTestId('member-search-input'), 'Jane');
    await wait(SEARCH_DEBOUNCE_MS);

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('filters members by email (client-side)', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    await user.type(screen.getByTestId('member-search-input'), 'john@example');
    await wait(SEARCH_DEBOUNCE_MS);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('clears search and shows all members', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    const searchInput = screen.getByTestId('member-search-input');
    await user.type(searchInput, 'John');
    expect(searchInput).toHaveValue('John');

    const clearBtn = screen.getByLabelText('Clear');
    await user.click(clearBtn);

    expect(searchInput).toHaveValue('');
    await wait(SEARCH_DEBOUNCE_MS);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});

describe('OrganizationPeople Tab Switching', () => {
  it('switches to admin tab and shows admin data', async () => {
    renderOrgPeople([defaultMemberMock, adminMock]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await user.click(screen.getByTestId('sort-toggle'));
    await user.click(screen.getByText(/admin/i));
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  it('switches to users tab and shows user data', async () => {
    renderOrgPeople([defaultMemberMock, usersMock]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await user.click(screen.getByTestId('sort-toggle'));
    await user.click(screen.getByText(/users/i));
    await wait();

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();
    });
  });

  it('switches between all tabs: members → admins → users → members', async () => {
    renderOrgPeople([
      defaultMemberMock,
      adminMock,
      usersMock,
      defaultMemberMock,
    ]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // → Admins
    await user.click(screen.getByTestId('sort-toggle'));
    await user.click(screen.getByText(/admin/i));
    await wait();
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // → Users
    await user.click(screen.getByTestId('sort-toggle'));
    await user.click(screen.getByText(/users/i));
    await wait();
    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });

    // → Members
    await user.click(screen.getByTestId('sort-toggle'));
    await user.click(screen.getByText(/members/i));
    await wait();
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

describe('OrganizationPeople Load More', () => {
  it('loads more members when Load More is clicked', async () => {
    renderOrgPeople([defaultMemberMock, loadMoreMock]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const loadMoreBtn = screen.getByTestId('load-more-button');
    expect(loadMoreBtn).toBeInTheDocument();

    await user.click(loadMoreBtn);
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Extra Member')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

describe('OrganizationPeople Remove Member', () => {
  it('opens and uses remove member modal', async () => {
    const removeMemberMock = {
      request: {
        query: REMOVE_MEMBER_MUTATION_PG,
        variables: { organizationId: 'orgid', memberId: 'member1' },
      },
      result: {
        data: {
          removeMember: { id: 1 },
        },
      },
    };

    renderOrgPeople([defaultMemberMock, removeMemberMock]);
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const deleteButtons = screen.getAllByTestId('removeMemberModalBtn');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('removeMemberModal')).toBeInTheDocument();
    });

    const removeBtn = screen.getByTestId('removeMemberBtn');
    await user.click(removeBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('disables delete button on users tab', async () => {
    renderOrgPeople([defaultMemberMock, usersMock]);
    await wait();

    await user.click(screen.getByTestId('sort-toggle'));
    await user.click(screen.getByText(/users/i));
    await wait();

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTestId('removeMemberModalBtn');
    deleteButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});

describe('OrganizationPeople Location State', () => {
  it('uses initial tab from location.state.role when provided', async () => {
    renderOrgPeople(
      [adminMock],
      [{ pathname: '/admin/orgpeople/orgid', state: { role: 1 } }],
    );
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('falls back to members when location.state.role is invalid', async () => {
    renderOrgPeople(
      [defaultMemberMock],
      [{ pathname: '/admin/orgpeople/orgid', state: { role: 99 } }],
    );
    await wait();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});

describe('OrganizationPeople Sort Fallback', () => {
  it('handleSortChange falls back to state 0 for invalid option', async () => {
    renderOrgPeople([defaultMemberMock]);
    await wait();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const invalidSortButton = screen.getByTestId('trigger-invalid-sort');
    await user.click(invalidSortButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

describe('OrganizationPeople Date Locale', () => {
  it('uses en-US locale when language is not in languages list', async () => {
    const originalLanguage = i18nForTest.language;
    const originalSupported = [
      ...(i18nForTest.options.supportedLngs as string[]),
    ];
    const fixedCreatedAt = dayjs
      .utc()
      .year(2020)
      .month(0)
      .date(15)
      .toISOString();

    try {
      await i18nForTest.changeLanguage('en');
      i18nForTest.options.supportedLngs = [...originalSupported, 'xx'];
      await i18nForTest.changeLanguage('xx');

      const mockWithFixedDate = {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: makeMemberQueryVars(),
        },
        result: {
          data: {
            organization: {
              members: {
                edges: [
                  memberEdge({
                    cursor: 'cursor1',
                    id: 'member1',
                    name: 'John Doe',
                    emailAddress: 'john@example.com',
                    avatarURL: 'https://example.com/avatar1.jpg',
                    createdAt: fixedCreatedAt,
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

      renderOrgPeople([mockWithFixedDate]);
      await wait();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const expectedEnUSDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(fixedCreatedAt));

      const joinedEl = screen.getByTestId('org-people-joined-member1');
      expect(joinedEl).toHaveTextContent(`Joined : ${expectedEnUSDate}`);
    } finally {
      i18nForTest.options.supportedLngs = originalSupported;
      await i18nForTest.changeLanguage(originalLanguage);
    }
  });

  it('processes rows when createdAt is missing', async () => {
    const mockWithMissingDate = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: makeMemberQueryVars(),
      },
      result: {
        data: {
          organization: {
            members: {
              edges: [
                memberEdge({
                  cursor: 'cursor1',
                  id: 'member-no-date',
                  name: 'Member No Date',
                  emailAddress: 'nodate@example.com',
                  createdAt: undefined as unknown as string,
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

    renderOrgPeople([mockWithMissingDate]);
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Member No Date')).toBeInTheDocument();
    });

    const joinedEl = screen.getByTestId('org-people-joined-member-no-date');
    expect(joinedEl).toBeInTheDocument();

    const currentLang = languages.find(
      (lang: { code: string; country_code: string }) =>
        lang.code === i18nForTest.language,
    );
    const locale = currentLang
      ? `${currentLang.code}-${currentLang.country_code}`
      : 'en-US';
    const todayFormatted = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(new Date());

    expect(joinedEl.textContent ?? '').toContain(todayFormatted);
  });
});
