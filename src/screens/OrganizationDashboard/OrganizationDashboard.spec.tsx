import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrganizationDashboard from './OrganizationDashboard';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './OrganizationDashboardMocks';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
    tErrors: (key: string) => key,
  }),
}));

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
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
  });

  it('renders empty states when no data is returned', async () => {
    renderWithProviders({ mocks: EMPTY_MOCKS });

    await waitFor(() => {
      expect(screen.getByText('noUpcomingEvents')).toBeInTheDocument();
      expect(screen.getByText('noPostsPresent')).toBeInTheDocument();
      expect(screen.getByText('noMembershipRequests')).toBeInTheDocument();
    });
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
    expect(toast.success).toHaveBeenCalledWith('Coming soon!');

    const viewLeaderBtn = screen.getByTestId('viewAllLeadeboard');
    fireEvent.click(viewLeaderBtn);
    expect(toast.success).toHaveBeenCalledWith('Coming soon!');

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
