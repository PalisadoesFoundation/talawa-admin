import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { vi, afterEach, describe, test, expect } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';

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
                props.dropdowns?.[0]?.onOptionChange?.('invalid');
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

const FIXED_DATE_TIMESTAMP = 1672531200000;
const FIXED_DATE = dayjs(FIXED_DATE_TIMESTAMP);

let originalLocation: Location;
let client: ApolloClient<unknown>;

const renderComponent = (
  link: StaticMockLink,
  initialEntries: (string | Partial<Location>)[] = ['/admin/orgpeople/orgid'],
) => {
  return render(
    <MockedProvider
      link={link}
      cache={client.cache as unknown as InMemoryCache}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <I18nextProvider i18n={i18nForTest}>
          <Routes>
            <Route
              path="/admin/orgpeople/:orgId"
              element={<OrganizationPeople />}
            />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

const PAGE_SIZE = 10;

const createMemberConnectionMock = (
  variables: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
) => {
  const defaultData = {
    organization: {
      members: {
        edges: [
          {
            node: {
              id: 'member1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
              avatarURL: 'https://example.com/avatar1.jpg',
              createdAt: FIXED_DATE.subtract(3, 'day').toISOString(),
              role: 'member',
            },
            cursor: 'cursor1',
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

  const data = JSON.parse(JSON.stringify(defaultData)); // Deep copy
  if (overrides.edges) {
    data.organization.members.edges = overrides.edges;
  }
  if (overrides.pageInfo) {
    data.organization.members.pageInfo = {
      ...data.organization.members.pageInfo,
      ...overrides.pageInfo,
    };
  }

  return {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        first: PAGE_SIZE, // Ensure strictly 10
        after: null,
        last: null,
        before: null,
        where: undefined,
        ...variables,
      },
    },
    result: {
      data,
    },
  };
};

describe('OrganizationPeople', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(FIXED_DATE.toDate());

    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/',
        assign: vi.fn(),
        reload: vi.fn(),
        pathname: '/',
        search: '',
        hash: '',
        origin: 'http://localhost',
        state: null,
      },
      writable: true,
    });

    client = new ApolloClient({
      cache: new InMemoryCache({ addTypename: false }),
    });
  });

  afterEach(async () => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    await client.clearStore();
    vi.useRealTimers();
    cleanup();
    vi.restoreAllMocks();
  });

  test('renders loading state initially', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link);
  });

  test('displays members list correctly', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link);
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  test('handles search functionality correctly', async () => {
    const user = userEvent.setup({ delay: null });
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });

    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const searchMock = createMemberConnectionMock(
      { orgId: 'orgid', where: { name: 'Jane' } },
      {
        edges: [
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: FIXED_DATE.toISOString(),
              role: 'member',
            },
            cursor: 'cursor2',
          },
        ],
      },
    );
    // When search is cleared, we refetch initial
    const clearMock = createMemberConnectionMock({ orgId: 'orgid' });

    const link = new StaticMockLink([initialMock, searchMock, clearMock], true);

    renderComponent(link);
    vi.useFakeTimers({ toFake: ['Date'] });

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument(),
    );

    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    const searchInput = screen.getByTestId('member-search-input');
    await user.type(searchInput, 'Jane');

    await act(async () => {
      vi.advanceTimersByTime(400); // Debounce
    });

    vi.useFakeTimers({ toFake: ['Date'] });
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('handles pagination correctly via server-side cursors', async () => {
    // Page 1
    const page1Mock = createMemberConnectionMock(
      { orgId: 'orgid' },
      {
        pageInfo: { hasNextPage: true, endCursor: 'cursor1' },
      },
    );

    // Page 2 (triggered by click next)
    const page2Mock = createMemberConnectionMock(
      { orgId: 'orgid', after: 'cursor1' },
      {
        edges: [
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: FIXED_DATE.toISOString(),
              role: 'member',
            },
            cursor: 'cursor2',
          },
        ],
        pageInfo: { hasNextPage: false, endCursor: 'cursor2' },
      },
    );

    const link = new StaticMockLink([page1Mock, page2Mock], true);
    const user = userEvent.setup({ delay: null });

    renderComponent(link);

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument(),
    );

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).toBeEnabled();

    await user.click(nextBtn);

    await waitFor(() =>
      expect(screen.getByText('Jane Smith')).toBeInTheDocument(),
    );
  });
});
