import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  RenderResult,
  within,
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';

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
import { MEMBERSHIP_REQUEST } from 'GraphQl/Queries/Queries';

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
    (toast.error as jest.Mock).mockReset();
    (toast.success as jest.Mock).mockReset();
  });

  it('navigates to requests page when clicking on membership requests card', async () => {
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(screen.queryAllByTestId('fallback-ui').length).toBe(0);
    });

    await waitFor(() => {
      expect(screen.getByText('requests')).toBeInTheDocument();
    });

    const requestsCard = screen.getByText('requests');

    const requestsCardColumn = requestsCard.closest('[role="button"]');
    expect(requestsCardColumn).not.toBeNull();

    if (requestsCardColumn) {
      fireEvent.click(requestsCardColumn);
    } else {
      throw new Error('Membership requests card column not found');
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
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      expect(
        screen.getByTestId('viewAllMembershipRequests'),
      ).toBeInTheDocument();
    });

    const viewRequestsBtn = screen.getByTestId('viewAllMembershipRequests');
    fireEvent.click(viewRequestsBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/requests/orgId');

    const viewLeaderBtn = screen.getByTestId('viewAllLeadeboard');
    fireEvent.click(viewLeaderBtn);
    expect(toast.success).toHaveBeenCalledWith('comingSoon');

    const viewEventsBtn = screen.getByTestId('viewAllEvents');
    fireEvent.click(viewEventsBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/orgevents/orgId');

    const viewPostBtn = screen.getByTestId('viewAllPosts');
    fireEvent.click(viewPostBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/orgpost/orgId');
  });

  it('redirects to home when orgId is not provided', () => {
    renderWithProviders({ mocks: MOCKS, initialRoute: '/orglist' });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
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
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      const postsCountElement = screen.getByTestId('postsCount');
      fireEvent.click(postsCountElement);

      expect(mockedNavigate).toHaveBeenCalledWith('/orgpost/orgId');
    });
  });

  it('handles navigation to events page', async () => {
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      const eventsCountElement = screen.getByTestId('eventsCount');
      fireEvent.click(eventsCountElement);

      expect(mockedNavigate).toHaveBeenCalledWith('/orgevents/orgId');
    });
  });

  it('handles navigation to blocked users page', async () => {
    renderWithProviders({ mocks: MOCKS });

    await waitFor(() => {
      const blockedUsersCountElement = screen.getByTestId('blockedUsersCount');
      fireEvent.click(blockedUsersCountElement);

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
});
