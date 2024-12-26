import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import OrganizationDashboard from './OrganizationDashboard';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './OrganizationDashboardMocks';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

/**
 * This file contains unit tests for the OrganizationDashboard component.
 *
 * The tests cover:
 * - Behavior when URL parameters are undefined, including redirection to fallback URLs.
 * - Rendering of key sections, such as dashboard cards, upcoming events, latest posts, membership requests, and volunteer rankings.
 * - Functionality of user interactions with dashboard elements (e.g., navigation via clicks on cards and buttons).
 * - Handling of scenarios with empty data or errors in GraphQL responses.
 * - Integration with mocked GraphQL queries and toast notifications.
 *
 * These tests are implemented using Vitest for test execution and MockedProvider for mocking GraphQL queries.
 */

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const t = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.dashboard ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderOrganizationDashboard = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgdash/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/orgdash/:orgId"
                  element={<OrganizationDashboard />}
                />
                <Route
                  path="/orgpeople/:orgId"
                  element={<div data-testid="orgpeople"></div>}
                />
                <Route
                  path="/orgevents/:orgId"
                  element={<div data-testid="orgevents"></div>}
                />
                <Route
                  path="/orgpost/:orgId"
                  element={<div data-testid="orgpost"></div>}
                />
                <Route
                  path="/orgevents/:orgId"
                  element={<div data-testid="orgevents"></div>}
                />
                <Route
                  path="/blockuser/:orgId"
                  element={<div data-testid="blockuser"></div>}
                />
                <Route
                  path="/leaderboard/:orgId"
                  element={<div data-testid="leaderboard"></div>}
                />
                <Route
                  path="/requests"
                  element={<div data-testid="requests"></div>}
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Organization Dashboard Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const originalModule = await vi.importActual('react-router-dom');
      return {
        ...originalModule,
        useParams: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    vi.mocked(useParams).mockReturnValue({});
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgdash/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
                <Route path="/orgdash/" element={<OrganizationDashboard />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should render Organization Dashboard screen', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationDashboard(link1);

    // First wait for the dashboard to fully load
    await waitFor(() => {
      expect(screen.getByText(t.upcomingEvents)).toBeInTheDocument();
    });

    // Dashboard cards
    const membersBtn = await screen.findByText(t.members);
    expect(membersBtn).toBeInTheDocument();
    expect(screen.getByText(t.admins)).toBeInTheDocument();
    expect(screen.getByText(t.posts)).toBeInTheDocument();
    expect(screen.getByText(t.events)).toBeInTheDocument();
    expect(screen.getByText(t.blockedUsers)).toBeInTheDocument();

    // Upcoming events - Use a more flexible matcher
    expect(screen.getByText(/Event 1/i, { exact: false })).toBeInTheDocument();

    // Latest posts
    expect(screen.getByText(t.latestPosts)).toBeInTheDocument();
    expect(screen.getByText('postone')).toBeInTheDocument();

    // Membership requests
    expect(screen.getByText(t.membershipRequests)).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    // Volunteer rankings
    expect(screen.getByText(t.volunteerRankings)).toBeInTheDocument();
    expect(screen.getByText('Teresa Bradley')).toBeInTheDocument();
  });

  it('Click People Card', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationDashboard(link1);
    const membersBtn = await screen.findByText(t.members);
    expect(membersBtn).toBeInTheDocument();

    userEvent.click(membersBtn);
    await waitFor(() => {
      expect(screen.getByTestId('orgpeople')).toBeInTheDocument();
    });
  });

  it('Click Admin Card', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
    renderOrganizationDashboard(link1);
    const adminsBtn = await screen.findByText(t.admins);
    expect(adminsBtn).toBeInTheDocument();
  });
});

it('Click Post Card', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const postsBtn = await screen.findByText(t.posts);
  expect(postsBtn).toBeInTheDocument();

  userEvent.click(postsBtn);
  await waitFor(() => {
    expect(screen.getByTestId('orgpost')).toBeInTheDocument();
  });
});

it('Click Events Card', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const eventsBtn = await screen.findByText(t.events);
  expect(eventsBtn).toBeInTheDocument();

  userEvent.click(eventsBtn);
  await waitFor(() => {
    expect(screen.getByTestId('orgevents')).toBeInTheDocument();
  });
});

it('Click Blocked Users Card', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const blockedUsersBtn = await screen.findByText(t.blockedUsers);
  expect(blockedUsersBtn).toBeInTheDocument();

  userEvent.click(blockedUsersBtn);
  await waitFor(() => {
    expect(screen.getByTestId('blockuser')).toBeInTheDocument();
  });
});

it('Click Requests Card', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const requestsBtn = await screen.findByText(t.requests);
  expect(requestsBtn).toBeInTheDocument();

  userEvent.click(requestsBtn);
  await waitFor(() => {
    expect(screen.getByTestId('requests')).toBeInTheDocument();
  });
});

it('Click View All Events', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const viewAllBtn = await screen.findAllByText(t.viewAll);
  expect(viewAllBtn[0]).toBeInTheDocument();

  userEvent.click(viewAllBtn[0]);
  await waitFor(() => {
    expect(screen.getByTestId('orgevents')).toBeInTheDocument();
  });
});

it('Click View All Posts', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const viewAllBtn = await screen.findAllByText(t.viewAll);
  expect(viewAllBtn[1]).toBeInTheDocument();

  userEvent.click(viewAllBtn[1]);
  await waitFor(() => {
    expect(screen.getByTestId('orgpost')).toBeInTheDocument();
  });
});

it('Click View All Requests', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const viewAllBtn = await screen.findAllByText(t.viewAll);
  expect(viewAllBtn[2]).toBeInTheDocument();

  userEvent.click(viewAllBtn[2]);
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalled();
  });
});

it('Click View All Leaderboard', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link1);
  const viewAllBtn = await screen.findAllByText(t.viewAll);
  expect(viewAllBtn[3]).toBeInTheDocument();

  userEvent.click(viewAllBtn[3]);
  await waitFor(() => {
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
  });
});

it('should render Organization Dashboard screen with empty data', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link3);

  await waitFor(() => {
    expect(screen.getByText(t.noUpcomingEvents)).toBeInTheDocument();
    expect(screen.getByText(t.noPostsPresent)).toBeInTheDocument();
    expect(screen.getByText(t.noMembershipRequests)).toBeInTheDocument();
    expect(screen.getByText(t.noVolunteers)).toBeInTheDocument();
  });
});

it('should redirectt to / if error occurs', async () => {
  vi.mocked(useParams).mockReturnValue({ orgId: 'orgId' });
  renderOrganizationDashboard(link2);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalled();
    expect(screen.getByTestId('paramsError')).toBeInTheDocument();
  });
});
