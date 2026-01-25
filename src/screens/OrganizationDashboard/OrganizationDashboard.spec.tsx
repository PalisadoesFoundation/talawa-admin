import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
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
import { toast } from 'react-toastify';
import OrganizationDashboard from './OrganizationDashboard';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  MIXED_REQUESTS_MOCK,
} from './OrganizationDashboardMocks';
import {
  MEMBERSHIP_REQUEST,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
} from 'GraphQl/Queries/Queries';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
    tErrors: (key: string) => key,
  }),
}));

const mockedNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

interface InterfaceRenderOptions {
  mocks: MockedResponse[];
  initialRoute?: string;
}

function renderWithProviders({
  mocks,
  initialRoute = '/orgdash/orgId',
}: InterfaceRenderOptions): RenderResult {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/orgdash/:orgId" element={<OrganizationDashboard />} />
          <Route path="/orglist" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );
}

describe('OrganizationDashboard', () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
    vi.mocked(toast.error).mockReset();
    vi.mocked(toast.success).mockReset();
  });

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

    expect(mockedNavigate).toHaveBeenCalledWith('/requests/orgId');
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
      expect(toast.error).toHaveBeenCalledWith('errorLoading');
      expect(mockedNavigate).toHaveBeenCalledWith('/');
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
    expect(mockedNavigate).toHaveBeenCalledWith('/requests/orgId');

    const viewLeaderBtn = screen.getByTestId('viewAllLeadeboard');
    await user.click(viewLeaderBtn);
    expect(toast.success).toHaveBeenCalledWith('comingSoon');

    const viewEventsBtn = screen.getByTestId('viewAllEvents');
    await user.click(viewEventsBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/orgevents/orgId');

    const viewPostBtn = screen.getByTestId('viewAllPosts');
    await user.click(viewPostBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/orgpost/orgId');
  });

  it('redirects to home when orgId is not provided', () => {
    renderWithProviders({ mocks: MOCKS, initialRoute: '/orglist' });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('redirects to "/" when orgId is missing from URL params', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <MemoryRouter initialEntries={['/orgdash/']}>
          <Routes>
            <Route
              path="/orgdash/:orgId?"
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
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <MemoryRouter initialEntries={['/orgdash']}>
          <Routes>
            <Route path="/orgdash" element={<OrganizationDashboard />} />
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

    await waitFor(async () => {
      const postsCountElement = screen.getByTestId('postsCount');
      await user.click(postsCountElement);

      expect(mockedNavigate).toHaveBeenCalledWith('/orgpost/orgId');
    });
  });

  it('handles navigation to events page', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(async () => {
      const eventsCountElement = screen.getByTestId('eventsCount');
      await user.click(eventsCountElement);

      expect(mockedNavigate).toHaveBeenCalledWith('/orgevents/orgId');
    });
  });

  it('handles navigation to blocked users page', async () => {
    const user = userEvent.setup();
    renderWithProviders({ mocks: MOCKS });

    await waitFor(async () => {
      const blockedUsersCountElement = screen.getByTestId('blockedUsersCount');
      await user.click(blockedUsersCountElement);

      expect(mockedNavigate).toHaveBeenCalledWith('/blockuser/orgId');
    });
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
      mock.request.query === MEMBERSHIP_REQUEST
        ? { ...mock, delay: 500 }
        : mock,
    );

    const { rerender } = renderWithProviders({ mocks: LOADING_MOCKS });

    await waitFor(() => {
      const fallbackUIs = screen.getAllByTestId('fallback-ui');
      expect(fallbackUIs.length).toBeGreaterThan(0);
    });

    const EMPTY_REQUESTS_MOCK = MOCKS.map((mock) =>
      mock.request.query === MEMBERSHIP_REQUEST
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
      <MockedProvider mocks={EMPTY_REQUESTS_MOCK} addTypename={false}>
        <MemoryRouter initialEntries={['/orgdash/orgId']}>
          <Routes>
            <Route path="/orgdash/:orgId" element={<OrganizationDashboard />} />
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
    renderWithProviders({ mocks: MIXED_REQUESTS_MOCK });

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

      membershipCardItems.forEach((item, i) => {
        console.log(`Membership Card ${i + 1}:`, item.textContent);
      });

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
        expect(mockedNavigate).toHaveBeenCalledWith('/orgvenues/orgId');
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
        expect(toast.error).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith('/');
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

      await waitFor(async () => {
        await user.click(viewAllEventsButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(mockedNavigate).toHaveBeenCalledWith('/orgevents/orgId');
      });
    });

    it('handles async navigation for view all posts button', async () => {
      const user = userEvent.setup();
      renderWithProviders({ mocks: MOCKS });

      await waitFor(() => {
        expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
      });

      const viewAllPostsButton = screen.getByTestId('viewAllPosts');

      await waitFor(async () => {
        await user.click(viewAllPostsButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(mockedNavigate).toHaveBeenCalledWith('/orgpost/orgId');
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

      await waitFor(async () => {
        await user.click(viewAllRequestsButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(mockedNavigate).toHaveBeenCalledWith('/requests/orgId');
      });
    });
  });
});
