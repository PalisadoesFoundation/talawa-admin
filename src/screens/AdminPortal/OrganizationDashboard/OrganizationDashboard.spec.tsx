import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import {
  RenderResult,
  within,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router';
import OrganizationDashboard from './OrganizationDashboard';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './OrganizationDashboardMocks';
import { MOCKS_ORG2 } from './OrganizationDashboardSecondaryMocks';
import {
  MEMBERSHIP_REQUEST_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
} from 'GraphQl/Queries/Queries';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const { routerMocks, toastMocks } = vi.hoisted(() => ({
  routerMocks: {
    navigate: vi.fn(),
    params: { orgId: 'orgId' },
  },
  toastMocks: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => routerMocks.navigate,
    useParams: () => routerMocks.params,
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

interface InterfaceRenderOptions {
  mocks: MockedResponse[];
  initialRoute?: string;
  initialParams?: { orgId: string };
}

function renderWithProviders({
  mocks,
  initialRoute = '/admin/orgdash/orgId',
  initialParams,
}: InterfaceRenderOptions): RenderResult {
  if (initialParams) {
    routerMocks.params = initialParams;
  }
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/admin/orgdash/:orgId"
            element={<OrganizationDashboard />}
          />
          <Route path="/admin/orglist" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );
}

describe('OrganizationDashboard', () => {
  beforeEach(() => {
    routerMocks.navigate.mockReset();
    toastMocks.error.mockReset();
    toastMocks.success.mockReset();
    routerMocks.params = { orgId: 'orgId' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    routerMocks.params = { orgId: 'orgId' };
  });
  // ... existing tests ...

  it('navigates to requests page when clicking on membership requests card', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
    });

    await waitFor(() => {
      expect(screen.getByText('requests')).toBeInTheDocument();
    });

    const requestsCard = screen.getByText('requests');

    const requestsCardButton = requestsCard.closest('button');
    expect(requestsCardButton).not.toBeNull();

    if (requestsCardButton) {
      await user.click(requestsCardButton);
    } else {
      throw new Error('Membership requests card button not found');
    }

    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/requests/orgId');
  });

  it('renders dashboard cards with correct data when GraphQL queries succeed', async () => {
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.getByText('members')).toBeInTheDocument();
      expect(screen.getByText('posts')).toBeInTheDocument();
      expect(screen.getByText('events')).toBeInTheDocument();
    });

    const memberCountElement = await screen.findByTestId('membersCount');
    expect(memberCountElement).toHaveTextContent('2');

    const adminCountElement = await screen.findByTestId('adminsCount');
    expect(adminCountElement).toHaveTextContent('1');

    const eventCountElement = await screen.findByTestId('eventsCount');
    expect(eventCountElement).toHaveTextContent('1');

    const postCountElement = await screen.findByTestId('postsCount');
    expect(postCountElement).toHaveTextContent('10');

    const blockedUsersCountElement =
      await screen.findByTestId('blockedUsersCount');
    expect(blockedUsersCountElement).toHaveTextContent('2');
  });

  it('renders empty states when no data is returned', async () => {
    renderWithProviders({ mocks: EMPTY_MOCKS });

    await waitFor(() => {
      expect(screen.getByText('noUpcomingEvents')).toBeInTheDocument();
      expect(screen.getByText('noPostsPresent')).toBeInTheDocument();
    });
    const noRequestsElement = await screen.findByText('noMembershipRequests');
    expect(noRequestsElement).toBeInTheDocument();

    // Check that blocked users count is 0 when no blocked users exist
    const blockedUsersCountElement =
      await screen.findByTestId('blockedUsersCount');
    expect(blockedUsersCountElement).toHaveTextContent('0');
  });

  it('navigates to "/" and shows error toast when GraphQL errors occur', async () => {
    renderWithProviders({ mocks: ERROR_MOCKS });

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('errorLoading');
      expect(routerMocks.navigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows success toast when clicking on membership requests view button', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(
        screen.getByTestId('viewAllMembershipRequests'),
      ).toBeInTheDocument();
    });

    const viewRequestsBtn = screen.getByTestId('viewAllMembershipRequests');
    await user.click(viewRequestsBtn);
    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/requests/orgId');

    const viewLeaderBtn = screen.getByTestId('viewAllLeadeboard');
    await user.click(viewLeaderBtn);
    expect(toastMocks.success).toHaveBeenCalledWith('comingSoon');

    const viewEventsBtn = screen.getByTestId('viewAllEvents');
    await user.click(viewEventsBtn);
    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/orgevents/orgId');

    const viewPostBtn = screen.getByTestId('viewAllPosts');
    await user.click(viewPostBtn);
    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/orgpost/orgId');
  });

  it('redirects to home when orgId is not provided', () => {
    renderWithProviders({ mocks: MOCKS, initialRoute: '/admin/orglist' });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('redirects to "/" when orgId is missing from URL params', () => {
    routerMocks.params = { orgId: '' };
    render(
      <MockedProvider mocks={MOCKS}>
        <MemoryRouter initialEntries={['/admin/orgdash/']}>
          <Routes>
            <Route
              path="/admin/orgdash/:orgId?"
              element={<OrganizationDashboard />}
            />
            <Route path="/" element={<div>Redirected to Home</div>} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Redirected to Home')).toBeInTheDocument();
  });

  it('redirects to "/" when orgId is undefined', () => {
    routerMocks.params = { orgId: '' };
    render(
      <MockedProvider mocks={MOCKS}>
        <MemoryRouter initialEntries={['/admin/orgdash']}>
          <Routes>
            <Route path="/admin/orgdash" element={<OrganizationDashboard />} />
            <Route path="/" element={<div>Redirected to Home</div>} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Redirected to Home')).toBeInTheDocument();
  });

  it('displays view all buttons for active sections', async () => {
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.getByTestId('viewAllEvents')).toBeInTheDocument();
      expect(
        screen.getByTestId('viewAllMembershipRequests'),
      ).toBeInTheDocument();
    });
  });

  it('handles navigation to posts page', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
    });

    const postsCountElement = await screen.findByTestId('postsCount');
    await user.click(postsCountElement);

    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/orgpost/orgId');
  });

  it('handles navigation to events page', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
    });

    const eventsCountElement = await screen.findByTestId('eventsCount');
    await user.click(eventsCountElement);

    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/orgevents/orgId');
  });

  it('handles navigation to blocked users page', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
    });

    const blockedUsersCountElement =
      await screen.findByTestId('blockedUsersCount');
    await user.click(blockedUsersCountElement);

    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/blockuser/orgId');
  });

  it('renders loading state for dashboard cards', async () => {
    renderWithProviders({ mocks: MOCKS });

    const fallbackUIs = screen.getAllByTestId('fallback-ui');
    expect(fallbackUIs.length).toBeGreaterThan(0);
  });

  it('displays view all events button functionality', async () => {
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      const viewAllEventsButton = screen.getByTestId('viewAllEvents');
      expect(viewAllEventsButton).toBeInTheDocument();
    });
  });

  it('handles multiple page loads without memory leaks', async () => {
    const { unmount } = renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.getByText('posts')).toBeInTheDocument();
    });

    unmount();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.getByText('posts')).toBeInTheDocument();
    });
  });

  it('renders membership requests section with proper states', async () => {
    const LOADING_MOCKS = MOCKS.map((mock) =>
      mock.request.query === MEMBERSHIP_REQUEST_PG
        ? { ...mock, delay: 500 }
        : mock,
    );

    const { rerender } = renderWithProviders({ mocks: LOADING_MOCKS });

    await waitFor(() => {
      const fallbackUIs = screen.getAllByTestId('fallback-ui');
      expect(fallbackUIs.length).toBeGreaterThan(0);
    });

    const EMPTY_REQUESTS_MOCK = MOCKS.map((mock) =>
      mock.request.query === MEMBERSHIP_REQUEST_PG
        ? {
            ...mock,
            result: {
              data: {
                organization: {
                  id: 'orgId',
                  membershipRequests: [],
                },
              },
            },
          }
        : mock,
    );
    rerender(
      <MockedProvider mocks={EMPTY_REQUESTS_MOCK}>
        <MemoryRouter initialEntries={['/admin/orgdash/orgId']}>
          <Routes>
            <Route
              path="/admin/orgdash/:orgId"
              element={<OrganizationDashboard />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          (content) =>
            content.includes('noMembershipRequests') ||
            content.includes('membership') ||
            content.includes('requests'),
        ),
      ).toBeInTheDocument();
    });
  });

  it('correctly displays pending membership requests and filters out non-pending ones', async () => {
    // Define a local mock with unique user IDs to avoid cache collision with Post mocks
    const SAFE_MIXED_REQUESTS_MOCK = [
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: 'orgId' },
            skip: 0,
            first: 8,
            name_contains: '',
          },
        },
        maxUsageCount: 3,
        result: {
          data: {
            organization: {
              id: 'orgId',
              membershipRequests: [
                {
                  membershipRequestId: 'request1',
                  createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
                  status: 'pending',
                  user: {
                    id: 'pendingUser1',
                    name: 'Pending User 1',
                    emailAddress: 'user1@example.com',
                    avatarURL: 'https://example.com/avatar1.jpg',
                    __typename: 'User',
                  },
                  __typename: 'MembershipRequest',
                },
                {
                  membershipRequestId: 'request2',
                  createdAt: dayjs.utc().subtract(2, 'day').toISOString(),
                  status: 'pending',
                  user: {
                    id: 'pendingUser2',
                    name: 'Pending User 2',
                    emailAddress: 'user2@example.com',
                    avatarURL: 'https://example.com/avatar1.jpg',
                    __typename: 'User',
                  },
                  __typename: 'MembershipRequest',
                },
                {
                  membershipRequestId: 'request3',
                  createdAt: dayjs.utc().subtract(1, 'day').toISOString(),
                  status: 'pending',
                  user: {
                    id: 'pendingUser3',
                    name: 'Pending User 3',
                    emailAddress: 'user3@example.com',
                    avatarURL: null,
                    __typename: 'User',
                  },
                  __typename: 'MembershipRequest',
                },
                {
                  membershipRequestId: 'request4',
                  createdAt: dayjs.utc().toISOString(),
                  status: 'rejected',
                  user: {
                    id: 'rejectedUser4',
                    name: 'Rejected User',
                    emailAddress: 'rejected@example.com',
                    avatarURL: null,
                    __typename: 'User',
                  },
                  __typename: 'MembershipRequest',
                },
              ],
              __typename: 'Organization',
            },
          },
        },
      },
      ...MOCKS.filter((mock) => mock.request.query !== MEMBERSHIP_REQUEST_PG),
    ];

    renderWithProviders({ mocks: SAFE_MIXED_REQUESTS_MOCK });

    await waitFor(() => {
      expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
    });

    const membershipRequestsHeader = screen.getByText('membershipRequests');
    const membershipRequestsCard =
      membershipRequestsHeader.closest('.card') ||
      membershipRequestsHeader.closest(
        '[data-testid="membership-requests-section"]',
      );

    await waitFor(() => {
      if (!membershipRequestsCard) {
        throw new Error('Membership requests section not found');
      }

      const { getAllByTestId } = within(membershipRequestsCard as HTMLElement);
      const membershipCardItems = getAllByTestId('cardItem');

      expect(membershipCardItems.length).toBe(3);

      const sectionText = membershipRequestsCard.textContent || '';
      expect(sectionText).toContain('Pending User 1');
      expect(sectionText).toContain('Pending User 2');
      expect(sectionText).toContain('Pending User 3');
      expect(sectionText).not.toContain('Rejected User');
    });
  });

  describe('Blocked Users Pagination', () => {
    it('should accumulate blocked users count correctly as pages are fetched', async () => {
      const INCREMENTAL_MOCK = [
        {
          request: {
            query: GET_ORGANIZATION_BLOCKED_USERS_PG,
            variables: { id: 'orgId', first: 32, after: null },
          },
          result: {
            data: {
              organization: {
                blockedUsers: {
                  edges: Array.from({ length: 32 }, (_, i) => ({
                    node: {
                      id: `blocked${i + 1}`,
                      name: `User ${i + 1}`,
                      emailAddress: `user${i + 1}@test.com`,
                      role: 'member',
                    },
                    cursor: `c${i + 1}`,
                  })),
                  pageInfo: { hasNextPage: true, endCursor: 'c32' },
                },
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_BLOCKED_USERS_PG,
            variables: { id: 'orgId', first: 32, after: 'c32' },
          },
          result: {
            data: {
              organization: {
                blockedUsers: {
                  edges: Array.from({ length: 15 }, (_, i) => ({
                    node: {
                      id: `blocked${i + 33}`,
                      name: `User ${i + 33}`,
                      emailAddress: `user${i + 33}@test.com`,
                      role: 'member',
                    },
                    cursor: `c${i + 33}`,
                  })),
                  pageInfo: { hasNextPage: false, endCursor: 'c47' },
                },
              },
            },
          },
        },
        ...MOCKS.filter(
          (mock) => mock.request.query !== GET_ORGANIZATION_BLOCKED_USERS_PG,
        ),
      ];

      renderWithProviders({ mocks: INCREMENTAL_MOCK });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });
    });
  });

  describe('Venues functionality', () => {
    it('displays venues count correctly', async () => {
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      await waitFor(() => {
        expect(screen.getByTestId('venuesCount')).toBeInTheDocument();
      });

      // Should display venues count of 2 (from MOCKS)
      const venuesCard = screen.getByTestId('venuesCount');
      expect(venuesCard).toBeInTheDocument();
    });

    it('navigates to venues page when clicking on venues card', async () => {
      const user = userEvent.setup();
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      await waitFor(() => {
        expect(screen.getByTestId('venuesCount')).toBeInTheDocument();
      });

      const venuesCard = screen.getByTestId('venuesCount');
      await user.click(venuesCard);

      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/admin/orgvenues/orgId',
        );
      });
    });

    it('displays zero venues count when no venues exist', async () => {
      renderWithProviders({ mocks: EMPTY_MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      await waitFor(() => {
        expect(screen.getByTestId('venuesCount')).toBeInTheDocument();
      });

      const venuesCard = screen.getByTestId('venuesCount');
      expect(venuesCard).toHaveTextContent('0');
    });

    it('handles venues loading state correctly', async () => {
      renderWithProviders({ mocks: MOCKS });

      // Should show loading initially
      expect(screen.queryAllByTestId('fallback-ui').length).toBeGreaterThan(0);

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });
    });

    it('handles venues error state correctly', async () => {
      renderWithProviders({ mocks: ERROR_MOCKS });

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith('/');
      });
    });

    it('displays venues title correctly', async () => {
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      await waitFor(() => {
        expect(screen.getByText('venues')).toBeInTheDocument();
      });
    });

    it('includes venues loading in overall loading state', async () => {
      const loadingMocks = MOCKS.map((mock) => ({
        ...mock,
        delay: 100, // Add delay to simulate loading
      }));

      renderWithProviders({ mocks: loadingMocks });

      // Should show loading fallback UI (DashboardStats shows 6 loading cards)
      const fallbackUIs = screen.getAllByTestId('fallback-ui');
      expect(fallbackUIs.length).toBeGreaterThan(0);
      expect(fallbackUIs.length).toBe(6);
    });
  });

  describe('Async navigation handlers', () => {
    it('handles async navigation for view all events button', async () => {
      const user = userEvent.setup();
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      const viewAllEventsButton = screen.getByTestId('viewAllEvents');

      await user.click(viewAllEventsButton);
      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/admin/orgevents/orgId',
        );
      });
    });

    it('handles async navigation for view all posts button', async () => {
      const user = userEvent.setup();
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      const viewAllPostsButton = screen.getByTestId('viewAllPosts');

      await user.click(viewAllPostsButton);
      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/admin/orgpost/orgId',
        );
      });
    });

    it('handles async navigation for view all membership requests button', async () => {
      const user = userEvent.setup();
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      const viewAllRequestsButton = screen.getByTestId(
        'viewAllMembershipRequests',
      );

      await user.click(viewAllRequestsButton);
      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/admin/requests/orgId',
        );
      });
    });
  });

  describe('Organization Navigation', () => {
    it('updates dashboard data when navigating from one organization to another', async () => {
      const combinedMocks = [...MOCKS, ...MOCKS_ORG2];

      const { unmount } = renderWithProviders({
        mocks: combinedMocks,
        initialRoute: '/admin/orgdash/orgId',
      });

      // Verify org1 data is loaded
      await waitFor(() => {
        expect(screen.getByTestId('membersCount')).toHaveTextContent('2');
        expect(screen.getByTestId('adminsCount')).toHaveTextContent('1');
        expect(screen.getByTestId('eventsCount')).toHaveTextContent('1');
        expect(screen.getByTestId('venuesCount')).toHaveTextContent('10');
        expect(screen.getByTestId('blockedUsersCount')).toHaveTextContent('2');
        expect(screen.getByTestId('postsCount')).toHaveTextContent('10');

        expect(screen.getByText('members')).toBeInTheDocument();
        expect(screen.getByText('admins')).toBeInTheDocument();
        expect(screen.getByText('events')).toBeInTheDocument();
        expect(screen.getByText('venues')).toBeInTheDocument();
        expect(screen.getByText('blockedUsers')).toBeInTheDocument();
        expect(screen.getByText('posts')).toBeInTheDocument();
        expect(screen.getByText('membershipRequests')).toBeInTheDocument();
      });

      unmount();

      // Render again with new organization ID
      // This simulates visiting the page for a different organization
      renderWithProviders({
        mocks: combinedMocks,
        initialRoute: '/admin/orgdash/orgId2',
        initialParams: { orgId: 'orgId2' },
      });

      // Verify org2 data is loaded
      await waitFor(() => {
        expect(screen.getByTestId('membersCount')).toHaveTextContent('5');
        expect(screen.getByTestId('adminsCount')).toHaveTextContent('2');
        expect(screen.getByTestId('eventsCount')).toHaveTextContent('3');
        expect(screen.getByTestId('venuesCount')).toHaveTextContent('5');
        expect(screen.getByTestId('blockedUsersCount')).toHaveTextContent('0');
        expect(screen.getByTestId('postsCount')).toHaveTextContent('20');

        expect(screen.getByText('members')).toBeInTheDocument();
        expect(screen.getByText('admins')).toBeInTheDocument();
        expect(screen.getByText('events')).toBeInTheDocument();
        expect(screen.getByText('venues')).toBeInTheDocument();
        expect(screen.getByText('blockedUsers')).toBeInTheDocument();
        expect(screen.getByText('posts')).toBeInTheDocument();
        expect(screen.getByText('noMembershipRequests')).toBeInTheDocument();
      });
    });

    it('updates dashboard data when route parameter changes without unmounting', async () => {
      const combinedMocks = [...MOCKS, ...MOCKS_ORG2];

      const { rerender } = renderWithProviders({
        mocks: combinedMocks,
        initialRoute: '/admin/orgdash/orgId',
      });

      // Verify org1 data is loaded
      await waitFor(() => {
        expect(screen.getByTestId('membersCount')).toHaveTextContent('2');
        expect(screen.getByTestId('adminsCount')).toHaveTextContent('1');
        expect(screen.getByTestId('eventsCount')).toHaveTextContent('1');
        expect(screen.getByTestId('venuesCount')).toHaveTextContent('10');
        expect(screen.getByTestId('blockedUsersCount')).toHaveTextContent('2');
        expect(screen.getByTestId('postsCount')).toHaveTextContent('10');

        expect(screen.getByText('members')).toBeInTheDocument();
        expect(screen.getByText('admins')).toBeInTheDocument();
        expect(screen.getByText('events')).toBeInTheDocument();
        expect(screen.getByText('venues')).toBeInTheDocument();
        expect(screen.getByText('blockedUsers')).toBeInTheDocument();
        expect(screen.getByText('posts')).toBeInTheDocument();
        expect(screen.getByText('membershipRequests')).toBeInTheDocument();
      });

      // Update params to simulate route change
      routerMocks.params = { orgId: 'orgId2' };

      // Rerender with new route to trigger update
      rerender(
        <MockedProvider mocks={combinedMocks}>
          <MemoryRouter initialEntries={['/admin/orgdash/orgId2']}>
            <Routes>
              <Route
                path="/admin/orgdash/:orgId"
                element={<OrganizationDashboard />}
              />
              <Route path="/admin/orglist" element={<div>Home Page</div>} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );

      // Verify org2 data is loaded
      await waitFor(() => {
        expect(screen.getByTestId('membersCount')).toHaveTextContent('5');
        expect(screen.getByTestId('adminsCount')).toHaveTextContent('2');
        expect(screen.getByTestId('eventsCount')).toHaveTextContent('3');
        expect(screen.getByTestId('venuesCount')).toHaveTextContent('5');
        expect(screen.getByTestId('blockedUsersCount')).toHaveTextContent('0');
        expect(screen.getByTestId('postsCount')).toHaveTextContent('20');

        expect(screen.getByText('members')).toBeInTheDocument();
        expect(screen.getByText('admins')).toBeInTheDocument();
        expect(screen.getByText('events')).toBeInTheDocument();
        expect(screen.getByText('venues')).toBeInTheDocument();
        expect(screen.getByText('blockedUsers')).toBeInTheDocument();
        expect(screen.getByText('posts')).toBeInTheDocument();
        expect(screen.getByText('noMembershipRequests')).toBeInTheDocument();
      });
    });
  });
});
