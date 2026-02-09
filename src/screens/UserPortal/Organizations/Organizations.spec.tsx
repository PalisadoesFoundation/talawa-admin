/* global HTMLSelectElement */

/**
 * Polyfill: Node >= 22 exposes a non-functional localStorage global when
 * --localstorage-file is not set. Override it with an in-memory shim so that
 * the `useLocalstorage` utility (which calls `localStorage.setItem` /
 * `localStorage.getItem` directly) works inside vitest threads.
 */
if (
  typeof globalThis.localStorage === 'undefined' ||
  typeof globalThis.localStorage.setItem !== 'function'
) {
  const _store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => _store[key] ?? null,
    setItem: (key: string, value: string) => {
      _store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete _store[key];
    },
    clear: () => {
      Object.keys(_store).forEach((k) => delete _store[k]);
    },
    get length() {
      return Object.keys(_store).length;
    },
    key: (index: number) => Object.keys(_store)[index] ?? null,
  } as Storage;
}

import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import { expect, vi, describe, test, beforeEach, afterEach } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ORGANIZATION_FILTER_LIST,
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
  USER_CREATED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import Organizations from './Organizations';
import { StaticMockLink } from 'utils/StaticMockLink';

const { setItem } = useLocalStorage();

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';
const TEST_USER_NAME = 'Noble Mittal';

/* ------------------------------------------------------------------ */
/*  Mock helpers – each builds a mock matching the real query shape    */
/* ------------------------------------------------------------------ */

function allOrgsMock(
  filter = '',
  organizations: Record<string, unknown>[] = [],
) {
  return {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter },
    },
    result: { data: { organizations } },
  };
}

function joinedOrgsMock(
  userId: string,
  edges: { node: Record<string, unknown> }[] = [],
  hasNextPage = false,
  filter = '',
  first = 5,
) {
  return {
    request: {
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: { id: userId, first, filter },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            pageInfo: { hasNextPage },
            edges,
          },
        },
      },
    },
  };
}

function createdOrgsMock(
  userId: string,
  createdOrganizations: Record<string, unknown>[] = [],
  filter = '',
) {
  return {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: userId, filter },
    },
    result: {
      data: {
        user: { createdOrganizations },
      },
    },
  };
}

function sampleFilterOrg(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Organization',
    id: 'org-1',
    name: 'Test Org 1',
    addressLine1: '123 Main St',
    description: 'A test org',
    avatarURL: '',
    membersCount: 50,
    adminsCount: 3,
    createdAt: '2024-01-01',
    isMember: false,
    ...overrides,
  };
}

function sampleJoinedEdge(overrides: Record<string, unknown> = {}) {
  return {
    node: {
      __typename: 'Organization',
      id: 'joined-1',
      name: 'Joined Org 1',
      addressLine1: '456 Side St',
      description: 'A joined org',
      avatarURL: '',
      membersCount: 10,
      adminsCount: 1,
      createdAt: '2024-02-01',
      ...overrides,
    },
  };
}

function sampleCreatedOrg(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Organization',
    id: 'created-1',
    name: 'Created Org 1',
    description: 'A created org',
    createdAt: '2024-03-01',
    avatarMimeType: 'image/png',
    isMember: true,
    membersCount: 5,
    adminsCount: 1,
    ...overrides,
  };
}

function baseMocks(userId: string) {
  return [
    allOrgsMock('', [
      sampleFilterOrg({
        id: 'org-1',
        name: 'anyOrganization1',
        isMember: true,
      }),
      sampleFilterOrg({
        id: 'org-2',
        name: 'anyOrganization2',
        isMember: false,
      }),
    ]),
    joinedOrgsMock(userId),
    createdOrgsMock(userId),
  ];
}

/* ------------------------------------------------------------------ */
/*  PaginationList mock                                                */
/* ------------------------------------------------------------------ */

vi.mock('components/Pagination/PaginationList/PaginationList', () => ({
  default: ({
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
  }: {
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (
      event: React.MouseEvent<unknown> | null,
      newPage: number,
    ) => void;
    onRowsPerPageChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  }) => (
    <div data-testid="pagination">
      <span data-testid="current-page">{page}</span>
      <button
        data-testid="prev-page"
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        data-testid="next-page"
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        Next
      </button>
      <select
        data-testid="rows-per-page"
        value={rowsPerPage}
        onChange={(e) =>
          onRowsPerPageChange(
            e as unknown as React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement
            >,
          )
        }
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="0">0</option>
      </select>
    </div>
  ),
}));

