import React from 'react';
import { MockedProvider } from '@apollo/client/testing/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import OrganizationScreen from './OrganizationScreen';
import { GET_ORGANIZATION_EVENTS_PG } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import styles from '../../style/app-fixed.module.css';
import { vi } from 'vitest';
import { setItem, clearAllItems } from 'utils/useLocalstorage';

// Create mocks for the router hooks
let mockUseParams: ReturnType<typeof vi.fn>;
let mockUseMatch: ReturnType<typeof vi.fn>;
let mockNavigate: ReturnType<typeof vi.fn>;
let mockUseLocation: ReturnType<typeof vi.fn>;

// Mock the router hooks
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useMatch: () => mockUseMatch(),
    useLocation: () => mockUseLocation(),
    Navigate: (props: import('react-router').NavigateProps) => {
      mockNavigate(props);
      return null;
    },
  };
});

// Mock LeftDrawerOrg to prevent router-related errors from NavLink, useLocation, etc.
vi.mock('components/LeftDrawerOrg/LeftDrawerOrg', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="left-drawer-org" data-hide-drawer={hideDrawer}>
      <span>Organization Menu</span>
    </div>
  )),
}));

// Mock SignOut component to prevent useNavigate() error from Router context
vi.mock('components/SignOut/SignOut', () => ({
  default: vi.fn(() => (
    <button data-testid="signOutBtn" type="button">
      Sign Out
    </button>
  )),
}));

// Mock useSession to prevent router hook errors
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
    startSession: vi.fn(),
    handleLogout: vi.fn(),
    extendSession: vi.fn(),
  })),
}));

// Mock ProfileCard component to prevent useNavigate() error from Router context
vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown">
      <div data-testid="display-name">Test User</div>
    </div>
  )),
}));

const MOCKS = [
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: '123' },
    },
    result: {
      data: {
        organization: {
          eventsCount: 1,
          events: {
            edges: [
              {
                node: {
                  id: 'event123',
                  name: 'Test Event Title',
                  description: 'Test Description',
                  startDate: '2024-01-01',
                  endDate: '2024-01-02',
                  location: 'Test Location',
                  startAt: '2024-01-01T09:00:00Z',
                  endAt: '2024-01-02T17:00:00Z',
                  allDay: false,
                  isPublic: true,
                  isRegisterable: true,
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: 1,
                  totalCount: 1,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  attachments: [],
                  creator: {
                    id: 'creator123',
                    name: 'Creator Name',
                  },
                  organization: {
                    id: '123',
                    name: 'Test Org',
                  },
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: '2024-01-01T00:00:00Z',
                },
                cursor: 'cursor123',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

describe('Testing OrganizationScreen', () => {
  beforeAll(() => {
    setItem('Talawa-admin', 'name', 'John Doe');
  });

  afterAll(() => {
    clearAllItems('Talawa-admin');
  });

  beforeEach(() => {
    // Reset all mocks before each test
    mockUseParams = vi.fn();
    mockUseMatch = vi.fn();
    mockNavigate = vi.fn();
    mockUseLocation = vi.fn().mockReturnValue({ pathname: '/orgdash/123' });
    mockUseParams.mockReset();
    mockUseMatch.mockReset();
    mockNavigate.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (): void => {
    render(
      <MockedProvider link={link} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  test('renders correctly with event title', async () => {
    // Set up mocks for valid orgId case
    mockUseParams.mockReturnValue({ orgId: '123' });
    mockUseMatch.mockReturnValue({
      params: { eventId: 'event123', orgId: '123' },
    });

    renderComponent();

    await waitFor(() => {
      const mainPage = screen.getByTestId('mainpageright');
      expect(mainPage).toBeInTheDocument();
    });
  });

  test('navigates to home page when orgId is not provided', () => {
    // Set up mocks for undefined orgId case
    mockUseParams.mockReturnValue({ orgId: undefined });
    mockUseMatch.mockReturnValue(null);

    renderComponent();

    // Verify Navigate was called with correct props
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/', replace: true }),
    );
  });

  test('handles window resize', () => {
    // Set up mocks for valid orgId case
    mockUseParams.mockReturnValue({ orgId: '123' });
    mockUseMatch.mockReturnValue({
      params: { eventId: 'event123', orgId: '123' },
    });

    renderComponent();

    window.innerWidth = 800;
    fireEvent(window, new window.Event('resize'));
    expect(screen.getByTestId('mainpageright')).toHaveClass(styles.expand);
  });

  test('handles event not found scenario', async () => {
    // Set up mocks for valid orgId but with an eventId that doesn't match any events in data
    mockUseParams.mockReturnValue({ orgId: '123' });
    // Return a match with an eventId that doesn't exist in our mock data
    mockUseMatch.mockReturnValue({
      params: { eventId: 'nonexistent-event', orgId: '123' },
    });

    // Spy on console.warn to verify it's called
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderComponent();

    // Wait for data to be processed
    await waitFor(() => {
      // Verify console.warn was called with the expected message
      expect(warnSpy).toHaveBeenCalledWith(
        'Event with id nonexistent-event not found',
      );
    });

    // Verify that no event name is displayed
    const eventNameElement = screen.queryByText(/Test Event Title/i);
    expect(eventNameElement).not.toBeInTheDocument();

    // Clean up the spy
    warnSpy.mockRestore();
  });

  test('displays event name when on event path with valid event', async () => {
    mockUseParams.mockReturnValue({ orgId: '123' });
    mockUseMatch.mockReturnValue({
      params: { eventId: 'event123', orgId: '123' },
    });
    renderComponent();
    await waitFor(() => {
      const eventNameElement = screen.getByText('Test Event Title');
      expect(eventNameElement).toBeInTheDocument();
      expect(eventNameElement.tagName).toBe('H4');
    });
  });

  test('sets eventName to null when eventId is not provided', async () => {
    // Set up mocks for valid orgId but no eventId (not on event path)
    mockUseParams.mockReturnValue({ orgId: '123' });
    // Return null to simulate not being on an event path
    mockUseMatch.mockReturnValue(null);

    renderComponent();

    await waitFor(() => {
      const mainPage = screen.getByTestId('mainpageright');
      expect(mainPage).toBeInTheDocument();
    });

    // Verify that no event name is displayed (eventName should be null)
    const eventNameElement = screen.queryByText(/Test Event Title/i);
    expect(eventNameElement).not.toBeInTheDocument();

    // Verify that the main page renders without event name
    const h4Elements = screen.queryAllByRole('heading', { level: 4 });
    expect(h4Elements.length).toBe(0);
  });

  test('sets eventName to null when eventId is undefined in match params', async () => {
    // Set up mocks for valid orgId but eventId is undefined in params
    mockUseParams.mockReturnValue({ orgId: '123' });
    // Return a match object but with undefined eventId
    mockUseMatch.mockReturnValue({
      params: { orgId: '123', eventId: undefined },
    });

    renderComponent();

    await waitFor(() => {
      const mainPage = screen.getByTestId('mainpageright');
      expect(mainPage).toBeInTheDocument();
    });

    // Verify that no event name is displayed (eventName should be null)
    const eventNameElement = screen.queryByText(/Test Event Title/i);
    expect(eventNameElement).not.toBeInTheDocument();

    // Verify that the main page renders without event name
    const h4Elements = screen.queryAllByRole('heading', { level: 4 });
    expect(h4Elements.length).toBe(0);
  });
});
