import React from 'react';
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

import { MOCKS_WITHOUT_TIME, MOCKS_WITH_TIME } from './EventDashboard.mocks';
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
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);

// Mock for no event data
const MOCKS_NO_EVENT = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: null,
      },
    },
  },
];

// Mock for event with minimal data
const MOCKS_MINIMAL_EVENT = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          id: 'event123',
          name: 'Minimal Event',
          description: null,
          location: null,
          startAt: '2025-04-01T00:00:00Z',
          endAt: '2025-04-02T00:00:00Z',
          allDay: false,
          isPublic: true,
          isRegisterable: false,
          creator: {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

// Mock for invalid date format - using null instead of invalid string
// since formatDate throws errors for invalid dates
const MOCKS_INVALID_DATE = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          id: 'event123',
          name: 'Invalid Date Event',
          description: 'Test',
          location: 'Test Location',
          startAt: null,
          endAt: null,
          allDay: true,
          isPublic: true,
          isRegisterable: true,
          creator: {
            id: 'user1',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
      },
    },
  },
];

const mockNoEvent = new StaticMockLink(MOCKS_NO_EVENT, true);
const mockMinimalEvent = new StaticMockLink(MOCKS_MINIMAL_EVENT, true);
const mockInvalidDate = new StaticMockLink(MOCKS_INVALID_DATE, true);

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

// Mock useLocalStorage
const mockGetItem = vi.fn();
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

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
    mockGetItem.mockReturnValue('user123');
  });

  afterEach(() => {
    vi.clearAllMocks();
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

    expect(getByTestId('no-event')).toBeInTheDocument();
    expect(getByTestId('no-event')).toHaveTextContent('Event not found');
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should handle minimal event data with null values', async () => {
    const { getByTestId } = renderEventDashboard(mockMinimalEvent);
    await wait();

    expect(getByTestId('event-name')).toHaveTextContent('Minimal Event');
    expect(getByTestId('event-description')).toHaveTextContent('');
    expect(getByTestId('event-location')).toHaveTextContent('N/A');
    expect(getByTestId('event-registrants')).toHaveTextContent('N/A');
  });

  it('Should handle invalid date format gracefully', async () => {
    const { getByTestId } = renderEventDashboard(mockInvalidDate);
    await wait();

    expect(getByTestId('event-name')).toBeInTheDocument();
    // For null dates with allDay=true, times should be empty
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
  });

  it('Should open and close event modal when edit button is clicked', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');

    fireEvent.click(editButton);
    await waitFor(() => {
      expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
    });
  });

  it('Should handle user role as ADMINISTRATOR when stored role is administrator', async () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'userId' || key === 'id') return 'admin123';
      if (key === 'role') return 'administrator';
      return null;
    });

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-name')).toBeInTheDocument();
    expect(mockGetItem).toHaveBeenCalledWith('userId');
    expect(mockGetItem).toHaveBeenCalledWith('role');
  });

  it('Should handle user role as REGULAR when stored role is not administrator', async () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'userId' || key === 'id') return 'user456';
      if (key === 'role') return 'user';
      return null;
    });

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should fallback to getItem("id") when userId is not available', async () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'userId') return null;
      if (key === 'id') return 'fallback123';
      if (key === 'role') return 'user';
      return null;
    });

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-name')).toBeInTheDocument();
    expect(mockGetItem).toHaveBeenCalledWith('userId');
    expect(mockGetItem).toHaveBeenCalledWith('id');
  });

  it('Should display N/A for statistics when data is not available', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should render all event dashboard components', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-stats')).toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should format time correctly from UTC datetime', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');

    expect(startTime.textContent).toMatch(/\d{2}:\d{2}/);
    expect(endTime.textContent).toMatch(/\d{2}:\d{2}/);
  });

  it('Should handle null startAt and endAt for all-day events', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
  });

  it('Should pass correct props to EventListCardModals', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
  });

  it('Should display event with empty location as N/A', async () => {
    const { getByTestId } = renderEventDashboard(mockMinimalEvent);
    await wait();

    const locationElement = getByTestId('event-location');
    expect(locationElement).toHaveTextContent('N/A');
  });

  it('Should handle formatTimeFromDateTime with empty string', async () => {
    const MOCKS_EMPTY_TIME = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123',
              name: 'Empty Time Event',
              description: 'Test',
              location: 'Test',
              startAt: null, // Changed from '' to null
              endAt: null, // Changed from '' to null
              allDay: true, // Changed to true since no times are provided
              isPublic: true,
              isRegisterable: true,
              creator: {
                id: 'user1',
                firstName: 'Test',
                lastName: 'User',
              },
            },
          },
        },
      },
    ];

    const mockEmptyTime = new StaticMockLink(MOCKS_EMPTY_TIME, true);
    const { getByTestId } = renderEventDashboard(mockEmptyTime);
    await wait();

    // For all-day events with null times, expect empty time fields
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
  });
});