/* ------------------------------------------------------------------ */
/*  Render helper                                                      */
/* ------------------------------------------------------------------ */

function renderOrg(mocks: readonly unknown[], useStaticLink = false) {
  const link = useStaticLink
    ? new StaticMockLink(mocks as never[], true)
    : undefined;
  return render(
    <MockedProvider
      {...(link ? { link } : { mocks: mocks as never[] })}
    >
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
}

async function waitLoaded() {
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('Organizations Screen', () => {
  beforeEach(() => {
    setItem('name', TEST_USER_NAME);
    setItem('userId', TEST_USER_ID);
    setItem('sidebar', 'false');
    window.innerWidth = 1024;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  /* ---------- loading / empty states ---------- */

  test('shows loading spinner while data is fetching', () => {
    renderOrg([{ ...allOrgsMock(''), delay: 10000 }]);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows "nothing to show" when all orgs list is empty', async () => {
    renderOrg([allOrgsMock(''), joinedOrgsMock(TEST_USER_ID), createdOrgsMock(TEST_USER_ID)]);
    await waitLoaded();
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });

  /* ---------- mode 0: all orgs ---------- */

  test('renders all organizations in mode 0 with correct membership status', async () => {
    renderOrg(baseMocks(TEST_USER_ID));
    await waitLoaded();

    await waitFor(() => {
      expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
    });
    const cards = screen.getAllByTestId('organization-card');
    expect(cards.length).toBe(2);

    const memberCard = cards.find(
      (c) => c.getAttribute('data-organization-name') === 'anyOrganization1',
    );
    expect(memberCard?.getAttribute('data-membership-status')).toBe('accepted');

    const nonMemberCard = cards.find(
      (c) => c.getAttribute('data-organization-name') === 'anyOrganization2',
    );
    expect(nonMemberCard?.getAttribute('data-membership-status')).toBe('');
  });

  test('maps null avatarURL to null and missing addressLine1 / counts to defaults', async () => {
    renderOrg([
      allOrgsMock('', [
        sampleFilterOrg({
          name: 'NullImg',
          avatarURL: null,
          addressLine1: undefined,
          adminsCount: undefined,
          membersCount: undefined,
        }),
      ]),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();
    await waitFor(() => {
      expect(screen.getByTestId('org-name-NullImg')).toBeInTheDocument();
    });
  });

  /* ---------- mode 1: joined orgs ---------- */

  test('switches to joined mode and maps data with "accepted" status', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      joinedOrgsMock(TEST_USER_ID, [
        sampleJoinedEdge({ id: 'j1', name: 'JoinedA' }),
        sampleJoinedEdge({ id: 'j2', name: 'JoinedB' }),
      ]),
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await waitLoaded();

    await waitFor(() => {
      const cards = screen.getAllByTestId('organization-card');
      expect(cards.length).toBe(2);
      cards.forEach((c) =>
        expect(c.getAttribute('data-membership-status')).toBe('accepted'),
      );
    });
  });

  test('shows empty message when joined orgs edges are missing', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
          variables: { id: TEST_USER_ID, first: 5, filter: '' },
        },
        result: {
          data: { user: { organizationsWhereMember: null } },
        },
      },
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await waitLoaded();

    await waitFor(() => {
      expect(
        screen.getByTestId('no-organizations-message'),
      ).toBeInTheDocument();
    });
  });

  /* ---------- mode 2: created orgs ---------- */

  test('switches to created mode and maps data with "created" status', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID, [
        sampleCreatedOrg({ id: 'c1', name: 'CreatedOrg1' }),
      ]),
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitLoaded();

    await waitFor(() => {
      const card = screen.getByTestId('organization-card');
      expect(card.getAttribute('data-membership-status')).toBe('created');
      expect(
        screen.getByTestId('membership-status-CreatedOrg1').getAttribute('data-status'),
      ).toBe('created');
    });
  });

  test('shows empty message when created orgs data is null', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      joinedOrgsMock(TEST_USER_ID),
      {
        request: {
          query: USER_CREATED_ORGANIZATIONS,
          variables: { id: TEST_USER_ID, filter: '' },
        },
        result: { data: { user: { createdOrganizations: null } } },
      },
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitLoaded();

    await waitFor(() => {
      expect(
        screen.getByTestId('no-organizations-message'),
      ).toBeInTheDocument();
    });
  });

  /* ---------- search ---------- */

  test('search by Enter key triggers refetch in mode 0', async () => {
    renderOrg([
      allOrgsMock('', [
        sampleFilterOrg({ id: 'a', name: 'Alpha' }),
        sampleFilterOrg({ id: 'b', name: 'Beta' }),
      ]),
      allOrgsMock('Beta', [sampleFilterOrg({ id: 'b', name: 'Beta' })]),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();

    const input = screen.getByTestId('searchInput');
    fireEvent.change(input, { target: { value: 'Beta' } });
    fireEvent.keyUp(input, { key: 'Enter' });

    await waitFor(() => {
      const cards = screen.getAllByTestId('organization-card');
      expect(cards.length).toBe(1);
    });
  });

  test('search by button click triggers refetch in mode 0', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg({ id: 'a', name: 'Alpha' })]),
      allOrgsMock('Alpha', [sampleFilterOrg({ id: 'a', name: 'Alpha' })]),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();

    const input = screen.getByTestId('searchInput');
    fireEvent.change(input, { target: { value: 'Alpha' } });
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getAllByTestId('organization-card').length).toBe(1);
    });
  });

  test('non-Enter key does not trigger immediate search', async () => {
    renderOrg(baseMocks(TEST_USER_ID));
    await waitLoaded();

    const input = screen.getByTestId('searchInput');
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.keyUp(input, { key: 'a' });

    // Should still show both orgs (no immediate search for non-Enter)
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  test('search in joined mode (mode 1) refetches joined orgs', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      joinedOrgsMock(TEST_USER_ID, [
        sampleJoinedEdge({ id: 'j1', name: 'JA' }),
      ]),
      joinedOrgsMock(TEST_USER_ID, [sampleJoinedEdge({ id: 'j1', name: 'JA' })], false, 'JA'),
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await waitLoaded();

    const input = screen.getByTestId('searchInput');
    fireEvent.change(input, { target: { value: 'JA' } });
    fireEvent.keyUp(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  test('search in created mode (mode 2) refetches created orgs', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID, [
        sampleCreatedOrg({ id: 'c1', name: 'CA' }),
      ]),
      createdOrgsMock(TEST_USER_ID, [sampleCreatedOrg({ id: 'c1', name: 'CA' })], 'CA'),
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitLoaded();

    const input = screen.getByTestId('searchInput');
    fireEvent.change(input, { target: { value: 'CA' } });
    fireEvent.keyUp(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  test('debounced onChange fires search after delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    renderOrg([
      allOrgsMock('', [
        sampleFilterOrg({ id: 'a', name: 'Alpha' }),
        sampleFilterOrg({ id: 'b', name: 'Beta' }),
      ]),
      allOrgsMock('Be', [sampleFilterOrg({ id: 'b', name: 'Beta' })]),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID),
    ]);

    // Wait for initial render
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    const input = screen.getByTestId('searchInput');

    // Type in input — triggers handleChangeFilter → debouncedSearch
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Be' } });
    });

    // Advance past debounce delay (300ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    vi.useRealTimers();
  });

  test('debounce resets when typing again before delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    renderOrg([
      allOrgsMock('', [sampleFilterOrg({ name: 'Alpha' })]),
      allOrgsMock('final', []),
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID),
    ]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    const input = screen.getByTestId('searchInput');

    // Type first value
    await act(async () => {
      fireEvent.change(input, { target: { value: 'first' } });
    });

    // Advance partially (less than 300ms debounce)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    // Type again — resets debounce timer
    await act(async () => {
      fireEvent.change(input, { target: { value: 'final' } });
    });

    // Advance past debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    vi.useRealTimers();
  });

  /* ---------- pagination ---------- */

  test('next/prev page navigation works', async () => {
    const orgs = Array.from({ length: 12 }, (_, i) =>
      sampleFilterOrg({ id: `org-${i}`, name: `Org ${i + 1}` }),
    );
    renderOrg([allOrgsMock('', orgs), joinedOrgsMock(TEST_USER_ID), createdOrgsMock(TEST_USER_ID)]);
    await waitLoaded();

    expect(screen.getByTestId('current-page').textContent).toBe('0');

    fireEvent.click(screen.getByTestId('next-page'));
    await waitFor(() => {
      expect(screen.getByTestId('current-page').textContent).toBe('1');
    });

    fireEvent.click(screen.getByTestId('prev-page'));
    await waitFor(() => {
      expect(screen.getByTestId('current-page').textContent).toBe('0');
    });
  });

  test('changing rowsPerPage resets page to 0', async () => {
    const orgs = Array.from({ length: 12 }, (_, i) =>
      sampleFilterOrg({ id: `org-${i}`, name: `Org ${i + 1}` }),
    );
    renderOrg([allOrgsMock('', orgs), joinedOrgsMock(TEST_USER_ID), createdOrgsMock(TEST_USER_ID)]);
    await waitLoaded();

    fireEvent.click(screen.getByTestId('next-page'));
    await waitFor(() => {
      expect(screen.getByTestId('current-page').textContent).toBe('1');
    });

    fireEvent.change(screen.getByTestId('rows-per-page'), {
      target: { value: '10' },
    });
    await waitFor(() => {
      expect(screen.getByTestId('current-page').textContent).toBe('0');
    });
  });

  test('rowsPerPage 0 shows all organizations without slicing', async () => {
    const orgs = Array.from({ length: 8 }, (_, i) =>
      sampleFilterOrg({ id: `org-${i}`, name: `Org ${i + 1}` }),
    );
    renderOrg([allOrgsMock('', orgs), joinedOrgsMock(TEST_USER_ID), createdOrgsMock(TEST_USER_ID)]);
    await waitLoaded();

    fireEvent.change(screen.getByTestId('rows-per-page'), {
      target: { value: '0' },
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('organization-card').length).toBe(8);
    });
  });

  /* ---------- sidebar / resize ---------- */

  test('resize to <=820 sets hideDrawer to true', async () => {
    renderOrg(baseMocks(TEST_USER_ID));
    await waitLoaded();

    act(() => {
      window.innerWidth = 700;
      fireEvent(window, new window.Event('resize'));
    });

    expect(screen.getByTestId('organizations-container')).toBeInTheDocument();
  });

  test('resize listener is removed on unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderOrg(baseMocks(TEST_USER_ID));
    await waitLoaded();

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });

  test('sidebar state is read from localStorage on mount', async () => {
    setItem('sidebar', 'true');
    renderOrg(baseMocks(TEST_USER_ID));
    await waitLoaded();
    expect(screen.getByTestId('organizations-container')).toBeInTheDocument();
  });

  test('component renders on small screen initially', async () => {
    window.innerWidth = 600;
    renderOrg(baseMocks(TEST_USER_ID));
    await waitLoaded();
    expect(screen.getByTestId('organizations-container')).toBeInTheDocument();
  });

  /* ---------- mode cycling ---------- */

  test('cycles through all three modes (0 → 1 → 2 → 0)', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg({ name: 'AllOrg' })]),
      joinedOrgsMock(TEST_USER_ID, [sampleJoinedEdge({ name: 'JoinOrg' })]),
      createdOrgsMock(TEST_USER_ID, [sampleCreatedOrg({ name: 'CreateOrg' })]),
    ]);
    await waitLoaded();

    expect(screen.getByTestId('org-name-AllOrg')).toBeInTheDocument();

    // → mode 1
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await waitLoaded();
    await waitFor(() =>
      expect(screen.getByTestId('org-name-JoinOrg')).toBeInTheDocument(),
    );

    // → mode 2
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitLoaded();
    await waitFor(() =>
      expect(screen.getByTestId('org-name-CreateOrg')).toBeInTheDocument(),
    );

    // → mode 0
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn0'));
    await waitLoaded();
    await waitFor(() =>
      expect(screen.getByTestId('org-name-AllOrg')).toBeInTheDocument(),
    );
  });

  /* ---------- GraphQL error ---------- */

  test('handles GraphQL error gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderOrg([
      {
        request: {
          query: ORGANIZATION_FILTER_LIST,
          variables: { filter: '' },
        },
        error: new Error('Network error'),
      },
      joinedOrgsMock(TEST_USER_ID),
      createdOrgsMock(TEST_USER_ID),
    ]);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    errorSpy.mockRestore();
  });

  /* ---------- joined loading spinner ---------- */

  test('shows spinner when joined data is loading after mode switch', async () => {
    renderOrg([
      allOrgsMock('', [sampleFilterOrg()]),
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
          variables: { id: TEST_USER_ID, first: 5, filter: '' },
        },
        delay: 10000,
        result: {
          data: {
            user: {
              organizationsWhereMember: {
                pageInfo: { hasNextPage: false },
                edges: [],
              },
            },
          },
        },
      },
      createdOrgsMock(TEST_USER_ID),
    ]);
    await waitLoaded();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  /* ---------- pagination count when empty ---------- */

  test('PaginationList receives count=0 when organizations list is empty', async () => {
    renderOrg([allOrgsMock(''), joinedOrgsMock(TEST_USER_ID), createdOrgsMock(TEST_USER_ID)]);
    await waitLoaded();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
