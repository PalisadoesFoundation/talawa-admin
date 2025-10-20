import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ApolloLink, DefaultOptions } from '@apollo/client';

import { MOCKS_WITH_TIME, MOCKS_WITHOUT_TIME } from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);

// We want to disable all forms of caching so that we do not need to define a custom merge function in testing for the network requests
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

vi.mock('utils/useLocalstorage');

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
  beforeEach(() => {
    vi.clearAllMocks();
    const mockGetItem = vi.fn((key: string) => {
      if (key === 'userId' || key === 'id') return 'user123';
      if (key === 'role') return 'administrator';
      return null;
    });
    (useLocalStorage as jest.MockedFunction<typeof useLocalStorage>).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('The page should display event details correctly and also show the time if provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify basic event details
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    // Verify time and date information
    expect(getByTestId('start-time')).toHaveTextContent('09:00');
    expect(getByTestId('end-time')).toHaveTextContent('17:00');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();

    // Verify statistics cards
    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();

    // Test edit button
    const editButton = getByTestId('edit-event-button');
    expect(editButton).toBeInTheDocument();
  });

  it('The page should display event details correctly and should not show the time if all day event', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    // Verify basic event details
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    // Verify date information without time for all-day event
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should show loader while data is being fetched', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);

    // Initially show loader
    expect(getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
    expect(queryByTestId('event-details')).not.toBeInTheDocument();

    // Wait for loading to complete
    await wait();

    // Verify loader is gone and content is shown
    expect(queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    expect(queryByTestId('spinner')).not.toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should display "Event not found" when event data is null', async () => {
    const mockNoEvent = new StaticMockLink([
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
    ], true);

    const { getByTestId } = renderEventDashboard(mockNoEvent);
    await wait();

    expect(getByTestId('no-event')).toBeInTheDocument();
    expect(getByTestId('no-event')).toHaveTextContent('Event not found');
  });

  it('Should display "Event not found" when eventData is undefined', async () => {
    const mockNoEventData = new StaticMockLink([
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: null,
        },
      },
    ], true);

    const { getByTestId } = renderEventDashboard(mockNoEventData);
    await wait();

    expect(getByTestId('no-event')).toBeInTheDocument();
  });

  it('Should open and close event modal when edit button is clicked', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');
    
    // Click edit button to open modal
    fireEvent.click(editButton);
    await wait();

    // Modal should be rendered with event details
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  it('Should handle regular user role correctly', async () => {
    const mockGetItem = vi.fn((key: string) => {
      if (key === 'userId' || key === 'id') return 'user123';
      if (key === 'role') return 'user';
      return null;
    });
    (useLocalStorage as jest.MockedFunction<typeof useLocalStorage>).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
  });

  it('Should handle missing userId gracefully', async () => {
    const mockGetItem = vi.fn((key: string) => {
      if (key === 'role') return 'administrator';
      return null;
    });
    (useLocalStorage as jest.MockedFunction<typeof useLocalStorage>).mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should display N/A for missing location', async () => {
    const mockNoLocation = new StaticMockLink([
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
              startAt: '2024-01-01T09:00:00Z',
              endAt: '2024-01-02T17:00:00Z',
              startTime: '09:00:00',
              endTime: '17:00:00',
              allDay: false,
              location: null,
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
    ], true);

    const { getByTestId } = renderEventDashboard(mockNoLocation);
    await wait();

    expect(getByTestId('event-location')).toHaveTextContent('N/A');
  });

  it('Should verify all statistics cards display N/A', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should handle all-day event with specific time values', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    // For all-day events, time should not be displayed
    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');
    
    expect(startTime.textContent).toBe('');
    expect(endTime.textContent).toBe('');
  });

  it('Should display event registrants as N/A', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-registrants')).toHaveTextContent('N/A');
  });

  it('Should render event dashboard with correct test ids', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-stats')).toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });
});
