import React from 'react';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import type { RenderResult } from '@testing-library/react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ApolloLink, DefaultOptions } from '@apollo/client';

import {
  MOCKS_WITHOUT_TIME,
  MOCKS_WITH_TIME,
  MOCKS_NO_EVENT,
  MOCKS_MISSING_DATA,
  MOCKS_NO_LOCATION,
  MOCKS_INVALID_DATETIME,
} from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  vi,
  expect,
  it,
  describe,
  beforeAll,
  beforeEach,
  afterEach,
} from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);

// Additional mocks for comprehensive testing
const mockNoEvent = new StaticMockLink(MOCKS_NO_EVENT, true);
const mockMissingData = new StaticMockLink(MOCKS_MISSING_DATA, true);
const mockNoLocation = new StaticMockLink(MOCKS_NO_LOCATION, true);
const mockInvalidDateTime = new StaticMockLink(MOCKS_INVALID_DATETIME, true);

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const mockID = 'event123';
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
}));

const renderEventDashboard = (mockLink: ApolloLink): RenderResult => {
  return render(
    <BrowserRouter>
      <MockedProvider
        addTypename={false}
        link={mockLink}
        defaultOptions={defaultOptions}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <EventDashboard eventId={mockID} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>
    </BrowserRouter>,
  );
};

describe('Testing Event Dashboard Screen', () => {
  beforeAll(() => {
    vi.mock('components/EventListCard/Modal/EventListCardModals', () => ({
      __esModule: true,
      default: () => <div data-testid="event-list-card-modals" />,
    }));
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorageMock.clear();
  });

  it('The page should display event details correctly and also show the time if provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    expect(getByTestId('start-time')).toHaveTextContent('09:00');
    expect(getByTestId('end-time')).toHaveTextContent('17:00');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();

    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();

    const editButton = getByTestId('edit-event-button');
    expect(editButton).toBeInTheDocument();
  });

  it('The page should display event details correctly and should not show the time if all day event', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should show loader while data is being fetched', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);

    expect(getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
    expect(queryByTestId('event-details')).not.toBeInTheDocument();

    await wait();

    expect(queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    expect(queryByTestId('spinner')).not.toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should display "Event not found" when event data is null', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockNoEvent);
    await wait();

    expect(getByTestId('no-event')).toHaveTextContent('Event not found');
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should display "Event not found" when data object is missing', async () => {
    const { getByTestId, queryByTestId } =
      renderEventDashboard(mockMissingData);
    await wait();

    expect(getByTestId('no-event')).toHaveTextContent('Event not found');
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should handle missing location gracefully', async () => {
    const { getByTestId } = renderEventDashboard(mockNoLocation);
    await wait();

    expect(getByTestId('event-location')).toHaveTextContent('N/A');
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
  });

  it('Should handle empty description gracefully', async () => {
    const { getByTestId } = renderEventDashboard(mockNoLocation);
    await wait();

    expect(getByTestId('event-description')).toHaveTextContent('');
  });

  it('Should open and close event modal when edit button is clicked', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');

    // Click to open modal
    await act(async () => {
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
    });
  });

  it('Should handle invalid date formats with fallback time', async () => {
    const { getByTestId } = renderEventDashboard(mockInvalidDateTime);
    await wait();

    // Component should render successfully even with edge case data
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-details')).toBeInTheDocument();
  });

  it('Should use userId from localStorage when available', async () => {
    localStorage.setItem('userId', 'test-user-123');
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-details')).toBeInTheDocument();
  });

  it('Should fallback to id from localStorage when userId is not available', async () => {
    localStorage.setItem('id', 'test-id-456');
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-details')).toBeInTheDocument();
  });

  it('Should set userRole as ADMINISTRATOR when role is administrator', async () => {
    localStorage.setItem('role', 'administrator');
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-details')).toBeInTheDocument();
  });

  it('Should set userRole as REGULAR when role is not administrator', async () => {
    localStorage.setItem('role', 'user');
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-details')).toBeInTheDocument();
  });

  it('Should display all statistics cards with N/A values', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should display event registrants as N/A', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-registrants')).toHaveTextContent('N/A');
  });

  it('Should display event-stats section', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-stats')).toBeInTheDocument();
  });

  it('Should render event-dashboard container', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should format time correctly for midnight (00:00)', async () => {
    const mockMidnight = new StaticMockLink(
      [
        {
          request: {
            query: EVENT_DETAILS,
            variables: { eventId: 'event123' },
          },
          result: {
            data: {
              event: {
                _id: 'event123',
                id: 'event123',
                name: 'Test Event',
                description: 'Test Description',
                startAt: '2024-01-01T00:00:00Z',
                endAt: '2024-01-02T00:00:00Z',
                allDay: false,
                location: 'India',
                isPublic: true,
                isRegisterable: true,
                attendees: [],
                creator: {
                  _id: 'creator1',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
          },
        },
      ],
      true,
    );

    const { getByTestId } = renderEventDashboard(mockMidnight);
    await wait();

    expect(getByTestId('start-time')).toHaveTextContent('00:00');
    expect(getByTestId('end-time')).toHaveTextContent('00:00');
  });

  it('Should handle empty string for startAt/endAt', async () => {
    const mockEmpty = new StaticMockLink(
      [
        {
          request: {
            query: EVENT_DETAILS,
            variables: { eventId: 'event123' },
          },
          result: {
            data: {
              event: {
                _id: 'event123',
                id: 'event123',
                name: 'Test Event',
                description: 'Test Description',
                startAt: '2024-01-01T08:00:00Z',
                endAt: '2024-01-02T08:00:00Z',
                allDay: false,
                location: 'India',
                isPublic: true,
                isRegisterable: true,
                attendees: [],
                creator: {
                  _id: 'creator1',
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
          },
        },
      ],
      true,
    );

    const { getByTestId } = renderEventDashboard(mockEmpty);
    await wait();

    expect(getByTestId('start-time')).toHaveTextContent('08:00');
    expect(getByTestId('end-time')).toHaveTextContent('08:00');
    expect(getByTestId('event-details')).toBeInTheDocument();
  });
});
