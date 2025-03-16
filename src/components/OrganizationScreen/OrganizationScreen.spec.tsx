import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import OrganizationScreen from './OrganizationScreen';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import styles from '../../style/app-fixed.module.css';
import { vi } from 'vitest';
import '../../style/app.module.css';
import { setItem } from 'utils/useLocalstorage';

// Create mocks for the router hooks
const mockUseParams = vi.fn();
const mockUseMatch = vi.fn();
const mockNavigate = vi.fn();

// Mock the router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useMatch: () => mockUseMatch(),
    Navigate: (props: any) => {
      mockNavigate(props);
      return null;
    },
  };
});

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        eventsByOrganization: [
          {
            _id: 'event123',
            title: 'Test Event Title',
            description: 'Test Description',
            startDate: '2024-01-01',
            endDate: '2024-01-02',
            location: 'Test Location',
            startTime: '09:00',
            endTime: '17:00',
            allDay: false,
            recurring: false,
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
    mockUseParams.mockReset();
    mockUseMatch.mockReset();
    mockNavigate.mockReset();
  });

  const renderComponent = (): void => {
    render(
      <MockedProvider addTypename={false} link={link} mocks={MOCKS}>
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
      expect.objectContaining({
        to: '/',
        replace: true,
      }),
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
    fireEvent(window, new Event('resize'));
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
});
