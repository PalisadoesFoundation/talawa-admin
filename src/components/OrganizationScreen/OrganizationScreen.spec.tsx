import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import OrganizationScreen from './OrganizationScreen';
import { GET_ORGANIZATION_EVENTS_PG } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import styles from '../../style/app-fixed.module.css';
import { vi } from 'vitest';
import { setItem } from 'utils/useLocalstorage';

// Create mocks for the router hooks
let mockUseParams: ReturnType<typeof vi.fn>;
let mockUseMatch: ReturnType<typeof vi.fn>;
let mockNavigate: ReturnType<typeof vi.fn>;

// Mock the router hooks
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useMatch: () => mockUseMatch(),
    Navigate: (props: import('react-router').NavigateProps) => {
      mockNavigate(props);
      return null;
    },
  };
});

const MOCKS = [
  {
    request: { query: GET_ORGANIZATION_EVENTS_PG, variables: { id: '123' } },
    result: {
      data: {
        eventsByOrganization: [
          {
            id: 'event123',
            title: 'Test Event Title',
            description: 'Test Description',
            startDate: '2024-01-01',
            endDate: '2024-01-02',
            location: 'Test Location',
            startTime: '09:00',
            endTime: '17:00',
            allDay: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

describe('Testing OrganizationScreen', () => {
  beforeAll(() => {
    setItem('name', 'John Doe', 3600);
  });

  afterAll(() => {
    localStorage.clear();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    mockUseParams = vi.fn();
    mockUseMatch = vi.fn();
    mockNavigate = vi.fn();
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
});
